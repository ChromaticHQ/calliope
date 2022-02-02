/**
 * @file
 * Load the downstream project’s watch accessories, if any.
 */

const chalk = require('chalk');
const find = require('../lib/find');
const log = require('fancy-log');
const path = require('path');

function watchAccessories(report) {
  const accessories = find(path.resolve(process.cwd(), 'calliope/watchAccessories'));

  if (report && accessories.length) {
    log.info(chalk.green(`✓ Custom daemons found! `));
    log.info(chalk.grey('    The following custom Gulp tasks will run alongside watch tasks.'));
    accessories.forEach((name) => log.info(chalk.grey(`      - ${name}`)));
  } else if (report) {
    log.info(chalk.cyan('- No custom daemons found.'));
  }
  return accessories;
}

module.exports = watchAccessories;
