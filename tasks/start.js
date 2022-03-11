/*
 * @file
 * Task to start our watch tasks and watch for tooling and configuration files
 * to restart the watch tasks when appropriate.
 */

const config = require('../config')();
const path = require('path');
const spawn = require('child_process').spawn;

function start() {
  const nodemon = spawn('nodemon', [
    '--config',
    path.resolve(__dirname, '..', 'nodemon.json'),
  ], {
    stdio: [ 'inherit', 'inherit', 'inherit', 'ipc' ],
  }).on('message', (event) => {
    if (event.type === 'restart' && event.data && event.data.length) {
      // Acknowledge changed files to the console.
      console.log(`Detected changes:\n    - ${event.data.join('\n    - ')}`);
      console.log('Restarting toolchian…');
    }
  });
}

module.exports = start;
