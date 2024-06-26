const { build } = require('esbuild')
const EsbuildHtmlPlugin = require('./plugins/html-plugin')

async function runBuild() {
  const result = await build({
        // 当前项目根目录
        absWorkingDir: process.cwd(),
        // 入口文件列表，为一个数组
        entryPoints: ["./src/index.jsx"],
        // 打包产物目录
        outdir: "dist",
        // 是否需要打包，一般设为 true
        bundle: true,
        // 模块格式，包括`esm`、`commonjs`和`iife`
        format: "esm",
        // 是否开启自动拆包
        splitting: true,
        // 是否生成 SourceMap 文件
        sourcemap: true,
        // 是否生成打包的元信息文件
        metafile: true,
        // 是否进行代码压缩
        minify: false,
        // 是否将产物写入磁盘
        write: true,
        // Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、text、json
        // 针对一些特殊的文件，调用不同的 loader 进行加载
        loader: {
          '.png': 'base64',
        },
        plugins: [EsbuildHtmlPlugin()]
  })

  console.log(result)
}

runBuild()
