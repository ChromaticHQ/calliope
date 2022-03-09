const assert = require('assert');
const { execSync } = require('child_process');
const { existsSync, mkdtempSync, readFileSync, rmdirSync } = require('fs');
const { resolve } = require('path');
// Path to cli relative to tmp directory.
const cli = '../../../cli.js';
// Create tmp directory.
const cwd = mkdtempSync(resolve(__dirname, 'tmp/init-'));
const initCmd = `${ cli } init`;
const maxErrors = 4;
const stdio = 'pipe';
const boilerplates = {
  config: readFileSync(resolve(__dirname, '../boilerplate', 'calliope.config-sample.js')).toString(),
  env: readFileSync(resolve(__dirname, '../boilerplate', '.env-sample')).toString(),
  eslint: readFileSync(resolve(__dirname, '../boilerplate', '.eslintrc-sample.yml')).toString(),
};
const expectedPackageCommands = {
  calliope: 'yarn install && calliope',
  build: 'yarn calliope build',
  start: 'yarn calliope start',
  lint: 'yarn calliope lint',
  test: 'yarn lint',
};

// Create a manifest file.
execSync('yarn init -y', { cwd, stdio });

// Assert clean init with existing manifest.
// Run init command and assert that everything is fine.
execSync(initCmd, { cwd, stdio });
// Assert that generated files match boilerplates.
assert.equal(readFileSync(resolve(cwd, 'calliope.config.js')).toString(), boilerplates.config);
assert.equal(readFileSync(resolve(cwd, '.env-sample')).toString(), boilerplates.env);
assert.equal(readFileSync(resolve(cwd, '.eslintrc.yml')).toString(), boilerplates.eslint);
// Load the updated manifest and assert that all expected scripts are correct.
const { scripts } = require(resolve(cwd, 'package.json'));
Object.keys(expectedPackageCommands).forEach((command) => {
  assert.equal(
    scripts[command],
    expectedPackageCommands[command],
    `Expected calliope command in package.json scripts to be '${ expectedPackageCommands[command] }', but found '${ scripts[command] }' in ${ cwd }/package.json.`,
  );
});

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
  assertFileExistsError(error, 'calliope.config.js');
  assertFileExistsError(error, '.env-sample');
  assertFileExistsError(error, '.eslintrc.yml');
}

// Create new manifest file.
execSync('yarn init -y', { cwd, stdio });

// Assert errors when manifest exists.
try {
  execSync(initCmd, { cwd, stdio });
}
catch (error) {
  assert.equal(error.status, maxErrors - 1);
  assertFileExistsError(error, 'calliope.config.js');
  assertFileExistsError(error, '.env-sample');
  assertFileExistsError(error, '.eslintrc.yml');
}

// Modify existing config and store its contents.
execSync('echo "\n// This is the old file, which should be backed up." >> calliope.config.js', { cwd, stdio });
const prevConfig = readFileSync(resolve(cwd, 'calliope.config.js')).toString();

// Assert init with --force-config flag.
try {
  execSync(`${ initCmd } --force-config`, { cwd, stdio });
}
catch (error) {
  assert.equal(error.status, maxErrors - 2);
  assertFileExistsError(error, '.env-sample');
  assertFileExistsError(error, '.eslintrc.yml');
  assertFileExists('calliope.config-backup.js');
  // Assert the contents of the new config file and its backup.
  const backupConfig = readFileSync(resolve(cwd, 'calliope.config-backup.js'))
    .toString();
  const newConfig = readFileSync(resolve(cwd, 'calliope.config.js'))
    .toString();
  assert.equal(backupConfig, prevConfig);
  assert.equal(newConfig, boilerplates.config);
}

// Modify existing env and store its contents.
execSync('echo "\n# This is the old file, which should be backed up." >> .env-sample', { cwd, stdio });
const prevEnv = readFileSync(resolve(cwd, '.env-sample')).toString();

// Assert init with --force-env flag.
try {
  execSync(`${ initCmd } --force-env`, { cwd, stdio });
}
catch (error) {
  assert.equal(error.status, maxErrors - 2);
  assertFileExistsError(error, 'calliope.config.js');
  assertFileExistsError(error, '.eslintrc.yml');
  assertFileExists('.env-sample-backup');
  // Assert the contents of the new env file and its backup.
  const backupEnv = readFileSync(resolve(cwd, '.env-sample-backup')).toString();
  const newEnv = readFileSync(resolve(cwd, '.env-sample')).toString();
  assert.equal(backupEnv, prevEnv);
  assert.equal(newEnv, boilerplates.env);
}

// Modify existing eslintrc and store its contents.
execSync('echo "\n// This is the old file, which should be backed up." >> .eslintrc.yml', { cwd, stdio });
const prevEslint = readFileSync(resolve(cwd, '.eslintrc.yml')).toString();

// Assert init with --force-eslint flag.
try {
  execSync(`${ initCmd } --force-eslint`, { cwd, stdio });
}
catch (error) {
  assert.equal(error.status, maxErrors - 2);
  assertFileExistsError(error, 'calliope.config.js');
  assertFileExistsError(error, '.env-sample');
  assertFileExists('.eslintrc-backup.yml');
  // Assert the contents of the new env file and its backup.
  const backupEslint = readFileSync(resolve(cwd, '.eslintrc-backup.yml')).toString();
  const newEslint = readFileSync(resolve(cwd, '.eslintrc.yml')).toString();
  assert.equal(backupEslint, prevEslint);
  assert.equal(newEslint, boilerplates.eslint);
}

// Remove old backup files.
execSync('rm calliope.config-backup.js .env-sample-backup .eslintrc-backup.yml', { cwd, stdio });

// Assert init with --force.
execSync(`${ initCmd } --force`, { cwd, stdio });
assertFileExists('calliope.config-backup.js');
assertFileExists('.env-sample-backup');
assertFileExists('.eslintrc-backup.yml');

// All assertions appear to have passed, so delete the testing directory.
rmdirSync(cwd, { recursive: true });

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
