import { getCollection } from "astro:content";

export const BLOG_DESCRIPTION =
	"Writing on software engineering, distributed systems, and building with AI.";

/** All posts, newest first. */
export async function getSortedPosts() {
	const posts = await getCollection("blog");
	return posts.sort(
		(a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
	);
}

export function formatPostDate(date: Date) {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});
}
