/**
 * @file
 * Configuration objects used in Gulp tasks.
 */

const chalk = require('chalk');
const defaultsDeep = require('lodash.defaultsdeep');
const log = require('fancy-log');

const defaults = require('./defaults');

const { env } = process;

function config(report) {
  // Load downstream configuration.
  const downstream = require('./downstream')(report);
  // Load variables from `.env` file into the process environment variables.
  require('./environment')(report);

  const daemons = defaultsDeep({}, downstream.daemons, defaults.daemons);

  // Allow Browsersync proxy value to be overridden via environment variable.
  daemons.browsersync.proxy = env.CALLIOPE_REVERSE_PROXY_URL === 'null' ? null
    : (env.CALLIOPE_REVERSE_PROXY_URL || daemons.browsersync.proxy);

  // Configure Brwosersync to announce reverse proxy URLs when enabled.
  daemons.browsersync.callbacks = {
    ready: (error, bs) => {
      if (error) throw error;
      log.info(chalk.green(`✓ Browsersync is reverse proxying ${bs.options.get('proxy').get('target')} at the following URLs:`));
      bs.options.get('urls')._root.entries.forEach((pair) => {
        log.info(chalk.grey(`    - ${pair[0].toUpperCase()}: ${pair[1]}`));
      });
    },
  };

  // Create a register of asset pipelines: the `build` and `watch` tasks use this
  // object to programmatically run each pipeline. If it aint here, it ain’t
  // getting built! Destination directories are relative to CWD.
  const pipelines = defaultsDeep({}, downstream.pipelines, defaults.pipelines);

  // Modify the pipelines to filter out anything that is falsy.
  Object.keys(pipelines).forEach((name) => {
    if (!pipelines[name]) delete pipelines[name];
  });

  // Create config object for tools and Gulp plugins.
  const plugins = defaultsDeep({}, downstream.plugins, defaults.plugins);

  const custom = {
    daemons: require('./daemons')(report),
    pipelines: require('./pipelines')(pipelines, report),
    tasks: require('./tasks')(report),
  };

  return {
    custom, daemons, pipelines, plugins,
  };
}

module.exports = config;
