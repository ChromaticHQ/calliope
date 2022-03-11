/*
 * @file
 * Gulp task to process fonts.
 */

const changed = require('gulp-changed');
const { dest, src } = require('gulp');

const config = require('../config')();

// Copy fonts to build directory.
function fonts() {
  return src(config.pipelines.fonts.src)
    .pipe(changed(config.pipelines.fonts.dest))
    .pipe(dest(config.pipelines.fonts.dest));
}

module.exports = fonts;
