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
  configBackup: 'calliope.config-backup.js',
  configSample: 'calliope.config-sample.js',
  // The destination .env file is a sample file as well, intended to be tracked
  // in downstream projects for devs to use locally.
  env: '.env-sample',
  envBackup: '.env-sample-backup',
  envSample: '.env-sample',
  package: 'package.json',
};
const paths = {
  downstream: {
    config: resolve(cwd(), names.config),
    configBackup: resolve(cwd(), names.configBackup),
    env: resolve(cwd(), names.env),
    envBackup: resolve(cwd(), names.envBackup),
    package: resolve(cwd(), names.package),
  },
  boilerplate: {
    config: resolve(__dirname, '../../boilerplate', names.configSample),
    env: resolve(__dirname, '../../boilerplate', names.envSample),
  },
};

/**
 * Set up a new project.
 */
function init({ args }) {
  // Count exceptions.
  let exceptions = 0;

  const force = {
    config: args.includes('--force-config') || args.includes('--force'),
    env: args.includes('--force-env') || args.includes('--force'),
  };

  if (!copyBoilerplateFile({ force, names, paths, type: 'config' })) exceptions++;
  if (!copyBoilerplateFile({ force, names, paths, type: 'env' })) exceptions++;
  if (!updatePackageFile({ args, names, paths })) exceptions++;

  exit(exceptions);
}

module.exports = init;
