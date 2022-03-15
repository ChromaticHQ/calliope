/*
 * @file
 * Gulp task to process all images.
 */

const changed = require('gulp-changed');
const { dest, src } = require('gulp');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');

const config = require('../config')();

function images() {
  return src(config.pipelines.images.src)
    .pipe(changed(config.pipelines.images.dest))
    .pipe(gulpIf(isSVG, imagemin()))
    .pipe(dest(config.pipelines.images.dest));
}

/**
 * Returns true if a file’s extension is `.svg`.
 */
function isSVG(file) {
  return file.extname === '.svg';
}

module.exports = images;
