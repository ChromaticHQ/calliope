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

const basicStylesPath = resolve(__dirname, 'styles/samples/basic/scss');

describe('Style tasks', () => {
  describe('checks entire style task', () => {
    const command = `${cli} styles`;
    let cwd;
    // Before test is ran, needs to compile styles into css.
    before(async () => {
      cwd = createTemporaryWorkingDirectory();
      const tmpDirStylesPath = resolve(cwd, 'src/styles');
      createManifestFile(cwd);
      execSync('yarn add breakpoint-sass', { cwd, stdio });
      mkdirSync(resolve(cwd, 'src'));
      await copyRecursively(basicStylesPath, tmpDirStylesPath);
      execSync(command, { cwd, stdio });
    });

    // after test is ran, delete that temporary compiled style.
    after(() => deleteTemporaryWorkingDirectory(cwd));
    it('styles task checked', () => {
      const generatedFile = readFileSync(resolve(cwd, 'build/styles/styles-expanded.css').toString());
      const controlFile = readFileSync(resolve(__dirname, 'styles/samples/basic/css/styles-expanded.css')).toString();
      assert.equal(generatedFile, controlFile);
    });

    it('minified stylesheet checked', () => {
      const generatedFile = readFileSync(resolve(cwd, 'build/styles/styles.css')).toString();
      const controlFile = readFileSync(resolve(__dirname, 'styles/samples/basic/css/styles.css')).toString();
      assert.equal(generatedFile, controlFile);
    });
    // it('Styles linted.');
    // it('Vendor prefixes applied.');
    // it('Filename changed to [X].');
  });
});
