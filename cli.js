#!/usr/bin/env node

// Grab args from the process object, stripping out the first two (node and
// calliope). This gives us everything that comes after those two, which is
// what we care about.
const chalk = require('chalk');

const calliope = require('./calliope');
const packageFile = require('./package.json');

const args = process.argv.slice(2);
const isInit = args[0] === 'init';
const omitSetupReport = args.includes('--omit-setup-report') || isInit;

const greeting = ` You’re using ${packageFile.name} v${packageFile.version}. `;
const greetingBg = 'bgYellow';
const greetingFg = 'black';

// Report library version number if reporting is not omitted, or if this is the
// init command.
if (!omitSetupReport || isInit) {
  /* eslint-disable no-console */
  console.log(chalk.bold.visible[greetingBg][greetingFg]('-'.repeat(greeting.length)));
  console.log(chalk.bold.visible[greetingBg][greetingFg](greeting));
  console.log(chalk.bold.visible[greetingBg][greetingFg]('-'.repeat(greeting.length)));
}

// Confirm config loads w/o issues and report custom config and dev options to
// the console, unless requested to omit.
require('./config')(!omitSetupReport);

calliope(...args);
