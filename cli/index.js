#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()

program
  .command(
    'component [name]', '创建一个component(ts+jsx+service+types)',
    { executableFile: 'action/component' }
  ).alias('c')
  .parse()
