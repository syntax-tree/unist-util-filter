'use strict'

var flatmap = require('flatmap')
var is = require('unist-util-is')

module.exports = filter

function filter(tree, opts, test) {
  var cascade

  if (!test) {
    test = opts
    opts = {}
  }

  cascade = opts.cascade
  cascade = cascade === null || cascade === undefined ? true : cascade

  return preorder(tree, null, null)

  function preorder(node, index, parent) {
    var next

    if (!is(test, node, index, parent)) {
      return null
    }

    next = Object.keys(node).reduce(reduce, {})

    if (node.children) {
      next.children = flatmap(node.children, map)

      if (cascade && node.children.length !== 0 && next.children.length === 0) {
        return null
      }
    }

    return next

    function reduce(acc, key) {
      if (key !== 'children') {
        acc[key] = node[key]
      }

      return acc
    }

    function map(child, index) {
      return preorder(child, index, node)
    }
  }
}
