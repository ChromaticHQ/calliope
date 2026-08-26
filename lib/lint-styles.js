/**
 * Lint the given SCSS file(s)/glob(s) using Stylelint directly, replacing
 * the unmaintained `gulp-stylelint` plugin (last published 2022, still
 * peer-declaring `stylelint@^13.0.0` against the `^14.16.1` this project
 * actually uses).
 *
 * If `options.failAfterError` is true and Stylelint reports any errors, the
 * returned promise rejects so the calling Gulp task fails.
 */

const log = require('fancy-log');
const stylelint = require('stylelint');

async function lintStyles(files, { failAfterError, ...options } = {}) {
  const result = await stylelint.lint({ files, ...options });

  if (result.output) log.info(result.output);
  if (failAfterError && result.errored) {
    throw new Error('Stylelint found errors.');
  }
}

module.exports = lintStyles;
