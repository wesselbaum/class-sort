#!/usr/bin/env node
'use strict';

//Internal
const Sorter = require('./sorter');
const Errors = require('./errors');

//External
const argv = require('yargs').argv;

const argumentsRequired = true;
const sorter = new Sorter();

if (argv['v'] || argv['version']) {
  console.log(sorter.getVersion());
  this.argumentsRequired = false;
}

if (argv['verbose']) {
  sorter.changeLogLevel('verbose');
}

if (argv['q'] || argv['quiet']) {
  sorter.changeLogLevel('warning');
}

if (argv['t'] || argv['test']) {
  sorter.addConfiguration('test', true);
}

//Process arguments
if (argv._ && argv._.length > 0) {
  argv._.forEach(function (argument) {
    sorter.processArgument(argument);
  })
} else if (this.argumentsRequired) {
  Errors.errorHandler(Errors.missingAgrumentError(), 1);
}
