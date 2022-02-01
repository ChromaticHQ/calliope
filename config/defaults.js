/**
 * @file
 * Define configuration defaults to be overridden by downstream projects.
 */

const { argv, env } = process;
const failLint = process.argv.indexOf('lint') > -1;

// Paths used throughout our configuration objects.
const paths = {
  // source
  SRC: 'src',
  // destination
  DEST: 'build',
  // settings
  CONF: 'toolchain',
}

exports.pipelines = {
  fonts: null,
  images: null,
  scripts: {
    bundle: false,
    lint: env.CALLIOPE_LINT_JS === 'true',
    src: [
      `${ paths.SRC }/scripts/**/*.js`,
      `${ paths.SRC }/components/**/*.js`,
      `!${ paths.SRC }/components/**/*.config.js`,
    ],
    dest: `${ paths.DEST }/scripts`,
  },
  styles: {
    lint: env.CALLIOPE_LINT_SCSS === 'true',
    src: [
      `${ paths.SRC }/styles/**/*.scss`,
    ],
    dest: `${ paths.DEST }/styles`,
  },
};

exports.plugins = {
  browsersync: {
    // Watch build files for changes.
    files: [
      `${ paths.DEST }/**/*`,
      './templates/**/*',
    ],
    // We log ready state manually (see `callbacks` above).
    logLevel: 'silent',
    // Stop BrowserSync from opening a browser window automatically.
    open: false,
    // Use port 4000 to avoid collisions w/Fractal’s instance of BrowserSync.
    port: 4000,
    // Use port 4001 for UI.
    ui: {
      port: 4001,
    },
  },
  nodemon: require('../nodemon.json'),
  sass: {
    outputStyle: 'expanded',
    errLogToConsole: true,
  },
  stylelint: {
    failAfterError: failLint,
    reporters: [
      { formatter: 'string', console: true },
    ],
  },
};
