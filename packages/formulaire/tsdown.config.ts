import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  // The stylesheet ships as-is: plain CSS in a cascade layer, no processing.
  copy: ['src/styles.css'],
  // Fail the build on packaging mistakes before they reach npm.
  publint: true,
  attw: {
    level: 'error',
    // attw only resolves JS and types; the stylesheet export is plain CSS.
    excludeEntrypoints: ['./styles.css'],
  },
});
