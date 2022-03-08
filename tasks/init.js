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

// Declare some paths.
const backupPath = resolve(cwd(), 'calliope.config-backup.js');
const configPath = resolve(cwd(), 'calliope.config.js');
const packagePath = resolve(cwd(), 'package.json');
const samplePath = resolve(__dirname, '../calliope.sample-config.js');

// Declare an array to keep track of exceptions.
let exceptions = [];

/**
 * Set up a new project.
 */
function setup({ args }) {
  // By using COPYFILE_EXCL, the operation will fail if the destination file exists.
  const failIfExists = args.includes('--force') ? undefined : constants.COPYFILE_EXCL;
  let foundExistingConfigFile;
  if (!failIfExists) {
    foundExistingConfigFile = backupExistingConfigFile();
  }
  if (copyConfigFile(failIfExists)) {
    log.info(chalk.green('✓ A new calliope.config.js file has been created!'));
    if (foundExistingConfigFile) {
      log.info(chalk.grey('    Your old config file was saved to calliope.config-backup.js.'));
    }
  }
  if (updatePackageFile(args)) {
    log.info(chalk.green('✓ Your project’s package.json file has been updated.'));
  }
  exit(exceptions.length);
}

/**
 * Update the project’s package.json file with common scripts.
 */
function updatePackageFile(args) {
  try {
    // The require() function automatically parses JSON into a JS object.
    const package = require(packagePath);
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
    writeFileSync(packagePath, `${JSON.stringify(package, null, 2)}\n`);
    return true;
  }
  catch (error) {
    // TODO: Find a way to auto-create package.jsonm and auto-install the
    // @chromatichq/calliope package. So far, all attempts with execSync and
    // spawnSync fail. yarn init creates the file, but the file is never found
    // on the next run, so it just keeps looping.
    if (error.code === 'MODULE_NOT_FOUND') {
      log.error(chalk.red('✕ No package.json file was found. Some potential solutions:'));
      log.error(chalk.cyan('    - Starting from scratch? Run `yarn add --dev @chromatichq/calliope` to create package.json and install Calliope on your project.'));
      log.error(chalk.cyan('    - If you already have a package.json file, make sure you are running this command in the directory where that file is located.'));
      exceptions.push('read package.json');
    } else {
      log.error(chalk.red('✕ There was an error updating your package.json file.'));
      log.error(chalk.cyan(`    ${ error.toString() }`));
      exceptions.push('update package.json');
    }
    return false;
  }
}

/**
 * Backup an existing calliope.config.js file.
 */
function backupExistingConfigFile() {
  try {
    copyFileSync(configPath, backupPath);
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
 * Copy sample config file to the downstream project.
 */
function copyConfigFile(failIfExists) {
  try {
    copyFileSync(samplePath, configPath, failIfExists);
    return true;
  }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    log.info(chalk.red('✕ Your project already has a calliope.config.js file.'));
    log.info(chalk.cyan('    Use --force if you want to replace it. (Don’t worry, I’ll back it up first.)'));
    exceptions.push('copy calliope.config.js');
    return false;
  }
}

module.exports = setup;
