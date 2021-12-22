/**
 * @file
 * Read the downstream project’s `.env` file into the process’ environment and
 * print any variables found within it to the console.
 */

const log = require('fancy-log');
const options = require('dotenv').config();
// If options were found, log them to the console.
if (options.parsed && Object.keys(options.parsed).length > 0) {
  log.info(`Personalization options detected via .env file:`);
  Object.keys(options.parsed).map(key => log.info(`  - ${key}: ${options.parsed[key]}`));
}
