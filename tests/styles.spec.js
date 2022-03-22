const assert = require('assert');
const { execSync } = require('child_process');
const {
  existsSync, mkdtempSync, mkdirSync, cpSync, readFileSync, rmdirSync,
} = require('fs');
const { parse, resolve } = require('path');
const { cli } = require('./lib/cli');
// Create tmp directory.
const stdio = 'pipe';


  describe.only('Style tasks', () => {
    describe('checks each style task', () => {
      let command = `${cli} styles`;
      let cwd;

      // Before test is ran, needs to compile styles into css.
      before(() => {
        cwd = createTemporaryWorkingDirectory();
        createManifestFile(cwd);
        execSync(`${cli} init --only-config --only-package`, { cwd, stdio });
        mkdirSync(resolve(cwd, 'src'));
        cpSync(resolve(__dirname, 'styles/samples/basic/scss'), resolve(cwd, 'src/styles'), {recursive: true});
        // @TODO: Problem with yarn and gulp.
        execSync(command, { cwd, stdio });
      });

      // after test is ran, delete that temporary compiled style.
      // after(() => deleteTemporaryWorkingDirectory(cwd));
      it('styles task checked');
      // it('Styles linted.', () => {
      //   assert.equal([1, 2, 3].indexOf(4), -1);
      // });
      // it('Imports using globs have run.', () => {
      //   assert.equal([1, 2, 3].indexOf(4), -1);
      // });
      // it('Vendor prefixes applied.', () => {
      //   assert.equal([1, 2, 3].indexOf(4), -1);
      // });
      // it('Filename changed to [X].', () => {
      //   assert.equal([1, 2, 3].indexOf(4), -1);
      // });
      // it('Stylesheet is minified.', () => {
      //   assert.equal([1, 2, 3].indexOf(4), -1);
      // });
    });

  });

function createManifestFile(cwd) {
  return execSync('yarn init -y', { cwd, stdio });
}

function createTemporaryWorkingDirectory() {
  return mkdtempSync(resolve(__dirname, 'tmp/init-'));
}
