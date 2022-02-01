/*
 * @file
 * Create Gulp task to spin up a Browsersync instance with a reverse proxy.
 */

// Load dependencies.
const bs = require('browser-sync').create();
const chalk = require('chalk');
const config = require('../config')();
const log = require('fancy-log');

// Export task.
module.exports = proxy;

/*
 * Start Browsersync and reverse proxy.
 */
function proxy(done) {
  // If a reverse proxy URL is set, start a Browsersync instance, otherwise a
  // send message to the console.
  if (config.plugins.browsersync.proxy) {
    return bs.init(config.plugins.browsersync, done);
  }
  log.info(chalk.cyan('- No reverse proxy configured. Skipping the proxy task.'));
  return done();
}
