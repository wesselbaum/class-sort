class-sort
=========
[![Build Status](https://travis-ci.com/wesselbaum/class-sort.svg?branch=master)](https://travis-ci.com/wesselbaum/class-sort)

Class-sort is a tool which gives you the power to make sure your html class attribute is always good readable. 

The class attribute will be sorted alphabetically. If you want you also can provide a custom configuration to make the sort order yours.
 
## Installation

  `npm install -g class-sort`

## Usage

  `class-sort path/to/directory`
  
  `class-sort path/to/file`
### Test-case
  `<div class="class1 c-wrapper class2 c-wrapper--modifier class5 c-wrapper--different-modifier class3 class6">` 
### Result
  `<div class="c-wrapper c-wrapper--different-modifier c-wrapper--modifier class1 class2 class3 class5 class6">` 

## Flags

  `class-sort -v` `class-sort --version` Returns the current Version of class-sort  
  
  `class-sort path/to/directory -t` `class-sort path/to/directory --test` Instead of overwriting the existing files new files with extension _sorted.html will be created.

  `class-sort path/to/directory -q` `class-sort path/to/directory --quiet` Only necessary output will be written.
  
## Configuration file

A configuration file can be placed somewhere up the tree named class-sort.json. Following configurations can be done:

*  log-level [String]
   * verbose
   * info
   * warning
   * error
   
*  exclude [String Array] Paths in glob syntax to be excluded
* file-types [String Array] File extensions to be parsed
* sort-order [String Array] Regular Expression for ordering the classes. First occurrence will be matched only.
  
## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.