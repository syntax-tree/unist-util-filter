'use strict';

var filter = require('..');

var test = require('tape'),
    u = require('unist-builder'),
    select = require('unist-util-select');


test('example from README', function (t) {
  var ast = u('root', [
    u('leaf', 1),
    u('node', [
      u('leaf', 2),
      u('node', [
        u('leaf', 3)
      ])
    ]),
    u('leaf', 4)
  ]);

  var newAst = filter(ast, function (node) {
    return node.type != 'leaf' || node.value % 2 == 0;
  });

  t.equal(select(ast, 'leaf').length, 4);
  t.deepEqual(newAst, u('root', [
    u('node', [
      u('leaf', 2)
    ]),
    u('leaf', 4)
  ]));
  t.end();
});
