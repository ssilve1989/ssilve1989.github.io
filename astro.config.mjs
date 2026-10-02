// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://ssilve1989.github.io",
	base: "/",
	integrations: [mdx(), sitemap()],
	build: {
		assets: "assets",
	},
	markdown: {
		shikiConfig: {
			themes: { light: "github-light", dark: "github-dark" },
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
