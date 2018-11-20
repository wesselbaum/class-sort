'use strict';

const expect = require('chai').expect;

const Sorter = require('../src/sorter');
const testLines = require('../test-data/testline');


describe('Sort', function() {
  const sorter = new Sorter();

  it('Convert single line double quotes class', function() {
    const result = sorter.sort(testLines['single-line-double-quotes']);
    expect(result).to.equal(testLines['single-line-double-quotes-result']);
  });

  it('Convert single line single quotes class', function() {
    const result = sorter.sort(testLines['single-line-single-quotes']);
    expect(result).to.equal(testLines['single-line-single-quotes-result']);
  });
/*
  it('should convert double digits', function() {
    const result = numFormatter(12);
    expect(result).to.equal('12');
  });

  it('should convert triple digits', function() {
    const result = numFormatter(123);
    expect(result).to.equal('123');
  });

  it('should convert 4 digits', function() {
    const result = numFormatter(1234);
    expect(result).to.equal('1,234');
  });

  it('should convert 5 digits', function() {
    const result = numFormatter(12345);
    expect(result).to.equal('12,345');
  });

  it('should convert 6 digits', function() {
    const result = numFormatter(123456);
    expect(result).to.equal('123,456');
  });

  it('should convert 7 digits', function() {
    const result = numFormatter(1234567);
    expect(result).to.equal('1,234,567');
  });

  it('should convert 8 digits', function() {
    const result = numFormatter(12345678);
    expect(result).to.equal('12,345,678');
  });*/
});