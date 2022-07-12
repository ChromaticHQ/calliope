/**
 * @file
 * Configuration objects used by Calliope.
 */

/**
 * paths Object
 *
 * Paths used throughout the sample configuration values below. This has no
 * significance beyond this file; it is merely here to avoid duplication of
 * source and destination paths in the configuration values used below.
 */
const paths = {
  // Source.
  SRC: 'src',
  // Destination.
  DEST: 'build',
};

/**
 * pipelines Object
 *
 * A register of assets pipelines: the `build` and `watch` tasks use this
 * object to programmatically run each pipeline. If it ain’t here, it ain’t
 * getting built! Destination directories are relative to the current working
 * directory.
 */
exports.pipelines = {
  fonts: {
    /**
     * src - String or Array of Strings
     *
     * A value representing one or more font files to be used as a source. It
     * may be a path to a single file or a glob matching one or more files, or
     * an array of said strings.
     *
     * Uncomment the next few lines and edit them as necessary.
     */
    // src: [
    //   `${ paths.SRC }/fonts/**/*`,
    // ],

    /**
     * dest - String
     *
     * The directory to which font files will be moved.
     *
     * Uncomment the next line and edit it as necessary.
     */
    // dest: `${ paths.DEST }/fonts`,
  },
  images: {
    /**
     * src - String or Array of Strings
     *
     * A value representing one or more image files to be used as a source. It
     * may be a path to a single file or a glob matching one or more files, or
     * an array of said strings.
     *
     * Uncomment the next few lines and edit them as necessary.
     */
    // src: [
    //   `${ paths.SRC }/images/**/*`,
    // ],

    /**
     * dest - String
     *
     * The directory to which processed image files will be saved.
     *
     * Uncomment the next line and edit it as necessary.
     */
    dest: `${paths.DEST}/images`,
  },
  scripts: {
    /**
     * bundle - String or falsy value
     *
     * If set to a string (e.g. 'main.js'), Calliope will concatenate all JS
     * files into a single JS file using that string for the filename. Files
     * are concatenated in the order in which they are processed. If this
     * option is not set, Calliope will default to `false` and not concatenate
     * files, instead processing and saving each one to the build directory
     * individually.
     *
     * Uncomment the next line to enable bundling.
     */
    // bundle: true,

    /**
     * compress - Boolean
     *
     * Whether the generated JavaScript should be uglified. Calliope uses
     * terser (https://www.npmjs.com/package/terser) to compress and uglify
     * JavaScript files. If set to `false`, your JavaScript will not be
     * compressed or uglified.
     *
     * Uncomment the next line to disable compression.
     */
    // compress: false,

    /**
     * lint - Boolean
     *
     * Whether to lint JavaScript files during build. If true, Calliope will
     * lint your JavaScript as part of the `scripts` task. This configuration
     * has no effect on the standalone `lint` task; that task always lints
     * JavaScript regardless of this setting.
     *
     * It is highly recommended that this be kept as-is, since it’s important
     * for developers to be able to configure their development environment as
     * they wish. That said, if your project needs to change this value,
     * uncomment the next line and edit it as needed.
     */
    // lint: env.CALLIOPE_LINT_JS === 'true',

    /**
     * rename - Boolean
     *
     * Whether compressed JavaScript files should be renamed to add `.min` to
     * the base filename. This option only takes effect when `compress` is set
     * to `true` and `bundle` is falsy. It renames processed module files from
     * `FILENAME.js` to `FILENAME.min.js` before saving them to the destination
     * directory.
     *
     * Uncomment the next line to enable renaming.
     */
    // rename: true,

    /**
     * src - String or Array of Strings
     *
     * A value representing one or more JavaScript files to be used as a
     * source. It may be a path to a single file or a glob matching one or more
     * files, or an array of said strings.
     *
     * Uncomment the next few lines and edit them as necessary.
     */
    // src: [
    //   `${ paths.SRC }/scripts/**/*.js`,
    //   `${ paths.SRC }/components/**/*.js`,
    //   `!${ paths.SRC }/components/**/*.config.js`,
    // ],

    /**
     * dest - String
     *
     * The directory to which generated JavaScript files will be saved.
     *
     * Uncomment the next line and edit it as necessary.
     */
    // dest: `${ paths.DEST }/scripts`,
  },
  styles: {
    /**
     * lint - Boolean
     *
     * Whether to lint SCSS files during build. If true, Calliope will lint
     * your SCSS as part of the `styles` task. This configuration has no effect
     * on the standalone `lint` task; that task always lints SCSS regardless of
     * this setting.
     *
     * It is highly recommended that this be kept as-is, since it’s important
     * for developers to be able to configure their development environment as
     * they wish. That said, if your project needs to change this value,
     * uncomment the next line and edit it as needed.
     */
    // lint: env.CALLIOPE_LINT_SCSS === 'true',

    /**
     * src - String or Array of Strings
     *
     * A value representing one or more SCSS files to be used as a source. It
     * may be a path to a single file or a glob matching one or more files, or
     * an array of said strings.
     *
     * Uncomment the next few lines and edit them as necessary.
     */
    // src: [
    //   `${ paths.SRC }/styles/**/*.scss`,
    // ],

    /**
     * watch - String or Array of Strings
     *
     * A value representing one or more SCSS files to be watched during
     * development. It may be a path to a single file or a glob matching one or
     * more files, or an array of said strings.
     *
     * Use this option to declare files that may need to trigger a watched
     * task, but not necessarily processed individually themselves (e.g.
     * stylesheet partials).
     *
     * Uncomment the next few lines and edit them as necessary.
     */
    // watch: [
    //   `${ paths.SRC }/components/**/*.scss`,
    // ],

    /**
     * dest - String
     *
     * The directory to which generated CSS files will be saved.
     * Uncomment the next line and edit it as necessary.
     */
    // dest: `${ paths.DEST }/styles`,
  },
};

exports.daemons = {
  browsersync: {
    /**
     * proxy - String
     *
     * An absolute URL representing a development environment of your project.
     * Browsersync will reverse proxy this URL during development.
     *
     * Uncomment the next line and edit it as necessary.
     */
    // proxy: 'http://myproject.lndo.site',
  },
};
