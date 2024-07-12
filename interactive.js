import inquirer from 'inquirer'

export const inquirerConfirm = async (message) => {
  const { isDelete } = await inquirer.prompt(
    {
      type: 'confirm',
      name: 'isDelete',
      message,
      default: false
    }
  )
  return isDelete
}

export const inquirerList = async (message, choices, type = 'list') => {
  const { repo } = await inquirer.prompt(
    {
      type,
      name: 'repo',
      message,
      choices
    }
  )
  return repo
}

export const inquirerQuestion = async (messages) => {
  const answer = await inquirer.prompt(messages.map(message => {
    const { type = 'input', } = message
    return {
      ...message,
      type,
    }
   }))
  return answer
}