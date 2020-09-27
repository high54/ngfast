import arg from "arg";
const inquirer = require('inquirer');
const clear = require('clear');
const figlet = require('figlet');
const { exec } = require("child_process");
const chalk = require("chalk");
const ngServe = `ng serve --o`;

clear();
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({
        '--material': Boolean,
        '--serve': Boolean,
        '--name': String,
        '-m': '--material',
        '-s': '--serve',
        '-n': '--name'
    },
        {
            argv: rawArgs.slice(2)
        });

    return {
        name: args._[0] || args['--name'],
        material: args['--material'] || false,
        serve: args['--serve'] || false,
    }
}

async function promptForMissingOptions(options) {
    if (options.name) {
        return {
            ...options
        };
    }
    const questions = [];
    if (!options.name) {
        questions.push({
            type: 'input',
            name: 'name',
            message: 'Veuillez saisir le nom du projet'
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        name: options.name || answers.name
    };
}

export async function cli(args) {
    console.log(chalk.yellow(figlet.textSync('NgFast', { horizontalLayout: 'full' })));
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    console.log(`Creating project ... `);
    execCmd(options).then(() => {
        process.chdir('./' + options.name);
        if (options.material) {
            console.log(`Installing Material ... `);
            addMaterialFn(options.name).then((result) => {
                if (options.serve) {
                    console.log(`Running server ... `);
                    exec(ngServe);
                }
            });
        } else {
            if (options.serve) {
                console.log(`Running server ... `);
                exec(ngServe);
            }
        }

    })

}

async function execCmd(options) {
    return new Promise((resolve, reject) => {
        exec(` ng new ${options.name} --routing --style=scss `, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

async function addMaterialFn(name) {
    return new Promise((resolve, reject) => {
        exec('ng add @angular/material ', (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}
