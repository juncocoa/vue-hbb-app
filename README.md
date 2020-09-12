# hbb-web-app 爸妈课堂

## 基于 Vue + Vuex + Vant UI + 微信支付的项目，不熟悉查询一下百度，了解一下

### 项目介绍

```
基于 vue-cli 创建的项目, node_modules 依赖建议使用 yarn 进行管理
使用 rem 基于 750px 设计稿进行移动端设备适配
核心功能
```

## 项目展示图
![wapb8g](https://s1.ax1x.com/2020/09/12/wapb8g.png)
![wapHPS](https://s1.ax1x.com/2020/09/12/wapHPS.png)
![wapq2Q](https://s1.ax1x.com/2020/09/12/wapq2Q.png)
![wapT58](https://s1.ax1x.com/2020/09/12/wapT58.png)

### 运行 与 打包

> npm serve（vue-cli-service serve）

文件打包，在 dist 文件夹下，生成所有打包文件，网页加载采用分包加载。

> npm build（vue-cli-service build）

### 使用插件

> `postcss-normalize` 添加css reset. [查看源代码地址](https://github.com/csstools/postcss-normalize)

> `postcss-preset-env` 前身是postcss-cssnext,用于polyfill css新特性，已集成autoprefixer. [查看源代码地址](https://github.com/csstools/postcss-preset-env)

> `postcss-pxtorem` 自动转换px到rem的插件. [查看源代码地址](https://github.com/cuth/postcss-pxtorem)
