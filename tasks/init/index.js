/**
 * @file
 * Task to set up a new project with necessary files, scripts, and
 * documentation.
 */

const { cwd, exit } = process;
const { resolve } = require('path');

// Load helper modules.
const { copyBoilerplateFile } = require('./copy');
const { updatePackageFile } = require('./package');

// Declare some names and paths.
const names = {
  config: 'calliope.config.js',
  // The destination .env file is a sample file as well, intended to be tracked
  // in downstream projects for devs to use locally.
  env: '.env-sample',
  eslint: '.eslintrc.yml',
  package: 'package.json',
  readme: 'README.md',
  stylelint: '.stylelintrc.yml',
};
const paths = {
  config: resolve(cwd(), names.config),
  env: resolve(cwd(), names.env),
  eslint: resolve(cwd(), names.eslint),
  package: resolve(cwd(), names.package),
  readme: resolve(cwd(), names.readme),
  stylelint: resolve(cwd(), names.stylelint),
};
const filesToCopy = [
  'config', 'env', 'eslint', 'readme', 'stylelint',
];

/**
 * Set up a new project.
 */
function init({ args }) {
  // Count exceptions.
  let exceptions = 0;

  const force = {};
  filesToCopy.forEach((type) => {
    force[type] = args.includes(`--force-${ type }`) || args.includes('--force');
  });

  filesToCopy.forEach((type) => {
    if (!copyBoilerplateFile({ force, names, paths, type })) exceptions++;
  });

  if (!updatePackageFile({ args, names, paths })) exceptions++;

  exit(exceptions);
}

module.exports = init;
