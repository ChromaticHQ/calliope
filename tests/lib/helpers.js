/**
 * @file
 * Helper functions to abstract common operations carried out during testing.
 */

const { execSync } = require('child_process');
const { cpSync, mkdtempSync, rmSync } = require('fs');
const { resolve } = require('path');
const { stdio } = require('./cli');

/**
 * Node’s cp and cpSync methods were introduced in v16. This function uses the
 * `recursive-copy` package as a fallback until we no longer support Node
 * versions below 16.
 *
 * Important to note that due to the way the fallback package works, this
 * function must be async. Be sure to use it only from async functions and to
 * await it. See styles.spec.js for an example.
 */
exports.copyRecursively = async function copyRecursively(src, dest) {
  if (typeof cpSync === 'function') {
    cpSync(src, dest, { recursive: true });
  } else {
    const copy = require('recursive-copy');
    await copy(src, dest, { dot: true });
  }
};

exports.createManifestFile = function createManifestFile(cwd) {
  return execSync('yarn init -y', { cwd, stdio });
};

exports.createTemporaryWorkingDirectory = function createTemporaryWorkingDirectory() {
  return mkdtempSync(resolve(__dirname, '../tmp/init-'));
};

exports.deleteTemporaryWorkingDirectory = function deleteTemporaryWorkingDirectory(cwd) {
  return rmSync(cwd, { recursive: true });
};
