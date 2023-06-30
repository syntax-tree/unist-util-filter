import type {Heading, Paragraph, Root} from 'mdast'
import {expectError, expectType} from 'tsd'
import type {Node} from 'unist'
import {filter} from './index.js'

const root: Root = {type: 'root', children: []}
/* eslint-disable @typescript-eslint/consistent-type-assertions */
const justSomeNode = {type: 'whatever'} as Node
const headingOrParagraph = {
  type: 'paragraph',
  children: []
} as Heading | Paragraph
/* eslint-enable @typescript-eslint/consistent-type-assertions */

expectError(filter())
expectType<Root>(filter(root))
expectType<Root>(filter(root, 'root'))
expectType<Root>(filter(root, {}, 'root'))
expectError(filter(root, {notAnOption: true}, 'root'))
expectType<Root>(filter(root, {cascade: false}, 'root'))
expectType<null>(filter(root, 'heading'))
expectType<null>(filter(root, {cascade: false}, 'notAHeading'))

// Vague types.
expectType<Heading | Paragraph>(filter(headingOrParagraph))
expectType<Paragraph | null>(filter(headingOrParagraph, 'paragraph'))
expectType<null>(filter(headingOrParagraph, 'notAHeading'))
expectType<Heading | null>(
  filter(headingOrParagraph, {cascade: false}, 'heading')
)

expectType<Heading | Paragraph | null>(
  filter(headingOrParagraph, {cascade: false}, function () {
    return Math.random() > 0.5
  })
)

expectType<Heading | null>(
  filter(
    headingOrParagraph,
    {cascade: false},
    (node: Node): node is Heading => node.type === 'heading'
  )
)

// Abstract types.
// These don’t work well.
// Use strict nodes types.
expectType<Node>(filter(justSomeNode))
expectType<null>(filter(justSomeNode, '???'))
expectType<null>(filter(justSomeNode, {cascade: false}, '???'))
expectType<Node | null>(
  filter(justSomeNode, {cascade: false}, function () {
    return Math.random() > 0.5
  })
)
expectType<null>(
  filter(
    justSomeNode,
    {cascade: false},
    (node: Node): node is Heading => node.type === 'heading'
  )
)
