const assert = require('assert');
const { execSync } = require('child_process');
const { mkdirSync, readFileSync } = require('fs');

const { resolve } = require('path');
const { cli, stdio } = require('./lib/cli');
const {
  copyRecursively,
  createManifestFile,
  createTemporaryWorkingDirectory,
  deleteTemporaryWorkingDirectory,
} = require('./lib/helpers');

const basicStylesPath = resolve(__dirname, 'data/styles/scss');

describe('Style tasks', () => {
  const command = `${cli} styles`;
  let cwd;
  before(async () => {
    cwd = createTemporaryWorkingDirectory();
    const tmpDirStylesPath = resolve(cwd, 'src/styles');
    createManifestFile(cwd);
    // Install a third-party dependency used in sample stylesheets.
    execSync('yarn add breakpoint-sass', { cwd, stdio });
    mkdirSync(resolve(cwd, 'src'));
    await copyRecursively(basicStylesPath, tmpDirStylesPath);
    // Create .env file that disables linting.
    execSync('echo "CALLIOPE_LINT_SCSS=false" > .env', { cwd, stdio });
    // Generate CSS.
    execSync(command, { cwd, stdio });
  });
  after(() => deleteTemporaryWorkingDirectory(cwd));

  it('generates expanded CSS that matches our samples', () => {
    const generatedFile = readFileSync(resolve(cwd, 'build/styles/basic-expanded.css')).toString().replace(/\r\n/g, '\n');
    const controlFile = readFileSync(resolve(__dirname, 'data/styles/css/basic-expanded.css')).toString().replace(/\r\n/g, '\n');
    assert.equal(generatedFile, controlFile);
  });

  it('generates minified CSS that matches our samples', () => {
    const generatedFile = readFileSync(resolve(cwd, 'build/styles/basic.css')).toString().replace(/\r\n/g, '\n');
    const controlFile = readFileSync(resolve(__dirname, 'data/styles/css/basic.css')).toString().replace(/\r\n/g, '\n');
    assert.equal(generatedFile, controlFile);
  });

  it('lints source files during development', () => {
    let error;
    // Delete .env file.
    execSync('rm .env', { cwd, stdio });
    // Run command.
    try { execSync(command, { cwd, stdio }); } catch (err) { error = err; }
    // Assert error due to missing stylelint config file.
    assert.match(
      error.message,
      /No configuration provided/,
      'Expected an error message for non-existent Stylelint config.',
    );
  });
});
