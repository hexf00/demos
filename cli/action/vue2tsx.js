const { Command } = require('commander')

const ejs = require('ejs')
const path = require('path')
const voca = require('voca')
const fs = require('fs')
const prettier = require("prettier");
const { resolve } = require('path')

const program = new Command()

program.parse(process.argv)
const fileName = program.args[0]

function getEventName ($1) {
  let $1_result = 'on' + $1;
  if ($1.indexOf(".") !== -1) {
    $1_result = 'on' + $1.split(".")[0]
  }
  return $1_result
}

function getMaxLineLength (str) {
  let max = 0
  let lines = str.split('\n')
  lines.forEach(line => {
    if (line.length > max) {
      max = line.length
    }
  })
  return max
}

!(async () => {

  let vueContent = fs.readFileSync(resolve(process.cwd(), fileName), 'utf8')
  vueContent.match(/<template>([\s\S]*)<\/template>/g).forEach(template => {
    // console.log(template)

    let templateContent = template.replace(/<template>/, '').replace(/<\/template>/, '')
    let maxLineLength = getMaxLineLength(templateContent)

    // props 替换
    templateContent = templateContent.replace(/:(.*?)="(.*?)["]([\n\s>/])/g, (match, $1, $2, $3) => {


      let $r2_result = $2;

      // 兼容  :style="{}" 语法
      if ($2.indexOf("{") === 0) {
        $r2_result = `{${$2}}`
      }
      return `${$1}={${$r2_result}}${$3}`
    })
    templateContent = templateContent.replace(/(v-model)="(.*?)["]([\n\s>/])/g, '$1={$2}$3')

    // 替换 无()=>{}的方法
    templateContent = templateContent.replace(/@(.*?)="([^>]*?)["]([\n\s>/])/g, (_, $1, $2, $3) => {
      let $1_result = getEventName($1)
      return `${$1_result}={()=>{${$2}}}${$3}`
    })
    // 替换 有()=>{}的方法
    templateContent = templateContent.replace(/@(.*?)="(.*?)["]([\n\s>/])/g, (_, $1, $2, $3) => {
      let $1_result = getEventName($1)
      let $r2_result = $2;
      return `${$1_result}={${$r2_result}}${$3}`
    })

    // 替换 无内容的方法
    templateContent = templateContent.replace(/ @(.*?)\..*?([\n\s>/])/g, (_, $1, $2, $3) => {
      // console.log(_, $1,$2,$3)
      return `${$1}={()=>{}}${$2}`
    })

    // 替换注释
    templateContent = templateContent.replace(/<!--(.*?)-->/g, '')


    // 替换值显示
    templateContent = templateContent.replace(/\{\{(.*?)\}\}/g, '{$1}')

    // style 替换
    templateContent = templateContent.replace(/(class)="(.*?)["]([\n\s>/])/g, (_, $1, $2, $3) => {
      let $r_result = $2.split(' ').map(className => {
        if ((className.includes('-') || className.includes('_'))
          && (className.indexOf('fx') !== 0 && className.indexOf('mb') !== 0)) {
          const camelCaseClassName = voca.camelCase(className)
          return `style.${camelCaseClassName}`
        } else {
          return `'${className}'`
        }
      }).join(',')
      return `${$1}={classnames(${$r_result})}${$3}`
    })

    console.log(
      prettier.format(templateContent, {
        singleQuote: true, //单引号
        semi: false, //无分号
        printWidth: maxLineLength, //最大长度
        parser: "babel-ts"
      })
    )

  })


})()