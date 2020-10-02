import arg from "arg";
const inquirer = require('inquirer');
const clear = require('clear');
const figlet = require('figlet');
const { exec } = require("child_process");
const chalk = require("chalk");
const ngServe = `ng serve --o`;
const runVsCode = `code .`;

clear();
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({
        '--material': Boolean,
        '--serve': Boolean,
        '--name': String,
        '--port': Number,
        '-m': '--material',
        '-s': '--serve',
        '-n': '--name',
        '-p': '--port'
    },
        {
            argv: rawArgs.slice(2)
        });

    return {
        name: args._[0] || args['--name'],
        material: args['--material'] || false,
        serve: args['--serve'] || false,
        port: args['--port'] || false,
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
        name: options.name || answers.name,
        port: options.port || 4200
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
                    runServe(options.port);
                }
            });
        } else {
            if (options.serve) {
                runServe(options.port);
            }
        }
        exec(runVsCode);

    });

}

async function execCmd(options) {
    return new Promise((resolve, reject) => {
        const process = exec(` ng new ${options.name} --routing --style=scss `, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
        process.stdout.on('data', (data) => {
            console.log(data);
        });
    });
}

async function addMaterialFn(name) {
    return new Promise((resolve, reject) => {
        const process = exec('ng add @angular/material ', (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
        process.stdout.on('data ', (data) => {
            console.log(data);
        });
    }); 
}

function runServe(port) {
    console.log(`Running server ... `);
    exec(`${ngServe} --port=${port}`);
}
