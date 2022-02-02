/**
 * @file
 * Load the downstream project’s miscellaneous tasks, if any.
 */

const chalk = require('chalk');
const find = require('../lib/find');
const log = require('fancy-log');
const path = require('path');

function customTasks(report) {
  const tasks = find(path.resolve(process.cwd(), 'calliope/tasks'));

  if (report && tasks.length) {
    log.info(chalk.green('✓ Custom tasks found!'));
    log.info(chalk.grey('    The following custom Gulp tasks are available:'));
    tasks.forEach((task) => log.info(chalk.grey(`      - ${ task.name }`)));
  } else if (report) {
    log.info(chalk.cyan('- No custom tasks found.'));
  }

  return tasks;
}

module.exports = customTasks;
