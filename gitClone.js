import download from 'download-git-repo'
import ora from 'ora'
import chalk from 'chalk'

const clone = (url, dest, options = { clone: true }) => {
  const spinner = ora('正在拉取项目...').start();
  return new Promise((resolve, reject) => {
    const callback = (err) => {
      if (err) {
        // 项目拉取失败 - 停止加载动画 - 输出错误信息 - 红色文字
        spinner.fail(chalk.red(err))
        reject(err)
      } else {
        // 项目拉取成功 - 停止加载动画 - 输出成功信息 - 绿色文字
        spinner.succeed(chalk.green('拉取项目成功!'))
        resolve()
      }
    }
    download(url, dest, options, callback)
  })
}

export default clone
