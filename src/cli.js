#!/usr/bin/env node
'use strict';

//Internal
const Sorter = require("./sorter");
const Errors = require("./errors");

//External
const argv = require('yargs').argv;

let sorter = new Sorter();

//Process arguments
if(argv._ && argv._.length > 0){
  argv._.forEach(function (argument) {
    sorter.processArgument(argument)
  })
}else{
  Errors.errorHandler(Errors.missingAgrumentError(), 1);
}