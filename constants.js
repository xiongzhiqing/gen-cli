export const prefix = 'direct:https://gitee.com/xiongzhiqing/'

export const templates = [
  {
    name: 'webpack-template',
    description: '基于webpack5初始化自定义vue3项目模版',
    value: 'webpack-template.git'
  },
  {
    name: 'vue-cli-template',
    description: '基于vue-cli创建初始化自定义vue3项目模版',
    value: 'vue-cli-template.git'
  },
  {
    name: 'vite-template',
    description: '基于vite创建初始化自定义vue3项目模版',
    value: 'vite-vue3-template.git'
  },
  {
    name: 'vue3-template',
    description: 'Vue 3 + TypeScript + Vite 创建初始化自定义vue3项目模版',
    value: 'vue3-template.git'
  }
]

export const messages = [
  {
    message: '请输入项目名称',
    name: 'name',
    validate: (value) => {
      if (value.match(/[\u4E00-\u9FFF`~!@#$%^&*\[\]()+=<>?:"{}|,./;]/g)) {
        return '项目名称存在非法字符'
      } else {
        return true
      }
    }
  },
  {
    message: '请输入项目关键词（,分割）',
    name: 'keywords'
  },
  {
    message: '请输入项目描述',
    name: 'description'
  },
  {
    message: '请输入项目作者',
    name: 'author'
  }
]