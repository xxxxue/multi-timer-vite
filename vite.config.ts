import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from "vite-plugin-pages"
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [react(),
  Pages(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: { lang: 'zh-cn' }
  })],

})
