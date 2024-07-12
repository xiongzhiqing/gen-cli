#!/usr/bin/env node 解决不同的用户node路径不一致问题,可以让系统动态的查找node执行脚本文件


> ****node使用18.x版本之后****

初始化步骤:
1.声明脚本 #!/usr/bin/env
2.定义package.json中的bin属性值
3.全局安装

> npm link  软连接 - 直接在项目根目录下运行

> npm list -g 查看本机全局安装的包
> npm rm [package] -g 删除本地全局安装的包

> import.meta.url ESM模块化中的属，用于获取当前模块文件的绝对路径，它只能在支持ESM模块化环境中使用

> __dirname 获取当前文件所在目录的绝对路径，它是nodejs在每个模块注入的特殊属性，只能在commonjs模块化环境中使用

> process.cwd() 获取当前执行命令的目录

```js
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// ESM 模拟 require 模块，加载JSON 文件
console.log(require('./package.json'))
```
