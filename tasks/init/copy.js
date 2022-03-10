/**
 * @file
 * Handle operations pertaining to copying files to downstream projects.
 */

const { parse, resolve } = require('path');
const chalk = require('chalk');
const { constants, copyFileSync } = require('fs');
const log = require('fancy-log');

exports.copyBoilerplateFile = copyBoilerplateFile;

/**
 * Copy sample file to the downstream project.
 */
function copyBoilerplateFile({ force, names, paths, type }) {
  let foundExistingFile;
  if (force[type]) {
    foundExistingFile = backupExistingFile({ names, paths, type });
  }
  try {
    const parsedPath = parse(resolve(__dirname, '../../boilerplate', names[type]));
    const boilerplateFilename = names[type].match(/-sample/) ?
      names[type] :
      `${ parsedPath.name }-sample${ parsedPath.ext }`;
    const boilerplatePath = resolve(parsedPath.dir, boilerplateFilename);
    const backupFilename = `${ parsedPath.name }-backup${ parsedPath.ext }`;
    // When using COPYFILE_EXCL, the operation will fail if the destination
    // file exists.
    copyFileSync(boilerplatePath, paths[type], force[type] ? undefined : constants.COPYFILE_EXCL);
    log.info(chalk.green(`✓ A new ${names[type]} file has been created!`));
    if (foundExistingFile) {
      log.info(chalk.grey(`    Your old file was saved to ${ backupFilename }.`));
    }
    return true;
  }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    log.error(chalk.red(`✕ Your project already has a ${names[type]} file.`));
    log.error(chalk.cyan(`    Use --force-${type} to replace it. (Don’t worry, I’ll back it up first.)`));
    return false;
  }
}

/**
 * Backup an existing file in the downstream project.
 */
function backupExistingFile({ names, paths, type }) {
  const parsedPath = parse(paths[type]);
  const backupFilename = `${ parsedPath.name }-backup${ parsedPath.ext }`;
  const backupPath = resolve(parsedPath.dir, backupFilename);
  try {
    copyFileSync(paths[type], backupPath);
    return true;
  }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    // Looks like there is no file to backup, so do nothing.
    return false;
  }
}
