const assert = require('assert');
const { execSync } = require('child_process');
const {
  existsSync, mkdtempSync, mkdirSync, cpSync, readFileSync, rmdirSync,
} = require('fs');
let copy;
if (typeof cpSync === 'undefined') {
  copy = require('recursive-copy');
}
const { parse, resolve } = require('path');
const { cli, stdio } = require('./lib/cli');
const {
  copyRecursively,
  createManifestFile,
  createTemporaryWorkingDirectory,
  deleteTemporaryWorkingDirectory,
} = require('./lib/helpers');
const basicStylesPath = resolve(__dirname, 'styles/samples/basic/scss');

describe.only('Style tasks', () => {
  let cwd;
  describe('checks each style task', () => {
    let command = `${cli} styles`;
    // Before test is ran, needs to compile styles into css.
    before(async () => {
      cwd = createTemporaryWorkingDirectory();
      const tmpDirStylesPath = resolve(cwd, 'src/styles');
      createManifestFile(cwd);
      execSync(`yarn add breakpoint-sass`, { cwd, stdio });
      mkdirSync(resolve(cwd, 'src'));
      await copyRecursively(basicStylesPath, tmpDirStylesPath);
      // @TODO: Problem with yarn and gulp.
      execSync(command, { cwd, stdio });
    });

    // after test is ran, delete that temporary compiled style.
    // after(() => deleteTemporaryWorkingDirectory(cwd));
    it('styles task checked', () => {
      // YAY!!
      const controlFile = readFileSync(resolve(__dirname, 'styles/samples/basic/css/styles-expanded.css')).toString();
      console.log(controlFile);
    });
    // it('Styles linted.');
    // it('Imports using globs have run.');
    // it('Vendor prefixes applied.');
    // it('Filename changed to [X].');
    // it('Stylesheet is minified.');
  });
});
