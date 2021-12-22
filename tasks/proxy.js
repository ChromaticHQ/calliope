/*
 * @file
 * Create Gulp task to spin up a Browsersync instance with a reverse proxy.
 */

// Load dependencies.
const bs = require('browser-sync').create();
const config = require('../config');

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
  console.info('No reverse proxy configured. Skipping.');
  return done();
}
