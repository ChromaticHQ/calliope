/**
 * @file
 * Configuration objects used in Gulp tasks.
 */

const defaultsDeep = require('lodash.defaultsdeep');
const defaults = require('./defaults');
const downstream = require('./downstream');
const { env } = process;
const log = require('fancy-log');

// Load variables from `.env` file into the process environment variables.
require('./environment');

// Create a register of asset pipelines: the `build` and `watch` tasks use this
// object to programmatically run each pipeline. If it aint here, it ain’t
// getting built! Destination directories are relative to CWD.
const pipelines = defaultsDeep({}, downstream.pipelines, defaults.pipelines);

// Modify the pipelines to filter out anything that is falsy.
Object.keys(pipelines).forEach(name => {
  if (!pipelines[name]) delete pipelines[name];
});

// Create config objects for tools and Gulp plugins.
const plugins = defaultsDeep({}, downstream.plugins, defaults.plugins);

// Allow Browsersync proxy value to be overridden via environment variable.
plugins.browsersync.proxy = env.CALLIOPE_REVERSE_PROXY_URL === 'null' ? null :
  (env.CALLIOPE_REVERSE_PROXY_URL || plugins.browsersync.proxy);

// Configure Brwosersync to announce reverse proxy URLs when enabled.
plugins.browsersync.callbacks = {
  ready: (error, bs) => {
    if (error) throw error;
    log.info(`Browsersync is reverse proxying ${ bs.options.get('proxy').get('target') } at the following URLs:`);
    bs.options.get('urls')._root.entries.forEach(pair => {
      log.info(`    - ${pair[0].toUpperCase()}: ${pair[1]}`);
    });
  },
};

module.exports = { pipelines, plugins };
