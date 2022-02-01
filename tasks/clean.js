/*
 * @file
 * Gulp task to clean build directories.
 */

const { pipelines } = require('../config')();
const del = require('del');

// Delete all destination directories.
function clean() {
  return del(Object.keys(pipelines).map(name => pipelines[name].dest));
}

module.exports = clean;
