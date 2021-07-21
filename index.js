import {convert} from 'unist-util-is'

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 *
 * @typedef {import('unist-util-is').Type} Type
 * @typedef {import('unist-util-is').Props} Props
 * @typedef {import('unist-util-is').TestFunctionAnything} TestFunctionAnything
 */

/**
 * Options for unist util filter
 *
 * @typedef {Object} FilterOptions
 * @property {boolean} [cascade=true] Whether to drop parent nodes if they had children, but all their children were filtered out.
 */

const own = {}.hasOwnProperty

export const filter =
  /**
   * @type {(
   *  (<T extends Node>(node: Node, options: FilterOptions, test: T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>|Array.<T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>>) => T|null) &
   *  (<T extends Node>(node: Node, test: T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>|Array.<T['type']|Partial<T>|import('unist-util-is').TestFunctionPredicate<T>>) => T|null) &
   *  ((node: Node, options: FilterOptions, test?: null|undefined|Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>) => Node|null) &
   *  ((node: Node, test?: null|undefined|Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>) => Node|null)
   * )}
   */
  (
    /**
     * Create a new tree consisting of copies of all nodes that pass test.
     * The tree is walked in preorder (NLR), visiting the node itself, then its head, etc.
     *
     * @param {Node} tree Tree to filter
     * @param {FilterOptions} options
     * @param {null|undefined|Type|Props|TestFunctionAnything|Array<Type|Props|TestFunctionAnything>} test is-compatible test (such as a type)
     * @returns {Node|null}
     */
    function (tree, options, test) {
      const is = convert(test || options)
      const cascade =
        options.cascade === undefined || options.cascade === null
          ? true
          : options.cascade

      return preorder(tree)

      /**
       * @param {Node} node
       * @param {number|undefined} [index]
       * @param {Parent|undefined} [parent]
       * @returns {Node|null}
       */
      function preorder(node, index, parent) {
        /** @type {Array.<Node>} */
        const children = []
        /** @type {number} */
        let childIndex
        /** @type {Node} */
        let result
        /** @type {string} */
        let key

        if (!is(node, index, parent)) return null

        // @ts-expect-error: Looks like a parent.
        if (node.children) {
          childIndex = -1

          // @ts-ignore Looks like a parent.
          while (++childIndex < node.children.length) {
            // @ts-ignore Looks like a parent.
            result = preorder(node.children[childIndex], childIndex, node)

            if (result) {
              children.push(result)
            }
          }

          // @ts-ignore Looks like a parent.
          if (cascade && node.children.length > 0 && children.length === 0)
            return null
        }

        // Create a shallow clone, using the new children.
        /** @type {typeof node} */
        // @ts-ignore all the fields will be copied over.
        const next = {}

        for (key in node) {
          /* istanbul ignore else - Prototype injection. */
          if (own.call(node, key)) {
            next[key] = key === 'children' ? children : node[key]
          }
        }

        return next
      }
    }
  )
