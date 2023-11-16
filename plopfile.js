import recursive from 'inquirer-recursive';
import fs from "fs";
import helpers from "handlebars-helpers";

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

    // import handlebars helpers
    for (const prop in helpers) {
        // if it is not an already included "case" helper, than add the helper to plop
        if (!prop.toLowerCase().includes("case")) {
            plop.setHelper(prop, helpers[prop]);
        }
    }

    // overwrite "raw" helper afterwards, because it's not able to
    // avoid escaping of {{{{raw}}}} block content otherwise
    plop.setHelper("raw", (options) => {
        return options.fn(undefined);
    });

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
                        choices: ['text', 'varchar(10)', 'varchar(50)', 'varchar(100)', 'varchar(255)', 'timestamp', 'timestamptz', 'boolean', 'integer', 'bigint', 'float', 'decimal', 'json'],
                        default: 'text'
                    },
                    {
                        type: 'list',
                        name: 'tsType',
                        message: 'Typescript type:',
                        choices: ['string', 'number', 'Date', 'boolean'],
                        default: 'string'
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
                path: 'services/migrations/0000000000001_create_{{pascalCase name}}_table.mjs',
                templateFile: '.plop_templates/services/create_table.mjs.hbs',
                force: true
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
                type: 'addMany',
                destination: 'packages/functions/src/{{snakeCase name}}',
                base: `.plop_templates/functions/`,
                templateFiles: '.plop_templates/functions/*',
                force: true
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
              const importPattern = plop.renderString('^((?!import \\{ {{pascalCase name}}Table \\} from \\"\\.\/{{snakeCase name}}\\";).)*$', answers);
              const importRegex = new RegExp(importPattern);
              
              const entityPattern = plop.renderString('^((?!  {{snakeCase name}}: {{pascalCase name}}Table,\n).)*$', answers);
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
            function modifyRoutes(answers) {
              // move the current working directory to the plop file path
              // this allows this action to work even when the generator is
              // executed from inside a subdirectory
              process.chdir(plop.getPlopfilePath());
      
              const filePath = plop.getDestBasePath() + "/stacks/routes.ts";
            
              const routeString = 'const {{snakeCase name}} = {\n"GET /{{snakeCase name}}": "packages/functions/src/{{snakeCase name}}/list.main",\n"GET /{{snakeCase name}}/{id}": "packages/functions/src/{{snakeCase name}}/get.main",\n"POST /{{snakeCase name}}": "packages/functions/src/{{snakeCase name}}/create.main",\n"POST /{{snakeCase name}}/search": "packages/functions/src/{{snakeCase name}}/find.main",\n"PATCH /{{snakeCase name}}/{id}": "packages/functions/src/{{snakeCase name}}/update.main",\n"DELETE /{{snakeCase name}}/{id}": "packages/functions/src/{{snakeCase name}}/remove.main",\n}$1';
              const routesDefinitionTemplate = plop.renderString(routeString, answers);
              const routeImportTemplate = plop.renderString('    ...{{snakeCase name}},\n$1', answers);

              // The regex are to match that entry must NOT exists
              const routesDefinitionPattern = plop.renderString('^((?!\\/\\/ {{pascalCase name}} routes -do not modify this plop comment-).)*$', answers);
              const routesDefinitionRegex = new RegExp(routesDefinitionPattern);
              
              const routeImportPattern = plop.renderString('^((?!\\.\\.\\.{{snakeCase name}},).)*$', answers);
              const routeImportRegex = new RegExp(routeImportPattern);

              try {
                let contents = fs.readFileSync(filePath, 'utf-8');

                // check any line on the file match regex, in that case it does not exist and we add it
                const definitionMatch = contents.split("\n").every(line => routesDefinitionRegex.test(line));
                if (definitionMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP ROUTE DEFINITION)/g, routesDefinitionTemplate);
                }

                const importMatch = contents.split("\n").every(line => routeImportRegex.test(line));
                if (importMatch) {
                    contents = contents.replace(/(\/\/ DO NOT REMOVE THIS LINE: PLOP ROUTE IMPORT)/g, routeImportTemplate);
                }

                // if file content was modified, write the file
                if (definitionMatch || importMatch) {
                    fs.writeFileSync(filePath, contents);
                }
              } catch (err) {
                console.log(err);
              }
            },
            function dumpEntityDefinition(answers) {
              // move the current working directory to the plop file path
              // this allows this action to work even when the generator is
              // executed from inside a subdirectory
              process.chdir(plop.getPlopfilePath());
      
              // custom function can be synchronous or async (by returning a promise)
              const dirPath = plop.getDestBasePath() + "/.entities";
              const filePath = plop.renderString(dirPath + "/{{snakeCase name}}.json", answers);
              
              try {
                if (!fs.existsSync(dirPath)){
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, JSON.stringify(answers, null, 2), { encoding: 'utf8', flag: 'w' })
              } catch (err) {
                console.log(err);
              }
            },
        ],
    });

    // Helpers
    plop.setHelper('timestamp', function (text) {
        return Date.now();
    });
}
