import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev` forwards /api to the Spring Boot API (api/, `./gradlew bootRun`).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': process.env.API_PROXY_TARGET || 'http://localhost:8080' },
  },
});
