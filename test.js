/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {filter} from './index.js'

test('filter', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), ['filter'])
  })

  await t.test(
    'should not traverse into children of filtered out nodes',
    function () {
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
    }
  )

  await t.test(
    'should return `undefined` if root node is filtered out',
    function () {
      const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

      assert.deepEqual(filter(tree, predicate), undefined)

      function predicate() {
        return false
      }
    }
  )

  await t.test('should cascade-remove parent nodes', function () {
    const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

    assert.deepEqual(filter(tree, notOne), u('root', [u('leaf', '2')]))
    assert.deepEqual(filter(tree, notLeaf), undefined)

    /**
     * @param {Node} node
     */
    function notOne(node) {
      return 'value' in node ? node.value !== '1' : true
    }

    /**
     * @param {Node} node
     */
    function notLeaf(node) {
      return node.type !== 'leaf'
    }
  })

  await t.test(
    'should not cascade-remove nodes that were empty initially',
    function () {
      const tree = u('node', [u('node', []), u('node', [u('leaf')])])

      assert.deepEqual(filter(tree, 'node'), u('node', [u('node', [])]))
    }
  )

  await t.test(
    'should call iterator with `index` and `parent` args',
    function () {
      const leaf1 = u('leaf', '1')
      const leaf2 = u('leaf', '2')
      const node = u('node', [leaf1])
      const tree = u('root', [node, leaf2])
      /** @type {Array<[Node, number | null | undefined, Parent | null | undefined]>} */
      const callLog = []

      assert.deepEqual(
        filter(tree, function (a, b, c) {
          callLog.push([a, b, c])
          return true
        }),
        tree
      )

      assert.deepEqual(callLog, [
        [tree, undefined, undefined],
        [node, 0, tree],
        [leaf1, 0, node],
        [leaf2, 1, tree]
      ])
    }
  )

  await t.test('should support type and node tests', function () {
    const tree = u('node', [u('node', [u('leaf', '1')]), u('leaf', '2')])

    assert.deepEqual(filter(tree, 'node'), undefined)
    assert.deepEqual(
      filter(tree, {cascade: false}, 'node'),
      u('node', [u('node', [])])
    )
    assert.deepEqual(filter(tree, {cascade: false}, 'leaf'), undefined)
  })

  await t.test('opts.cascade', function () {
    const tree = u('root', [u('node', [u('leaf', '1')]), u('leaf', '2')])

    assert.deepEqual(
      filter(tree, {cascade: true}, predicate),
      undefined,
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

  await t.test('example from README', function () {
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
      if (node.type === 'leaf') {
        assert('value' in node)
        return Number(node.value) % 2 === 0
      }

      return true
    }
  })
})
