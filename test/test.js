'use strict';

const expect = require('chai').expect;

const Sorter = require('../src/sorter');
const testLines = require('../test-data/testline');

describe('Sort', function() {
  const sorter = new Sorter();

  it('Convert single line double quotes', function() {
    const result = sorter.sort(testLines['single-line-double-quotes']);
    expect(result).to.equal(testLines['single-line-double-quotes-result']);
  });

  it('Convert single line single quotes', function() {
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
});

describe('ProcessContent', function() {
  const sorter = new Sorter();

  it('Convert single line double quotes class', function() {
    const result = sorter.processContent(testLines['single-line-double-quotes'], '', true);
    expect(result).to.equal(testLines['single-line-double-quotes-result']);
  });

  it('Convert single line single quotes class', function() {
    const result = sorter.processContent(testLines['single-line-single-quotes'], '', true);
    expect(result).to.equal(testLines['single-line-single-quotes-result']);
  });
});