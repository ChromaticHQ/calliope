/*
 * @file
 * Gulp task to process stylesheets.
 */

const config = require('../config')();
const { dest, src } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('node-sass'));
const sassGlob = require('gulp-sass-glob');
const stylelint = require('gulp-stylelint');

// cache destination
const intake = config.pipelines.styles.src;
const output = config.pipelines.styles.dest;

// styles task
function styles() {
  return src(intake, { sourcemaps: true })
    .pipe(gulpIf(config.pipelines.styles.lint, stylelint(config.plugins.stylelint)))
    .pipe(sassGlob())
    .pipe(sass(config.plugins.sass).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename(path => path.basename += '-expanded'))
    .pipe(dest(output))
    .pipe(cleanCss())
    .pipe(rename(path => path.basename = path.basename.replace('-expanded', '')))
    .pipe(dest(output, { sourcemaps: '.' }));
}

module.exports = styles;
