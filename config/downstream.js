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
  let pipelines = {}, plugins = {};

  try {
    const downstreamPath = path.resolve(process.cwd(), 'calliope.config.js');
    const downstream = require(downstreamPath);
    report && log.info(chalk.green(`✓ Project config found!`));
    report && log.info(chalk.grey(`    Using file ${downstreamPath}.`));
    pipelines = downstream.pipelines || pipelines;
    plugins = downstream.plugins || plugins;
  }
  catch (error) {
    if (!error.message.match('ENOENT')) throw error;
    report && log.info(chalk.yellow('! No calliope.config.js file found. Going with the defaults.'));
  }

  return { pipelines, plugins };
}

module.exports = downstream;
