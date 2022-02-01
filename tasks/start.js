/*
 * @file
 * Gulp task to start our watch tasks and watch for tooling and configuration
 * files to restart the watch tasks when appropriate.
 */

const config = require('../config');
const { watch } = require('gulp');
const nodemon = require('gulp-nodemon');

function start(done) {
  nodemon({
    ...(config.plugins.nodemon),
    done: done,
  }).on('restart', (changedFiles) => {
    // Acknowledge changed files to the console.
    console.log(`Detected changes:\n    - ${changedFiles.join('\n    - ')}`);
    console.log('Restarting toolchian…');
  });
}

module.exports = start;
