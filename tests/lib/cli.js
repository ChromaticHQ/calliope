const { resolve } = require('path');
// Absolute path to cli file.
const cliPath = resolve(__dirname, '../../cli.js');
// Create variable for the `cli.js` path prefixed with `node`, e.g. `node
// /absolute/path/to/cli.js` in the case of Windows. This allows Windows
// machines to know what interpreter to use. *nix systems do not need this
// because they correctly interpret the shebang at the top of `cli.js`, so we
// do not prefix it at all.
const prefix = process.platform === 'win32' ? 'node ' : '';
const cli = `${prefix}${cliPath}`;
exports.cli = cli;
// Export a stdio setting for command line execution.
exports.stdio = 'pipe';
