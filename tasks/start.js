/*
 * @file
 * Gulp task to start our watch tasks and watch for tooling and configuration
 * files to restart the watch tasks when appropriate.
 */

const config = require('../config');
const { series, watch } = require('gulp');
const nodemon = require('gulp-nodemon');
const path = require('path');
const watchTask = require('./watch');

function start(done) {
  nodemon({
    ...(config.plugins.nodemon),
    tasks: function (changedFiles) {
      console.log(changedFiles);
      const tasks = [];
      if (!changedFiles) return tasks;
      console.log(require.cache[changedFiles[0]]);
      changedFiles.forEach(file => delete require.cache[file]);
      console.log(require.cache[changedFiles[0]]);
      return tasks;
    },
    done: done,
  });
}

module.exports = start;
