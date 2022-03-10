# Calliope

An extensible, Gulp-based front-end toolchain designed for quick and fussless setup and maintenance.

## Table of Contents

<!--
  Please do not update this table of contents manually!
  Use `yarn update-readme-toc` instead.
-->

<!-- toc -->

- [System Requirements](#system-requirements)
- [Introduction](#introduction)
- [Installation & Usage](#installation--usage)
- [Configuration](#configuration)
- [Available Commands](#available-commands)
- [Default Tasks](#default-tasks)
  * [Pipelines](#pipelines)
    + [`fonts` - Move Font Files](#fonts---move-font-files)
    + [`images` - Optimize Images](#images---optimize-images)
    + [`scripts` - Optimize JavaScript](#scripts---optimize-javascript)
    + [`styles` - Pre-process Stylesheets](#styles---pre-process-stylesheets)
  * [Daemons](#daemons)
    + [`browsersync` - Reverse Proxy](#browsersync---reverse-proxy)
  * [Generic Tasks](#generic-tasks)
    + [`lint` - Lint JS and SCSS](#lint---lint-js-and-scss)
- [Developer Personalization](#developer-personalization)
- [Customization](#customization)
  * [Custom Task Types](#custom-task-types)
  * [Overriding Default Pipelines](#overriding-default-pipelines)
  * [Creating Custom Pipelines](#creating-custom-pipelines)
  * [Creating Custom Daemons & Tasks](#creating-custom-daemons--tasks)
  * [Environment Variables](#environment-variables)

<!-- tocstop -->

---

# System Requirements

In order to use this theme, you must have each of the following installed in your system:
- [Node.js](https://nodejs.org/en/) v14+
- [Yarn](https://yarnpkg.com/) v1+

---

# Introduction

Calliope is a front-end task runner based on Gulp. It is designed to provide reasonable defaults that will get most web projects up and running with minimal setup or maintenance. Common tasks include image processing, JavaScript compression, Sass compilation, linting, watching for changes, and starting a reverse proxy that will refresh the browser anytime assets change. These tasks can be configured to suit your project’s needs.

This tool also exposes a simple API for customization. Default tasks can be overridden and custom tasks can be registered to be run in a variety of scenarios.

# Installation & Usage

You can install Calliope in your project with the following command (assuming you’re using Yarn):

```shell
yarn add @chromatichq/calliope
```

In your project’s `package.json` file, find the `scripts` object and add the following:

```json
"scripts": {
  "calliope": "yarn install && calliope"
},
```

This will allow you to use `yarn calliope COMMAND` to run any of the tasks available in the toolchain, with the added benefit of installing dependencies before doing so. For example, to run the `build` task, you would run `yarn calliope build`. You can take this one step further and add a dedicated `build` script in `package.json`, like so:

```json
"scripts": {
  "calliope": "yarn install && calliope",
  "build": "yarn calliope build"
},
```

Now running `yarn build` will do the same thing as `yarn calliope build`. You can do the same for any other tasks commonly used in your project.

# Configuration

Calliope works without additional configuration. Should you need to configure how any of the default tasks behave or add configuration for a custom task, you’ll be able to do so by creating a `calliope.config.js` file in the same directory as your project’s `package.json`. See the [`samples/calliope.config-sample.js`] file in this repository for details on how to configure each individual task from your newly-created configuration file, or as a reference for creating your configuration object for a custom task.

# Available Commands

For the most part, you will be interacting with two commands: `build` and `start`. The `build` command runs all of the tasks defined as pipelines (see [Pipelines] below). The `start` command will run the `build` command, watch for changes in the project’s source files, and re-run the appropriate tasks when any changes are detected. In addition to watching for changes, the `start` command will also run any daemons available in your project.

In addition to these built-in commands, any individual task can be invoked as a standalone command via Calliope’s CLI. Once your `package.json` has been set up according to the [Installation & Usage] section, you can run any task from the command line like so:

```shell
yarn calliope scripts
```

The command above would run the `scripts` task once by itself.


# Default Tasks

Calliope ships with a few basic tasks that most projects will need. This section provides an overview of these tasks and what they accomplish. For details on the configuration options available for each of the following tasks, see the [`samples/calliope.config-sample.js`] file in this project’s repository.

## Pipelines

Your project’s build is defined by its pipeline tasks. These tasks are concerned with processing your project’s static assets (JS, CSS, images, etc) and are run every time you run the `build` or `start` commands.

### `fonts` - Move Font Files

The `fonts` task merely moves font files from your source directory to the destination directory without any additional processing.

**`fonts` is disabled by default, but can be easily enabled by adding a configuration object for it in your project’s `calliope.config.js` file. See [`samples/calliope.config-sample.js`] for configuration details.**

### `images` - Optimize Images

The `images` moves image files from the source directory to the destination directory. It also provides simple image optimization for SVGs via [`gulp-imagemin`](https://npmjs.com/package/gulp-imagemin).

**`images` is disabled by default, but can be easily enabled by adding a configuration object for it in your project’s `calliope.config.js` file. See [`samples/calliope.config-sample.js`] for configuration details.**

### `scripts` - Optimize JavaScript

The `scripts` task handles operations related to JavaScript processing and optimization. It provides linting, uglification/compression (via [`terser`](https://npmjs.com/package/terser)), and concatenation. All of these operations are configurable to some degree.

By default, this task does not lint JS files, but linting can be enabled via an `.env` file. See [Developer Personalization] for details.

### `styles` - Pre-process Stylesheets

The `styles` task generates CSS from your project’s `.scss` files using [`node-sass`](https://npmjs.com/package/node-sass). It includes a few affordances, such as [`gulp-sass-glob`](https://npmjs.com/package/gulp-sass-glob), [`gulp-autoprefixer`](https://www.npmjs.com/package/gulp-autoprefixer), and [`gulp-clean-css`](https://www.npmjs.com/package/gulp-clean-css). This task generates both minified and expanded (i.e. not minified) CSS stylesheets. Minified stylesheets will be named after your SCSS files, and expanded stylesheets will have the suffix `-expanded` attached to the filename. So if your stylesheet is named `main.scss`, Calliope will produce two files: `main.css` and `main-expanded.css`.

By default, this task does not lint SCSS files, but linting can be enabled via an `.env` file. See [Developer Personalization] for details.

## Daemons

Daemons are tasks that run alongside your watched tasks when you use the `start` command. They are typically servers designed to enhance or otherwise facilitate the development experience without necessarily impacting the outcome of your build.

### `browsersync` - Reverse Proxy

The `browsersync` task reverse proxies your project’s local URL, so that it may be accessed at <https://localhost:3000>. Using this reverse proxy during development saves time and effort by dynamically refreshing styles when styles change or auto-refreshing the page when JS or template files change.

## Generic Tasks

Generic tasks are tasks that are not part of the build and are not run alongside your watched tasks, but are nevertheless invoked independently throughout the development workflow in one way or another.

### `lint` - Lint JS and SCSS

The `lint` tasks uses [`gulp-eslint-new`](https://npmjs.com/package/gulp-eslint-new) and [`gulp-stylelint`](https://npmjs.com/package/gulp-stylelint) to lint your project’s JS and SCSS (respectively). It uses the `src` and (optional) `watch` settings of the `scripts` and `styles` configuration to determine which files should be linted, and relies on your project’s `.eslintrc.yml` and `.stylelintrc.yml` files to define the rules with which to lint your source files.

# Developer Personalization

In addition to the configuration options available in your project’s `calliope.config.js`, individual developers may modify parts of the tooling behavior according to their personal preferences. Developers may opt into JS and SCSS linting, and modify the reverse proxy’s URL (or opt out of reverse proxying altogether) by creating a `.env` file in their project and setting variables according to their needs. See the [`.env.sample`] file in this project’s repo for reference.

# Customization

Calliope will serve the needs of most of our projects out of the box, but if you run into a scenario where you need it to do something different or extra there are two things you can do: override default tasks or create custom tasks. In both cases, all you have to do is create a `calliope/` directory and add your tasks to the appropriate directory within. Read on to learn the details.

## Custom Task Types

Calliope is just a fancy wrapper around Gulp, so all tasks that you may need to create will be just standard Gulp tasks. However, there are three different types of tasks within Calliope, some of which get special treatment.

1. **Pipelines:** These are typically tasks that process static assets, e.g. compiling styles, compressing JavaScript, processing images, moving fonts around, etc. If your custom task or override is intended to be run as part of each build, it goes in `calliope/pipelines/`. In addition to creating custom pipelines, Calliope supports overriding its default pipelines if your project requires this. See [Overriding Default Pipelines] below for details.
1. **Daemons:** Daemons are long-running processes that you want Calliope to run _alongside_ any watched tasks. Anytime you run `yarn calliope start`, Calliope will not only build assets and start watching for changes, but also run any daemons that may be available. If you need to run a service during development (a component library server, an API stubs server, etc.), it belongs in `calliope/daemons/`. While you may create custom daemons to run in parallel to build and watched tasks during development, the default reverse proxy daemon may not be overridden at this time.
1. **Tasks:** These are generic tasks that may be used as needed. They are standard Gulp taks that are only run when you explicitly invoke them in the command line. e.g. if you have a `calliope/tasks/build-patterns.js` file in your project, you can use `yarn calliope build-patterns` to run it. You can create as many custom generic tasks as your project needs, but existing ones are not currently overrideable.

## Overriding Default Pipelines

Any of Calliope’s pipeline tasks can be overridden by creating an appropriately-named module file in the `calliope/pipelines/` directory within your project. Your task file should have the same name as the task you intend to override (e.g. `scripts.js` overrides the `scripts` task, `fonts.js` overrides `fonts`, etc.). Your override file should export a function to be used by Gulp instead of the default function provided by Calliope:

Here’s what it might look like to override the `scripts` task (keeping in mind this is a highly-contrived example that merely moves JS files without modifying them in any way):

```javascript
/*
 * @file
 * Gulp task to process client-side JavaScript.
 */

// Get the configuration object from Calliope.
const config = require('@chromatichq/calliope').config;
const { src, dest } = require('gulp');

function scripts() {
  return src(config.pipelines.scripts.src, { sourcemaps: true })
    // Transform JS files one way or another.
    .pipe(dest(config.pipelines.scripts.dest, { sourcemaps: '.' }));
}

module.exports = scripts;
```

## Creating Custom Pipelines

Custom pipeline tasks are unique custom tasks that do not override any of the default pipeline tasks shipped with Calliope. These tasks are simply run alongside the default pipelines. This can be useful in the case that your project has special assets that need to be processed one way or another in a way that Calliope does not currently support. For example, say your project includes custom Vue.js components that need to be processed separately from all the other JS. You could write a `components.js` file that exports a Gulp task to process those files and add it to your projects `calliope/pipelines/` directory.

Custom Pipelines require one more step, however. Calliope only runs pipelines that have a configuration. This makes it possible for Calliope to programmatically determine what tasks constitute a “build”, so that it may be easily reproduced in a variety of contexts (*building in production, watching in development, etc). Your project’s `config.pipelines` object dictates what tasks are run as pipeline tasks during build and watch processes. Therefore, in order for Calliope to know about your custom pipeline, it must be added to the `pipelines` configuration object exported in your project’s `calliope.config.js` file.

Using the `components` example above, your `calliope.config.js` file should have something like this:

```javascript
exports.pipelines = {
  // Other pipeline configuration…
  components: {
    // Your Vue.js task’s configuration here.
  },
};
```

Any configuration you include in that `components` object can be accessed from your custom `components.js` file like so:

```javascript
const config = require('@chromatichq/calliope').config;
console.log(config.pipelines.components);
```

Finally, note that in the unlikely event that your custom pipeline needs no configuration whatsoever, you can simply pass an empty object:

```javascript
exports.pipelines = {
  components: {},
};
```

## Creating Custom Daemons & Tasks

Custom daemons and generic tasks is very similar to creating custom pipelines, with the exception that these are simply picked up by Calliope automatically without the need to add them to `calliope.config.js`. That’s not to say that you shouldn’t add configuration for these tasks if you need it; only that you don’t _have_ to in order for Calliope to know about and use these tasks.

In the case of daemons, Calliope will run them in parallel to the build tasks while watching for changes during development (i.e. during the `start` command). Refer to the `tasks/browsersync.js` file in this project for an example of a daemon.

As for generic tasks, Calliope will register them and only run them when you explicitly run `yarn calliope TASK_NAME`. For an example of a generic task, refer to the `tasks/lint.js` file in this project.

## Environment Variables

Depending on the nature of your custom task, it may make sense to make some configuration available for developers to customize in a localized manner that only affects their local environment. This should only be used for configuration that does not impact the reproducibility of a build; think: linting vs not linting during development (a feature that the default `scripts` and `styles` tasks offer out of the box!), or whether to print stats about your fancy Vue.js compilation process to the console.

This sort of personalization can be easily accomplished by declaring one or more appropriately-named variables in your `.env` file and referencing said variables from the `calliope.config.js` file. For example, if you create a variable like this in your `.env` file:

```
CALLIOPE_MY_CUSTOM_VAR=something fun
```

You can then access that value from `calliope.config.js` like so:

```javascript
const myCustomVar = process.env.CALLIOPE_MY_CUSTOM_VAR || 'some less fun fallback';
```

See the `pipelines.scripts` and `pipelines.styles` objects in the `config/defaults.js` file in this project for other examples of how we currently use environment variables.

It’s important to note that these personalization options should always be optional and there should always be a fallback in your configuration. You should also document any new environment variables in the Development Settings section of your project’s README for ease of reference and add sample variable definitions in your project’s [`.env.sample`] file.

[Available Commands]: #available-commands
[`samples/calliope.config-sample.js`]: https://github.com/ChromaticHQ/calliope/blob/main/samples/calliope.config-sample.js
[Daemons]: #daemons
[Developer Personalization]: #developer-personalization
[`.env.sample`]: https://github.com/ChromaticHQ/calliope/blob/main/.env.sample
[Overriding Default Pipelines]: #overriding-default-pipelines
[Pipelines]: #pipelines
[Generic Tasks]: #generic-tasks
