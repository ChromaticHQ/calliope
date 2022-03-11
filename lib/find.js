/**
 * Find JavaScript modules in a given directory and return an array of
 * filenames (sans extension).
 *
 * If none are found or directory does not exist, returns an empty array.
 */

const { readdirSync } = require('fs');
const path = require('path');

function find(dir) {
  try {
    const modules = readdirSync(dir)
      // Filter out files that do not have the `.js` extension.
      // Note: We may need to support other extensions in the future.
      .filter((name) => name.match(/\.js$/, ''))
      // Remove the filename extension.
      .map((name) => name.replace(/\.js$/, ''))
      // Turn filenames into useful objects.
      .map((name) => ({
        name,
        path: path.resolve(dir, name),
      }));
    return modules;
  } catch (error) {
    // If error is not an ENOENT error, throw it immediately.
    if (!error.message.match('ENOENT')) throw error;
    // Since the error _is_ an ENOENT error, we return an empty array.
    return [];
  }
}

module.exports = find;
