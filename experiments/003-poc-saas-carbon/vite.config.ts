import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Carbon recommande l'API moderne de Sass
        api: 'modern-compiler',
        silenceDeprecations: ['mixed-decls'],
      },
    },
  },
});
