// vite.config.mts
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE || '/',
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, 'src/app'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@widgets': path.resolve(__dirname, 'src/widgets'),
      },
    },
    build: {
      sourcemap: mode !== 'production',
    },
  };
});
