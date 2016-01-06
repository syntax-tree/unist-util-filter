'use strict';

var flatmap = require('flatmap');


module.exports = function (ast, opts, predicate, context) {
  if (typeof opts == 'function') {
    context = predicate;
    predicate = opts;
    opts = {};
  }
  opts.cascade = opts.cascade || opts.cascade === undefined;

  return (function preorder (node, index, parent) {
    if (!predicate.call(context, node, index, parent)) {
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

      if (!newNode.children.length && opts.cascade) {
        return null;
      }
    }

    return newNode;
  }(ast, null, null));
};
