const fs = require('fs/promises');
const path = require('path');
const { createScript, createLink, generateHTML } = require('./utils');

module.exports = () => {
  return {
    name: "esbuild:html",
    setup(build) {
      build.onEnd(async (res) => {
        if (res.errors.length) {
          return
        }

        const { metafile } = res

        const scripts = []
        const links = []

        if (metafile) {
          const { outputs } = metafile
          const assets = Object.keys(outputs)

          // 找到相关的静态资源
          assets.forEach((asset) => {
            if (asset.endsWith('.js')) {
              scripts.push(createScript(asset))
            } else if (asset.endsWith('.css')) {
              links.push(createLink(asset))
            }
          })

          // 拼接 html
          const templateContent = generateHTML(scripts, links);
          // HTML 写入磁盘
          const templatePath = path.join(process.cwd(), "index.html");
          await fs.writeFile(templatePath, templateContent);
        }
      })
    },
  };
}
