# unist-util-filter [![Build Status][build-badge]][build-page] [![Coverage Status][coverage-badge]][coverage-page]

Create a new [unist][] tree with all nodes that pass the given test.

## Install

```sh
npm install unist-util-filter
```

## Usage

```js
var filter = require('unist-util-filter');

var tree = {
  type: 'root',
  children: [
    {type: 'leaf', value: '1'},
    {
      type: 'node',
      children: [
        {type: 'leaf', value: '2'},
        {type: 'node', children: [{type: 'leaf', value: '3'}]}
      ]
    },
    {type: 'leaf', value: '4'}
  ]
}

console.log(filter(tree, node => node.type != 'leaf' || node.value % 2 == 0))
```

Yields:

```js
{
  type: 'root',
  children: [
    {type: 'node', children: [{type: 'leaf', value: '2'}]},
    {type: 'leaf', value: '4'}
  ]
}
```

## API

### `filter(tree, [opts], test)`

Creates a copy of `tree` consisting of all nodes that pass `test`.
The tree is filtered in [preorder][].

###### Parameters

*   `tree` ([`Node?`][node])
    — Tree to filter
*   `opts.cascade` (`boolean`, default: `true`)
    — Whether to drop parent nodes if they had children, but all their
    children were filtered out
*   `test`
    — See [`unist-util-is`][is] for details

###### Returns

A new tree ([`Node?`][node]) with nodes for which `test` returned `true`.
`null` is returned if `tree` itself didn’t pass the test, or is cascaded away.

## Contribute

See [`contributing.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][] © Eugene Sharygin

[mit]: license

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[is]: https://github.com/syntax-tree/unist-util-is

[preorder]: https://en.wikipedia.org/wiki/Tree_traversal

[build-page]: https://travis-ci.org/syntax-tree/unist-util-filter

[build-badge]: https://travis-ci.org/syntax-tree/unist-util-filter.svg?branch=master

[coverage-page]: https://codecov.io/github/syntax-tree/unist-util-filter?branch=master

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-filter.svg?branch=master

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md
