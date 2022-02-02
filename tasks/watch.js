/*
 * @file
 * Gulp task to watch files and run pipelines when appropriate,
 * using the tasks exposed by the `build` function.
 */

const build = require('./build');
const config = require('../config')();
const gulp = require('gulp');
const path = require('path');
const proxy = require('./proxy');
const { series, watch } = require('gulp');

// store pipelines for reuse
const pipelines = config.pipelines;

// Create array of pipeline names from the pipeline dictionary.
const pipelineNames = Object.keys(pipelines);

// Create an array of daemon processes to be run alongside our watch tasks.
// e.g. component libraries, APIs, stub servers, etc.
const daemons = config.daemons.map((daemon) => {
  const task = require(daemon.path);
  gulp.task(daemon.name, task);
  return task;
});

// Private task: programmatically create watchers.
function watchSource(done) {
  // Iterate through the build pipelines and start a watcher for each.
  pipelineNames.forEach(name => {
    let watchFiles = pipelines[name].src;
    // If pipeline has a separate watch property, assume it to be an array and
    // add it to the src array.
    if (pipelines[name].watch) {
      watchFiles = [...watchFiles, ...pipelines[name].watch];
    }
    watch(watchFiles, { usePolling: true }, require(`./${name}`));
  });
  done();
}

module.exports = series(build, watchSource, proxy, ...daemons);
