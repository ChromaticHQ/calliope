const assert = require('assert');
const { execSync } = require('child_process');
const { existsSync, mkdtempSync, readFileSync, rmdirSync } = require('fs');
const { parse, resolve } = require('path');
// Path to cli relative to tmp working directory.
const cli = '../../../cli.js';
// Create tmp directory.
const cwd = mkdtempSync(resolve(__dirname, 'tmp/init-'));
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
};
// Total number of possible errors is equal to the number of boilerplates
// available to copy plus one error to account for non-existent manifest error.
const maxErrors = Object.keys(files).length + 1;

/**
 * HAPPY PATH.
 */

// Create a manifest file.
execSync('yarn init -y', { cwd, stdio });

// Assert clean init with existing manifest.
// Run init command and assert that everything is fine.
execSync(initCmd, { cwd, stdio });
// Assert that generated files match the boilerplates.
Object.keys(files).map((type) => files[type]).forEach((filename) => {
  assert.equal(
    readFileSync(resolve(cwd, filename)).toString(),
    readFileSync(resolve(__dirname, '../boilerplate', sampleFilename(filename))),
  );
});
// Load the updated manifest and assert that all expected scripts are correct.
const { scripts } = require(resolve(cwd, 'package.json'));
Object.keys(expectedPackageCommands).forEach((command) => {
  assert.equal(
    scripts[command],
    expectedPackageCommands[command],
    `Expected calliope command in package.json scripts to be '${ expectedPackageCommands[command] }', but found '${ scripts[command] }' in ${ cwd }/package.json.`,
  );
});

/**
 * NOTHING CAN BE DONE.
 */

// Remove manifest file.
execSync('rm package.json', { cwd, stdio });

// Assert errors when nothing can be done.
try {
  execSync(initCmd, { cwd, stdio });
}
catch (error) {
  // Assert that the exit code matches the number of errors expected.
  assert.equal(error.status, maxErrors);
  assert.match(
    error.message, /No package.json file was found/,
    'Expected an error message for non-existent package.json file.'
  );
  Object.keys(files).map((type) => files[type]).forEach((filename) => {
    assertFileExistsError(error, filename);
  });
}

/**
 * CANNOT COPY ANY FILES.
 */

// Create new manifest file.
execSync('yarn init -y', { cwd, stdio });

// Assert errors when manifest exists.
try {
  execSync(initCmd, { cwd, stdio });
}
catch (error) {
  assert.equal(error.status, maxErrors - 1);
  Object.keys(files).map((type) => files[type]).forEach((filename) => {
    assertFileExistsError(error, filename);
  });
}

/**
 * FORCE SINGLE FILE.
 */

Object.keys(files).forEach((type) => {
  // Modify existing file and store its contents.
  execSync(`echo "\n// This is the old file, which should be backed up." >> ${ files[type] }`, { cwd, stdio });
  const prevFile = readFileSync(resolve(cwd, files[type])).toString();
  // Assert init with --force-config flag.
  try {
    execSync(`${ initCmd } --force-${ type }`, { cwd, stdio });
  }
  catch (error) {
    // Assert total number of errors is maximum possible number minus two:
    //   1. The missing manifest error, which should not occur.
    //   2. The existing file error for the file currently being tested, which
    //      we’ve forced.
    assert.equal(error.status, maxErrors - 2);
    // Assert that we get errors for the files *not* being forced in this run.
    Object.keys(files).filter((t) => t !== type).forEach((t) => {
      assertFileExistsError(error, files[t]);
    });
    assertFileExists(backupFilename(files[type]));
    // Assert the contents of the new config file and its backup.
    const backupFile = readFileSync(resolve(cwd, backupFilename(files[type])))
      .toString();
    const newFile = readFileSync(resolve(cwd, files[type])).toString();
    assert.equal(backupFile, prevFile);
    assert.equal(newFile, readFileSync(resolve(__dirname, '../boilerplate', sampleFilename(files[type]))).toString());
  }
});

/**
 * FORCE ALL FILES.
 */

// Remove old backup files.
execSync(`rm ${ Object.keys(files).map((type) => files[type]).join(' ') }`, { cwd, stdio });

// Assert init with --force.
execSync(`${ initCmd } --force`, { cwd, stdio });
Object.keys(files).map((type) => files[type])
  .forEach(assertFileExists);

/**
 * CLEANUP.
 */

// All assertions appear to have passed, so delete the testing directory.
rmdirSync(cwd, { recursive: true });

/**
 * HELPER FUNCTIONS.
 */

function assertFileExistsError(error, filename) {
  assert.match(
    error.message, new RegExp(`Your project already has a ${ filename } file`),
    `Expected an error message for existing ${ filename } file.`
  );
}

function assertFileExists(filename) {
  assert.ok(
    existsSync(resolve(cwd, filename)),
    `Expected ${ filename } to exist in ${ cwd }.`,
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
