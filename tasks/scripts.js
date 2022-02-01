/*
 * @file
 * Gulp task to process client-side JavaScript.
 */

const config = require('../config')();
const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint-new');
const gulpIf = require('gulp-if');
const terser = require('gulp-terser');

function scripts(bundle) {
  return src(config.pipelines.scripts.src, { sourcemaps: true })
    // Lint only if we’re not bundling and linting is enabled.
    .pipe(gulpIf(!bundle && config.pipelines.scripts.lint, eslint()))
    .pipe(gulpIf(!bundle && config.pipelines.scripts.lint, eslint.format()))
    .pipe(terser())

    // Bundle the component scripts into one file for Fractal.js to consume.
    .pipe(gulpIf(bundle, concat('fractal-bundle.js')))
    // If bundled, save concatenated fractal-bundle.js file. Otherwise, save
    // discrete component script files for Drupal to consume individually.
    .pipe(dest(config.pipelines.scripts.dest, { sourcemaps: '.' }));
}

function discreteScripts() {
  return scripts();
}

function bundledScripts() {
  return scripts(true);
}

module.exports = parallel(discreteScripts, bundledScripts);
