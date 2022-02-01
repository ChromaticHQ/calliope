/**
 * @file
 * Load the downstream project’s watch accessories, if any.
 */

const chalk = require('chalk');
const { readdirSync } = require('fs');
const log = require('fancy-log');
const path = require('path');

function watchAccessories(report) {
  try {
    const accessories = readdirSync(path.resolve(process.cwd(), 'calliope/watchAccessories'))
      // Filter out files that do not have the `.js` extension.
      // Note: We may need to support other extensions in the future.
      .filter(name => name.match(/\.js$/, ''))
      // Remove the filename extension.
      .map(name => name.replace(/\.js$/, ''));

    if (report && accessories.length) {
      log.info(chalk.green(`✓ Watch task accessories found! The following custom tasks will be run alongside watch tasks.`));
      accessories.forEach((name) => log.info(chalk.grey(`    - ${name}`)));
    }

    return accessories;
  }
  catch (error) {
    if (!error.message.match('ENOENT')) throw error;
    report && log.info(chalk.cyan('- No watch task accessories found.'));
    // If no watchAccessories directory is found, return an empty array.
    return [];
  }
}

module.exports = watchAccessories;
