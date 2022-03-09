/**
 * @file
 * Handle operations pertaining to the package.json manifest file.
 */

const chalk = require('chalk');
const log = require('fancy-log');
const { writeFileSync } = require('fs');

exports.updatePackageFile = updatePackageFile;

/**
 * Update the project’s package.json file with common scripts.
 */
function updatePackageFile({ args, names, paths }) {
  try {
    // The require() function automatically parses JSON into a JS object.
    const package = require(paths.package);
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
    writeFileSync(paths.package, `${JSON.stringify(package, null, 2)}\n`);
    log.info(chalk.green(`✓ Your project’s ${names.package} file has been updated.`));
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
    } else {
      log.error(chalk.red(`✕ There was an error updating your ${names.package} file.`));
      log.error(chalk.cyan(`    ${ error.toString() }`));
    }
    return false;
  }
}

