/*
 * @file
 * Gulp task to run all tasks from the build task register in config.
 */

const config = require('../config');
const clean = require('./clean');
const { parallel, series } = require('gulp');
const path = require('path');

// Create array of build task names from build task register.
const pipelines = Object.keys(config.pipelines);
const tasks = [
  clean,
  parallel(...pipelines.map(pipelineName => {
    let task = null;
    // Try to load the task from the project’s own CWD first.
    try {
      task = require(path.resolve(process.cwd(), 'tasks', pipelineName));
    }
    catch (error) {
      // If the issue is not that the module is missing, throw the error.
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
    }
    // If the above attempt produced a module, use it.
    if (task) return task;

    // Since no module has been found yet, try to load one from the default
    // tasks in calliope.
    try {
      task = require(`./${pipelineName}`);
    }
    catch (error) {
      // If the issue is not that the module is missing, throw the error.
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
      throw new Error(`Build task '${pipelineName}' was not found.\n       If you have a custom task with this name, be sure to add a module for it at 'tasks/${pipelineName}.js'.\n`);
    }

    // Found a task, so return it.
    return task;
  })),
];

// Export composed task.
module.exports = series(tasks);
