import chalk from "chalk"

/**
 * 获取终端是否支持 unicode
 * @returns {boolean}
 */
function isUnicodeSupported() {
  if (process.platform !== 'win32') {
    return process.env.TERM !== 'linux'
  }
  return Boolean(process.env.WT_SESSION) // Windows Terminal
		|| Boolean(process.env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
		|| process.env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
		|| process.env.TERM_PROGRAM === 'Terminus-Sublime'
		|| process.env.TERM_PROGRAM === 'vscode'
		|| process.env.TERM === 'xterm-256color'
		|| process.env.TERM === 'alacritty'
		|| process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}

const main = {
  info: chalk.blue('ℹ︎'),
  success: chalk.green('✔︎'),
  warning: chalk.yellow('⚠︎'),
  error: chalk.red('✘'),
  debug: chalk.magenta('⧩'),
  star: chalk.yellow('✦'),
}
 
const fallback = {
  info: chalk.blue('i'),
  success: chalk.green('√'),
  warning: chalk.yellow('!'),
  error: chalk.red('×'),
  debug: chalk.magenta('☺'),
  star: chalk.yellow('*'),
}

/*
 * logSymbols 输出的符号
 */
export default isUnicodeSupported() ? main : fallback