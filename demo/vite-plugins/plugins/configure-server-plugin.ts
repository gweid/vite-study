export default function configureServerPlugin(){
  return {
    name: 'vite-plugin-configure-server',
    configureServer(server) {
      // 方式1: 在 Vite 内置中间件之前执行
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理逻辑
      })

      // 方式2: 在 Vite 内置中间件之后执行 
      return () => {
        server.middlewares.use((req, res, next) => {
          // 自定义请求处理逻辑
        })
      }
    }
  }
}