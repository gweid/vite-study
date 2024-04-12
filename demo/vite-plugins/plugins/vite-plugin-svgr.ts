import * as fs from 'fs'
import { config } from 'process'
import { Plugin, transformWithEsbuild } from 'vite'

interface IOptions {
  exportType?: 'url' | 'component'
}

const viteSvgrPlugin = (options: IOptions = {}): Plugin => {
  const { exportType = 'component' } = options

  return {
    name: 'vite-plugin-svgr',
    async transform(code, id) {
      if (!id.endsWith('.svg')) return code

      const { transform: transformSvg } = await import('@svgr/core')
      const { default: jsx } = await import('@svgr/plugin-jsx')

      const svg = await fs.promises.readFile(id, 'utf8')

      const svgResult = await transformSvg(
        svg,
        {},
        { caller: 
          { 
            defaultPlugins: [jsx]
          }
        }
      )

      let componentCode = svgResult

      if (exportType === 'url') {
        componentCode += code
        componentCode = componentCode.replace(
          "export default ReactComponent",
          "export { ReactComponent }"
        )
      }

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
