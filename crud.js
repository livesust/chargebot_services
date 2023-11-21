import nodePlop from 'node-plop';
import fs from "fs";
import { glob } from "glob";
import yml from 'js-yaml';
import { snakeCase } from "snake-case";

// load an instance of plop from a plopfile
const plop = await nodePlop(`./plopfile.js`);

// get a generator by name
const crud = plop.getGenerator('crud');

const generateEntity = async (filePath) => {
    console.log('\nGenerating entity: ', filePath);

    try {
        let answers;
        if (!fs.existsSync(filePath)){
            // run all the generator actions using the data specified
            answers = await crud.runPrompts()
        } else {
            // run all the generator actions using the data specified
            const config = fs.readFileSync(filePath, 'utf-8');
            answers = yml.load(config);
        }
        const result = await crud.runActions(answers);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

const generateAll = async () => {
    console.log('\nGenerate ALL entities');

    const files = glob.sync('.entities/*.yml');
    for (const file of files) {
        await generateEntity(file);
    }
}

const entity = process.env.npm_config_entity;
const all = process.env.npm_config_all;

console.log('Running CRUD generator');

if (all) {
    await generateAll();
} else if (entity) {
    const file = '.entities/' + snakeCase(entity) + '.yml';
    await generateEntity(file);
}


