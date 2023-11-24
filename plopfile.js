import recursive from 'inquirer-recursive';
import pluralize from 'handlebars-helper-pluralize';
import fs from "fs";
import { glob } from "glob";
import yml from 'js-yaml';

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

export default function (plop) {
    plop.setPrompt('recursive', recursive);

    plop.setGenerator('crud', {
        description: 'A generator for Serverless API CRUD services',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Entity name:',
                validate: function(value) {
                    if (value) {
                      return true;
                    }
                    return 'Please enter a valid entity name';
                }
            },
            {
                type: 'recursive',
                name: 'attributes',
                message: 'Add new attribute?',
                prompts: [
                    {
                        type: 'input',
                        name: 'attribute',
                        message: 'Attribute name:',
                        validate: function(value) {
                            if (value) {
                              return true;
                            }
                            return 'Please enter a valid attribute name';
                        }
                    },
                    {
                        type: 'list',
                        name: 'type',
                        message: 'Database type:',
                        choices: ['text', 'varchar', 'timestamp', 'timestamptz', 'boolean', 'integer', 'bigint', 'float', 'decimal', 'json'],
                        default: 'text'
                    },
                    {
                        type: 'input',
                        name: 'varchar_length',
                        message: 'Varchar length (1-255):',
                        default: '255',
                        validate: function(value) {
                            if (1 <= value <= 255) {
                              return true;
                            }
                            return 'Please enter a valid length (1-255)';
                        },
                        when(answers) {
                            return answers['type'] === 'varchar';
                        },
                    },
                    {
                        type: 'list',
                        name: 'tsType',
                        message: 'Typescript type:',
                        choices: ['string', 'number', 'Date', 'boolean', 'object'],
                        default: 'string',
                    },
                    {
                        type: 'confirm',
                        name: 'unique',
                        message: 'Only allow unique values on insert/update?',
                        default: false
                    },
                    {
                        type: 'confirm',
                        name: 'not_null',
                        message: 'Is it required?',
                        default: false
                    }
                ]
            },
            {
                type: 'recursive',
                name: 'relationships',
                message: 'Add new relationship? (always from the Many side of a ManyToOne)',
                default: false,
                prompts: [
                    {
                        type: 'input',
                        name: 'entity',
                        message: 'Entity that represents the "One" side:',
                        validate: function(value) {
                            if (value) {
                              return true;
                            }
                            return 'Please enter a valid entity name';
                        }
                    },
                    {
                        type: 'confirm',
                        name: 'not_null',
                        message: 'Is it required?',
                        default: false
                    },
                    {
                        type: 'confirm',
                        name: 'eager',
                        message: 'Eager loading?',
                        default: false
                    }
                ]
            }
        ],
        actions: [
            function dumpEntityDefinition(answers) {
              // first all, save current answers into a yml file in case any of next actions fail
              process.chdir(plop.getPlopfilePath());
      
              // custom function can be synchronous or async (by returning a promise)
              const dirPath = plop.getDestBasePath() + "/.entities";
              const filePath = plop.renderString(dirPath + "/{{snakeCase name}}.yml", answers);
              
              try {
                if (!fs.existsSync(dirPath)){
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, yml.dump(answers), { encoding: 'utf8', flag: 'w' })
              } catch (err) {
                console.log(err);
              }
            },
            {
                type: 'add',
                path: 'services/migrations/{{timestamp}}_create_{{pascalCase name}}_table.mjs',
                templateFile: '.plop_templates/services/create_table.mjs.hbs',
                skip: function(answers) {
                    //skips if file already exists
                    process.chdir(plop.getPlopfilePath());
                    const filePath = plop.getDestBasePath() + "/services/migrations/*_create_{{pascalCase name}}_table.mjs";
                    const migrationFile = plop.renderString(filePath, answers);
                    try {
                        if (glob.sync(migrationFile).length > 0) {
                            return "Migration file already exists. Write a new migration for changes or remove existent file.";
                        }
                    } catch (err) {
                        // skip on error
                        return true;
                    }
                }
            },
            {
                type: 'add',
                path: 'services/migrations/{{timestamp_future 10}}_alter_{{pascalCase name}}_table_fk.mjs',
                templateFile: '.plop_templates/services/alter_table_foreign_key.mjs.hbs',
                skip: function(answers) {
                    if (!answers.relationships || answers.relationships.length === 0) {
                        return "No need to FK migration, no relationships exist."
                    }
                    //skips if file already exists
                    process.chdir(plop.getPlopfilePath());
                    const filePath = plop.getDestBasePath() + "/services/migrations/*_alter_{{pascalCase name}}_table_fk.mjs";
                    const migrationFile = plop.renderString(filePath, answers);
                    try {
                        if (glob.sync(migrationFile).length > 0) {
                            return "Migration file already exists. Write a new migration for changes or remove existent file.";
                        }
                    } catch (err) {
                        // skip on error
                        return true;
                    }
                }
            },
            {
                type: 'add',
                path: 'packages/core/src/database/{{snakeCase name}}.ts',
                templateFile: '.plop_templates/core/entity.ts.hbs',
                force: true
            },
            {
                type: 'add',
                path: 'packages/core/src/services/{{snakeCase name}}.ts',
                templateFile: '.plop_templates/core/service.ts.hbs',
                force: true
            },
            {
                type: 'add',
                path: 'packages/core/test/{{snakeCase name}}.test.ts',
                templateFile: '.plop_templates/core/test.ts.hbs',
                force: true
            },
            {
                type: 'add',
                path: 'packages/functions/src/schemas/{{snakeCase name}}.schema.ts',
                templateFile: '.plop_templates/functions/schema.ts.hbs',
                force: true
            },
            function modifySchemasIndex(answers) {
              // move the current working directory to the plop file path
              // this allows this action to work even when the generator is
              // executed from inside a subdirectory
              process.chdir(plop.getPlopfilePath());
      
              const filePath = plop.getDestBasePath() + "/packages/functions/src/schemas/index.ts";

              const importTemplate = plop.renderString('import * as {{pascalCase name}} from "./{{snakeCase name}}.schema";\n$1', answers);
              const entityTemplate = plop.renderString('    if ("{{snakeCase name}}" === entity_name) { schema = {{pascalCase name}}; }\n$1', answers);

              // The regex are to match that entry must NOT exists
              const importPattern = plop.renderString('^((?!import \\* as {{pascalCase name}} from \\"\\.\\/{{snakeCase name}}\\.schema\\";).)*$', answers);
              const importRegex = new RegExp(importPattern);
              
              const ifBlockPattern = plop.renderString('^((?!if \\(\\"{{snakeCase name}}\\" === entity_name\\) \\{).)*$', answers);
              const ifBlockRegex = new RegExp(ifBlockPattern);

              try {
                let contents = fs.readFileSync(filePath, 'utf-8');

                // check any line on the file match regex, in that case it does not exist and we add it
                const importMatch = contents.split("\n").every(line => importRegex.test(line));
                if (importMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP SCHEMA IMPORT)/g, importTemplate);
                }

                const ifBlockMatch = contents.split("\n").every(line => ifBlockRegex.test(line));
                if (ifBlockMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP SCHEMA IF)/g, entityTemplate);
                }

                // if file content was modified, write the file
                if (importMatch || ifBlockMatch) {
                    fs.writeFileSync(filePath, contents);
                }
              } catch (err) {
                console.log(err);
              }
            },
            function modifyServicesIndex(answers) {
              // move the current working directory to the plop file path
              // this allows this action to work even when the generator is
              // executed from inside a subdirectory
              process.chdir(plop.getPlopfilePath());
      
              const filePath = plop.getDestBasePath() + "/packages/core/src/services/index.ts";

              const importTemplate = plop.renderString('import { {{pascalCase name}} } from "./{{snakeCase name}}";\n$1', answers);
              const entityTemplate = plop.renderString('    if ("{{snakeCase name}}" === entity_name) { service = {{pascalCase name}}; }\n$1', answers);

              // The regex are to match that entry must NOT exists
              const importPattern = plop.renderString('^((?!import \\{ {{pascalCase name}} \\} from \\"\\.\\/{{snakeCase name}}\\";).)*$', answers);
              const importRegex = new RegExp(importPattern);
              
              const ifBlockPattern = plop.renderString('^((?!if \\(\\"{{snakeCase name}}\\" === entity_name\\) \\{).)*$', answers);
              const ifBlockRegex = new RegExp(ifBlockPattern);

              try {
                let contents = fs.readFileSync(filePath, 'utf-8');

                // check any line on the file match regex, in that case it does not exist and we add it
                const importMatch = contents.split("\n").every(line => importRegex.test(line));
                if (importMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP SERVICE IMPORT)/g, importTemplate);
                }

                const ifBlockMatch = contents.split("\n").every(line => ifBlockRegex.test(line));
                if (ifBlockMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP SERVICE IF)/g, entityTemplate);
                }

                // if file content was modified, write the file
                if (importMatch || ifBlockMatch) {
                    fs.writeFileSync(filePath, contents);
                }
              } catch (err) {
                console.log(err);
              }
            },
            function modifyDatabaseIndex(answers) {
              // move the current working directory to the plop file path
              // this allows this action to work even when the generator is
              // executed from inside a subdirectory
              process.chdir(plop.getPlopfilePath());
      
              const filePath = plop.getDestBasePath() + "/packages/core/src/database/index.ts";

              const importTemplate = plop.renderString('import { {{pascalCase name}}Table } from "./{{snakeCase name}}";\n$1', answers);
              const entityTemplate = plop.renderString('  {{snakeCase name}}: {{pascalCase name}}Table,\n$1', answers);

              // The regex are to match that entry must NOT exists
              const importPattern = plop.renderString('^((?!import \\{ {{pascalCase name}}Table \\} from \\"\\.\\/{{snakeCase name}}\\";).)*$', answers);
              const importRegex = new RegExp(importPattern);
              
              const entityPattern = plop.renderString('^((?!{{snakeCase name}}: {{pascalCase name}}Table).)*$', answers);
              const entityRegex = new RegExp(entityPattern);

              try {
                let contents = fs.readFileSync(filePath, 'utf-8');

                // check any line on the file match regex, in that case it does not exist and we add it
                const importMatch = contents.split("\n").every(line => importRegex.test(line));
                if (importMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP ENTITY IMPORT)/g, importTemplate);
                }

                const entityMatch = contents.split("\n").every(line => entityRegex.test(line));
                if (entityMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP ENTITY LIST)/g, entityTemplate);
                }

                // if file content was modified, write the file
                if (importMatch || entityMatch) {
                    fs.writeFileSync(filePath, contents);
                }
              } catch (err) {
                console.log(err);
              }
            },
        ],
    });

    // Helpers
    plop.setHelper('pluralize', pluralize);

    plop.setHelper('timestamp', function () {
        return Date.now();
    });

    plop.setHelper('timestamp_future', function (minutes) {
        return Date.now() + minutes * 60 * 1000;
    });

    plop.setHelper('when', function(attribute, operator, value, options) {
        var operators = {
         'eq': function(l,r) { return l == r; },
         'neq': function(l,r) { return l != r; },
         'gt': function(l,r) { return Number(l) > Number(r); },
         'lt': function(l,r) { return Number(l) < Number(r); },
         'gte': function(l,r) { return Number(l) >= Number(r); },
         'lte': function(l,r) { return Number(l) <= Number(r); },
         'or': function(l,r) { return l || r; },
         'and': function(l,r) { return l && r; },
         '%': function(l,r) { return (l % r) === 0; }
        }
        , result = operators[operator](attribute,value);
      
        if (result) return options.fn(this);
        else return options.inverse(this);
    });

    plop.setHelper('any', function(list, attribute, operator, value, options) {
        var operators = {
         'eq': function(l,r) { return l == r; },
         'neq': function(l,r) { return l != r; },
         'gt': function(l,r) { return Number(l) > Number(r); },
         'lt': function(l,r) { return Number(l) < Number(r); },
         'gte': function(l,r) { return Number(l) >= Number(r); },
         'lte': function(l,r) { return Number(l) <= Number(r); },
         'or': function(l,r) { return l || r; },
         'and': function(l,r) { return l && r; },
         '%': function(l,r) { return (l % r) === 0; }
        };
        var result = false;
        for (var each of list) {
            if (operators[operator](each[attribute], value)) {
                result = true;
                break;
            }
        }
        if (result) return options.fn(this);
        else return options.inverse(this);
    });
}
