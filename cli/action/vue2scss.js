const { Command } = require('commander')

const ejs = require('ejs')
const path = require('path')
const voca = require('voca')
const fs = require('fs')
const { resolve } = require('path')

const program = new Command()

program.parse(process.argv)
const fileName = program.args[0]


!(async () => {

  let vueContent = fs.readFileSync(resolve(process.cwd(), fileName), 'utf8')
  vueContent.match(/<style(.*?)>([\s\S]*)<\/style>/g).forEach(template => {

    let templateContent = template.replace(/<style(.*?)>/, '').replace(/<\/style>/, '')

    templateContent = templateContent.replace(/\.([a-zA-Z\-_]*?)([,\{])/g, (match, $1, $2) => {
      return `.${voca.camelCase($1)}${$2}`
    })

    console.log(templateContent)
  })
})()