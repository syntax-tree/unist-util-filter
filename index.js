'use strict';

var flatmap = require('flatmap'),
    is = require('unist-util-is');


module.exports = function (ast, opts, predicate) {
  if (arguments.length == 2) {
    predicate = opts;
    opts = {};
  }
  opts.cascade = opts.cascade || opts.cascade === undefined;

  return (function preorder (node, index, parent) {
    if (!is(predicate, node, index, parent)) {
      return null;
    }

    var newNode = Object.keys(node).reduce(function (acc, key) {
      if (key != 'children') {
        acc[key] = node[key];
      }
      return acc;
    }, {});

    if (node.children) {
      newNode.children = flatmap(node.children, function (child, index) {
        return preorder(child, index, node);
      });

      if (opts.cascade && !newNode.children.length && node.children.length) {
        return null;
      }
    }

    return newNode;
  }(ast, null, null));
};
