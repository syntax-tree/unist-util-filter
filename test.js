/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {filter} from './index.js'
import * as mod from './index.js'

test('filter', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['filter'],
    'should expose the public api'
  )
})

test('should not traverse into children of filtered out nodes', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  /** @type {Record<string, number>} */
  const types = {}

  assert.deepEqual(filter(tree, predicate), u('root', [u('leaf', '2')]))
  assert.deepEqual(types, {root: 1, node: 1, leaf: 1})

  /**
   * @param {Node} node
   */
  function predicate(node) {
    types[node.type] = (types[node.type] || 0) + 1
    return node.type !== 'node'
  }
})

test('should return `null` if root node is filtered out', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  assert.deepEqual(filter(tree, predicate), null)

  function predicate() {
    return false
  }
})

test('should cascade-remove parent nodes', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  assert.deepEqual(filter(tree, notOne), u('root', [u('leaf', '2')]))
  assert.deepEqual(filter(tree, notLeaf), null)

  /**
   * @param {Node} node
   */
  function notOne(node) {
    // @ts-expect-error: fine.
    return node.value !== '1'
  }

  /**
   * @param {Node} node
   */
  function notLeaf(node) {
    return node.type !== 'leaf'
  }
})

test('should not cascade-remove nodes that were empty initially', () => {
  const tree = u('node', [u('node', []), u('node', [u('leaf')])])

  assert.deepEqual(filter(tree, 'node'), u('node', [u('node', [])]))
})

test('should call iterator with `index` and `parent` args', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])
  /** @type {Array<[Node, number|null|undefined, Parent|null|undefined]>} */
  const callLog = []

  assert.deepEqual(
    filter(tree, (a, b, c) => {
      callLog.push([a, b, c])
      return true
    }),
    tree
  )

  assert.deepEqual(callLog, [
    [tree, undefined, undefined],
    [tree.children[0], 0, tree],
    // @ts-expect-error yeah, it exists.
    [tree.children[0].children[0], 0, tree.children[0]],
    [tree.children[1], 1, tree]
  ])
})

test('should support type and node tests', () => {
  const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  assert.deepEqual(filter(tree, 'node'), null)
  assert.deepEqual(
    filter(tree, {cascade: false}, 'node'),
    u('node', [u('node', [])])
  )
  assert.deepEqual(filter(tree, {cascade: false}, 'leaf'), null)
})

test('opts.cascade', () => {
  const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

  assert.deepEqual(
    filter(tree, {cascade: true}, predicate),
    null,
    'opts.cascade = true'
  )

  assert.deepEqual(
    filter(tree, {cascade: false}, predicate),
    u('root', [u('node', [])]),
    'opts.cascade = false'
  )

  /**
   * @param {Node} node
   */
  function predicate(node) {
    return node.type !== 'leaf'
  }
})

test('example from README', () => {
  const tree = u('root', [
    u('leaf', '1'),
    u('node', [u('leaf', '2'), u('node', [u('leaf', '3')])]),
    u('leaf', '4')
  ])

  assert.deepEqual(
    filter(tree, predicate),
    u('root', [u('node', [u('leaf', '2')]), u('leaf', '4')]),
    'example from readme'
  )

  /**
   * @param {Node} node
   */
  function predicate(node) {
    // @ts-expect-error: fine.
    return node.type !== 'leaf' || Number(node.value) % 2 === 0
  }
})
