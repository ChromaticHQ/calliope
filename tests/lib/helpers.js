/**
 * @file
 * Helper functions to abstract common operations carried out during testing.
 */

const { execSync } = require('child_process');
const { mkdtempSync, rmdirSync } = require('fs');
const { resolve } = require('path');
const { stdio } = require('./cli');

exports.createManifestFile = function createManifestFile(cwd) {
  return execSync('yarn init -y', { cwd, stdio });
};

exports.createTemporaryWorkingDirectory = function createTemporaryWorkingDirectory() {
  return mkdtempSync(resolve(__dirname, '../tmp/init-'));
};

exports.deleteTemporaryWorkingDirectory = function deleteTemporaryWorkingDirectory(cwd) {
  return rmdirSync(cwd, { recursive: true });
};
