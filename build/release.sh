#! /usr/bin/env sh
# 告诉脚本在任何命令出错的时候，立即退出。可以确保在脚本执行过程中遇到错误立即停止。
set -e

# 输出提示信息
echo "输入新发布的版本号:"
# 等待用户在终端输入，读取用户输入 变量 VERSION
read VERSION
# 输出信息并让用户确认信息
# -p 用于在输出前面输出提示信息，-n1 表示只读取一个字符，-r 表示读取时不进行转义，-s 表示不显示输入字符。
read -p "确认发布版本号 $VERSION? (y/n)" -n1
# $REPLY 读取用户输入的 y/n 值 默认存在在 $REPLY 变量中
# echo "\r\n----$VERSION----$REPLY\r\n"
# 换行 直接输出一个空行
echo

# if [] 是直接判断  if[[]] 是模糊判断
# =~ 表示模糊匹配
if [[ $REPLY =~ ^[Yy]$ ]]; 
then
  echo "发布版本号 $VERSION"
  # 获取git暂存目录是否为空
  if [[ `git status --porcelain` ]]; # 如果存在文件，则返回非空，否则返回空
  then
    echo "\r\n----工作目录不干净，需要提交----\r\n"
    git add -A
    git commit -m "feat: release $VERSION" # 提交版本信息
  else
    echo "\r\n----工作目录没有任何需要提交的内容，不建议生产新的版本----\r\n"
    exit 1 # 退出脚本
  fi
  # 修改package.json 中的版本号
  npm version $VERSION --message "[release]: $VERSION"

  # 提交修改到远程仓库 master 分支
  git push origin master

  # 提交tag
  git push origin refs/tags/v$VERSION

  # 发布到npm
  npm publish
  
else
  echo "取消发布"
  exit 1
fi
# fi 表示结束 if 语句


