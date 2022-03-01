/*
 * @file
 * Create task to lint scss and js. 
 */

// Load Gulp methods.
const { series, src } = require('gulp');

// Load dependencies.
const config = require('../config')();
const eslint = require('gulp-eslint-new');
const flattenDeep = require('lodash.flattendeep');
const stylelint = require('gulp-stylelint');

/**
 * Lint all SCSS files inside the `./src/scss/` directory. Fail if any errors
 * are detected.
 */
function lintScss() {
  const fullSrc = [ config.pipelines.styles.src ];

  // If configuration includes additional files to watch, add them to the array
  // of strings.
  if (config.pipelines.styles.watch) {
    fullSrc.push(config.pipelines.styles.watch);
  }

  // Since `src` and `watch` values can be strings or arrays, flatten them
  // before passing them to Gulp.
  return src(flattenDeep(fullSrc))
    .pipe(stylelint(config.plugins.stylelint))
}

/**
 * Lint all JavaScript files inside the theme directory, excluding dependencies
 * and generated assets. Fail if any errors are detected.
 */
function lintJs() {
  return src(config.pipelines.scripts.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Export main task as either a series (if both scripts and styles are in the
// pipelines), or a single task. If no linting is possible, export a function
// that just throws an error.
if (config.pipelines.scripts && config.pipelines.styles) {
  module.exports = series(lintJs, lintScss);
} else if (config.pipelines.scripts) {
  module.exports = lintJs;
} else if (config.pipelines.styles) {
  module.exports = lintScss;
} else {
  module.exports = () => {
    throw new Error('No script or style pipelines found for linting.');
  }
}
