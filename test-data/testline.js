const testLines = {

  "single-line-single-quotes": "class='c d a 3 1 2'",
  "single-line-single-quotes-result": "class='1 2 3 a c d'",

  "single-line-double-quotes": 'class="c d a 3 1 2"',
  "single-line-double-quotes-result": 'class="1 2 3 a c d"',

  "single-line-double-quotes-with-spaces": 'class="   c   d    a   3   1   2  "',

  "multi-line-double-quotes" : "class=\"\n            c\n            d\n            a\n            3\n            1\n            2\n  \"",
  "multi-line-single-quotes" : "class=\'\n            c\n            d\n            a\n            3\n            1\n            2\n  \'",

  "ordered-by-sort-order" : "class=\"row columns column c-item c-item--red c-item__headline--uppercase large-12 large-5 large-offset-3 small-4 medium-6\"",
  "ordered-by-sort-order-result" : "class=\"c-item c-item--red c-item__headline--uppercase column columns large-5 large-12 large-offset-3 medium-6 row small-4\"",
};
//TODO Save lines like errors


module.exports = testLines;
