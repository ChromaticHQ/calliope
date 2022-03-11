/**
 * @file
 * Handle init command with --help flag.
 */

const chalk = require('chalk');
const log = require('fancy-log');

exports.printHelp = printHelp;

/**
 * Print general help message.
 */
function printHelp(filesToCopy) {
  // TODO: Is there a library that can format strings like this?
  console.log(chalk.cyan('@chromatichq/calliope init'));
  console.log(chalk.grey('  A command to help set up Calliope in your project.'));

  console.log('');
  console.log(chalk.cyan('Usage:'));
  console.log(chalk.white('  - npx @chromatichq/calliope init'));
  console.log(chalk.grey(
    `    Create basic boilerplate configuration files and
    update package.json scripts. (Does not overwrite
    existing configuration files.)`,
  ));

  console.log('');
  console.log(chalk.white('  - npx @chromatichq/calliope init --force'));
  console.log(chalk.grey(
    `    Overwrite ALL existing configuration files that
    might collide with new boilerplate files.
    (Overwritten files are backed up first.)`,
  ));

  console.log('');
  console.log(chalk.white('  - npx @chromatichq/calliope init --force-config'));
  console.log(chalk.grey(
    `    Overwrite only specific configuration files that
    might collide with new boilerplate files. You can
    use more than one of these. Options available:
      ${filesToCopy.map((type) => `--force-${type}`).join('\n      ')}
    (Overwritten files are backed up first.)`,
  ));

  console.log('');
  console.log(chalk.white('  - npx @chromatichq/calliope init --only-config'));
  console.log(chalk.grey(
    `    Create only specific configuration files,
    overwriting any files that already exist in your
    project. You can use more than one of these. Note
    that all --force-* flags are completely ignored
    when --only-* flags are used. Options available:
      ${filesToCopy.map((type) => `--only-${type}`).join('\n      ')}
      --only-package (updates existing package.json)
    (Overwritten files are backed up first.)`,
  ));
}
