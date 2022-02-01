/**
 * @file
 * Read the downstream project’s `.env` file into the process’ environment and
 * print any variables found within it to the console.
 */

const chalk = require('chalk');
const log = require('fancy-log');

function env(report) {
  const options = require('dotenv').config();
  // If we’re not reporting our findings, do nothing else.
  if (!report) return;
  // If options were found, log them to the console.
  if (options.parsed && Object.keys(options.parsed).length > 0) {
    log.info(chalk.green(`✓ Personalization options detected via .env file:`));
    Object.keys(options.parsed)
      .map(key => log.info(chalk.grey(`    ${key}: ${options.parsed[key]}`)));
  } else {
    log.info(chalk.grey('! No personalization options detected via .env file.'));
  }
}

module.exports = env;
