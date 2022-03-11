const assert = require('assert');
const { execSync } = require('child_process');
const { existsSync, mkdtempSync, readFileSync, rmdirSync } = require('fs');
const { parse, resolve } = require('path');
// Path to cli relative to tmp working directory.
const cli = '../../../cli.js';
// Create tmp directory.
const initCmd = `${ cli } init`;
const stdio = 'pipe';
const expectedPackageCommands = {
  calliope: 'yarn install && calliope',
  build: 'yarn calliope build',
  start: 'yarn calliope start',
  lint: 'yarn calliope lint',
  test: 'yarn lint',
};
const files = {
  config: 'calliope.config.js',
  env: '.env-sample',
  eslint: '.eslintrc.yml',
  gitignore: '.gitignore',
  readme: 'README.md',
  stylelint: '.stylelintrc.yml',
};
// Total number of possible errors is equal to the number of boilerplates
// available to copy plus one error to account for non-existent manifest error.
const maxErrors = Object.keys(files).length + 1;

describe('init Command', () => {
  describe('Run simple init', () => {
    describe('in a clean directory w/package.json', () => {
      const command = `${ cli } init`;
      let cwd;
      let package;
      before(() => {
        cwd = createTemporaryWorkingDirectory();
        createManifestFile(cwd);
        execSync(command, { cwd, stdio });
        package = JSON.parse(readFileSync(resolve(cwd, 'package.json')));
      });
      after(() => deleteTemporaryWorkingDirectory(cwd));

      // Assert that each boilerplate file is copied to the downstream project.
      Object.keys(files).map((type) => files[type]).forEach((filename) => {
        it(`Copies ${ filename } to the downstream project.`, () => {
          assertFileExists(cwd, filename);
          assert.equal(
            readFileSync(resolve(cwd, filename)).toString(),
            readFileSync(resolve(__dirname, '../boilerplate', sampleFilename(filename))),
          );
        });
      });

      // Assert that each command is added to the downstream package.json file.
      Object.keys(expectedPackageCommands).forEach((command) => {
        it(`Adds a ${ command } script to package.json.`, () => {
          const { scripts } = package;
          assert.equal(
            scripts[command],
            expectedPackageCommands[command],
            `Expected ${ command } script to be '${ expectedPackageCommands[command] }', but found '${ scripts[command] }' in ${ cwd }/package.json.`,
          );
        });
      });
    });

    describe('in a directory w/pre-existing files and no package.json', () => {
      const command = `${ cli } init`;
      let cwd;
      let error;
      before(() => {
        cwd = createTemporaryWorkingDirectory();
        createManifestFile(cwd);
        // Execute command once to generate boilerplate files.
        execSync(command, { cwd, stdio });
        // Remove manifest file.
        execSync('rm package.json', { cwd, stdio });
        // Execute command again, catch the resulting error, and store it.
        try { execSync(command, { cwd, stdio }); } catch (err) { error = err }
      });
      after(() => deleteTemporaryWorkingDirectory(cwd));

      it('Exit code matches the number of errors', () => {
        assert.equal(error.status, maxErrors);
      });

      it('Includes an error for the package.json file', () => {
        assert.match(
          error.message, /No package.json file was found/,
          'Expected an error message for non-existent package.json file.'
        );
      });

      // Assert an error exists for each boilerplate file.
      Object.keys(files).forEach((type) => {
        it(`Includes an error for the ${ files[type] } file`, () => {
          assertFileExistsError(error, files[type]);
        });
      });
    });

    describe('in a directory w/pre-existing files and a package.json', () => {
      const command = `${ cli } init`;
      let cwd;
      let error;
      before(() => {
        cwd = createTemporaryWorkingDirectory();
        createManifestFile(cwd);
        // Execute command once to generate boilerplate files.
        execSync(command, { cwd, stdio });
        // Execute command again, catch the resulting error, and store it.
        try { execSync(command, { cwd, stdio }); } catch (err) { error = err }
      });
      after(() => deleteTemporaryWorkingDirectory(cwd));

      it('Exit code matches the number of errors', () => {
        assert.equal(error.status, maxErrors - 1);
      });

      // Assert an error exists for each boilerplate file.
      Object.keys(files).forEach((type) => {
        it(`Includes an error for the ${ files[type] } file`, () => {
          assertFileExistsError(error, files[type]);
        });
      });
    });
  });

  describe('Run with --force-* flags', () => {
    Object.keys(files).forEach((type) => {
      describe(`--force-${ type }`, () => {
        const command = `${ cli } init --force-${ type }`;
        let cwd;
        let error;
        let prevFile;
        before(() => {
          cwd = createTemporaryWorkingDirectory();
          createManifestFile(cwd);
          // Execute command once to generate boilerplate files.
          execSync(command, { cwd, stdio });
          // Modify existing file and store its contents for later comparison.
          execSync(
            `echo "\n// This is the old file, which should be backed up." >> ${ files[type] }`,
            { cwd, stdio }
          );
          prevFile = readFileSync(resolve(cwd, files[type])).toString();
          // Execute command again, catch the resulting error, and store it.
          try { execSync(command, { cwd, stdio }); } catch (err) { error = err }
        });
        after(() => deleteTemporaryWorkingDirectory(cwd));

        it('Exit code matches the number of errors', () => {
          // Errors for all but the package.json file and the file being forced.
          assert.equal(error.status, maxErrors - 2);
        });

        it(`Overwrites the ${ files[type] } file with the contents of the ${ sampleFilename(files[type]) } boilerplate.`, () => {
          const newFile = readFileSync(resolve(cwd, files[type])).toString();
          const boilerplate = readFileSync(
              resolve(__dirname, '../boilerplate', sampleFilename(files[type]))
            ).toString();
          assert.equal(newFile, boilerplate);
        });

        it(`Creates a ${ backupFilename(files[type]) } file that matches the original ${ files[type] } file.`, () => {
          assertFileExists(cwd, backupFilename(files[type]));
          // Read the newly-created backup file.
          const backupFile = readFileSync(
            resolve(cwd, backupFilename(files[type]))
          ).toString();
          // Compare newly-created backup file with original file as it existed
          // before it was overwritten.
          assert.equal(backupFile, prevFile);
        });

        // Assert that we get errors for the files *not* forced in this run.
        Object.keys(files).filter((t) => t !== type).forEach((t) => {
          it(`Includes an error for the ${ files[t] } file.`, () => {
            assertFileExistsError(error, files[t]);
          });
        });
      });
    });

    describe('--force', () => {
      const command = `${ cli } init --force`;
      let cwd;
      let error;
      let prevFiles = {};
      before(() => {
        cwd = createTemporaryWorkingDirectory();
        createManifestFile(cwd);
        // Execute command once to generate boilerplate files.
        execSync(command, { cwd, stdio });
        // Modify all existing files and store their contents for later
        // comparison.
        Object.keys(files).forEach((type) => {
          execSync(
            `echo "\n// This is the old file, which should be backed up." >> ${ files[type] }`,
            { cwd, stdio }
          );
          prevFiles[type] = readFileSync(resolve(cwd, files[type])).toString();
        });
        // Execute command again, storing the results for later retrieval.
        try { execSync(command, { cwd, stdio }) } catch (err) { error = err }
      });
      after(() => deleteTemporaryWorkingDirectory(cwd));

      it('No errors should be produced', () => {
        // Errors for all but the package.json file and the file being forced.
        assert.equal(error, undefined);
      });

      Object.keys(files).forEach((type) => {
        it(`Creates a ${ backupFilename(files[type]) } file that matches the original ${ files[type] } file.`, () => {
          assertFileExists(cwd, backupFilename(files[type]));
          // Read the newly-created backup file.
          const backupFile = readFileSync(
            resolve(cwd, backupFilename(files[type]))
          ).toString();
          // Compare newly-created backup file with original file as it existed
          // before it was overwritten.
          assert.equal(backupFile, prevFiles[type]);
        });

        it(`Overwrites the ${ files[type] } file with the contents of the ${ sampleFilename(files[type]) } boilerplate.`, () => {
          const newFile = readFileSync(resolve(cwd, files[type])).toString();
          const boilerplate = readFileSync(
            resolve(__dirname, '../boilerplate', sampleFilename(files[type]))
          ).toString();
          assert.equal(newFile, boilerplate);
        });
      });
    });
  });

  describe('Run with --only-* flags', () => {
    describe('in a clean directory with package.json', () => {
      Object.keys(files).forEach((type) => {
        describe(`--only-${ type }`, () => {
          const command = `${ cli } init --only-${ type }`;
          let filesNotToCopy = Object.keys(files).filter((t) => t !== type);
          let cwd;
          let error;
          before(() => {
            cwd = createTemporaryWorkingDirectory();
            createManifestFile(cwd);
            // Execute command once, catching and storing any resulting error.
            try { execSync(command, { cwd, stdio }); } catch (err) { error = err }
          });
          after(() => deleteTemporaryWorkingDirectory(cwd));

          it(`Copies ${ files[type] } to the downstream project.`, () => {
            assertFileExists(cwd, files[type]);
          });

          filesNotToCopy.forEach((t) => {
            it(`Does not copy ${ files[t] } to the downstream project.`, () => {
              assertFileDoesNotExist(cwd, files[t]);
            });
          });
        });
      });

      describe('--only-package', () => {
        const command = `${ cli } init --only-package`;
        let cwd;
        let package;
        before(() => {
          cwd = createTemporaryWorkingDirectory();
          createManifestFile(cwd);
          execSync(command, { cwd, stdio });
          package = JSON.parse(readFileSync(resolve(cwd, 'package.json')));
        });
        after(() => deleteTemporaryWorkingDirectory(cwd));

        // Assert that each command is added to the downstream package.json file.
        Object.keys(expectedPackageCommands).forEach((command) => {
          it(`Adds a ${ command } script to package.json.`, () => {
            const { scripts } = package;
            assert.equal(
              scripts[command],
              expectedPackageCommands[command],
              `Expected ${ command } script to be '${ expectedPackageCommands[command] }', but found '${ scripts[command] }' in ${ cwd }/package.json.`,
            );
          });
        });

        Object.keys(files).forEach((type) => {
          it(`Does not copy ${ files[type] } to the downstream project.`, () => {
            assertFileDoesNotExist(cwd, files[type]);
          });
        });
      });
    });

    describe('in a directory with pre-existing files', () => {
      Object.keys(files).forEach((type) => {
        describe(`--only-${ type }`, () => {
          const command = `${ cli } init --only-${ type }`;
          let filesNotToCopy = Object.keys(files).filter((t) => t !== type);
          let cwd;
          let error;
          const prevFiles = {};
          before(() => {
            cwd = createTemporaryWorkingDirectory();
            createManifestFile(cwd);
            // Execute command once to create default files.
            execSync(`${ cli } init`, { cwd, stdio });
            // Modify all existing files and store their updated contents for
            // later comparison.
            Object.keys(files).forEach((t) => {
              execSync(
                `echo "\n// This is the old file, which should be backed up." >> ${ files[t] }`,
                { cwd, stdio }
              );
              prevFiles[t] = readFileSync(resolve(cwd, files[t])).toString();
            });
            // Execute command once, catching and storing any resulting error.
            try { execSync(command, { cwd, stdio }); } catch (err) { error = err }
          });
          after(() => deleteTemporaryWorkingDirectory(cwd));

          it(`Copies ${ files[type] } to the downstream project.`, () => {
            assertFileExists(cwd, files[type]);
            assert.equal(
              readFileSync(resolve(cwd, files[type])).toString(),
              readFileSync(resolve(__dirname, '../boilerplate', sampleFilename(files[type]))).toString(),
            );
          });

          it(`Creates a ${ backupFilename(files[type]) } file that matches the original ${ files[type] } file.`, () => {
            assertFileExists(cwd, backupFilename(files[type]));
            assert.equal(
              readFileSync(resolve(cwd, backupFilename(files[type]))).toString(),
              prevFiles[type],
            );
          });

          filesNotToCopy.forEach((t) => {
            it(`Does not copy ${ files[t] } to the downstream project.`, () => {
              assert.equal(
                readFileSync(resolve(cwd, files[t])),
                prevFiles[t],
              );
              assertFileDoesNotExist(cwd, backupFilename(files[t]));
            });
          });
        });
      });

      describe('--only-package', () => {
        const command = `${ cli } init --only-package`;
        let cwd;
        let error;
        let package;
        const prevFiles = {};
        before(() => {
          cwd = createTemporaryWorkingDirectory();
          createManifestFile(cwd);
          // Execute command once to create default files.
          execSync(`${ cli } init`, { cwd, stdio });
          // Modify all existing files and store their updated contents for
          // later comparison.
          Object.keys(files).forEach((t) => {
            execSync(
              `echo "\n// This is the old file, which should be backed up." >> ${ files[t] }`,
              { cwd, stdio }
            );
            prevFiles[t] = readFileSync(resolve(cwd, files[t])).toString();
          });
          // Execute command once, catching and storing any resulting error.
          try { execSync(command, { cwd, stdio }); } catch (err) { error = err }
          package = JSON.parse(readFileSync(resolve(cwd, 'package.json')));
        });
        after(() => deleteTemporaryWorkingDirectory(cwd));

        // Assert that each command is added to the downstream package.json file.
        Object.keys(expectedPackageCommands).forEach((command) => {
          it(`Adds a ${ command } script to package.json.`, () => {
            const { scripts } = package;
            assert.equal(
              scripts[command],
              expectedPackageCommands[command],
              `Expected ${ command } script to be '${ expectedPackageCommands[command] }', but found '${ scripts[command] }' in ${ cwd }/package.json.`,
            );
          });
        });

        Object.keys(files).forEach((type) => {
          it(`Does not copy ${ files[type] } to the downstream project.`, () => {
            assert.equal(
              readFileSync(resolve(cwd, files[type])),
              prevFiles[type],
            );
            assertFileDoesNotExist(cwd, backupFilename(files[type]));
          });
        });
      });
    });
  });
});

// Helper functions.
function createTemporaryWorkingDirectory() {
  return mkdtempSync(resolve(__dirname, 'tmp/init-'));
}

function deleteTemporaryWorkingDirectory(cwd) {
  return rmdirSync(cwd, { recursive: true });
}

function createManifestFile(cwd) {
  return execSync('yarn init -y', { cwd, stdio });
}

function assertFileExistsError(error, filename) {
  assert.match(
    error.message, new RegExp(`Your project already has a ${ filename } file`),
    `Expected an error message for existing ${ filename } file.`
  );
}

function assertFileExists(cwd, filename) {
  assert.ok(
    existsSync(resolve(cwd, filename)),
    `Expected ${ filename } to exist in ${ cwd }.`,
  );
}

function assertFileDoesNotExist(cwd, filename) {
  assert.ok(
    !existsSync(resolve(cwd, filename)),
    `Expected ${ filename } not to exist in ${ cwd }.`,
  );
}

function backupFilename(filename) {
  const parsedFilename = parse(filename);
  return `${ parsedFilename.name }-backup${ parsedFilename.ext }`;
}

function sampleFilename(filename) {
  if (filename.match(/-sample/)) return filename;
  const parsedFilename = parse(filename);
  return `${ parsedFilename.name }-sample${ parsedFilename.ext }`;
}
