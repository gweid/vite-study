# Vite

vite 学习总结



[vite插件推荐](https://juejin.cn/post/7287131053566459963)





## 前言

前端工程的痛点：

- **前端的模块化需求**：前端的模块标准非常多，包括 ESM、CommonJS、AMD 和 CMD 等等。前端工程一方面需要落实这些模块规范，保证模块正常加载。另一方面需要兼容不同的模块规范，以适应不同的执行环境
- **浏览器兼容、转译高级语法**：由于浏览器实现规范的限制，还有不同浏览器版本语法兼容不同等原因，高级语法（ts、jsx、新es语法）等需要在浏览器运行，就得转译成浏览器可识别的形式。这个需要在工程编译层面支持
- **线上代码质量**：与开发环境不同，在生产环境中，不仅需要考虑代码的兼容性、安全性，还需要考虑代码运行时的性能问题等
- **开发效率问题**：项目的冷启动/二次启动、热更新时间，都会影响开发效率，尤其是项目越来越大的时候



而目前社区已有的，例如：webpack、rollup、parcel 等，都能解决上面的问题：

- 模块化方面，提供模块加载方案，并兼容不同的模块规范
- 语法转译方面，配合 `Sass`、`Babel` 等前端工具链，对高级语法进行转译，同时对于静态资源也能进行处理，使之能作为一个模块正常加载
- 产物质量方面，在生产环境中，配合 `Terser`等压缩工具进行代码压缩和混淆，通过 `Tree Shaking` 删除未使用的代码，提供对于低版本浏览器的语法降级处理等
- 开发效率方面，使用缓存、多线程等方式



而 Vite 的优势：兼具了以上的能力，并且做到更**高效**

- 一方面，vite 在开发阶段基于浏览器原生 ESM 的支持实现了`no-bundle`服务，
- 另一方面，构建阶段，借助 Esbuild 超快的编译速度来做第三方库构建和 TS/JSX 语法编译

基于以上两点，vite 能将项目的启动性能提升一个量级，并且达到毫秒级的瞬间热更新效果



其它方面的能力：

- 模块化方面，vite 基于浏览器原生的 ESM 支持实现模块加载，并且无论是在开发还是生产环境，都可以将其它格式的产物(如 CommonJS)转换为 ESM
- 语法转译方面，vite 内置了对 ts、jsx 等高级语法的支持，也能加载各种静态资源，例如图片等
- 产物质量方面，vite 基于 rollup 实现生产环境打包，同时可以配合`Terser`、`Babel`等工具链，可以极大程度保证构建产物的质量



## vite 的基本使用



### 项目初始化



通过命令行，快速创建 vite 项目，这里使用 pnpm 进行方式管理包

执行以下命令：

```js
pnpm create vite
```

执行完这个命令，pnpm 会先下载 `create-vite` 这个包，然后执行这个包的项目初始化逻辑，如下：

![](./imgs/img1.png)

基本步骤就是：

1. 输入项目名称
2. 选择框架（react、vue 等）
3. 选择开发语言（js、ts 等）



创建完毕，进入项目，安装依赖，执行 `pnpm run dev` 即可启动项目，即可通过 `http://localhost:5173/` 进行访问：

![](./imgs/img2.png)



### 项目入口加载

vite 项目的基本结构如下：

```
.
├── public
│   └── vite.svg
├── src
│   ├── assets
│   └──── react.svg
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```



在项目根目录下，有 `index.html` 文件，这就是 vite 项目默认的入口文件，也就是访问 `http://localhost:5173/` 的时候，vite 的 Dev Server 会自动返回这个 HTML 文件的内容



下面来看下这个 `index.html` 里面的内容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```



这里面，比较重要的就是 

```js
<script type="module" src="/src/main.tsx"></script>
```

利用了现代浏览器原生支持 ES 模块规范的特性，只需要在 script 标签中声明 `type="module"` 即可。这样，相当于请求了 `http://localhost:5173/src/main.tsx` 这个资源，vite 的 Dev Server 此时会接受到这个请求，然后读取对应的文件内容，对内容进行一些列的处理，最后返回给浏览器



接下来，看下 `src/main.tsx` 的内容

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

这里有几个疑问：

- 浏览器并不会识别 tsx 语法
- 浏览器也已无法直接 import css 文件

浏览器执行这段代码归功于 vite 做了一系列的处理。首先，在读取到 `main.tsx`文件的内容之后，vite 会对文件的内容进行编译，查看浏览器，可以看到返回如下代码：

![](./imgs/img3.png)

Vite 会将项目的源代码编译成浏览器可以识别的代码，与此同时，一个 import 语句即代表了一个 HTTP 请求，基于请求，Vite Dev Server 会读取本地文件，返回浏览器可以解析的代码。当浏览器解析到新的 import 语句，又会发出新的请求，以此类推，直到所有的资源都加载完成

![](./imgs/img4.png)



![](./imgs/img5.png)



基于上述，vite 的 `no-bundle` 理念就是： **利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载**，而不是**先整体打包再进行加载**。相比 Webpack 这种必须打包再加载的传统构建模式，vite 在**开发阶段省略了繁琐且耗时的打包过程**，这也是 vite 为什么快的一个重要原因。



### vite 构建

看下 vite 相关的构建命令

> package.json

```js
"scripts": {
  // 开发环境启动项目
  "dev": "vite",
  // 打生产环境包
  "build": "tsc && vite build",
  // 生产环境打包完，预览产物
  "preview": "vite preview"
}
```



这里有一个问题，就是，在执行生产环境打包的时候，为什么要先执行 `tsc` ？

`tsc` 作为 TypeScript 的官方编译命令，可以用来编译 TypeScript 代码并进行类型检查，而这里的作用主要是用来做类型检查。这可以从 `tsconfig.json` 中确定，有如下配置：

```json
{
  "compilerOptions": {
    // 1. noEmit 表示只做类型检查，而不会输出产物文件
    // 2. 与 tsc --noEmit 命令等效
    "noEmit": true
  }
}
```

虽然 vite 提供了开箱即用的 TypeScript 以及 JSX 的编译能力，但实际上底层并没有实现 TypeScript 的类型校验系统，因此需要借助 `tsc` 来完成类型校验，在打包前提早暴露出类型相关的问题，保证代码的健壮性

主要原因：

> 之所以不把类型检查作为转换过程的一部分，是因为这两项工作在本质上是不同的。转译可以在每个文件的基础上进行，与 Vite 的按需编译模式完全吻合。相比之下，类型检查需要了解整个模块图。把类型检查塞进 Vite 的转换管道，将不可避免地损害 Vite 的速度优势。
>
> Vite 的工作是尽可能快地将源模块转化为可以在浏览器中运行的形式。为此，我们建议将静态分析检查与 Vite 的转换管道分开。这一原则也适用于其他静态分析检查，例如 ESLint。
>
> - 在构建生产版本时，你可以在 Vite 的构建命令之外运行 `tsc --noEmit`。
> - 在开发时，如果你需要更多的 IDE 提示，我们建议在一个单独的进程中运行 `tsc --noEmit --watch`，或者如果你喜欢在浏览器中直接看到上报的类型错误，可以使用 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)。



执行完 `pnpm build` 构建后，得到构建产物，此时可以通过 `pnpm preview` 预览一下**打包产物**的执行效果，相当于在本地起了服务，去加载 build 之后的资源

> 注意：使用 pnpm preview 之前，要先 build 构建出产物



### vite 对样式资源的处理

样式方案是前端工程化绕不开的一个话题，在最原始的开发阶段大家都是手写原生的 CSS，但原生 CSS 存在着诸多问题：

- **发体验**欠佳。比如原生 CSS 不支持选择器的嵌套（从Chrome 112 开始，原生 CSS也支持嵌套了）
- **样式污染**问题。如果出现同样的类名，很容易造成不同的样式互相覆盖和污染
- **浏览器兼容**问题。为了兼容不同的浏览器，我们需要对一些属性(如`transition`)加上不同的浏览器前缀
- 打包后的**代码体积**问题。如果不用任何的 CSS 工程化方案，所有的 CSS 代码都将打包到产物中，即使有部分样式并没有在代码中使用，导致产物体积过大



针对上述问题，社区诞生了一些方案：

- `CSS 预处理器`：主流的包括`Sass/Scss`、`Less`和`Stylus`。这些方案各自定义了一套语法，让 CSS 也能使用嵌套规则，甚至能像编程语言一样定义变量、写条件判断和循环语句，增强了样式语言的灵活性，解决原生 CSS 的**开发体验问题**
- `CSS Modules`：能将 CSS 类名处理成哈希值，这样就可以避免同名的情况下**样式污染**的问题
- CSS 后处理器`PostCSS`，用来解析和处理 CSS 代码，可以实现的功能非常丰富，比如将 `px` 转换为 `rem`、根据目标浏览器情况自动加上类似于`--moz--`、`-o-`的属性前缀等等
- `CSS in JS` 方案，主流的包括`emotion`、`styled-components`等等，顾名思义，这类方案可以实现直接在 JS 中写样式代码，基本包含`CSS 预处理器`和 `CSS Modules` 的各项优点，非常灵活，解决了开发体验和全局样式污染的问题
- CSS 原子化框架，如`Tailwind CSS`、`Windi CSS`，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了原生 CSS **开发体验**的问题

这几种方案没有孰优孰劣，各自解决的方案有重叠的部分，但也有一定的差异

那么，在 vite 中要怎么使用这几种方案呢？



#### CSS 预处理器

Vite 本身对 CSS 各种预处理器语言(`Sass/Scss`、`Less`和`Stylus`)做了内置支持。也就是说，即使你不经过任何的配置也可以直接使用各种 CSS 预处理器。

由于 Vite 底层会调用 CSS 预处理器的官方库进行编译，而 Vite 为了实现按需加载，并没有内置这些工具库，而是让用户根据需要安装。

这里以 less 为例

```shell
pnpm i less -D
```



如果使用了 ts，为了在引入样式时，不报错，需要在 `vite-env.d.ts` 中配置下

> 注意，这里一定要配置在 `/// <reference types="vite/client" />` 上面才生效

```typescript
declare module '*.module.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

/// <reference types="vite/client" />
```



安装完 less，直接就可以在项目中创建 .less 文件使用了

```
// index.less
.header {
  color: red;
}



// index.tsx
import styles from "./index.module.less"

const PageHeader = () => {
  return (
    <div className={styles.header}>this is header</div>
  )
}

export default PageHeader
```



下面来封装一个全局的主题色

```less
// variable.less
@theme-color: red;
```

然后应用这个变量

```less
@import url("../../assets/styles/variable.less");

.header {
  color: @theme-color;
}
```



但是这样有一个问题：每次要使用`$theme-color`属性的时候我们都需要手动引入`variable.scss`文件

vite 提供了方案解决这种问题，需要在 `vite.config.ts` 文件中进行一些配置

```ts
// vite.config.ts

// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path'
import { defineConfig, normalizePath } from 'vite'

// 全局 less 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/assets/styles/variable.less'));

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        // additionalData 的内容会在每个 less 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    }
  }
})
```

这样，就可以直接在文件中使用全局文件的变量，相当于之前手动引入的方式显然方便了许多



#### CSS Modules

CSS Modules 在 Vite 也是一个开箱即用的能力，Vite 会对后缀带有`.module`的样式文件自动应用 CSS Modules。

下面来使用下 css modules

首先，将刚刚的 less 文件名改为 `index.module.less`

然后引入方式改动下：

```tsx
import styles from "./index.module.less"

const PageHeader = () => {
  return (
    <div className={styles.header}>this is header</div>
  )
}
```



现在打开浏览器，可以看见标签的类名已经被处理成了哈希值的形式:

![](./imgs/img6.png)

同样的，还可以在配置文件中`css.modules`选项来配置 CSS Modules 的功能，例如：

```ts
export default defineConfig({
  css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: "[name]__[local]__[hash:base64:8]"
    }
  }
})
```

此时，再看可以发现，类名已经变成了自定义形式

![](./imgs/img7.png)









#### PostCSS

在 vite 中，可以通过 `postcss.config.js` 文件或者直接在 Vite 配置文件中进行 postcss 配置

比如这里，利用 postcss 解决浏览器兼容问题，首先安装一个 postcss 插件：`autoprefixer`

```shell
pnpm i autoprefixer -D
```



在 `vite.config.ts` 中配置

```ts
import autoprefixer from 'autoprefixer'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ['last 2 versions', 'not dead']
        })
      ]
    }
  }
})
```



在 `postcss.config.js` 中配置

```js
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    autoprefixer({
      // 指定目标浏览器
      overrideBrowserslist: ['last 2 versions', 'not dead']
    })
  ]
}
```



然后执行 `pnpm build`，后查看产物

![](./imgs/img8.png)



这里，更加建议将 postcss 相关的配置放到 `postcss.config.js` 文件中



还有，这里跟浏览器相关的兼容配置，也建议抽离到 `.browserslistrc`文件，这样能做到 browserslist 的复用

```
// .browserslistrc

last 2 versions,not dead
```



由于有 CSS 代码的 AST (抽象语法树)解析能力，PostCSS 可以做的事情非常多，甚至能实现 CSS 预处理器语法和 CSS Modules，社区当中也有不少的 PostCSS 插件，除了`autoprefixer`插件，常见的插件还包括:

- [postcss-pxtorem](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fcuth%2Fpostcss-pxtorem)： 用来将 px 转换为 rem 单位，在适配移动端的场景下很常用。
- [postcss-preset-env](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fcsstools%2Fpostcss-preset-env): 通过它，你可以编写最新的 CSS 语法，不用担心兼容性问题。
- [cssnano](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fcssnano%2Fcssnano): 主要用来压缩 CSS 代码，跟常规的代码压缩工具不一样，它能做得更加智能，比如提取一些公共样式进行复用、缩短一些常见的属性值等等。

关于 PostCSS 插件，可以去这个站点探索更多的内容：[www.postcss.parts/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.postcss.parts%2F) 



#### CSS In JS





#### CSS 原子化框架

在目前的社区当中，CSS 原子化框架主要包括`Tailwind CSS` 和 `Windi CSS`。

Windi CSS 作为前者的替换方案，实现了按需生成 CSS 类名的功能，开发环境下的 CSS 产物体积大大减少，速度上比`Tailwind CSS v2`快 20~100 倍！

当然，Tailwind CSS 在 v3 版本也引入 [JIT(即时编译)](https://link.juejin.cn/?target=https%3A%2F%2Fv2.tailwindcss.com%2Fdocs%2Fjust-in-time-mode) 的功能，解决了开发环境下 CSS 产物体积庞大的问题。



但是 `windi css` 在 2023-3月停止维护了，现在更建议使用 `UnoCSS`，UnoCSS 看作是 Windi CSS 的"精神继承者"



这里主要说明下 `UnoCSS`



首先，安装相关依赖

```shell
pnpm add -D unocss
```



然后配置 `vite.config.ts`

```typescript
import UnoCSS from 'unocss/vite'

export default {
  plugins: [
    UnoCSS()
  ]
}
```



接着在 `main.tsx` 中引入

```tsx
import 'virtual:uno.css'
```



这三步，就已经完成了 Windi CSS 的接入



接下来是使用

```tsx
const UnoCssCom = () => {
  return (
    <div className="p-20 text-center">
      <div className="font-bold text-2xl mb-2">windicss的使用</div>
    </div>
  )
}

export default UnoCssCom
```



可以看到，这说明已经生效了：

![](./imgs/img9.png)



如果需要对 `unocss` 进行配置，那么在项目根目录下建 `unocss.config.ts` 文件

```typescript
import { defineConfig } from 'unocss'

export default defineConfig({
  
})
```



附录
[unocss 中文文档](https://alfred-skyblue.github.io/unocss-docs-cn/)

[unocss交互式文档](https://unocss.dev/interactive/)

可以通过交互式文档来查看 unocss 的值及对应的样式



### Vite 对静态资源的处理

静态资源处理是前端工程经常遇到的问题，在真实的工程中不仅仅包含了动态执行的代码，也不可避免地要引入各种静态资源，如`图片`、`JSON`、`Worker 文件`、`Web Assembly 文件`等等。

而静态资源本身并不是标准意义上的模块，因此对它们的处理和普通的代码是需要区别对待的。一方面我们需要解决**资源加载**的问题，对 Vite 来说就是如何将静态资源解析并加载为一个 ES 模块的问题；另一方面在**生产环境**下我们还需要考虑静态资源的部署问题、体积问题、网络性能问题，并采取相应的方案来进行优化。



#### 图片处理

在开发过程中，最常见的加载图片的场景：

1. 在 HTML 或者 JSX 中，通过 img 标签来加载图片，如:

```html
<img src="../../assets/a.png"></img>
```

2. 在 CSS 中通过 background 属性加载图片，如:

```css
background: url('../../assets/b.png') norepeat;
```

3. 在 JavaScript 中，通过脚本的方式动态指定图片的`src`属性，如:

```javascript
document.getElementById('hero-img').src = '../../assets/c.png'
```



在 vite 中，其实已经内置了这个能力，只需要正常引入即可，但是如果需要通过别名前缀引入，俺么需要添加 `alias`

```typescript
// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@assets': path.join(__dirname, 'src/assets')
    }
  }
})
```

如果使用了 ts，那么需要配置 `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@assets/*": ["src/assets/*"],
      "@components/*": ["src/components/*"],
    }
  }
}
```



那么就可以使用了

```tsx
import MusicLogo from '@assets/images/music.png'

const StaticCom = () => {
  return (
    <div className="text-center">
      <h3>静态资源</h3>
      <img src={MusicLogo} className='w-100 h-80' />
    </div>
  )
}

export default StaticCom
```



但是这里还有一个问题，在 ts 中引入会报错，需要配置下 `vite-env.d.ts` 文件

```ts
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.json'

/// <reference types="vite/client" />
```

一般建议将常用的静态资源配置上



#### SVG 组件方式加载

上面成功地在 Vite 中实现了图片的加载，上述这些加载的方式对于 svg 格式来说依然是适用的。不过，开发中通常也希望能将 svg 当做一个组件来引入，这样可以很方便地修改 svg 的各种属性，而且比 img 标签的引入方式更加优雅。

SVG 组件加载在不同的前端框架中的实现不太相同，社区中也已经了有了对应的插件支持：

- Vue2 项目中可以使用 [vite-plugin-vue2-svg](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpakholeung37%2Fvite-plugin-vue2-svg)插件
- Vue3 项目中可以引入 [vite-svg-loader](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjpkleemans%2Fvite-svg-loader)
- React 项目使用 [vite-plugin-svgr](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpd4d10%2Fvite-plugin-svgr)插件

在 react 中安装

```shell
pnpm i vite-plugin-svgr -D
```

然后配置 `vite.config.ts`

```typescript
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [svgr()]
})
```

同时为了避免 ts 报错，需要配置 `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-svgr/client"],
  }
}
```



然后就可以引入使用了，引用方式为 `svg 图片路径+?react` 的形式

```tsx
import Algorand from "@assets/svgs/algorand.svg?react"

const StaticCom = () => {
  return (
    <div className="text-center">
      <Algorand className='w-40 h-40 mt-10'/>
    </div>
  )
}

export default StaticCom
```



#### JSON 加载

Vite 中已经内置了对于 JSON 文件的解析，底层使用`@rollup/pluginutils` 的 `dataToEsm` 方法将 JSON 对象转换为一个包含各种具名导出的 ES 模块。

使用方式

```typescript
import { version } from '../../../package.json'
```



#### 其它静态资源

除了上述的一些资源格式，Vite 也对下面几类格式提供了内置的支持：

- 媒体类文件，包括`mp4`、`webm`、`ogg`、`mp3`、`wav`、`flac`和`aac`
- 字体类文件。包括`woff`、`woff2`、`eot`、`ttf` 和 `otf`
- 文本类。包括`webmanifest`、`pdf`和`txt`

也就是说，在 Vite 中，可以将这些类型的文件当做一个 ES 模块来导入使用。如果项目中还存在其它格式的静态资源，也可以通过 `assetsInclude` 配置让 Vite 来支持加载:

配置 `vite.config.ts` 文件

```
export default defineConfig({
  assetsInclude: ['.gltf']
})
```



#### 特殊资源后缀

Vite 中引入静态资源时，支持在路径最后加上一些特殊的 query 后缀，包括：

- `?url`: 表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用
- `?raw`: 表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀
- `?inline`: 表示资源强制内联，而不是打包成单独的文件



### Vite 生产环境静态资源处理

在生产环境下，静态资源面临着一些新的问题：

- 部署域名怎么配置？
- 资源打包成单文件还是作为 Base64 格式内联?
- 图片太大了怎么压缩？
- svg 请求数量太多了怎么优化？



#### 自定义部署域名

一般在我们访问线上的站点时，站点里面一些静态资源的地址都包含了相应域名的前缀，如:

```html
<img src="https://test-888999.com/imgs/logo.png" />
```

`https://test-888999.com/` 是 CDN 地址，`imgs/logo.png` 是开发阶段地址。那么怎么在生产阶段替换呢？



在 Vite 中我们可以有更加自动化的方式来实现地址的替换，只需要在配置文件中指定`base`参数即可：

首先，在项目根目录新增的两个环境变量文件`.env.development`和`.env.production`，顾名思义，即分别在开发环境和生产环境注入一些环境变量，这里为了区分不同环境我们加上了`NODE_ENV`

```typescript
// .env.development
NODE_ENV=development

// .env.production
NODE_ENV=production
```



配置 `vite.config.ts`

```typescript
const isProd = process.env.NODE_ENV === 'production'

const CDN_URL = 'https://test-888999.com'

export default defineConfig({
  base: isProd ? CDN_URL : '/',
})
```



执行 `pnpm build` 可以看到，已经被替换了

![](./imgs/img10.png)



但是这样会有一些缺点，HTML 中的一些 JS、CSS 资源链接也一起加上了 CDN 地址前缀。

有时候可能项目中的某些图片需要存放到另外的存储服务

- 一种直接的方案是将完整地址写死到 src 属性中，比如将 CDN 前缀封装函数，每次引入

  ```typescript
  const getCDN = () => {
    const isProd = process.env.NODE_ENV === 'production'
    
    if (isProd) return 'https://test-888999.com'
    
    return ''
  }
  ```

- 另一种方法是通过定义环境变量的方式

  在项目根目录新增 `.env` 文件，内容如下：

  ```typescript
  // 优先级问题：
  // 开发环境优先级: .env.development > .env
  // 生产环境优先级: .env.production > .env
  
  VITE_IMG_BASE_URL=https://test-888999.com
  ```

  然后子啊 `vite-env.d.ts` 中增加类型声明

  ```typescript
  interface ImportMetaEnv {
    // 自定义的环境变量
    readonly VITE_IMG_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  ```

  值得注意的是，如果某个环境变量要在 Vite 中通过 `import.meta.env` 访问，那么它必须以`VITE_`开头，如`VITE_IMG_BASE_URL`。接下来我们在组件中来使用这个环境变量:

  ```html
  <img src={new URL('./logo.png', import.meta.env.VITE_IMG_BASE_URL).href} />
  ```

  当然，可以封装一下：

  ```typescript
  const getImgBaseUrl = (img: string) => {
    return new URL(`${img}`, import.meta.env.VITE_IMG_BASE_URL).href
  }
  ```

  > 这种方式有一个缺点，就是无论开发还是生产，都会被替换



#### 静态文件是单文件还是内联？

在 Vite 中，所有的静态资源都有两种构建方式，一种是打包成一个单文件，另一种是通过 base64 编码的格式内嵌到代码中。

一般来说，对于比较小的资源，适合内联到代码中，一方面对`代码体积`的影响很小，另一方面可以减少不必要的网络请求，`优化网络性能`。而对于比较大的资源，就推荐单独打包成一个文件，而不是内联了，否则可能导致上 MB 的 base64 字符串内嵌到代码中，导致代码体积瞬间庞大，页面加载性能直线下降。



Vite 中内置的优化方案是下面这样的:

- 如果静态资源体积 >= 4KB，则提取成单独的文件
- 如果静态资源体积 < 4KB，则作为 base64 格式的字符串内联

当然，这个 `4KB` 的临界值可以调整，配置 `vite.config.ts` 文件

```typescript
export default defineConfig({
  build: {
    assetsInlineLimit: 8 *1024
  }
})
```

> svg 格式的文件不受这个临时值的影响，始终会打包成单独的文件，因为它和普通格式的图片不一样，需要动态设置一些属性



#### 图片压缩

图片资源的体积往往是项目产物体积的大头，如果能尽可能精简图片的体积，那么对项目整体打包产物体积的优化将会是非常明显的。

在 JavaScript 领域有一个非常知名的图片压缩库[imagemin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fimagemin)，作为一个底层的压缩工具，前端的项目中经常基于它来进行图片压缩，比如 Webpack 中大名鼎鼎的`image-webpack-loader`。

Vite 社区当中也已经有了开箱即用的 Vite 插件——`vite-plugin-imagemin`



安装 `vite-plugin-imagemin`

```ts
pnpm i vite-plugin-imagemin -D
```



然后配置 `vite.config.ts`

```typescript
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      // 无损压缩，无损压缩下图片质量不会变差
      optipng: {
        optimizationLevel: 7
      }
    })
  ]
})
```

执行 `pnpm build`，可以在控制台看到压缩效果

![](./imgs/img11.png)



也可以进行有损压缩，这种会导致图片质量变差

```typescript
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      // 有损压缩，图片质量会变差
      pngquant: {
        quality: [0.7, 0.8]
      }
    })
  ]
})
```

![](./imgs/img12.png)

可以看到，压缩效率更高（但是要注意，过高的压缩率会导致图片质量变差）



`vite-plugin-imagemin` 其它的一些配置

```typescript
import { defineConfig,loadEnv} from 'vite'
import viteImagemin from 'vite-plugin-imagemin'

export default  ({ mode }) => defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { // gif图片压缩
        optimizationLevel: 3, // 选择1到3之间的优化级别
        interlaced: false, // 隔行扫描gif进行渐进式渲染
        // colors: 2 // 将每个输出GIF中不同颜色的数量减少到num或更少。数字必须介于2和256之间。
      },
      optipng: { // png
        optimizationLevel: 7, // 选择0到7之间的优化级别
      },
      mozjpeg: {// jpeg
        quality: 20, // 压缩质量，范围从0(最差)到100(最佳)。
      },
      pngquant: {// png
        quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
        speed: 4, // 压缩速度，1(强力)到11(最快)
      },
      svgo: { // svg压缩
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ]
})
```



#### 雪碧图优化

在实际的项目中我们还会经常用到各种各样的 svg 图标，虽然 svg 文件一般体积不大，但 Vite 中对于 svg 文件会始终打包成单文件，大量的图标引入之后会导致网络请求增加，大量的 HTTP 请求会导致网络解析耗时变长，页面加载性能直接受到影响。

> HTTP2 的多路复用设计可以解决大量 HTTP 的请求导致的网络加载性能问题，因此雪碧图技术在 HTTP2 并没有明显的优化效果，这个技术更适合在传统的 HTTP 1.1 场景下使用(



比如分别引入 4 个 svg 文件

```typescript
import Svg1 from '@assets/svgs/svg-1.svg'
import Svg2 from '@assets/svgs/svg-2.svg'
import Svg3 from '@assets/svgs/svg-3.svg'
import Svg4 from '@assets/svgs/svg-4.svg'
```

Vite 中提供了`import.meta.glob`的语法糖来解决这种**批量导入**的问题，如上述的 import 语句可以写成下面这样

```typescript
const icons = import.meta.glob('@assets/svgs/svg-*.svg')
```

控制台打印下，结果：

![](./imgs/img13.png)

可以看到对象的 value 都是动态 import，适合按需加载的场景。在这里我们只需要**同步加载**即可

```typescript
// eager: true 表示同步加载
const icons = import.meta.glob('@assets/svgs/svg-*.svg', { eager: true })

const iconUrls = Object.values(icons).map((mod: any) => mod.default)


const SvgPage = () => {
  return (
    <div className="text-center mt-10">
      {iconUrls.map(icon => (
        <img src={icon} key={icon} className="w-20 h-20 ml-4" />
      ))}
    </div>
  )
}

export default SvgPage
```



查看浏览器，可以发现，同时发出了 4 个请求

![](./imgs/img14.png)



假设页面有多个 svg 图标，将会很多 HTTP 请求。此时可以将所有 svg 图标合并为雪碧图。

可以通过`vite-plugin-svg-icons`来实现这个方案

安装 `vite-plugin-svg-icons`

```typescript
pnpm i vite-plugin-svg-icons -D
```



配置 `vite.config.ts`

```typescript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/svgs')]
    })
  ]
})
```



在`src/main.tsx`文件中添加一行代码

```typescript
import 'virtual:svg-icons-register'
```



创建一个 `SvgIcon` 组件

```tsx
export interface IProps {
  name: string
  prefix?: string
  color?: string
  [key: string]: any
}

const SvgIcon = ({
  name,
  prefix = 'icon',
  color = '#333',
  ...props
}: IProps)  => {
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg {...props} aria-hidden="true">
      <use href={symbolId} fill={color} />
    </svg>
  )
}

export default SvgIcon
```



使用

```tsx
import SvgIcon from '../svg-icon'

const icons = import.meta.glob('@assets/svgs/svg-*.svg', { eager: true })

// const iconUrls = Object.values(icons).map((mod: any) => mod.default)
const iconUrls = Object.values(icons).map((mod: any) => {
  const fileName = mod.default.split('/').pop();
  const [svgName] = fileName.split('.');
  return svgName;
})


const SvgPage = () => {
  return (
    <div className="text-center mt-10">
      {iconUrls.map(icon => (
        <SvgIcon name={icon} key={icon} className="w-20 h-20 ml-4" />
      ))}
    </div>
  )
}

export default SvgPage
```



现在回到浏览器的页面中，发现雪碧图已经生成：

![](./imgs/img15.png)

雪碧图包含了所有图标的具体内容，而对于页面每个具体的图标，则通过 `use` 属性来引用雪碧图的对应内容

![](./imgs/img16.png)





### 代码风格和质量

在真实的工程项目中，尤其是多人协作的场景下，代码规范就变得非常重要了，它可以用来统一团队代码风格，避免不同风格的代码混杂到一起难以阅读，有效提高**代码质量**，甚至可以将一些**语法错误**在开发阶段提前规避掉。但仅有规范本身不够，还需要**自动化的工具**(即`Lint 工具`)来保证规范的落地，把代码规范检查(包括`自动修复`)这件事情交给机器完成，开发者只需要专注应用逻辑本身。



#### JS/TS 规范：eslint

ESLint 主要通过配置文件对各种代码格式的规则(`rules`)进行配置，以指定具体的代码规范。目前开源社区也有一些成熟的规范集可供使用，著名的包括[Airbnb JavaScript 代码规范](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript)、[Standard JavaScript 规范](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fstandard%2Fstandard%2Fblob%2Fmaster%2Fdocs%2FREADME-zhcn.md)、[Google JavaScript 规范](https://link.juejin.cn/?target=https%3A%2F%2Fgoogle.github.io%2Fstyleguide%2Fjsguide.html)等等。当然，根据团队需求，也可以自己定制一套团队独有的代码规范，这在一些大型团队当中还是很常见的。



#### ESLint 安装及初始化

安装

```shell
pnpm i eslint -D
```



执行 ESLint 命令进行初始化

```shell
npx eslint --init
```



然后通过命令行选择，生成一份基础配置

![](./imgs/img17.png)



#### ESLint 核心配置



**1、parser 解释器**

ESLint 底层默认使用 [Espree](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Feslint%2Fespree)来进行 AST 解析，这个解析器目前基于 `Acron` 来实现，虽然说 `Acron` 目前能够解析绝大多数的 [ECMAScript 规范的语法](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Facornjs%2Facorn%2Ftree%2Fmaster%2Facorn)，但还是不支持 TypeScript ，因此需要引入其他的解析器完成 TS 的解析。

社区提供了`@typescript-eslint/parser`这个解决方案，专门为了 TypeScript 的解析而诞生，将 `TS` 代码转换为 `Espree` 能够识别的格式(即 [**Estree 格式**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Festree%2Festree))，然后在 Eslint 下通过`Espree`进行格式检查， 以此兼容了 TypeScript 语法。

```js
module.exports = {
    "parser": "@typescript-eslint/parser"
}
```



**2、parserOptions 选项**

这个配置可以对上述的解析器进行能力定制，默认情况下 ESLint 支持 ES5 语法，可以通过这个配置进行更改，具体内容如下:

- ecmaVersion: 这个配置和 `Acron` 的 [ecmaVersion](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Facornjs%2Facorn%2Ftree%2Fmaster%2Facorn) 是兼容的，可以配置 `ES + 数字`(如 ES6)或者`ES + 年份`(如 ES2015)，也可以直接配置为`latest`，启用最新的 ES 语法。
- sourceType: 默认为`script`，如果使用 ES Module 则应设置为`module`
- ecmaFeatures: 为一个对象，表示想使用的额外语言特性，如开启 `jsx`

```js
module.exports = {
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    }
}
```



**3、rules 具体规则**

`rules` 配置即代表在 ESLint 中手动调整哪些代码规则，比如字符串使用单引号，这条规则可以像如下的方式配置：

```js
// .eslintrc.cjs
module.exports = {
  // 其它配置省略
  rules: {
    // key 为规则名，value 配置内容
    "quotes": ["error", "single"],
  }
}
```

在 rules 对象中，`key` 一般为`规则名`，`value` 为具体的配置内容，在上述的例子中我们设置为一个数组，数组第一项为规则的 `ID`，第二项为`规则的配置`。

这里主要看下规则 ID，可以设置如下值：

- `off` 或 `0`: 表示关闭规则
- `warn` 或 `1`: 表示开启规则，不过违背规则后只抛出 warning，而不会导致程序退出
- `error` 或 `2`: 表示开启规则，不过违背规则后抛出 error，程序会退出

当然，也可以直接将 `rules` 对象的 `value` 配置成 ID，如: `"no-cond-assign": "error"`



**4、plugins 插件**

ESLint 的 parser 基于`Acorn`实现，不能直接解析 TypeScript，需要指定 parser 选项为`@typescript-eslint/parser`才能兼容 TS 的解析。同理，ESLint 本身也没有内置 TypeScript 的代码规则，这个时候 ESLint 的插件系统就派上用场了。需要通过添加 ESLint 插件来增加一些特定的规则，比如添加`@typescript-eslint/eslint-plugin` 来拓展一些关于 TS 代码的规则，如下代码所示

```js
module.exports = {
    "plugins": [
        "@typescript-eslint",
        "react"
    ]
}
```



需要注意的是，添加插件只是拓展了 ESLint 本身的规则集，但 ESLint 默认并**没有开启**这些规则的校验！如果要开启或者调整这些规则，需要在 rules 中进行配置，如:

```js
module.exports = {
  // 开启一些 TS 规则
  rules: {
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}
```



**5、extends 继承配置**

extends 相当于`继承`另外一份 ESLint 配置，可以配置为一个字符串，也可以配置成一个字符串数组。主要分如下 3 种情况：

1. 从 ESLint 本身继承
2. 从类似 `eslint-config-xxx` 的 npm 包继承
3. 从 ESLint 插件继承

例如下面的：

```js
// .eslintrc.js
module.exports = {
   "extends": [
     // 第1种情况 
     "eslint:recommended",

     // 第2种情况，一般配置的时候可以省略 `eslint-config`
     "standard"

     // 第3种情况，可以省略包名中的 `eslint-plugin`
     // 格式一般为: `plugin:${pluginName}/${configName}`
     "plugin:react/recommended"
     "plugin:@typescript-eslint/recommended",
   ]
}
```

有了 extends 的配置，对于之前所说的 ESLint 插件中的繁多配置，我们就**不需要手动一一开启**了，通过 extends 字段即可自动开启插件中的推荐规则



**6、env 和 globals**

这两个配置分别表示`运行环境` 和 `全局变量`，在指定的运行环境中会预设一些全局变量，比如:

```js
module.exports = {
    "env": {
        "browser": true,
        "node": true
    }
}
```

指定上述的 `env` 配置后便会启用浏览器和 Node.js 环境，这两个环境中的一些全局变量(如 `window`、`global` 等)会同时启用。



有些全局变量是业务代码引入的第三方库所声明，这里就需要在`globals`配置中声明全局变量了。每个全局变量的配置值有 3 种情况：

1. `"writable"`或者 `true`，表示变量可重写
2. `"readonly"`或者`false`，表示变量不可重写
3. `"off"`，表示禁用该全局变量

这里使用 jquery 说明下：

```js
module.exports = {
  "globals": {
    // 不可重写
    "$": false, 
    "jQuery": false 
  }
}
```



#### 搭配 Prettier 使用

虽然 ESLint 本身具备自动格式化代码的功能(`eslint --fix`)，但术业有专攻，ESLint 的主要优势在于`代码的风格检查并给出提示`，而在代码格式化这一块 Prettier 做的更加专业，因此 ESLint 结合 Prettier 一起使用是最优解



安装 Prettier

```shell
pnpm i prettier -D
```



然后在项目根目录下创建 `.prettierrc.js` 文件，配置如下：

```js
// .prettierrc.js
module.exports = {
  printWidth: 120, //一行的字符数，如果超过会进行换行，默认为120
  tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
  useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减
  singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
  semi: true, // 行尾是否使用分号，默认为true
  trailingComma: "none", // 是否使用尾逗号
  bracketSpacing: true // 对象大括号直接是否有空格，默认为 true，效果：{ a: 1 }
};
```



如果需要将`Prettier`集成到现有的`ESLint`工具中，首先安装两个工具包：

```shell
pnpm i eslint-config-prettier eslint-plugin-prettier -D
```

其中`eslint-config-prettier`用来覆盖 ESLint 本身的规则配置，而`eslint-plugin-prettier`则是用于让 Prettier 来接管`eslint --fix`即修复代码的能力。



接着，在 `.eslintrc.cjs` 配置文件中接入 prettier 的相关工具链，如下：

```js
module.exports = {
    "extends": [
        // 接入 prettier 的规则
        "prettier",
        "plugin:prettier/recommended"
    ],
    "plugins": [
        "prettier" // 加入 prettier 的 eslint 插件
    ],
    "rules": {
        "prettier/prettier": "error", // 开启 prettier 自动修复的功能
    }
}
```



最后，在 `package.json` 中定义一个脚本

```json
{
  "scripts": {
    "lint": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./src",
  }
}
```



如果不想每次都手动执行这个命令，可以在`VSCode`中安装`ESLint`和`Prettier`这两个插件，并且在设置区中开启`Format On Save`

![](./imgs/img18.png)

这样，在`Ctrl + S`保存代码的时候，Prettier 便会自动帮忙修复代码格式



#### 在 vite 开发环境使用 eslint

除了安装编辑器插件，还可以通过 Vite 插件的方式在开发阶段进行 ESLint 扫描，以命令行的方式展示出代码中的规范问题，并能够直接定位到原文件。



安装 `vite-plugin-eslint`

```shell
pnpm i vite-plugin-eslint -D
```



在  `vite.config.ts` 中接入

```typescript
import viteEslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    viteEslint()
  ]
})
```

此时，已经可以将 eslint 错误显示在控制台了

![](./imgs/img19.png)



> vite-plugin-eslint 这个插件采用另一个进程来运行 ESLint 的扫描工作，因此不会影响 Vite 项目的启动速度



#### 样式规范 stylelint

Stylelint 主要专注于样式代码的规范检查，内置了 **170 多个 CSS 书写规则**，支持 **CSS 预处理器**(如 Sass、Less)，提供**插件化机制**以供开发者扩展规则，已经被 Google、Github 等**大型团队**投入使用。与 ESLint 类似，在规范检查方面，Stylelint 已经做的足够专业，而在代码格式化方面，仍然需要结合 Prettier 一起来使用。



安装 stylelint 相关的 npm 包

```shell
pnpm i stylelint stylelint-prettier stylelint-config-prettier stylelint-config-recess-order stylelint-config-standard stylelint-config-standard-less -D
```



然后，在项目根目录新建 `.stylelintrc.js` 文件，配置内容如下：

```js
// .stylelintrc.js
module.exports = {
  // 注册 stylelint 的 prettier 插件
  plugins: ['stylelint-prettier'],
  // 继承一系列规则集合
  extends: [
    // standard 规则集合
    'stylelint-config-standard',
    // standard 规则集合的 less 版本
    'stylelint-config-standard-less',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    // 接入 Prettier 规则
    // 'stylelint-config-prettier',
    // 'stylelint-prettier/recommended'
  ],
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    'prettier/prettier': true
  }
};
```



同样的，在开发阶段，也可以依赖 Stylelint 相关的 Vite 插件，实现在项目开发阶段提前暴露出样式代码的规范问题

安装

```shell
pnpm i vite-plugin-stylelint -D
```



配置 `vite.config.ts`

```typescript
import viteStyleLint from 'vite-plugin-stylelint'

export default defineConfig({
  plugins: [
    viteStyleLint()
  ]
})
```



这样，就会在控制台显示相应的错误提示

![](./imgs/img20.png)



#### Husky + lint-staged 拦截 git 提交

在开发阶段提前规避掉代码格式的问题，但实际上这也只是将问题提前暴露，并不能保证规范问题能完全被解决，还是可能导致线上的代码出现不符合规范的情况。

在代码提交的时候进行卡点检查，也就是拦截 `git commit` 命令，进行代码格式检查，只有确保通过格式检查才允许正常提交代码。社区中已经有了对应的工具——`Husky`来完成这件事情



安装

```shell
pnpm i husky -D
```

这里需要注意的是，Husky `4.x` 及以下版本，可以在`package.json`中配置 husky 的钩子，例如：

```json
// package.json
{
  "husky": {
    "pre-commit": "npm run lint"
  }
}
```

但是在 Husky 7.x 版本以上，是无效的，Husky 7.x 以上版本需要：

```shell
pnpm exec husky init
```

执行完后，将会在项目根目录的`.husky`目录中看到名为`pre-commit`的文件，里面是 `git commit`前要执行的脚本

然后修改 `.husky/pre-commit` 文件，如下：

```shell
pnpm lint
pnpm lint:style
```

那么，在执行 git commit 之前，就会先执行检测脚本，拦截代码提交



但是以上会有一些问题：Husky 中每次执行`npm run lint`都对仓库中的代码进行全量检查，也就是说，即使某些文件并没有改动，也会走一次 Lint 检查，当项目代码越来越多的时候，提交的过程会越来越慢，影响开发体验。



而`lint-staged`就是用来解决上述全量扫描问题的，可以实现只对存入`暂存区`的文件进行 Lint 检查，大大提高了提交代码的效率



安装
```shell
pnpm i lint-staged -D
```

然后在 `package.json` 中添加

```json
{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "dev:tsc": "tsc --noEmit --watch",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./src",
    "lint:style": "stylelint --fix \"src/**/*.{css,less}\"",
    "prepare": "husky"
  },

  "lint-staged": {
    "**/*.{js,jsx,tsx,ts}": [
      "npm run lint:script",
      "git add ."
    ],
    "**/*.{scss}": [
      "npm run lint:style",
      "git add ."
    ]
  },
}
```

在 Husky 中应用`lint-stage`，回到`.husky/pre-commit`脚本中，将原来的换成：

```shell
npx --no -- lint-staged
```



#### 提交时的 commit 信息规范

除了代码规范检查之后，Git 提交信息的规范也是不容忽视的一个环节，规范的 commit 信息能够方便团队协作和问题定位。首先我们来安装一下需要的工具库



安装

```shell
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D
```



项目根目录下接下来新建`.commitlintrc.js`：

```js
// .commitlintrc.js
module.exports = {
  extends: ["@commitlint/config-conventional"]
};
```



一般直接使用`@commitlint/config-conventional`规范集就可以了，它所规定的 commit 信息一般由两个部分: `type` 和 `subject` 组成，结构如下:

> // type 指提交的类型
> // subject 指提交的摘要信息
> <type>: <subject>



常用的 `type` 值包括如下:

- `feat`: 添加新功能。
- `fix`: 修复 Bug。
- `chore`: 一些不影响功能的更改。
- `docs`: 专指文档的修改。
- `perf`: 性能方面的优化。
- `refactor`: 代码重构。
- `test`: 添加一些测试代码等等。



接下来将`commitlint`的功能集成到 Husky 的钩子当中



## 深入 Vite



### Vite 的预构建能力

Vite 是一个 `no-bundle` 构建工具，相对于传统的构建工具，能做到在开发环境下按需编译，而不需要构建。极大提升开发体验。



这里需要注意的是，模块代码其实分为两部分，一部分是源代码，也就是业务代码，另一部分是第三方依赖的代码，即`node_modules`中的代码。所谓的`no-bundle`**只是对于源代码而言**，对于第三方依赖而言，Vite 还是选择 bundle(打包)，并且使用速度极快的打包器 Esbuild 来完成这一过程，达到秒级的依赖编译速度



#### 为什么需要预购建

> 可以参考官网的：https://cn.vitejs.dev/guide/dep-pre-bundling.html#the-why



首先，vite 是基于浏览器原生 ES 模块规范实现的 Dev Server，不论是应用代码，还是第三方依赖的代码，都需要符合 ESM 规范才能够正常运行。

但是对于第三方依赖，开发者没法控制打包规范。而且，就目前而言，还有相当多的第三方库仍然没有 ES 版本的产物，是 CommonJS 格式的代码，这种代码在 vite 中是无法直接运行的，那么就需要先转换为 ESM 格式的产物。



另外，还有一个问题：**请求瀑布流问题**，比如：`lodash-es`库本身是有 ES 版本产物的，可以在 Vite 中直接运行，但是 lodash-es 将 ES 模块构建为许多单独的文件。有超过 600 个模块，这导致在加载时会发出特别多的请求，导致页面加载的前几秒几都乎处于卡顿状态

![](./imgs/img21.png)



在应用代码中调用了`debounce`方法，这个方法会依赖很多工具函数，每个`import`都会触发一次新的文件请求，因此在这种`依赖层级深`、`涉及模块数量多`的情况下，会触发成百上千个网络请求，巨大的请求量加上 Chrome 对同一个域名下只能同时支持 `6` 个 HTTP 并发请求的限制，导致页面加载十分缓慢。

而在进行了依赖与构建之后，`lodash-es`这个库的代码被打包成了一个文件，这样请求的数量会骤然减少，页面加载也快了许多。



总结依赖预购建做了两件事：

- 一是将其他格式(如 UMD 和 CommonJS)的产物转换为 ESM 格式，使其在浏览器通过 `<script type="module"><script>`的方式正常加载
- 二是打包第三方库的代码，将各个第三方库分散的文件合并到一起，减少 HTTP 请求数量，避免页面加载性能劣化

而这两件事，全部由性能优异的 `Esbuild` (基于 Golang 开发)完成，而不是传统的 Webpack/Rollup，所以也不会有明显的打包性能问题，反而是 Vite 项目启动飞快(秒级启动)的一个核心原因。

> Vite 1.x 使用了 Rollup 来进行依赖预构建，在 2.x 版本将 Rollup 换成了 Esbuild，编译速度提升了[近 100 倍](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2F)！



#### 如何开启 vite 的预购建

Vite 会自动开启预购建，当第一次启动项目时，可以在命令窗口看到：

![](./imgs/img22.png)



同时，在项目预构建成功后，在 `node_modules` 目录下有 `.vite` 目录，这就是预构建的产物

![](./imgs/img23.png)



对于预构建的产物，Vite 的 Dev Server 会设置强缓存:

![](./imgs/img24.png)

这个过期时间被设置为 1 年，一旦被缓存，这些请求将永远不会再次访问开发服务器。

会基于以下几个来源来决定是否需要重新运行预构建步骤：

- 包管理器的锁文件内容，例如 `package-lock.json`，`yarn.lock`，`pnpm-lock.yaml`，或者 `bun.lockb`；
- 补丁文件夹的修改时间；
- `vite.config.js` 中的相关字段；
- `NODE_ENV` 的值。

只有在上述其中一项发生更改时，才需要重新运行预构建。

如果出于某些原因你想要强制 Vite 重新构建依赖项，你可以在启动开发服务器时指定 `--force` 选项，或手动删除 `node_modules/.vite` 缓存目录。



#### 自定义预构建配置

Vite 可以通过提供的配置项来定制预构建的过程。Vite 将预构建相关的配置项都集中在`optimizeDeps`属性上。



##### 入口文件---entries

第一个参数是`optimizeDeps.entries`，通过这个参数可以自定义预构建的入口文件

在项目第一次启动上，vite 会默认抓取项目中所有的 HTML 文件（如当前脚手架项目中的`index.html`），将 HTML 文件作为应用入口，然后根据入口文件扫描出项目中用到的第三方依赖，最后对这些依赖逐个进行编译。

那么，当默认扫描 HTML 文件的行为无法满足需求的时候，可以通过配置指定

```tsx
// vite.config.ts
{
  optimizeDeps: {
    // 为一个字符串数组
    entries: ["./src/App.tsx"];
  }
}
```



同时，entries 配置也支持 [glob 语法](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmrmlnc%2Ffast-glob)，如：

```tsx
entries: ["**/*.tsx"];
```



##### 添加和排除依赖---include、exclude

首先是 include，它决定了可以强制预构建的依赖项，使用方式很简单

```ts
optimizeDeps: {
  // 配置为一个字符串数组，将 `lodash-es` 进行强制依赖预构建
  include: ["lodash-es"];
}
```



什么时候可以使用 include 字段呢

- 场景一：动态 import。在某些动态 import 的场景下，由于 Vite 天然按需加载的特性，经常会导致某些依赖只能在运行时被识别出来。

  ```js
  // src/locales/zh_CN.js
  import objectAssign from "object-assign";
  console.log(objectAssign);
  
  // main.tsx
  const importModule = (m) => import(`./locales/${m}.ts`);
  importModule("zh_CN");
  
  ```

  在这个例子中，动态 import 的路径只有运行时才能确定，无法在预构建阶段被扫描出来。因此，在访问项目时控制台会出现下面的日志信息:

  ![](./imgs/img25.png)

  这代表Vite 运行时发现了新的依赖，随之重新进行依赖预构建，并刷新页面。这个过程也叫**二次预构建**。

  然而，二次预构建的成本也比较大。我们不仅需要把预构建的流程重新运行一遍，还得重新刷新页面，并且需要重新请求所有的模块。尤其是在大型项目中，这个过程会严重拖慢应用的加载速度！

  此时就可以利用 include 字段提前声明需要预构建的依赖

- 场景二：某些包被手动 exclude。`exclude` 是`optimizeDeps`中的另一个配置项，与`include`相对，用于将某些依赖从预构建的过程中排除。不过这个配置并不常用，也不推荐使用。如果真遇到了要在预构建中排除某个包的情况，需要注意`它所依赖的包`是否具有 ESM 格式。比如：

  ```typescript
  // vite.config.ts
  {
    optimizeDeps: {
      exclude: ["@loadable/component"];
    }
  }
  ```

  手动排除了 @loadable/component 包之后，会发现报错

  ![](./imgs/img26.png)

  刚刚手动 exclude 的包`@loadable/component`本身具有 ESM 格式的产物，但它的某个依赖`hoist-non-react-statics`的产物并没有提供 ESM 格式，导致运行时加载失败。

  此时，就可以使用 include 字段强制对`hoist-non-react-statics`这个间接依赖进行预构建

  ```typescript
  // vite.config.ts
  {
    optimizeDeps: {
      include: [
        // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
        "@loadable/component > hoist-non-react-statics",
      ];
    }
  }
  ```

  

####  自定义 ESBuild 行为

Vite 提供了`esbuildOptions` 参数来让我们自定义 Esbuild 本身的配置，常用的场景是加入一些 Esbuild 插件

```typescript
// vite.config.ts
{
  optimizeDeps: {
    esbuildOptions: {
       plugins: [
        // 加入 Esbuild 插件
      ];
    }
  }
}
```

这个配置主要用来处理一些特殊情况。比如某个第三方包出现问题了。



由于无法保证第三方包的代码质量，在某些情况下会遇到莫名的第三方库报错。举一个常见的案例——`react-virtualized`库。这个库被许多组件库用到，但它的 ESM 格式产物有明显的问题，在 Vite 进行预构建的时候会直接抛出这个错误：

![](./imgs/img27.png)

原因是这个库的 ES 产物莫名其妙多出了一行无用的代码:

```js
// WindowScroller.js 并没有导出这个模块
import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";
```

其实并不需要这行代码，但它却导致 Esbuild 预构建的时候直接报错退出了。



这种问题怎么处理？

- 方案一：直接修改第三方库的代码。使用`patch-package` 这个库来进行第三方包源码修改
- 方案二：加入 esbuild 插件。通过 Esbuild 插件修改指定模块的内容



这里来说下方案二，还是以 `react-virtualized` 库为例

首先，定义一个 esbuild 插件

```typescript
const esbuildPatchPlugin = {
  name: "react-virtualized-patch",
  setup(build) {
    build.onLoad(
      {
        filter:
          /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/,
      },
      async (args) => {
        const text = await fs.promises.readFile(args.path, "utf8");

        return {
          contents: text.replace(
            'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
            ""
          ),
        };
      }
    );
  },
};
```

然后，在 `vite.config.ts` 中配置 esbuild 插件

```typescript
{
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildPatchPlugin];
    }
  }
}
```









































