/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "Monaco", "monospace"],
			},
			animation: {
				bounce: "bounce 1s infinite",
			},
		},
	},
	plugins: [],
};
