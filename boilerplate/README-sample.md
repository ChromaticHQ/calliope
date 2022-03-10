# My Calliope Project

A project based on [`@chromatichq/calliope`](https://npmjs.com/package/@chromatichq/calliope).

## Table of Contents

<!--
  Please do not update this table of contents manually!
  Use `yarn update-readme-toc` instead.
-->

<!-- toc -->

- [System Requirements](#system-requirements)
- [Working On This Project](#working-on-this-project)
  * [Available Commands](#available-commands)
    + [Developing Within This Project: `yarn start`](#developing-within-this-project-yarn-start)
    + [Building Project Assets: `yarn build`](#building-project-assets-yarn-build)
    + [Linting SCSS and JS: `yarn lint`](#linting-scss-and-js-yarn-lint)
  * [Development Settings](#development-settings)
    + [Enable Linting During Development](#enable-linting-during-development)
    + [Change Reverse Proxy Target](#change-reverse-proxy-target)
  * [Keeping Documentation Up-to-date](#keeping-documentation-up-to-date)
    + [Updating the Table of Contents](#updating-the-table-of-contents)
  * [Configuring Calliope](#configuring-calliope)

<!-- tocstop -->

---

# System Requirements

In order to work on this project, you must have each of the following installed in your system:
- [Node.js](https://nodejs.org/en/) (see the `.nvmrc` or `.node-version` file at the root of this repo for the required version)
- [Yarn](https://yarnpkg.com/) v1+
- [n](https://github.com/tj/n) v8.0.2+ or [nvm](https://github.com/nvm-sh/nvm#node-version-manager---) v0.39+ (optional)

---

# Working On This Project

This project uses [`@chromatichq/calliope`](https://npmjs.com/package/@chromatichq/calliope), a Gulp-based development workflow tool. The tasks and practices documented in this document are designed to simplify on-boarding, speed up front-end development, maintain performance, and provide a consistent, reliable interface with which project assets can be built for any environment.

## Available Commands

In the interest of observing best practices, all relevant Calliope commands are exposed via npm scripts which we invoke via Yarn commands. The following commands are available to facilitate development. (See [`@chromatichq/calliope`](https://npmjs.com/package/@chromatichq/calliope) documentation for details on overriding these commands and creating custom commands.)

Please note that explicitly installing dependencies is not necessary in this project. Each of the commands detailed below already installs dependencies by default just before it runs.

### Developing Within This Project: `yarn start`

This command will install dependencies, build all static assets, and start watching source files for changes. It will also reverse proxy <PROJECT_LANDO_URL> via Browsersync (see the [Change Reverse Proxy Target] section for details on how to change this). When changes are detected on a source file, the task responsible for building it will be run automatically and, if a reverse proxy is created, Browsersync will handle refreshing related assets in the browser.

To learn about what options are available to customize the development workflow, see [Development Settings].

Usage:
1. Run `yarn start`.
1. After all assets are built, you’ll see a message specifying the URL at which the pattern library can be previewed.
1. After all tasks have finished, you’ll see a “Finished 'watch'" message in the console.
1. If you haven’t opted out of the reverse proxy option, you’ll see a message pointing you to <http://localhost:4000>.
1. Use `Ctrl + c` to cancel the process.

### Building Project Assets: `yarn build`

This command will install dependencies, build all project assets, and exit. This is useful for CI and other environments where active project development is **not** taking place. Assets generated with this command are optimized for production by default.

Usage:
1. Run `yarn build`.
1. After all tasks run and the process exits, you should see updated assets generated in the `build/` directory.

### Linting SCSS and JS: `yarn lint`

This command will run linting for SCSS and JS based on rules set in `stylelintrc.yml` and `eslintrc.yml`.

Usage:
1. Run `yarn lint`.
1. After the process is finished, you will see any linting errors printed in the console. Note: This command does not compile files.

## Development Settings

`@chromatichq/calliope` exposes configuration that allows the developer to fine-tune their development environment. The following settings may be configured via a `.env` file wherever the `calliope.config.js` file exists.  You can use `.env-sample` as an example.

The `.env` file is interpreted as a series of key/value pairs. The format is as follows:

```
ENV_VAR_NAME=some value
```

### Enable Linting During Development

If you would like to lint SCSS and JS files during development uncomment the following lines in the `.env` file.

```
  # CALLIOPE_LINT_SCSS=true
  # CALLIOPE_LINT_JS=true
```

### Change Reverse Proxy Target

Browsersync is used to create a reverse proxy during the `yarn start` command.  This allows us to enjoy automatic browser refreshes on the Drupal site. By default, the Browsersync will reverse proxy <PROJECT_LANDO_URL> as part of the `yarn start` task. To change this, you only need to set the following variable in your `.env` file.

```
CALLIOPE_REVERSE_PROXY_URL=http://my-custom-host
```

Where `http://my-custom-host` is the protocol and hostname you’re using locally.

Alternatively, if you wish to simply turn this feature off, set the environment variable to `null`, like so:

```
CALLIOPE_REVERSE_PROXY_URL=null
```

## Keeping Documentation Up-to-date

This `README.md` file should be considered a living document. Any time the development workflow or practices change, this documentation should be updated to clearly convey those changes. If at any time you find yourself asking questions that you think should be added to this document, you’re encouraged to submit a PR doing just that.

### Updating the Table of Contents

Whenever this documentation changes, you can run the `yarn update-readme-toc` command to update this README file’s table of contents. Once you’ve run that command, you’ll need to commit any changes resulting from it.

## Configuring Calliope

All configuration for calliope (except for personal [Development Settings]) is handled from the `calliope.config.js` file.

Our tools and tasks should rarely have to change, but if the need arises, `@chromatichq/calliope` is designed to make existing tasks easy to override and new custom tasks easy to implement. Refer to the [`@chromatichq/calliope` documentation](https://npmjs.org/pacakge/@chromatichq/calliope) for details on overriding its default tasks and creating custom tasks.

[Development Settings]: #development-settings
[Change Reverse Proxy Target]: #change-reverse-proxy-target
