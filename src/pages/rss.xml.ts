import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { BLOG_DESCRIPTION, getSortedPosts } from "../lib/blog";

export async function GET(context: APIContext) {
	const posts = await getSortedPosts();

	return rss({
		title: "Steven Silvestri - Blog",
		description: BLOG_DESCRIPTION,
		site: context.site ?? "https://ssilve1989.github.io",
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
		})),
	});
}
