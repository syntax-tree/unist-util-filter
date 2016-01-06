[![npm](https://nodei.co/npm/unist-util-filter.png)](https://npmjs.com/package/unist-util-filter)

# unist-util-filter

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Create a new [Unist] tree with all nodes that pass the test implemented by the provided function.

[unist]: https://github.com/wooorm/unist

[travis]: https://travis-ci.org/eush77/unist-util-filter
[travis-badge]: https://travis-ci.org/eush77/unist-util-filter.svg?branch=master
[david]: https://david-dm.org/eush77/unist-util-filter
[david-badge]: https://david-dm.org/eush77/unist-util-filter.png

## Example

```js
var filter = require('unist-util-filter');

ast
//=> {
//     "type": "root",
//     "children": [
//       {
//         "type": "leaf",
//         "value": "1"
//       },
//       {
//         "type": "node",
//         "children": [
//           {
//             "type": "leaf",
//             "value": "2"
//           },
//           {
//             "type": "node",
//             "children": [
//               {
//                 "type": "leaf",
//                 "value": "3"
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "type": "leaf",
//         "value": "4"
//       }
//     ]
//   }

// Filter out odd-valued nodes.
filter(ast, (node) => node.type != 'leaf' || node.value % 2 == 0)
//=> {
//     "type": "root",
//     "children": [
//       {
//         "type": "node",
//         "children": [
//           {
//             "type": "leaf",
//             "value": "2"
//           }
//         ]
//       },
//       {
//         "type": "leaf",
//         "value": "4"
//       }
//     ]
//   }
```

## API

### `filter(ast, [opts], predicate, [context])`

- `ast` — [Unist] tree.
- `predicate` — Function to test each node. Invoked with arguments `(node, index?, parent?)`. Return `true` to keep the node, `false` otherwise.
- `context` — Optional. Value to use as `this` when executing `predicate`.

Executes `predicate` for each node in preorder tree traversal. Returns a new tree (or `null`) with nodes for which `predicate` returned `true`.

##### `opts.cascade`

Type: `Boolean`<br>
Default: `true`

If `true`, don't keep empty composite nodes.

## Install

```
npm install unist-util-filter
```

## License

MIT
