'use strict'

var test = require('tape')
var u = require('unist-builder')
var filter = require('.')

test('should not traverse into children of filtered out nodes', function (t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  var types = {}

  t.deepEqual(filter(tree, predicate), u('root', [u('leaf', '2')]))
  t.deepEqual(types, {root: 1, node: 1, leaf: 1})

  t.end()

  function predicate(node) {
    types[node.type] = (types[node.type] || 0) + 1
    return node.type !== 'node'
  }
})

test('should return `null` if root node is filtered out', function (t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  t.deepEqual(filter(tree, predicate), null)

  t.end()

  function predicate() {
    return false
  }
})

test('should cascade-remove parent nodes', function (t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  t.deepEqual(filter(tree, notOne), u('root', [u('leaf', '2')]))
  t.deepEqual(filter(tree, notLeaf), null)

  t.end()

  function notOne(node) {
    return node.value !== '1'
  }

  function notLeaf(node) {
    return node.type !== 'leaf'
  }
})

test('should not cascade-remove nodes that were empty initially', function (t) {
  var tree = u('node', [u('node', []), u('node', [u('leaf')])])

  t.deepEqual(filter(tree, 'node'), u('node', [u('node', [])]))

  t.end()
})

test('should call iterator with `index` and `parent` args', function (t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  var callLog = []

  t.deepEqual(filter(tree, predicate), tree)

  t.deepEqual(callLog, [
    [tree, null, null],
    [tree.children[0], 0, tree],
    [tree.children[0].children[0], 0, tree.children[0]],
    [tree.children[1], 1, tree]
  ])

  t.end()

  function predicate() {
    callLog.push([].slice.call(arguments))
    return true
  }
})

test('should support type and node tests', function (t) {
  var tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  t.deepEqual(filter(tree, 'node'), null)
  t.deepEqual(
    filter(tree, {cascade: false}, 'node'),
    u('node', [u('node', [])])
  )
  t.deepEqual(filter(tree, {cascade: false}, 'leaf'), null)

  t.end()
})

test('opts.cascade', function (t) {
  var tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  t.deepEqual(
    filter(tree, {cascade: true}, predicate),
    null,
    'opts.cascade = true'
  )

  t.deepEqual(
    filter(tree, {cascade: false}, predicate),
    u('root', [u('node', [])]),
    'opts.cascade = false'
  )

  t.end()

  function predicate(node) {
    return node.type !== 'leaf'
  }
})

test('example from README', function (t) {
  var tree = u('root', [
    u('leaf', '1'),
    u('node', [u('leaf', '2'), u('node', [u('leaf', '3')])]),
    u('leaf', '4')
  ])

  t.deepEqual(
    filter(tree, predicate),
    u('root', [u('node', [u('leaf', '2')]), u('leaf', '4')]),
    'example from readme'
  )

  t.end()

  function predicate(node) {
    return node.type !== 'leaf' || Number(node.value) % 2 === 0
  }
})
