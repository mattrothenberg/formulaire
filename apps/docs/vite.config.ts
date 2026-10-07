import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const lib = (path: string) =>
  fileURLToPath(new URL(`../../packages/formulaire/src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Use the library's source, not its dist: edits hot-reload with no build
    // step, and the site never ships a stale copy.
    alias: [
      { find: /^formulaire-ui$/, replacement: lib('index.tsx') },
      { find: /^formulaire-ui\/styles\.css$/, replacement: lib('styles.css') },
    ],
  },
});
