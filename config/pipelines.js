/**
 * @file
 * Load the downstream project’s pipelines, if any.
 */

const chalk = require('chalk');
const log = require('fancy-log');
const path = require('path');
const find = require('../lib/find');

function customPipelines(pipelines, report) {
  const tasks = {};

  Object.keys(pipelines).forEach((name) => {
    // Try to load the task from the project’s own CWD first.
    try {
      const task = require(path.resolve(process.cwd(), 'calliope/pipelines', name));
      tasks[name] = task;
    } catch (error) {
      // If the issue is not that the module is missing, throw the error.
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
    }
  });

  if (report && Object.keys(tasks).length) {
    log.info(chalk.green('✓ Custom pipelines found!'));
    log.info(chalk.grey('    The following custom or override Gulp tasks will run as part of your build:'));
    Object.keys(tasks).forEach((name) => log.info(chalk.grey(`      - ${name}`)));
  } else if (report) {
    log.info(chalk.cyan('- No custom pipeline found.'));
  }

  return tasks;
}

module.exports = customPipelines;
