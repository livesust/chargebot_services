import nodePlop from 'node-plop';
import fs from "fs";
import yml from 'js-yaml';
import { snakeCase } from "snake-case";

// load an instance of plop from a plopfile
const plop = await nodePlop(`./plopfile.js`);

// get a generator by name
const crud = plop.getGenerator('crud');

const entity = process.env.npm_config_entity;

const filePath = '.entities/' + snakeCase(entity) + '.yml';

console.log('Running CRUD generator: ', entity);

try {
    let answers;
    if (!fs.existsSync(filePath)){
        // run all the generator actions using the data specified
        answers = await crud.runPrompts()
    } else {
        // run all the generator actions using the data specified
        const config = fs.readFileSync(filePath, 'utf-8');
        answers = yml.load(config);
        console.log('Using existent entity:\n', answers);
    }
    crud.runActions(answers).then((result) => {
        console.log(result);
        console.log('\nFinished')
    });
} catch (err) {
    console.log(err);
}

