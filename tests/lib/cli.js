const { resolve } = require('path');
// Absolute path to cli file.
const cliPath = resolve(__dirname, '../../cli.js');
// Create variable for the `cli.js` path prefixed with `node`, e.g. `node
// /absolute/path/to/cli.js`. This allows Windows machines to know what
// interpreter to use. *nix systems do not need this because they correctly
// interpret the shebang at the top of `cli.js`, however they are not adversely
// affected by running the file with `node` in front.
const cli = `node ${cliPath}`;
exports.cli = cli;
