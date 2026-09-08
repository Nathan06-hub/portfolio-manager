import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/dashboard': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/transactions': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/goals': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/categories': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
