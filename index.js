const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./libs/files');
const inquirer = require('./libs/inquirer');


clear();

console.log(
  chalk.yellow(
    figlet.textSync('NgFastAPP', { horizontalLayout: 'full' })
  )
);

if (files.directoryExists('angular.json')) {
    console.log(chalk.red('Already a Angular project!'));
    process.exit();
  }

  const run = async () => {
    const credentials = await inquirer.askGithubCredentials();
    console.log(credentials);
  };
  
  run();