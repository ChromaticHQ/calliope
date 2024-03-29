/*
 * @file
 * Gulp task to process client-side JavaScript.
 */

const concat = require('gulp-concat');
/* eslint-disable-next-line import/no-unresolved */
const eslint = require('gulp-eslint-new');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const { src, dest } = require('gulp');
const terser = require('gulp-terser');

const config = require('../config')();

const pipelineConfig = config.pipelines.scripts;
// gulp-concat instantiation function requires a name to be passed in. In the
// case of bundling being disabled, we need to pass it a dummy string.
const bundleName = pipelineConfig.bundle || 'faux-bundle-name';

function scripts(bundle) {
  return src(pipelineConfig.src, { sourcemaps: true })
    // Lint if linting is enabled.
    .pipe(gulpIf(pipelineConfig.lint, eslint()))
    .pipe(gulpIf(pipelineConfig.lint, eslint.format()))
    // Compress/uglify if compression is enabled.
    .pipe(gulpIf(pipelineConfig.compress, terser()))
    // Rename file if compression and renaming are both enabled.
    .pipe(gulpIf((pipelineConfig.compress && pipelineConfig.rename), rename((path) => {
      path.basename += '.min';
    })))
    // Concatenate script files into a bundle, if a bundle name is set.
    .pipe(gulpIf(pipelineConfig.bundle, concat(bundleName)))
    // Write results to disk.
    .pipe(dest(pipelineConfig.dest, { sourcemaps: '.' }));
}

module.exports = scripts;
