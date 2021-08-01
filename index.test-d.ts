import {expectType, expectError} from 'tsd'
import {Node} from 'unist'
import {Root, Heading, Paragraph} from 'mdast'
import {filter} from './index.js'

const root: Root = {type: 'root', children: []}
/* eslint-disable @typescript-eslint/consistent-type-assertions */
const justANode = {type: 'whatever'} as Node
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
  filter(headingOrParagraph, {cascade: false}, () => Math.random() > 0.5)
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
expectType<Node>(filter(justANode))
expectType<null>(filter(justANode, '???'))
expectType<null>(filter(justANode, {cascade: false}, '???'))
expectType<Node | null>(
  filter(justANode, {cascade: false}, () => Math.random() > 0.5)
)
expectType<null>(
  filter(
    justANode,
    {cascade: false},
    (node: Node): node is Heading => node.type === 'heading'
  )
)
