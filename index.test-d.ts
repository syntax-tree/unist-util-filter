import type {Heading, Paragraph, Root} from 'mdast'
import {expectError, expectType} from 'tsd'
import type {Node} from 'unist'
import {filter} from 'unist-util-filter'

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
expectType<undefined>(filter(root, 'heading'))
expectType<undefined>(filter(root, {cascade: false}, 'notAHeading'))

// Vague types.
expectType<Heading | Paragraph>(filter(headingOrParagraph))
expectType<Paragraph | undefined>(filter(headingOrParagraph, 'paragraph'))
expectType<undefined>(filter(headingOrParagraph, 'notAHeading'))
expectType<Heading | undefined>(
  filter(headingOrParagraph, {cascade: false}, 'heading')
)

expectType<Heading | Paragraph | undefined>(
  filter(headingOrParagraph, {cascade: false}, function () {
    return Math.random() > 0.5
  })
)

expectType<Heading | undefined>(
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
expectType<undefined>(filter(justSomeNode, '???'))
expectType<undefined>(filter(justSomeNode, {cascade: false}, '???'))
expectType<Node | undefined>(
  filter(justSomeNode, {cascade: false}, function () {
    return Math.random() > 0.5
  })
)
expectType<undefined>(
  filter(
    justSomeNode,
    {cascade: false},
    (node: Node): node is Heading => node.type === 'heading'
  )
)
