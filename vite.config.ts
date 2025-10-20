import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ozanparquet/', // GitHub Pages için repository adınız
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
