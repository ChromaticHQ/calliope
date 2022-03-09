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
assert.ok(execSync(initCmd, { cwd, stdio }));
assert.ok(
  existsSync(resolve(cwd, 'calliope.config.js')),
  `Expected calliope.config.js to exist in ${ cwd }.`,
);
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
  assert.ok(execSync(initCmd, { cwd, stdio }));
}
catch (error) {
  // Assert that the exit code matches the number of errors expected.
  assert.equal(error.status, maxErrors);
  assert.match(
    error.message, /No package.json file was found/,
    'Expected an error message for non-existent package.json file.'
  );
  assert.match(
    error.message, /Your project already has a calliope.config.js file/,
    'Expected an error message for existing calliope.config.js file.'
  );
  assert.match(
    error.message, /Your project already has a .env-sample file/,
    'Expected an error message for existing .env-sample file.'
  );
  assert.match(
    error.message, /Your project already has a .eslintrc.yml file/,
    'Expected an error message for existing .eslintrc.yml file.'
  );
}

// Create new manifest file.
execSync('yarn init -y', { cwd, stdio });

// Assert errors when manifest exists.
try {
  execSync(initCmd, { cwd, stdio });
}
catch (error) {
  assert.equal(error.status, maxErrors - 1);
  assert.match(
    error.message, /Your project already has a calliope.config.js file/,
    'Expected an error message for existing calliope.config.js file.'
  );
  assert.match(
    error.message, /Your project already has a .env-sample file/,
    'Expected an error message for existing .env-sample file.'
  );
  assert.match(
    error.message, /Your project already has a .eslintrc.yml file/,
    'Expected an error message for existing .eslintrc.yml file.'
  );
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
  assert.match(
    error.message, /Your project already has a .env-sample file/,
    'Expected an error message for existing .env-sample file.'
  );
  assert.match(
    error.message, /Your project already has a .eslintrc.yml file/,
    'Expected an error message for existing .eslintrc.yml file.'
  );
  assert.ok(
    existsSync(resolve(cwd, 'calliope.config-backup.js')),
    `Expected calliope.config-backup.js to exist in ${ cwd }.`,
  );
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
  assert.match(
    error.message, /Your project already has a calliope.config.js file/,
    'Expected an error message for existing calliope.config.js file.'
  );
  assert.match(
    error.message, /Your project already has a .eslintrc.yml file/,
    'Expected an error message for existing .eslintrc.yml file.'
  );
  assert.ok(
    existsSync(resolve(cwd, '.env-sample-backup')),
    `Expected .env-sample-backup to exist in ${ cwd }.`,
  );
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
  assert.match(
    error.message, /Your project already has a calliope.config.js file/,
    'Expected an error message for existing calliope.config.js file.'
  );
  assert.match(
    error.message, /Your project already has a .env-sample file/,
    'Expected an error message for existing .env-sample file.'
  );
  assert.ok(
    existsSync(resolve(cwd, '.eslintrc-backup.yml')),
    `Expected .eslintrc.yml to exist in ${ cwd }.`,
  );
}

// Remove old backup files.
execSync('rm calliope.config-backup.js .env-sample-backup .eslintrc-backup.yml', { cwd, stdio });

// Assert init with --force.
try {
  execSync(`${ initCmd } --force`, { cwd, stdio });
  assert.ok(
    existsSync(resolve(cwd, 'calliope.config-backup.js')),
    `Expected calliope.config-backup.js to exist in ${ cwd }.`,
  );
  assert.ok(
    existsSync(resolve(cwd, '.env-sample-backup')),
    `Expected .env-sample-backup to exist in ${ cwd }.`,
  );
}
catch (error) {
  assert.fail(error.message);
}

// All assertions appear to have passed, so delete the testing directory.
rmdirSync(cwd, { recursive: true });
