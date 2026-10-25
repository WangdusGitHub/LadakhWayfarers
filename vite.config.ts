import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { devApiPlugin } from './devApiPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    devApiPlugin()
  ],
  server: {
    port: 3000,
    open: true
  }
});
