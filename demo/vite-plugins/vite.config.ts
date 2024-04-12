import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inspect from 'vite-plugin-inspect'
// import TestHookPlugin from './plugins/test-hook-plugin'
import vitePluginSvgr from './plugins/vite-plugin-svgr'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    inspect(),
    react(),
    vitePluginSvgr()
  ],
})
