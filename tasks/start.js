/*
 * @file
 * Task to start our watch tasks and watch for tooling and configuration files
 * to restart the watch tasks when appropriate.
 */

const chalk = require('chalk');
const log = require('fancy-log');
const path = require('path');
const { spawn } = require('child_process');

function start() {
  spawn('nodemon', [
    '--config',
    path.resolve(__dirname, '..', 'nodemon.json'),
  ], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  }).on('message', (event) => {
    if (event.type === 'restart' && event.data && event.data.length) {
      // Acknowledge changed files to the console.
      log.info(chalk.cyan(`! Detected changes:\n    - ${event.data.join('\n    - ')}`));
      log.info(chalk.cyan('✓ Restarting toolchain…'));
    }
  });
}

module.exports = start;
