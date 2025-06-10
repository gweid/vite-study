module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // 按需加载所需要的 polyfill
        corejs: 3 // 指定 corejs 版本
      },
    ],
  ],
};
