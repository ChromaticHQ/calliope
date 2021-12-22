/**
 * @file
 * Load the downstream project’s configuration object.
 */

const log = require('fancy-log');

// Load pipelines and plugins from downstream config, falling back to empty
// objects for each.
let pipelines = {}, plugins = {};

try {
  const downstream = require(`${ process.cwd() }/calliope.config.js`);
  log.info('Using project config found in calliope.config.js.');
  pipelines = downstream.pipelines || pipelines;
  plugins = downstream.plugins || plugins;
}
catch (error) {
  if (!error.message.match('ENOENT')) throw error;
  log.info('No calliope.config.js file found. Going with the defaults.');
}

exports.pipelines = pipelines;
exports.plugins = plugins;
