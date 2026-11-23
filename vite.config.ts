import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Preloads the font of the home page's largest text (the hero title, Cinzel 700), so the
 * browser fetches it alongside the stylesheet instead of after it. The file name is
 * content-hashed, hence looked up in the bundle.
 */
const preloadHeroFont = (): Plugin => ({
  name: 'preload-hero-font',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(_html, ctx) {
      const file = Object.keys(ctx.bundle ?? {}).find((f) => /cinzel-latin-700-normal-[\w-]+\.woff2$/.test(f));
      if (!file) return [];
      return [
        {
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head',
        },
      ];
    },
  },
});

// `npm run dev` forwards /api to the Spring Boot API (api/, `./gradlew bootRun`).
export default defineConfig({
  plugins: [react(), preloadHeroFont()],
  server: {
    port: 5173,
    proxy: { '/api': process.env.API_PROXY_TARGET || 'http://localhost:8080' },
  },
});
