#!/usr/bin/env node

"use strict";

var path = require('path');
var renderer = require('../lib/render');

var exitCode = 0;

process.on("uncaughtException", function(err){
  console.log("\nOops! Something went wrong! :(");
  console.log(err.message);
  console.log(err.stack);

  process.exit(1);
});

var eslintResult = process.env.FLOW_ESLINT_RESULT_JSON;
var eslintResultFile = process.env.FLOW_ESLINT_LOG_PATH;

var project = {
  name: process.env.FLOW_PROJECT_NAME,
  id: process.env.FLOW_PROJECT_ID
}

var event = {
  number: process.env.FLOW_EVENT_NUMBER,
  id: process.env.FLOW_EVENT_ID
}

if (!eslintResult && !eslintResultFile) {
  console.log('WARNING: Eslint result json or result file is required');
  eslintResultFile = path.join(__dirname, '../tests/eslint_result.json');
}

renderer({
  project: project,

  event: event,

  template: path.join(__dirname, '../lib/templates/layout.jade'),

  eslintResult: eslintResult,

  eslintResultFile: eslintResultFile

});

process.exit(exitCode);
