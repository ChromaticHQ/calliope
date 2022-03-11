/*
 * @file
 * Gulp task to process fonts.
 */

const changed = require('gulp-changed');
const config = require('../config')();
const { dest, src } = require('gulp');

// Copy fonts to build directory.
function fonts() {
  return src(config.pipelines.fonts.src)
    .pipe(changed(config.pipelines.fonts.dest))
    .pipe(dest(config.pipelines.fonts.dest));
}

module.exports = fonts;
