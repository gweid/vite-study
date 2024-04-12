// export default function htmlTransformPlugin() {
//   return {
//     name: 'vite-plugin-html-transform',
//     transformIndexHtml(html) {
//       return html.replace(
//         /<title>(.*?)</title>/,
//         `<title>换了个标题</title>`
//       )
//     }
//   }
// }

export default function htmlTransformPlugin() {
  return {
    name: 'vite-plugin-html-transform',
    transformIndexHtml(html) {
      return {
        html,
        // 注入标签
        tag: [
          {
            // 放到 body 末尾，可取值还有`head`|`head-prepend`|`body-prepend`
            injectTo: 'body',
            // 标签属性定义
            attrs: { type: 'module', src: './index.ts' },
            // 标签名
            tag: 'script',
          }
        ]
      }
    }
  }
}