#!/usr/bin/env node

import figlet from 'figlet'
import chalk from 'chalk'
import { program } from 'commander'
import { templates } from './constants.js'
// import pkg from './package.json' assert { type: 'json' } // esm 模块 引入JSON 文件 
// import fs from 'fs/promises'
import fs from 'fs-extra'
import {table} from 'table'
import initAction from './initAction.js'
import logSymbols from './logSymbols.js'
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
// // ESM 模拟 require 模块，加载JSON 文件
// console.log(require('./package.json'))

// 获取package.json版本号
// new URL('./package.json', import.meta.url) // 获取当前目录下的package.json
// import.meta.url 获取当前目录
// const pkg = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf-8'))

const pkg = fs.readJsonSync(new URL('./package.json', import.meta.url))

console.log(logSymbols.star, 'package.json', pkg.version)
console.log(logSymbols.star, 'import.meta.url', import.meta.url)
console.log(logSymbols.star, 'process.cwd', process.cwd())
process.on('error', (e) => {
  console.log(logSymbols.star, e)
})
// 命令行版本 -V
program.version('0.0.1')

// 命令行名称, 使用方式描述
program.name('ever')
  .description('尚医智信脚手架工具')
  .usage('<command> [options]')
  .on('--help', () => {
    // on 绑定事件。回调函数
    console.log(logSymbols.info, chalk.cyan(figlet.textSync('ever-cli', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })))
    
    
    console.log(logSymbols.info, `Run ${chalk.cyanBright('ever <command> --help')} for detailed usage of given command.`)
  })

// <name> 尖括号为必须的参数
program.command('create <app-name>')
  .description('创建一个新项目')
  .option('-t, --template [template]', '输入模版名称创建项目') // 带参数的选项
  .option('-f, --force', '强制覆盖本地已有同名项目')
  .option('-i, --ignore', '忽略项目相关描述，可快速创建项目')
  .action(initAction)

// 查看所有可用模版信息
program.command('list')
  .description('查看所有可用模版信息')
  .action(() => {
    const data = [

    ];
    templates.forEach((item, index) => {
      // console.log(logSymbols.debug, chalk.blueBright(index + 1), chalk.greenBright(item.name), chalk.grey(item.description))
      data.push([logSymbols.star, chalk.blueBright(index + 1), chalk.greenBright(item.name), chalk.grey(item.description)])
    })
    
    
    const tableConfig = {
      border: {
        topBody: `─`,
        topJoin: `┬`,
        topLeft: `┌`,
        topRight: `┐`,
    
        bottomBody: `─`,
        bottomJoin: `┴`,
        bottomLeft: `└`,
        bottomRight: `┘`,
    
        bodyLeft: `│`,
        bodyRight: `│`,
        bodyJoin: `│`,
    
        joinBody: `─`,
        joinLeft: `├`,
        joinRight: `┤`,
        joinJoin: `┼`
      },
      header: {
        alignment: 'center',
        content: chalk.yellowBright(logSymbols.star, '可用模版列表'),
      }
    };
    
    console.log(table(data, tableConfig))
    console.log(logSymbols.info, chalk.green('使用ever create <app-name> -t <template-name>创建项目'))
  })



// const url = 'direct:https://gitee.com/xiongzhiqing/webpack-template.git'
const url = 'xiongzhiqing/webpack-template.git'
const dest = './repo'
// clone(url, dest)

// 解析命令行参数
program.parse(process.argv)