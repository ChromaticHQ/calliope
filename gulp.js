const path = require('path');
const spawn = require('child_process').spawn;

function gulp({ command, args }) {
  spawn((process.platform === 'win32' ? 'gulp.cmd' : 'gulp') , [
    '--gulpfile',
    path.resolve(__dirname, 'gulpfile.js'),
    '--cwd',
    process.cwd(),
    command,
    ...args,
  ], {
    stdio: 'inherit',
  }).on('close', (code) => process.exit(code));
}

module.exports = gulp;
