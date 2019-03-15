#!/usr/bin/env node

import chalk from 'chalk'
import figlet from 'figlet'
import fs from 'fs'
import { modulet } from './modulet'
import path from 'path'
import program from 'commander'
import { walk } from './walk'
const clear = require('clear')

clear()
console.log(chalk.red(figlet.textSync('modulet', { horizontalLayout: 'full' })))

let source = '.'

program
  .version('0.1.0')
  .arguments('<source>')
  .action(function(s) {
    source = s
  })

program.parse(process.argv)

modulet(source)
