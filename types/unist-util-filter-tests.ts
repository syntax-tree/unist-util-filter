import * as filter from 'unist-util-filter'
import {Heading} from 'mdast'

filter() // $ExpectError
filter({type: 'root'}) // $ExpectType Node | null
filter({type: 'root'}, 'root') // $ExpectType Node | null
filter({type: 'root'}, {}, 'root') // $ExpectType Node | null
filter({type: 'root'}, {notAnOption: true}, 'root') // $ExpectError
filter({type: 'root'}, {cascade: false}, 'root') // $ExpectType Node | null
filter({type: 'root'}, {cascade: false}, 'root') // $ExpectType Node | null
filter<Heading>({type: 'root'}, 'heading') // $ExpectType Heading | null
filter<Heading>({type: 'root'}, 'notAHeading') // $ExpectError
