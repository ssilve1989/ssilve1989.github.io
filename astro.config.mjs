// @ts-check

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://ssilve1989.github.io",
	base: "/",
	integrations: [sitemap()],
	build: {
		assets: "assets",
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
