const { Command } = require('commander')

const inquirer = require('inquirer')
const ejs = require('ejs')
const path = require('path')
const voca = require('voca')
const fs = require('fs')
const prettier = require("prettier");

const program = new Command()

program.parse(process.argv)
const name = program.args[0]


!(async () => {
  const answers = await inquirer
    .prompt([{
      type: 'checkbox',
      message: '创建 tsx + service + types组件，请调整下列选项：',
      name: 'types',
      choices: [
      {
        name: "有表单",
        value: "hasForm",
        checked: true,
      },
      {
        name: "有样式",
        value: "hasCss",
        checked: true,
      },
      {
        name: "service从Props传入",
        value: "isServiceFromProps",
        checked: true,
      },
      {
        name: "创建同名文件夹",
        value: "mkdir",
        checked: true,
      }
      ]
    }, {
      type: 'input',
      name: 'componentName',
      message: '组件的名称？',
      async filter (value) {
        return voca.titleCase(value)
      },
      validate (value) {
        const done = this.async()
        if (!/^[a-zA-Z]+$/.test(value)) {
          done('组件名称仅可由大小写字母构成')
        }
        done(null, true)
      },
      default: name ? name : 'Test'
    }])


  console.log(answers);
  let data = {
    componentName: voca.titleCase(answers.componentName),
    namespaceName: `N${voca.titleCase(answers.componentName)}`,
    dataInterfaceName: 'IData',
    componentInterfaceName: 'IView',
    serviceInterfaceName: 'IService',
    serviceName: `${voca.titleCase(answers.componentName)}Service`,
    serviceObjName: 'service',
    isServiceFromProps: answers.types.includes('isServiceFromProps'),
    hasForm: answers.types.includes('hasForm'),
    hasCss: answers.types.includes('hasCss')
  }


  const isNeedMkDir = answers.types.includes('mkdir')

  const dir = isNeedMkDir ? `./${voca.titleCase(answers.componentName)}` : './';


  if (isNeedMkDir) {
    try {
      fs.mkdirSync(dir)
    } catch (error) {
      // throw Error('文件夹已经存在')
    }
  }

  if (data.hasCss) {
    fs.writeFileSync(path.resolve(dir, 'index.module.scss'), fs.readFileSync(path.resolve(path.dirname(program._scriptPath), `../template/index.module.scss`)))
  }

  ['index.tsx', 'service.ts', 'types.ts'].forEach((file) => {
    ejs.renderFile(path.resolve(path.dirname(program._scriptPath), `../template/${file}`), data, {}, function (err, str) {
      if (err) {
        console.error(err)
        return
      }
      // str.replace(/\n{3,}/g, '\n\n')
      fs.writeFileSync(path.resolve(dir, file),
        prettier.format(str, {
          singleQuote: true, //单引号
          semi: false, //无分号
          printWidth: 120, //最大长度
          parser: "babel-ts"
        })
      )
    });
  })


})()