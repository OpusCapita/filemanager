let execSync = require('child_process').execSync;

module.exports = (command) => {
  let output = execSync(
    command,
    {
      stdio: 'pipe',
      encoding: 'utf8',
      shell: '/bin/bash'
    }
  );

  console.log(output);

  return output;
};
