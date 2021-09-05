#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()

program
  .command('component [name]', '创建一个component(ts+jsx+service+types)', { executableFile: 'action/component' }).alias('c')
  .command('vue2tsx [test.vue]', 'vue2tsx', { executableFile: 'action/vue2tsx' })
  .parse()
