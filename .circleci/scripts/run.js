let execSync = require('child_process').execSync;

module.exports = (command, { suppressOutput }) => {
  let output = execSync(
    command,
    {
      stdio: 'pipe',
      encoding: 'utf8',
      shell: '/bin/bash'
    }
  );

  if (!suppressOutput) {
    console.log(output);
  }

  return output;
};
