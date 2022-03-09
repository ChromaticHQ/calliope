/**
 * @file
 * Task to set up a new project with necessary files, scripts, and
 * documentation.
 */

const chalk = require('chalk');
const { constants, copyFileSync, readFileSync, writeFileSync } = require('fs');
const { cwd, exit } = process;
const log = require('fancy-log');
const { resolve } = require('path');

// Load helper modules.
const { backupExistingFile } = require('./backup');
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

// Keep track of exceptions in an array.
let exceptions = [];

/**
 * Set up a new project.
 */
function init({ args }) {
  const force = {
    config: args.includes('--force-config') || args.includes('--force'),
    env: args.includes('--force-env') || args.includes('--force'),
  };
  let foundExistingConfigFile;
  if (force.config) {
    foundExistingConfigFile = backupExistingFile({ names, paths, type: 'config' });
  }
  const configFileResult = copyFile({ force, type: 'config' });
  if (configFileResult) {
    log.info(chalk.green(`✓ A new ${names.config} file has been created!`));
    if (foundExistingConfigFile) {
      log.info(chalk.grey(`    Your old config file was saved to ${names.configBackup}.`));
    }
  }
  let foundExistingEnvFile;
  if (force.env) {
    foundExistingEnvFile = backupExistingFile({ names, paths, type: 'env' });
  }
  const envFileResult = copyFile({ force, type: 'env' });
  if (envFileResult) {
    log.info(chalk.green(`✓ A new ${names.env} file has been created!`));
    if (foundExistingEnvFile) {
      log.info(chalk.grey(`    Your old config file was saved to ${names.envBackup}.`));
    }
  }
  try {
    updatePackageFile({ args, names, paths });
    log.info(chalk.green(`✓ Your project’s ${names.package} file has been updated.`));
  } catch (error) {
    exceptions.push(error.message);
  }
  exit(exceptions.length);
}

/**
 * Copy sample file to the downstream project.
 */
function copyFile({ force, type }) {
  try {
    // By using COPYFILE_EXCL, the operation will fail if the destination file exists.
    copyFileSync(paths.boilerplate[type], paths.downstream[type], force[type] ? undefined : constants.COPYFILE_EXCL);
    return true;
  }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    log.error(chalk.red(`✕ Your project already has a ${names[type]} file.`));
    log.error(chalk.cyan(`    Use --force-${type} to replace it. (Don’t worry, I’ll back it up first.)`));
    exceptions.push(`copy ${type}`);
    return false;
  }
}

module.exports = init;
