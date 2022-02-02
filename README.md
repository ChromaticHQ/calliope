# Calliope

An extensible, Gulp-based front-end toolchain designed for quick and fussless setup and maintenance.

[Documentation TK.]

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
  * [Configuring Custom Tasks](#configuring-custom-tasks)

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

1. **Pipelines:** These are typically tasks that process static assets, e.g. compiling styles, compressing JavaScript, processing images, moving fonts around, etc. If your custom task or override is intended to be run as part of each build, it goes in `calliope/pipelines/`.
1. **Daemons:** Daemons are long-running processes that you want Calliope to run _alongside_ any watched tasks. Anytime you run `yarn calliope start`, Calliope will not only build assets and start watching for changes, but also run any daemons that may be available. If you need to run a service during development (a component library server, an API stubs server, etc.), it belongs in `calliope/daemons/`.
1. **Tasks:** These are generic tasks that may be used as needed. They are standard Gulp taks that are only run when you explicitly invoke them in the command line. e.g. if you have a `calliope/tasks/build-patterns.js` file in your project, you can use `yarn calliope build-patterns` to run it.

## Configuring Custom Tasks

TK
