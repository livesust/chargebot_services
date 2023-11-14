/*
Plop Built-In Helpers:

    camelCase: changeFormatToThis
    snakeCase: change_format_to_this
    dashCase/kebabCase: change-format-to-this
    dotCase: change.format.to.this
    pathCase: change/format/to/this
    properCase/pascalCase: ChangeFormatToThis
    lowerCase: change format to this
    sentenceCase: Change format to this,
    constantCase: CHANGE_FORMAT_TO_THIS
    titleCase: Change Format To This
*/

import recursivePrompt from 'inquirer-recursive';

module.exports = function (plop) {
    plop.setPrompt('recursive', recursivePrompt);

    plop.setGenerator('Serverless API CRUD Generator', {
        description: 'A generator for Serverless API CRUD services',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'entity name',
            },
            {
                type: 'recursive',
                name: 'attributes',
                message: 'Add new attribute?',
                prompts: [
                    {
                        type: 'input',
                        name: 'attribute',
                        message: 'attribute name',
                    },
                    {
                        type: 'list',
                        name: 'type',
                        message: 'attribute type',
                        choices: ['text', 'varchar(10)', 'varchar(50)', 'varchar(100)', 'varchar(255)', 'timestamp', 'timestamptz', 'boolean', 'integer', 'bigint', 'float', 'decimal', 'uuid', 'json']
                    },
                    {
                        type: 'confirm',
                        name: 'unique',
                        message: 'Is it UNIQUE?',
                        default: false
                    },
                    {
                        type: 'confirm',
                        name: 'not_null',
                        message: 'Is it NOT NULL?',
                        default: false,
                        when(answers) {
                            return answers['unique'] === false;
                        },
                    }
                ]
            }
        ],
        actions: [
            {
                type: 'add',
                path: 'services/migrations/{{timestamp}}_create_{{pascalCase name}}_table.mjs',
                templateFile: 'plop-templates/create_table.mjs.hbs',
            },
        ],
    });

    // Helpers
    plop.setHelper('timestamp', function (text) {
        return Date.now();
    });
};
