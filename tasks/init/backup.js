/**
 * @file
 * Handle operations pertaining to the backup of existing files in a downstream project.
 */

const { copyFileSync } = require('fs');

exports.backupExistingFile = backupExistingFile;

/**
 * Backup an existing calliope.config.js file.
 */
function backupExistingFile({ names, paths, type }) {
  try {
    copyFileSync(paths.downstream[type], paths.downstream[`${type}Backup`]);
    return true;
  }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    // Looks like there is no calliope.config.js to backup,
    // so do nothing.
    return false;
  }
}

