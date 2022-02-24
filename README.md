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

Calliope works without additional configuration but should you need to configure how any of the default tasks behave, first create a `calliope.config.js` file in the same directory as your project’s `package.json`. See the `calliope.sample-config.js` file in this repository for details.

# Customization

Calliope will serve the needs of most of our projects out of the box, but if you run into a scenario where you need it to do something different or extra there are two things you can do: override default tasks or create custom tasks. In both cases, all you have to do is create a `calliope/` directory and add your tasks to the appropriate directory within. Read on to learn the details.

## Custom Task Types

Calliope is just a fancy wrapper around Gulp, so all tasks that you may need to create will be just standard Gulp tasks. However, there are three different types of tasks within Calliope, some of which get special treatment.

1. **Pipelines:** These are typically tasks that process static assets, e.g. compiling styles, compressing JavaScript, processing images, moving fonts around, etc. If your custom task or override is intended to be run as part of each build, it goes in `calliope/pipelines/`. In addition to creating custom pipelines, Calliope supports overriding its default pipelines if your project requires this. See [Overriding Default Pipelines] below for details.
1. **Daemons:** Daemons are long-running processes that you want Calliope to run _alongside_ any watched tasks. Anytime you run `yarn calliope start`, Calliope will not only build assets and start watching for changes, but also run any daemons that may be available. If you need to run a service during development (a component library server, an API stubs server, etc.), it belongs in `calliope/daemons/`. While you may create custom daemons to run in parallel to build and watch tasks during development, the default reverse proxy daemon may not be overridden at this time.
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

It’s important to note that these personalization options should always be optional and there should always be a fallback in your configuration. You should also document any new environment variables in the Development Settings section of your project’s README for ease of reference, and add sample variable definitions in your project’s `.env.sample` file.

[Overriding Default Pipelines]: #overriding-default-pipelines
