/**
 * @file
 * Configuration objects used in Gulp tasks.
 */

// Paths used throughout our configuration objects.
const paths = {
  // source
  SRC: 'src',
  // destination
  DEST: 'build',
  // settings
  CONF: 'toolchain',
}

// Export a register of assets pipelines: the `build` and `watch` tasks use
// this object to programmatically run each pipeline. If it aint here, it ain’t
// getting built! Destination directories are relative to theme root.
exports.pipelines = {
  fonts: {
    src: [
      `${ paths.SRC }/fonts/**/*`,
    ],
    dest: `${ paths.DEST }/fonts`,
  },
  images: {
    src: [
      `${ paths.SRC }/images/**/*`,
    ],
    dest: `${ paths.DEST }/images`,
  },
  scripts: {
    bundle: false,
    compress: true,
    src: [
      `${ paths.SRC }/scripts/**/*.js`,
      `${ paths.SRC }/components/**/*.js`,
      `!${ paths.SRC }/components/**/*.config.js`,
    ],
    dest: `${ paths.DEST }/scripts`,
  },
  styles: {
    src: [
      `${ paths.SRC }/styles/**/*.scss`,
    ],
    // Any pipeline task can have a `watch` key whose value is an array of
    // paths or globs that will be watched in addition to the pipeline’s `src`.
    // This is particularly useful with Sass-based stylesheets, where we only
    // source a handful of files, but we need to watch for changes in many
    // other files.
    watch: [
      `${ paths.SRC }/components/**/*.scss`,
    ],
    dest: `${ paths.DEST }/styles`,
  },
};

exports.daemons = {
  browsersync: {
    proxy: 'http://myproject.lndo.site',
  },
};
