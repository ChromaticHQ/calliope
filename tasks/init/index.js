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
const { printHelp } = require('./help');

// Declare some names and paths.
const names = {
  config: 'calliope.config.js',
  // The destination .env file is a sample file as well, intended to be tracked
  // in downstream projects for devs to use locally.
  env: '.env-sample',
  eslint: '.eslintrc.yml',
  gitignore: '.gitignore',
  package: 'package.json',
  readme: 'README.md',
  stylelint: '.stylelintrc.yml',
};
const paths = {
  config: resolve(cwd(), names.config),
  env: resolve(cwd(), names.env),
  eslint: resolve(cwd(), names.eslint),
  gitignore: resolve(cwd(), names.gitignore),
  package: resolve(cwd(), names.package),
  readme: resolve(cwd(), names.readme),
  stylelint: resolve(cwd(), names.stylelint),
};
const filesToCopy = [
  'config', 'env', 'eslint', 'gitignore', 'readme', 'stylelint',
];

/**
 * Set up a new project.
 */
function init({ args }) {
  if (args.includes('--help')) return printHelp(filesToCopy);

  // Count exceptions.
  let exceptions = 0;

  const force = {};
  filesToCopy.forEach((type) => {
    force[type] = args.includes(`--force-${type}`) || args.includes('--force');
  });

  // If there are any `--only-*` flags, populate a new array of files to copy
  // with only _those_ files.
  const onlyFilesToProcess = args.filter((arg) => arg.match(/--only-/))
    .map((arg) => arg.replace(/--only-/, ''));
  // Set only files to be forced.
  onlyFilesToProcess.forEach((type) => force[type] = true);

  // If there are “only files”, copy only those. Otherwise, copy all files.
  (onlyFilesToProcess.length ? onlyFilesToProcess : filesToCopy).forEach((type) => {
    // If file is package, do nothing. That is handled separately.
    if (type === 'package') return;
    if (!copyBoilerplateFile({
      force, names, paths, type,
    })) exceptions++;
  });

  // Update package.json only if no --only-* flags were passed, OR they were
  // and --only-package was one of them.
  if (!onlyFilesToProcess.length || onlyFilesToProcess.includes('package')) {
    if (!updatePackageFile({ args, names, paths })) exceptions++;
  }

  exit(exceptions);
}

module.exports = init;
