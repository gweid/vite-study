export default function hotUpdatePlugin() {
  return {
    name: 'vite-plugin-hot-update',
    async handleHotUpdate(ctx) {
      // 需要热更的文件
      console.log(ctx.file)
      // 需要热更的模块，如一个 Vue 单文件会涉及多个模块
      console.log(ctx.modules)
      // 时间戳
      console.log(ctx.timestamp)
      // Vite Dev Server 实例
      console.log(ctx.server)
      // 读取最新的文件内容
      // console.log(await read())
      // 自行处理 HMR 事件
      ctx.server.ws.send({
        type: 'custom',
        event: 'custom-update',
        data: { a: 1 }
      })
      return []
    }
  }
}




// 前端代码中加入
// if (import.meta.hot) {
//   import.meta.hot.on('custom-update', (data) => {
//     // 执行自定义更新
//     // { a: 1 }
//     console.log(data)
//     window.location.reload();
//   })
// }