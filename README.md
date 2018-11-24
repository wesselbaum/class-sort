class-sort
=========
[![Build Status](https://travis-ci.com/wesselbaum/class-sort.svg?branch=master)](https://travis-ci.com/wesselbaum/class-sort)

This project is meant to sort class attributes in a html file for better readability.
 
In current version no files will be overwritten, but a file with extension '_sorted.html' will be put next to the original one. In next versions this will be changed, when I can confirm the functionality the way this tool is meant to deliver.

## Installation

  `npm install -g class-sort`

## Usage

  `class-sort path/to/directory`
  
  `class-sort path/to/file`

## Flags

  `class-sort -v` `class-sort --version` Returns the current Version of class-sort  
  
  `class-sort path/to/directory -t` `class-sort path/to/directory --test` Instead of overwriting the existing files new files with extension _sorted.html will be created.

  `class-sort path/to/directory -q` `class-sort path/to/directory --quiet` Only necessary output will be written.
  
  
  
## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.