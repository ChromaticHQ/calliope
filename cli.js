#!/usr/bin/env node

const chalk = require('chalk');
const log = require('fancy-log');
const package = require('./package.json');
const greeting = ` You’re using ${ package.name } v${ package.version }. `;
const greetingBg = 'bgYellow';
const greetingFg = 'black'
log.info(chalk.bold.visible[greetingBg][greetingFg]('-'.repeat(greeting.length)));
log.info(chalk.bold.visible[greetingBg][greetingFg](greeting));
log.info(chalk.bold.visible[greetingBg][greetingFg]('-'.repeat(greeting.length)));

// Grab args from the process object, stripping out the first two (node and
// calliope). This gives us everything that comes after those two, which is
// what we care about.
const args = process.argv.slice(2);
const calliope = require('./calliope');
calliope(...args);
