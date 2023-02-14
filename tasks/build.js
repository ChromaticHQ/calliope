/*
 * @file
 * Gulp task to run all tasks from the build task register in config.
 */

const chalk = require('chalk');
const gulp = require('gulp');
const log = require('fancy-log');
const { parallel, series } = require('gulp');
const config = require('../config')();

console.log(config.custom.tasks);
let clean = config.custom.tasks.filter((task) => task.name === 'clean')[0];
console.log(clean);
if (clean) {
  clean = require(clean.path);
} else {
  clean = require('./clean');
}

// Create array of build task names from build task register.
const pipelines = Object.keys(config.pipelines);
const tasks = [
  clean,
  parallel(...pipelines.map((pipelineName) => {
    // Try to load the task from the project’s custom tasks and task overrides.
    let task = config.custom.pipelines[pipelineName];
    // If the above attempt produced a module, use it.
    if (task) {
      // Found a task, so register and return it.
      gulp.task(pipelineName, task);
      return task;
    }

    // Since no module has been found yet, try to load one from the default
    // tasks in calliope.
    try {
      task = require(`./${pipelineName}`);
    } catch (error) {
      // If the issue is not that the module is missing, throw the error.
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
      log.error(chalk.redBright(`✕ ERROR: Configuration ${pipelineName} detected, but task file '${pipelineName}.js' cannot be found.`));
      log.error(`    If you have a custom task with this name, be sure to add the module for it in your project at 'pipelines/${pipelineName}.js'.`);
      process.exit(1);
    }

    // Found a task, so register and return it.
    gulp.task(pipelineName, task);
    return task;
  })),
];

// Export composed task.
module.exports = series(tasks);
