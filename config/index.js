/**
 * @file
 * Configuration objects used in Gulp tasks.
 */

const chalk = require('chalk');
const defaultsDeep = require('lodash.defaultsdeep');
const defaults = require('./defaults');
const { env } = process;
const log = require('fancy-log');
const path = require('path');

function config(report) {
  // Load downstream configuration.
  const downstream = require('./downstream')(report);
  // Load variables from `.env` file into the process environment variables.
  require('./environment')(report);

  // Create a register of asset pipelines: the `build` and `watch` tasks use this
  // object to programmatically run each pipeline. If it aint here, it ain’t
  // getting built! Destination directories are relative to CWD.
  const pipelines = defaultsDeep({}, downstream.pipelines, defaults.pipelines);

  // Modify the pipelines to filter out anything that is falsy.
  Object.keys(pipelines).forEach(name => {
    if (!pipelines[name]) delete pipelines[name];
  });

  // Create config object for tools and Gulp plugins.
  const plugins = defaultsDeep({}, downstream.plugins, defaults.plugins);

  // Allow Browsersync proxy value to be overridden via environment variable.
  plugins.browsersync.proxy = env.CALLIOPE_REVERSE_PROXY_URL === 'null' ? null :
    (env.CALLIOPE_REVERSE_PROXY_URL || plugins.browsersync.proxy);

  // Configure Brwosersync to announce reverse proxy URLs when enabled.
  plugins.browsersync.callbacks = {
    ready: (error, bs) => {
      if (error) throw error;
      log.info(chalk.green(`✓ Browsersync is reverse proxying ${ bs.options.get('proxy').get('target') } at the following URLs:`));
      bs.options.get('urls')._root.entries.forEach(pair => {
        log.info(chalk.grey(`    - ${pair[0].toUpperCase()}: ${pair[1]}`));
      });
    },
  };

  // Create config object for custom tasks and task overrides.
  const pipelineOverrides = {};

  Object.keys(pipelines).forEach(name => {
    // Try to load the task from the project’s own CWD first.
    try {
      const task = require(path.resolve(process.cwd(), 'calliope/pipelines', name));
      pipelineOverrides[name] = task;
    }
    catch (error) {
      // If the issue is not that the module is missing, throw the error.
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
    }
  });

  if (report && Object.keys(pipelineOverrides).length) {
    log.info(chalk.green('✓ Found the following custom pipeline tasks:'));
    Object.keys(pipelineOverrides).forEach((task) => {
      log.info(chalk.grey(`    - ${ task }`));
    });
  } else if (report) {
    log.info(chalk.cyan('- No custom pipeline tasks found.'));
  }

  const watchAccessories = require('./watchAccessories')(report);

  return { pipelines, pipelineOverrides, plugins, watchAccessories };
}

module.exports = config;
