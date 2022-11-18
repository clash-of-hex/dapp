import { defineConfig } from 'vite'
import path, { join, resolve } from 'path'

const isProduction = process.argv.includes('production')
const rootPath = resolve(__dirname)
const srcPath = join(rootPath, 'src')
const assetPath = path.join(resolve(join(rootPath, '..')), 'asset')

import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-all-800-normal.woff',
          dest: '.',
        },
        {
          src: 'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-all-300-normal.woff',
          dest: '.',
        },
      ],
    }),
  ],
  base: isProduction ? '/v5/' : '/',
  build: {
    rollupOptions: {
      input: {
        index: join(rootPath, 'index.html'),
        404: join(rootPath, '404.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@asset': assetPath,
      '@': rootPath,
    },
  },
})
