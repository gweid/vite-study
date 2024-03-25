// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path'
import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import svgr from 'vite-plugin-svgr'
import viteImagemin from 'vite-plugin-imagemin'
import viteRestart from 'vite-plugin-restart' // 监听文件修改，自动重启 vite 服务
import viteEslint from 'vite-plugin-eslint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// const isProd = process.env.NODE_ENV === 'production'

// const CDN_URL = 'https://test-888999.com'

// 全局 less 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/assets/styles/variable.less'))

export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    svgr(),
    viteRestart({
      restart: [
        'vite.config.js'
      ]
    }),
    viteImagemin({
      // 无损压缩，无损压缩下图片质量不会变差
      optipng: { // png
        optimizationLevel: 7 // 选择0到7之间的优化级别
      },
      // pngquant: { // png
      //   quality: [0.7, 0.8]
      // }
      svgo: { // svg压缩
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/svgs')]
    }),
    viteEslint()
  ],
  // base: isProd ? CDN_URL : '/',
  server: {
    port: 5007
  },
  resolve: {
    alias: {
      '@assets': path.join(__dirname, 'src/assets'),
      '@components': path.join(__dirname, 'src/components'),
      '@utils': path.join(__dirname, 'src/utils')
    }
  },
  css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: "[name]__[local]__[hash:base64:8]"
    },
    preprocessorOptions: {
      less: {
        // additionalData 的内容会在每个 less 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    }
  },
  assetsInclude: ['.gltf'],
  build: {
    assetsInlineLimit: 8 *1024
  }
})
