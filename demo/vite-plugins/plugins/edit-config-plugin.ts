export default function editConfigPlugin() {
  return {
    name: 'vite-plugin-edit-config',
    config: () => ({
      alias: {
        react: require.resolve('react')
      }
    })
  }
}