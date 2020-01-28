#!/usr/bin/env node

const fs = require('fs');

const Ajv = require('ajv');
const yaml = require('js-yaml');

const ajv = new Ajv({ allErrors: true });

const schema = JSON.parse(fs.readFileSync(process.argv[3]));
const data = yaml.safeLoad(fs.readFileSync(process.argv[2]));

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) console.log(validate.errors);
