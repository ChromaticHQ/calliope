/**
 * @file
 * Create and export a register of asset pipelines: the `build` and `watch`
 * tasks use this object to programmatically run each pipeline. If it aint
 * here, it ain’t getting built! Destination directories are relative to CWD.
 */

const defaultsDeep = require('lodash.defaultsdeep');
const defaults = require('./defaults');
const downstream = require('./downstream');

defaultsDeep(module.exports = {}, downstream.pipelines, defaults.pipelines);

// Modify the pipelines to filter out anything that is falsy.
Object.keys(module.exports).forEach(name => {
  if (!module.exports[name]) delete module.exports[name];
});
