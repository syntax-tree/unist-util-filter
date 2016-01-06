'use strict';

var filter = require('..');

var test = require('tape'),
    u = require('unist-builder'),
    select = require('unist-util-select');


test('opts.cascade', function (t) {
  t.test('opts.cascade = true', function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);

    var newAst = filter(ast, { cascade: true }, function (node) {
      return node.type != 'leaf';
    });

    t.equal(select(ast, 'leaf').length, 2);
    t.equal(newAst, null);
    t.end();
  });

  t.test('opts.cascade = false', function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);
    var children = ast.children;
    var innerNode = ast.children[0];
    var grandChildren = ast.children[0].children;

    var newAst = filter(ast, { cascade: false }, function (node) {
      return node.type != 'leaf';
    });

    t.equal(select(ast, 'leaf').length, 2);
    t.deepEqual(newAst, u('root', [
      u('node', [])
    ]));
    t.end();
  });
});
