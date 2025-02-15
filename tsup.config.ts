import { shimPlugin } from 'esbuild-shim-plugin';
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    dts: false,
    sourcemap: true,
    esbuildPlugins: [shimPlugin()],
    entry: ['src/server.ts'],
    format: ['esm'],
    target: 'esnext',
    outDir: 'dist',
  },
]);
