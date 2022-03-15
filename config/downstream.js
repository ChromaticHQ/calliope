/**
 * @file
 * Load the downstream project’s configuration object.
 */

const chalk = require('chalk');
const log = require('fancy-log');
const path = require('path');

function getDownstream(report) {
  // Load pipelines and plugins from downstream config, falling back to empty
  // objects for each.
  let daemons = {}; let pipelines = {}; let
    plugins = {};

  try {
    const downstreamPath = path.resolve(process.cwd(), 'calliope.config.js');
    const downstream = require(downstreamPath);
    if (report) log.info(chalk.green('✓ Project config found!'));
    if (report) log.info(chalk.grey(`    Using file ${downstreamPath}.`));
    daemons = downstream.daemons || daemons;
    pipelines = downstream.pipelines || pipelines;
    plugins = downstream.plugins || plugins;

    // Consider `fonts` and `images` null if they are empty objects.
    if (pipelines.fonts && Object.keys(pipelines.fonts).length === 0) {
      pipelines.fonts = null;
    }
    if (pipelines.images && Object.keys(pipelines.images).length === 0) {
      pipelines.images = null;
    }
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    if (report) log.info(chalk.cyan('- No calliope.config.js file found. Going with the defaults.'));
  }

  return { daemons, pipelines, plugins };
}

module.exports = getDownstream;
