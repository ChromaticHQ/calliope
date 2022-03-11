/**
 * @file
 * Load the downstream project’s configuration object.
 */

const chalk = require('chalk');
const log = require('fancy-log');
const path = require('path');

function downstream(report) {
  // Load pipelines and plugins from downstream config, falling back to empty
  // objects for each.
  let daemons = {}, pipelines = {}, plugins = {};

  try {
    const downstreamPath = path.resolve(process.cwd(), 'calliope.config.js');
    const downstream = require(downstreamPath);
    report && log.info(chalk.green(`✓ Project config found!`));
    report && log.info(chalk.grey(`    Using file ${downstreamPath}.`));
    daemons = downstream.daemons || daemons;
    pipelines = downstream.pipelines || pipelines;
    plugins = downstream.plugins || plugins;
  }
  catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    report && log.info(chalk.cyan('- No calliope.config.js file found. Going with the defaults.'));
  }

  return { daemons, pipelines, plugins };
}

module.exports = downstream;
