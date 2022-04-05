/**
 * @file
 * Common assertions carried out during testing.
 */

const assert = require('assert');
const { existsSync } = require('fs');
const { resolve } = require('path');

exports.assertFileExists = function assertFileExists({ cwd, filename }) {
  assert.ok(
    existsSync(resolve(cwd, filename)),
    `Expected ${filename} to exist in ${cwd}.`,
  );
};

exports.assertFileDoesNotExist = function assertFileDoesNotExist({ cwd, filename }) {
  assert.ok(
    !existsSync(resolve(cwd, filename)),
    `Expected ${filename} not to exist in ${cwd}.`,
  );
};
