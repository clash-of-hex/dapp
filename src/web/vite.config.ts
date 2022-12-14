import path, { join, resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { viteStaticCopy } from 'vite-plugin-static-copy'
const isProduction = process.argv.includes('production');
const rootPath = resolve(__dirname);
const assetPath = path.join(resolve(join(rootPath, '..')), "asset")
// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        index: join(rootPath, "index.html"),
        404: join(rootPath, "404.html"),
      },
    },
    target: [ 'es2020' ],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  server: {
    host: "localhost",
    port: 8888,
    open: true,
    https: false,
    proxy: {},
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@eversdk/lib-web/eversdk.wasm',
          dest: '.'
        }
      ],
    }),
    vue({
      // https://vuejs.org/guide/extras/reactivity-transform.html
      // Reactivity Transform
      reactivityTransform: true,
      isProduction: isProduction,
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "vue/macros",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dts: "types/auto-imports.d.ts",
      dirs: [
        "src/component",
        "src/store",
      ],
      vueTemplate: true,
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ["vue"],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: "types/component.d.ts",
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    }),
  ],
  resolve: {
    alias: {
      "@asset": path.join(assetPath),
      "@/": path.join(rootPath, "src", "/"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
      @import "src/style/variables.scss";
    `,
        javascriptEnabled: true,
      },
    },
  },
});
