import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        // https://github.com/vitejs/vite/issues/2329
        find: "dynamsoft-javascript-barcode",
        replacement: require.resolve("dynamsoft-javascript-barcode/dist/dbr.browser.mjs"),
      },
    ],
  },
})
