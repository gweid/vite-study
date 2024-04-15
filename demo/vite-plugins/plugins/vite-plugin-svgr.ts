import * as fs from 'fs'
import { Plugin, transformWithEsbuild } from 'vite'

interface IOptions {
  exportType?: 'url' | 'component'
}

const viteSvgrPlugin = (options: IOptions = {}): Plugin => {
  const { exportType = 'component' } = options

  return {
    name: 'vite-plugin-svgr',
    async transform(code, id) {
      // 1、根据 id 入参过滤出 svg 资源
      if (!id.endsWith('.svg')) return code

      const { transform: transformSvg } = await import('@svgr/core')
      const { default: jsx } = await import('@svgr/plugin-jsx')

      // 2、读取 svg 文件内容
      const svg = await fs.promises.readFile(id, 'utf8')

      // 3、使用 `@svgr/core` 将 svg 转换为 React 组件代码
      const svgResult = await transformSvg(
        svg,
        {},
        { caller: 
          { 
            defaultPlugins: [jsx]
          }
        }
      )

      // 4、处理默认导出为 url 的情况
      let componentCode = svgResult

      // 4.1、加上 Vite 默认的 `export default 资源路径`
      if (exportType === 'url') {
        componentCode += code
        componentCode = componentCode.replace(
          "export default ReactComponent",
          "export { ReactComponent }"
        )
      }

      // 5、利用 esbuild，将组件中的 jsx 代码转译为浏览器可运行的代码;
      const result = await transformWithEsbuild(
        componentCode,
        id,
        { loader: 'jsx' }
      )

      return {
        code: result.code,
        map: null
      }
    }
  }
}

export default viteSvgrPlugin
