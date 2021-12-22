/**
 * @file
 * Load the downstream project’s configuration object.
 */

const { pipelines = {}, plugins = {} } = require(`${ process.cwd() }/calliope.config.js`);

exports.pipelines = pipelines;
exports.plugins = plugins;
