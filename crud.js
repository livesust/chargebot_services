import nodePlop from 'node-plop';
import fs from "fs";
import { glob } from "glob";
import yml from 'js-yaml';
import { snakeCase } from "snake-case";

// load an instance of plop from a plopfile
const plop = await nodePlop(`./plopfile.js`);

// get a generator by name
const crud = plop.getGenerator('crud');
const serviceGenerator = plop.getGenerator('service');

const generateService = async (filePath) => {
    console.log('\nGenerating service: ', filePath);

    try {
        let answers;
        if (!fs.existsSync(filePath)){
            // run all the generator actions using the data specified
            answers = await serviceGenerator.runPrompts()
        } else {
            // run all the generator actions using the data specified
            const config = fs.readFileSync(filePath, 'utf-8');
            answers = yml.load(config);
        }
        const result = await serviceGenerator.runActions(answers);
        if (result.failures?.length > 0) {
            console.log('ERROR', result);
        }        
    } catch (err) {
        console.log(err);
    }
}

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
        if (result.failures?.length > 0) {
            console.log('ERROR', result);
        }        
    } catch (err) {
        console.log(err);
    }
}

const generateAll = async () => {
    console.log('\nGenerate ALL entities');

    const files = glob.sync('.entities/*.yml');
    for (const file of files) {
        console.log('\nGenerating:', file);
        await generateEntity(file);
    }
}

const generateAllServices = async () => {
    console.log('\nGenerate ALL services');

    const files = glob.sync('.entities/*.yml');
    for (const file of files) {
        console.log('\nGenerating:', file);
        await generateService(file);
    }
}

const entity = process.env.npm_config_entity;
const service = process.env.npm_config_service;
const all = process.env.npm_config_all;
const allServices = process.env.npm_config_allservices;

console.log('Running CRUD generator', entity, service, all, allServices);

if (all) {
  await generateAll();
} else if (allServices) {
  await generateAllServices();
} else if (entity) {
  const file = '.entities/' + snakeCase(entity) + '.yml';
  await generateEntity(file);
} else if (service) {
  const file = '.entities/' + snakeCase(service) + '.yml';
  await generateService(file);
}


