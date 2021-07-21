import {Node} from 'unist'
import {expectType, expectError} from 'tsd'
import {Heading} from 'mdast'
import {filter} from './index.js'

expectError(filter())
expectType<Node | null>(filter({type: 'root'}))
expectType<Node | null>(filter({type: 'root'}, 'root'))
expectType<Node | null>(filter({type: 'root'}, {}, 'root'))
expectError(filter({type: 'root'}, {notAnOption: true}, 'root'))
expectType<Node | null>(filter({type: 'root'}, {cascade: false}, 'root'))
expectType<Heading | null>(filter<Heading>({type: 'root'}, 'heading'))
expectError(filter<Heading>({type: 'root'}, 'notAHeading'))
