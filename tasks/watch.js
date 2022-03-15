/*
 * @file
 * Gulp task to watch files and run pipelines when appropriate,
 * using the tasks exposed by the `build` function.
 */

const gulp = require('gulp');
const { series, watch } = require('gulp');

const browsersync = require('./browsersync');
const build = require('./build');
const config = require('../config')();

// store pipelines for reuse
const { pipelines } = config;

// Create array of pipeline names from the pipeline dictionary.
const pipelineNames = Object.keys(pipelines);

// Create an array of daemon processes to be run alongside our watch tasks.
// e.g. component libraries, APIs, stub servers, etc.
const daemons = config.custom.daemons.map((daemon) => {
  const task = require(daemon.path);
  gulp.task(daemon.name, task);
  return task;
});

// Private task: programmatically create watchers.
function watchSource(done) {
  // Iterate through the build pipelines and start a watcher for each.
  pipelineNames.forEach((name) => {
    let watchFiles = pipelines[name].src;
    // If pipeline has a separate watch property, assume it to be an array and
    // add it to the src array.
    if (pipelines[name].watch) {
      watchFiles = [...watchFiles, ...pipelines[name].watch];
    }
    watch(watchFiles, { usePolling: true }, gulp.task(name));
  });
  done();
}

module.exports = series(build, watchSource, browsersync, ...daemons);
