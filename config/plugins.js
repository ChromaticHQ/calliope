/**
 * @file
 * Create and export config objects for tools and Gulp
 * plugins.
 */

const defaultsDeep = require('lodash.defaultsdeep');
const defaults = require('./defaults');
const downstream = require('./downstream');
const { env } = process;
const log = require('fancy-log');
const pipelines = require('./pipelines');

defaultsDeep(module.exports = {}, downstream.plugins, defaults.plugins);

// Allow Browsersync proxy value to be overridden via environment variable.
module.exports.browsersync.proxy = env.CALLIOPE_REVERSE_PROXY_URL === 'null' ? null :
  (env.CALLIOPE_REVERSE_PROXY_URL || module.exports.browsersync.proxy);

// Configure Brwosersync to announce reverse proxy URLs when enabled.
module.exports.browsersync.callbacks = {
  ready: (error, bs) => {
    if (error) throw error;
    log.info(`Browsersync is reverse proxying ${ bs.options.get('proxy').get('target') } at the following URLs:`);
    bs.options.get('urls')._root.entries.forEach(pair => {
      log.info(`    - ${pair[0].toUpperCase()}: ${pair[1]}`);
    });
  },
};
