// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ssilve1989.github.io',
  base: '/',
  integrations: [
    sitemap()
  ],
  build: {
    assets: 'assets'
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
