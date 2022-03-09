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
    foundExistingConfigFile = backupExistingFile({ type: 'config' });
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
    foundExistingEnvFile = backupExistingFile({ type: 'env' });
  }
  const envFileResult = copyFile({ force, type: 'env' });
  if (envFileResult) {
    log.info(chalk.green(`✓ A new ${names.env} file has been created!`));
    if (foundExistingEnvFile) {
      log.info(chalk.grey(`    Your old config file was saved to ${names.envBackup}.`));
    }
  }
  if (updatePackageFile(args)) {
    log.info(chalk.green(`✓ Your project’s ${names.package} file has been updated.`));
  }
  exit(exceptions.length);
}

/**
 * Update the project’s package.json file with common scripts.
 */
function updatePackageFile(args) {
  try {
    // The require() function automatically parses JSON into a JS object.
    const package = require(paths.downstream.package);
    // If package.scripts is not defined, define it as an empty object.
    package.scripts = package.scripts || {};
    // Add initial calliope script, pre-installing dependencies first. This is
    // a wrapper around the calliope CLI. All other scripts added here invoke
    // this script, passing their calliope command (build, start, etc.) to it.
    package.scripts.calliope = 'yarn install && calliope';
    package.scripts.build = 'yarn calliope build';
    package.scripts.lint = 'yarn calliope lint';
    package.scripts.start = 'yarn calliope start';
    // Make the test script just be a wrapper for the lint script.
    package.scripts.test = 'yarn lint';
    // Write updated package object as a JSON string padded with 2 spaces and a
    // trailing newline character. This is the format that npm and Yarn use.
    writeFileSync(paths.downstream.package, `${JSON.stringify(package, null, 2)}\n`);
    return true;
  }
  catch (error) {
    // TODO: Find a way to auto-create package.jsonm and auto-install the
    // @chromatichq/calliope package. So far, all attempts with execSync and
    // spawnSync fail. yarn init creates the file, but the file is never found
    // on the next run, so it just keeps looping.
    if (error.code === 'MODULE_NOT_FOUND') {
      log.error(chalk.red(`✕ No ${names.package} file was found. Some potential solutions:`));
      log.error(chalk.cyan(`    - Starting from scratch? Run \`yarn add --dev @chromatichq/calliope\` to create ${names.package} and install Calliope on your project.`));
      log.error(chalk.cyan(`    - If you already have a ${names.package} file, make sure you are running this command in the directory where that file is located.`));
      exceptions.push('read package.json');
    } else {
      log.error(chalk.red(`✕ There was an error updating your ${names.package} file.`));
      log.error(chalk.cyan(`    ${ error.toString() }`));
      exceptions.push('update package.json');
    }
    return false;
  }
}

/**
 * Backup an existing calliope.config.js file.
 */
function backupExistingFile({ type }) {
  try {
    copyFileSync(paths.downstream[type], paths.downstream[`${type}Backup`]);
    return true;
  }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    // Looks like there is no calliope.config.js to backup,
    // so do nothing.
    return false;
  }
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
