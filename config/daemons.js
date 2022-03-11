/**
 * @file
 * Load the downstream project’s daemons, if any.
 */

const chalk = require('chalk');
const log = require('fancy-log');
const path = require('path');
const find = require('../lib/find');

function customDaemons(report) {
  const daemons = find(path.resolve(process.cwd(), 'calliope/daemons'));

  if (report && daemons.length) {
    log.info(chalk.green('✓ Custom daemons found!'));
    log.info(chalk.grey('    The following custom Gulp tasks will run alongside watch tasks:'));
    daemons.forEach((daemon) => log.info(chalk.grey(`      - ${daemon.name}`)));
  } else if (report) {
    log.info(chalk.cyan('- No custom daemons found.'));
  }
  return daemons;
}

module.exports = customDaemons;
