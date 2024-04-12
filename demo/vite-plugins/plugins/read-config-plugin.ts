export default function readConfigPlugin() {
  let config

  return {
    name: 'vite-plugin-read-config',
    configResolved(resolvedConfig) {
      config = resolvedConfig // 记录最终配置
    },
    // 在其他钩子中可以访问到配置
    transform(code, id) {
      console.log(config);
    }
  }
}