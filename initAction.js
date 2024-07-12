import clone from './gitClone.js'
import { messages, prefix, templates } from './constants.js'
import shell from 'shelljs'
import chalk from 'chalk'
import logSymbols from './logSymbols.js'
import fs from 'fs-extra'
import ora from 'ora'
import { resolve } from 'path'
import { inquirerConfirm, inquirerList, inquirerQuestion } from './interactive.js'
const appDirectory = fs.realpathSync(process.cwd()) // 获取当前目录
const resolveDir = (dir) => {
  return resolve(appDirectory, dir)
}
async function removeDir(dir) {
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}`,
    color: 'green',
    spinner: { // 配置加载动画
      interval: 80,
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    }
  }).start()
  try {
    await fs.remove(resolveDir(dir))
    spinner.succeed(chalk.green(`删除文件夹 ${chalk.yellowBright(dir)} 成功`))
  } catch (error) {
    spinner.fail(chalk.red(`删除文件夹 ${chalk.yellowBright(dir)} 失败`))
    console.log(error)
    return
  }
}

function changePackageJson(name, option) {
  const packageJsonPath = resolveDir(`${name}/package.json`)
  if (!fs.existsSync(packageJsonPath)) {
    console.log(logSymbols.error, chalk.redBright('Sorry  package.json 文件不存在'))
    shell.exit(1)
  }
  const packageJson = fs.readJsonSync(packageJsonPath)
  Object.assign(packageJson, option)
  // spaces: 2 缩进空格数
  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 })
}

function npmInstall(dir) {
  const spinner = ora({
    text: `正在安装依赖`,
    color: 'green',
    spinner: { // 配置加载动画
      interval: 80,
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    }
  }).start()
  try {
    // npm install -d 安装依赖, -d 显示安装进度 --force 强制覆盖 忽略对等依赖
    const result = shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d`)
    if (result.code !== 0) {
      spinner.fail(chalk.yellow(`安装依赖失败`))
      shell.exit(1)
    } else {
      spinner.succeed(chalk.green(`安装依赖成功`))
      // 项目安装成功
      console.log(logSymbols.success, chalk.greenBright('项目创建成功'))
      console.log(logSymbols.info, chalk.cyanBright(`cd ${dir} && npm run dev`))
      shell.exit(0)
    }
  } catch (error) {
    spinner.fail(chalk.yellow(`安装依赖失败`))
    console.log(error)
    shell.exit(1)
  }
}

// answers transformer 策略
const transformerMap = {
  name: (value, name) => {
    return value || name
  },
  keywords: (value) => {
    return value.split(',').map(item => item.trim())
  }
}

const initAction = async (name, option) => {
  // 验证name输入是否符合规范 - 英文开头，可以包含数字，下划线，中划线
  if (name.match(/[\u4E00-\u9FFF`~!@#$%^&*\[\]()+=<>?:"{}|,./;]/g)) {
    console.log(logSymbols.error, chalk.redBright('Sorry  项目名称存在非法字符'))
    shell.exit(1)
  }
  if (!shell.which('git')) {
    console.log(logSymbols.error, chalk.redBright('Sorry 请安装 git'))
    shell.exit(1)
  }

  // 校验 option.template 是否存在
  let repo = ''
  if (option.template) {
    repo = templates.find(template => template.name === option.template)
    if (repo) {
      repo = `${prefix}${repo.value}`
    } else {
      console.log(logSymbols.error, `${chalk.redBright('不存在的模版:')} ${chalk.yellowBright(option.template)} `)
      console.log(`\r\n 运行 ${logSymbols.info} ${chalk.cyanBright('ever list')} 查看模版列表 \r\n`)
      return
    }
  } else {
    try {
      repo = await inquirerList('请选择模版', templates)
      repo = `${prefix}${repo}`
      console.log(repo, 'repo')
    } catch (error) {
      console.log('close')
      return
    }
  }

  // 验证是否存在${name}文件夹, 如果存在
  // 1、如果 option.force 为 true，则删除文件夹,
  // 2、如果 option.force 为 false，则提示用户是否删除文件夹
  if (fs.existsSync(name) && !option.force) {
    console.log(logSymbols.warning, chalk.yellowBright(`Sorry  ${name} 文件夹已存在`))
    // 询问用户是否删除文件夹
    let isDelete
    try {
      isDelete = await inquirerConfirm('是否删除文件夹？')
    } catch (error) {
      console.log('close')
      return
    }
    console.log(isDelete , 'isDelete')
    if (isDelete) {
      await removeDir(name)
    } else {
      console.log(logSymbols.error, chalk.redBright('Sorry   项目创建失败，存在同名文件夹，请修改项目名称后再试'))
      return
    }
  } else if (fs.existsSync(name) && option.force) {
    console.log(logSymbols.info, chalk.cyanBright(`Sorry  ${name} 文件夹已存在，正在删除中...`))
    removeDir(name)
  }
  console.log(repo, 'repo')
  // 下载模版 - clone git 仓库
  try {
    await clone(repo, name)
  } catch (error) {
    console.log(logSymbols.error, chalk.redBright('Sorry  项目创建失败，请重试'))
    shell.exit(1)
  }

  // 判断命令行是否输入了option.ignore -i, 快速创建项目
  if (!option.ignore) {
    // 输入提问 - 获取用户输入 answers
    const answers = await inquirerQuestion(messages)
    console.log(answers)
    
    // 修改package.json
    try {
      changePackageJson(name, Object.keys(answers).reduce((pre, key) => {
        const transformer = transformerMap[key]
        const answerValue = answers[key].trim()
        const value = transformer ? transformer(answerValue, name) : answerValue
        if (value) pre[key] = value
        return pre
      }, {}))

    } catch (error) {
      console.log(logSymbols.error, chalk.redBright('Sorry  修改package.json 失败, 请手动修改'))
      console.log(error)
    }
    
  }

  // 安装依赖
  npmInstall(name)

}

export default initAction