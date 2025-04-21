// test suite checks functions rom the util file 
import {describe, expect, test} from '@jest/globals';

import { splitAtURI } from '../src/util'; 

const atURI = "at://did:plc:2jtyqespp2zfodukwvktqwe6/dev.blebbit.test.record/3lnbwewebps2d"

test('split at-uri', () => {
  const { did, collection, rkey} = splitAtURI(atURI)
  expect(did).toBe("did:plc:2jtyqespp2zfodukwvktqwe6")
  expect(collection).toBe("dev.blebbit.test.record")
  expect(rkey).toBe("3lnbwewebps2d")
})