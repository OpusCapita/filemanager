let execSync = require('child_process').execSync;

module.exports = (command, verbose = false) => {
  let output = execSync(
    command,
    {
      stdio: verbose ? 'inherit' : 'pipe',
      encoding: 'utf8',
      shell: '/bin/bash'
    }
  );

  return output;
};
