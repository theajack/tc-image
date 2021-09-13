### typescript运行环境demo

这是一个支持eslint的typescript运行环境

只需要克隆，安装依赖就可以运行起来了，毕竟webpack、eslint、babel、ts的配置搞起来还是比较麻烦的～

在你喜欢的目录运行：

```
git clone https://github.com/theajack/ts-demo.git
```

```
cd ts-demo
```

使用淘宝镜像安装依赖

```
npm i --registry=https://registry.npm.taobao.org
```

使用 webpack-dev-server 运行demo

```
npm run dev
```

打包：

```
npm run build
```


项目中有一些用不到的东西可以删除，代码就不介绍了，后面就到你自己发挥啦！


node ./node_modules/onchange/dist/bin.js -i 'src/wasm/lib/**/*' -- node ./helper/build-asm.js


备注

1. 坐标系为横轴为x轴，向右为正方向，纵轴为y轴，向下为正方向，垂直于纸面为z轴，向外为正方向
2. 图片定义起始坐标为（1，1） 结束坐标为（width，height）width、height分别为图片的宽高像素数
3. 极坐标定义水平朝右为0度，顺时针方向为正方向，竖直的角度（0-360）