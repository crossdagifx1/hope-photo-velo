import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    proxy: {
      '/api': {
        target: 'https://hope-photo-velo-jade.vercel.app',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
