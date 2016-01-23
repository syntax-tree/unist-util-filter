'use strict';

var filter = require('..');

var it = require('tape'),
    u = require('unist-builder'),
    select = require('unist-util-select');


it('should not traverse into children of filtered out nodes', function (t) {
  var ast = u('root', [
    u('node', [
      u('leaf', 1)
    ]),
    u('leaf', 2)
  ]);
  var types = {};

  var newAst = filter(ast, function (node) {
    types[node.type] = (types[node.type] || 0) + 1;
    return node.type != 'node';
  });

  t.equal(select(ast, 'leaf').length, 2);
  t.deepEqual(newAst, u('root', [u('leaf', 2)]));
  t.deepEqual(types, {
    root: 1,
    node: 1,
    leaf: 1
  });
  t.end();
});


it('should return `null` if root node is filtered out', function (t) {
  var ast = u('root', [
    u('node', [
      u('leaf', 1)
    ]),
    u('leaf', 2)
  ]);

  t.equal(filter(ast, function () { return false }), null);
  t.end();
});


it('should cascade remove parent nodes', function (t) {
  t.test(function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);
    var children = ast.children;
    var secondLeaf = ast.children[1];

    var newAst = filter(ast, function (node) {
      return node.value != 1;
    });

    t.equal(select(ast, 'leaf').length, 2);
    t.deepEqual(newAst, u('root', [secondLeaf]));
    t.end();
  });

  t.test(function (t) {
    var ast = u('root', [
      u('node', [
        u('leaf', 1)
      ]),
      u('leaf', 2)
    ]);

    var newAst = filter(ast, function (node) {
      return node.type != 'leaf';
    });

    t.equal(select(ast, 'leaf').length, 2);
    t.equal(newAst, null);
    t.end();
  });
});


it('should not cascade-remove nodes that were empty initially', function (t) {
  var ast = u('node', [
    u('node', []),
    u('node', [
      u('leaf')
    ])
  ]);

  ast = filter(ast, 'node');

  t.deepEqual(ast, u('node', [
    u('node', [])
  ]));
  t.end();
});


it('should call iterator with `index` and `parent` args', function (t) {
  var ast = u('root', [
    u('node', [
      u('leaf', 1)
    ]),
    u('leaf', 2)
  ]);
  var $ = function () {
    return select.bind(null, ast).apply(this, arguments)[0];
  };
  var callLog = [];

  var newAst = filter(ast, function () {
    callLog.push([].slice.call(arguments));
    return true;
  });

  t.deepEqual(newAst, ast);
  t.deepEqual(callLog, [
    [$('root'), null, null],
    [$('node'), 0, $('root')],
    [$('node > leaf'), 0, $('node')],
    [$('node + leaf'), 1, $('root')]
  ]);
  t.end();
});


it('should support type and node tests', function (t) {
  var ast = u('node', [
    u('node', [
      u('leaf', 1)
    ]),
    u('leaf', 2)
  ]);

  t.equal(filter(ast, 'node'), null);

  t.deepEqual(filter(ast, { cascade: false }, 'node'), u('node', [
    u('node', [])
  ]));
  t.equal(filter(ast, { cascade: false }, 'leaf'), null);

  t.deepEqual(filter(ast, { cascade: false }, ast), u('node', []));
  t.equal(filter(ast, { cascade: false }, ast.children[0]), null);

  t.end();
});
