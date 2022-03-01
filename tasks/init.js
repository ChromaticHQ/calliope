/**
 * @file
 * Task to set up a new project with necessary files,
 * scripts, and documentation.
 */

const chalk = require('chalk');
const { constants, copyFileSync, readFileSync } = require('fs');
const { cwd, exit } = process;
const log = require('fancy-log');
const { resolve } = require('path');

const configPath = resolve(cwd(), 'calliope.config.js');
const samplePath = resolve(__dirname, '../calliope.sample-config.js');
const backupPath = resolve(cwd(), 'calliope.config-backup.js');

function setup({ args }) {
  // By using COPYFILE_EXCL, the operation will fail if the destination file exists.
  const failIfExists = args.includes('--force') ? undefined : constants.COPYFILE_EXCL;
  let foundExistingConfigFile;
  if (!failIfExists) {
    foundExistingConfigFile = backupExistingConfigFile();
  }
  copyConfigFile(failIfExists);
  log.info(chalk.green('✓ A new calliope config file has been created!'));
  if (foundExistingConfigFile) {
    log.info(chalk.grey('    Your old config file was saved to calliope.config-backup.js.'));
  }
}

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

function copyConfigFile(failIfExists) {
  try {
    copyFileSync(samplePath, configPath, failIfExists);
  }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    log.info(chalk.red('✕ Your project already has a calliope.config.js file.'));
    log.info(chalk.cyan('    Use --force if you want to replace it. (Don’t worry, I’ll back it up first.)'));
    exit(1);
  }
}

module.exports = setup;
