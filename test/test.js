'use strict';

const expect = require('chai').expect;
const path = require('path');

const Sorter = require('../src/sorter');
const testLines = require('../test-data/testline');

describe('Sort', function () {
  const sorter = new Sorter();

  it('Convert single line double quotes', function () {
    const result = sorter.sort(testLines['single-line-double-quotes']);
    expect(result).to.equal(testLines['single-line-double-quotes-result']);
  });

  it('Convert single line single quotes', function () {
    const result = sorter.sort(testLines['single-line-single-quotes']);
    expect(result).to.equal(testLines['single-line-single-quotes-result']);
  });

  it('No unnecessary spaces', function () {
    const result = sorter.sort(testLines['single-line-double-quotes-with-spaces']);
    expect(result).to.equal(testLines['single-line-double-quotes-result']);
  });

  it('Convert multi line single quotes', function () {
    const result = sorter.sort(testLines['multi-line-single-quotes']);
    expect(result).to.equal(testLines['single-line-single-quotes-result']);
  });

  it('Convert multi line double quotes', function () {
    const result = sorter.sort(testLines['multi-line-double-quotes']);
    expect(result).to.equal(testLines['single-line-double-quotes-result']);
  });

  it('Sort according to sort-order', function () {
    sorter.addConfiguration('sort-order', [
          "c-.*",
          "row",
          "column.*",
          "small.*",
          "medium.*",
          "large.*"
        ]
    );
    const classes = testLines['ordered-by-sort-order'];
    console.log(classes);
    const result = sorter.sort(classes);
    expect(result).to.equal(testLines['ordered-by-sort-order-result']);
  });
});

describe('ProcessContent', function () {
  const sorter = new Sorter();

  it('Convert single line double quotes class', function () {
    const result = sorter.processContent(testLines['single-line-double-quotes'], '', true);
    expect(result).to.equal(testLines['single-line-double-quotes-result']);
  });

  it('Convert single line single quotes class', function () {
    const result = sorter.processContent(testLines['single-line-single-quotes'], '', true);
    expect(result).to.equal(testLines['single-line-single-quotes-result']);
  });
});

describe('ProcessArgument', function () {
  const sorter = new Sorter();

  it('Reading a directory', function () {
    const testPath = path.join(__dirname, '../test-data/three_files');
    const result = sorter.processArgument(testPath, true);
    expect(result.length).to.equal(3)
  });

  it('Reading a single file', function () {
    const testPath = path.join(__dirname, '../test-data/test.html');
    const result = sorter.processArgument(testPath, true);
    expect(result.length).to.equal(1)
  });
});

describe('CLI', function () {

  const sorter = new Sorter();

  it('Version', function () {
    const semanticVersionRegEx = /\d*\.\d*\.\d*/g;
    expect(sorter.getVersion().match(semanticVersionRegEx).length).to.equal(1)
  });
});
