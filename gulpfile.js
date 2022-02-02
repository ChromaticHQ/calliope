/**
 * @file
 * Build tasks for Calliope.
 */

// Load and export basic Gulp tasks.
exports.build = require('./tasks/build');
exports.lint = require('./tasks/lint');
exports.watch = require('./tasks/watch');

// Register custom tasks from the downstream project.
const config = require('./config')();
config.custom.tasks.forEach((file) => exports[file.name] = require(file.path));
