/*
 * @file
 * Gulp task to clean build directories.
 */

const del = require('del');

const { pipelines } = require('../config')();

// Delete all destination directories.
function clean() {
  const pathsToDelete = Object.keys(pipelines)
    // Filter out pipelines that do not have a destination.
    .filter((name) => pipelines[name].dest)
    // Return only each pipeline’s destination.
    .map((name) => pipelines[name].dest);
  return del(pathsToDelete);
}

module.exports = clean;
