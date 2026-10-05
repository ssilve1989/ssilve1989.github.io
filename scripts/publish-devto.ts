// Publishes blog posts that opt in with `devto: true` to dev.to.
// Usage: dotenvx run -- node scripts/publish-devto.ts [--dry-run]
import { readdir, readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const SITE = "https://ssilve1989.github.io";
const BLOG_DIR = new URL("../src/content/blog/", import.meta.url);
const API = "https://dev.to/api";
const MAX_TAGS = 4;
const AI_DISCLOSURE_TAG = "abotwrotethis";

const frontmatterSchema = z.object({
	title: z.string(),
	description: z.string(),
	tags: z.array(z.string()).default([]),
	devto: z.boolean().default(false),
	aiAssisted: z.boolean().default(true),
});

const articleSchema = z.object({
	id: z.number(),
	canonical_url: z.string().nullish(),
});
type Article = z.infer<typeof articleSchema>;

type Post = {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	body: string;
	canonicalUrl: string;
};

const dryRun = process.argv.includes("--dry-run");

function splitFrontmatter(source: string) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return undefined;
	return { data: parseYaml(match[1] ?? ""), body: match[2] ?? "" };
}

/** Applies `transform` to prose only, leaving fenced code blocks untouched. */
function mapOutsideFences(body: string, transform: (text: string) => string) {
	return body
		.split(/(^```[\s\S]*?^```[^\n]*$)/m)
		.map((part, i) => (i % 2 === 1 ? part : transform(part)))
		.join("");
}

/**
 * dev.to renders plain markdown, so MDX-only syntax has to go: imports become
 * nothing, <Callout> becomes a blockquote, other components are dropped, and
 * site-relative links are made absolute.
 */
function toDevtoMarkdown(body: string, canonicalUrl: string) {
	let droppedComponents = false;

	const converted = mapOutsideFences(body, (text) =>
		text
			.replace(/^import\s.+$\n?/gm, "")
			.replace(
				/<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g,
				(_, attrs: string, inner: string) => {
					const title = attrs.match(/title="([^"]*)"/)?.[1];
					const lines = inner.trim().split("\n");
					if (title) lines.unshift(`**${title}**`, "");
					return lines.map((line) => `> ${line}`.trimEnd()).join("\n");
				},
			)
			.replace(/^<([A-Z][\w.]*)\b[^>]*\/>\s*$\n?/gm, () => {
				droppedComponents = true;
				return "";
			})
			.replace(/\]\(\/(?!\/)/g, `](${SITE}/`),
	);

	const note = droppedComponents
		? `\n\n*This post has interactive diagrams. See them in the [original post](${canonicalUrl}).*\n`
		: "\n";
	return `${converted.trim()}${note}`;
}

/** The disclosure tag goes first so the 4-tag cap never drops it. */
function toDevtoTags(tags: string[], aiAssisted: boolean) {
	const cleaned = tags
		.map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ""))
		.filter(Boolean);
	const all = aiAssisted ? [AI_DISCLOSURE_TAG, ...cleaned] : cleaned;
	return [...new Set(all)].slice(0, MAX_TAGS);
}

async function loadPosts() {
	const posts: Post[] = [];
	for (const file of await readdir(BLOG_DIR)) {
		const ext = extname(file);
		if (ext !== ".md" && ext !== ".mdx") continue;

		const source = await readFile(new URL(file, BLOG_DIR), "utf8");
		const split = splitFrontmatter(source);
		if (!split) throw new Error(`${file}: missing frontmatter`);

		const parsed = frontmatterSchema.safeParse(split.data);
		if (!parsed.success) {
			throw new Error(`${file}: ${z.prettifyError(parsed.error)}`);
		}
		if (!parsed.data.devto) {
			console.log(`skip    ${file} (devto not enabled)`);
			continue;
		}

		const slug = basename(file, ext);
		const canonicalUrl = `${SITE}/blog/${slug}`;
		posts.push({
			slug,
			title: parsed.data.title,
			description: parsed.data.description,
			tags: toDevtoTags(parsed.data.tags, parsed.data.aiAssisted),
			body: toDevtoMarkdown(split.body, canonicalUrl),
			canonicalUrl,
		});
	}
	return posts;
}

function headers(apiKey: string) {
	return {
		"api-key": apiKey,
		accept: "application/vnd.forem.api-v1+json",
		"content-type": "application/json",
	};
}

async function request(url: string, init: RequestInit) {
	const res = await fetch(url, init);
	if (!res.ok) {
		throw new Error(
			`${init.method ?? "GET"} ${url} -> ${res.status}: ${await res.text()}`,
		);
	}
	return res.json();
}

async function fetchExistingArticles(apiKey: string) {
	const byCanonicalUrl = new Map<string, Article>();
	for (let page = 1; ; page++) {
		const json = await request(
			`${API}/articles/me/all?per_page=1000&page=${page}`,
			{
				headers: headers(apiKey),
			},
		);
		const articles = z.array(articleSchema).parse(json);
		if (articles.length === 0) break;
		for (const article of articles) {
			if (article.canonical_url) {
				byCanonicalUrl.set(article.canonical_url, article);
			}
		}
	}
	return byCanonicalUrl;
}

async function main() {
	const posts = await loadPosts();
	if (posts.length === 0) {
		console.log("No posts opted in to dev.to.");
		return;
	}

	const apiKey = process.env.DEVTO_API_KEY;
	if (!apiKey && !dryRun) throw new Error("DEVTO_API_KEY is not set");

	const existing = apiKey
		? await fetchExistingArticles(apiKey)
		: new Map<string, Article>();

	for (const post of posts) {
		const article = {
			title: post.title,
			description: post.description,
			body_markdown: post.body,
			published: true,
			canonical_url: post.canonicalUrl,
			tags: post.tags,
		};
		const found = existing.get(post.canonicalUrl);
		const action = found ? "update" : "create";

		if (dryRun || !apiKey) {
			console.log(`dry-run ${action} ${post.slug}`);
			console.log(JSON.stringify({ article }, null, 2));
			continue;
		}

		await request(found ? `${API}/articles/${found.id}` : `${API}/articles`, {
			method: found ? "PUT" : "POST",
			headers: headers(apiKey),
			body: JSON.stringify({ article }),
		});
		console.log(`${action}d ${post.slug}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
