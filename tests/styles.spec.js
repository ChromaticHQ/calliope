const assert = require('assert');
const { execSync } = require('child_process');
const { mkdirSync, cpSync, readFileSync } = require('fs');

/* eslint-disable */
let copy;
if (typeof cpSync === 'undefined') {
  copy = require('recursive-copy');
}
/* eslint-enable */

const { resolve } = require('path');
const { cli, stdio } = require('./lib/cli');
const {
  copyRecursively,
  createManifestFile,
  createTemporaryWorkingDirectory,
  deleteTemporaryWorkingDirectory,
} = require('./lib/helpers');

const sampleStylesPath = resolve(__dirname, 'data/styles/scss');

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
    await copyRecursively(sampleStylesPath, tmpDirStylesPath);
    // Generate CSS.
    execSync(command, { cwd, stdio });
  });
  after(() => deleteTemporaryWorkingDirectory(cwd));

  it('generates expanded CSS that matches our samples', () => {
    const generatedFile = readFileSync(resolve(cwd, 'build/styles/styles-expanded.css')).toString().replace(/\r\n/g, '\n');
    const controlFile = readFileSync(resolve(__dirname, 'data/styles/css/basic-expanded.css')).toString().replace(/\r\n/g, '\n');
    assert.equal(generatedFile, controlFile);
  });

  it('generates minified CSS that matches our samples', () => {
    const generatedFile = readFileSync(resolve(cwd, 'build/styles/styles.css')).toString().replace(/\r\n/g, '\n');
    const controlFile = readFileSync(resolve(__dirname, 'data/styles/css/basic.css')).toString().replace(/\r\n/g, '\n');
    assert.equal(generatedFile, controlFile);
  });
});
