/**
 * @file
 * Build tasks for the Chromatic Drupal theme and pattern library.
 */

// Load and export Gulp tasks. These can be run using `gulp TASK_NAME`.
exports.build = require('./tasks/build');
exports.watch = require('./tasks/watch');
exports.lint = require('./tasks/lint');
