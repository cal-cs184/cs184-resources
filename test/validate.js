#!/usr/bin/env node

const fs = require('fs');

const Ajv = require('ajv');
const yaml = require('js-yaml');

const ajv = new Ajv({ allErrors: true });

const schema = JSON.parse(fs.readFileSync(process.argv[3]));
const data = yaml.safeLoad(fs.readFileSync(process.argv[2]));

// Validate schema

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
    console.log(validate.errors);
    process.exit(1);
}

// Validate data-dependencies

let num_bad_topics = 0;

let resource_idx = 0;
for (let resource of data.resources) {
    let topic_idx = 0;
    for (let topic of resource.topics) {
        if (!data.topics[topic]) {
            console.log(`resources[${resource_idx}].topics[${topic_idx}] "${topic}" not defined in topics list`);
            num_bad_topics++;
        }
        topic_idx++;
    }
    resource_idx++;
}

if (num_bad_topics > 0) {
    process.exit(1);
}
