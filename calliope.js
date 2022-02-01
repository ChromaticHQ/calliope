/**
 * Handle toolchain commands and export configuration.
 *
 * Some commands are routed to Gulp, while others are exec’ed directly.
 */

function calliope(command, ...args) {
  // Extract command from list of args.
  switch(command) {
    case 'start':
      require('./tasks/start')();
      break;
    case 'version':
    case '--version':
    case '-v':
    case undefined:
      process.exit(0);
      break;
    default:
      require('./gulp')({ command, args });
  }
}

// Attach configuration to the function for easy reference.
calliope.config = require('./config')();

module.exports = calliope;
