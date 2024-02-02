declare module '*.module.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.json'

interface ImportMetaEnv {
  // 自定义的环境变量
  readonly VITE_IMG_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />
