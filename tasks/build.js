/*
 * @file
 * Gulp task to run all tasks from the build task register in config.
 */

const config = require('../config');
const clean = require('./clean');
const { parallel, series } = require('gulp');

// Create array of build task names from build task register.
const pipelines = Object.keys(config.pipelines);
const tasks = [
  clean,
  parallel(...pipelines.map(pipelineName => require(`./${pipelineName}`)))
];

// Export composed task.
module.exports = series(tasks);
