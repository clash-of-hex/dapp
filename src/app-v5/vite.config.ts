import { defineConfig } from 'vite'

const isProduction = process.argv.includes('production');

// https://vitejs.dev/config/
export default defineConfig({
  base: isProduction ? '/v5/' : '/',
  resolve: {
    alias: {
      "@": __dirname,
    },
  },
})
