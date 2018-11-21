const testLines = {

  "single-line-single-quotes": "class='c d a 3 1 2'",
  "single-line-single-quotes-result": "class='1 2 3 a c d'",

  "single-line-double-quotes": 'class="c d a 3 1 2"',
  "single-line-double-quotes-result": 'class="1 2 3 a c d"',

  "single-line-double-quotes-with-spaces": 'class="   c   d    a   3   1   2  "',

  "multi-line-double-quotes" : "class=\"\n            c\n            d\n            a\n            3\n            1\n            2\n  \"",
  "multi-line-single-quotes" : "class=\'\n            c\n            d\n            a\n            3\n            1\n            2\n  \'",
};
//TODO Save lines like errors


module.exports = testLines;
