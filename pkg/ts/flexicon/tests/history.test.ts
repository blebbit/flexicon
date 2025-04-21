// this test suite checks that records are edited and history is created
import {describe, expect, test} from '@jest/globals';
import AtpAgent from '@atproto/api';

import { createAuthdAgent, lookupUserInfo } from '../src/agent';
import { getCollection, delCollection } from '../src/collection';
import { createRecord, updateRecord, getRecord, delRecord } from '../src/history';
import { splitAtURI } from '../src/util';

const handle = process.env.BLUESKY_USERNAME
const password = process.env.BLUESKY_PASSWORD
const collection = "dev.blebbit.test.record"

let agent: AtpAgent = undefined
let info: any = undefined

beforeAll(async () => {
  await setup()
})

afterAll(async () => {
  // await nukeCollection()
})

test('get describeHandle', async () => {
  // use agent to get describeRepo
  const resp = await agent.com.atproto.repo.describeRepo({
    repo: handle
  })
  expect(resp).toBeDefined()
  expect(resp.data).toBeDefined()
  expect(resp.data.handle).toBeDefined()
  expect(resp.data.handle).toMatch(handle)
})

test('create and delete a record', async () => {
  // create a record
  const record = {
    test: "message",
  }
  const resp = await createRecord({
    agent,
    repo: handle,
    collection,
    record
  })

  expect(resp).toBeDefined()
  expect(resp.data).toBeDefined() 
  expect(resp.data.uri).toBeDefined() 
  expect(resp.data.commit).toBeDefined() 
  expect(resp.data.commit.rev).toBeDefined() 

  const aturi = resp.data.uri
  const parts = splitAtURI(aturi)
  expect(parts.did).toMatch(info.did)
  expect(parts.collection).toMatch(collection)
  expect(parts.rkey).toBeDefined()

  // delete the record
  const delResp = await delRecord({
    agent,
    repo: handle,
    collection,
    rkey: parts.rkey
  })
  expect(delResp).toBeDefined()
})

test('edit a record with history', async () => { 

  // create a record
  const record = {
    text: "test msg 1"
  }
  const r1 = await createRecord({
    agent,
    repo: handle,
    collection,
    record
  })
  checkResp(r1)

  const aturi = r1.data.uri
  const parts = splitAtURI(aturi)
  expect(parts.did).toMatch(info.did)
  expect(parts.collection).toMatch(collection)
  expect(parts.rkey).toBeDefined()

  const rkey = parts.rkey


  const r2 = await updateRecord({ agent, repo: handle, collection, rkey, recordUpdates: {
    text: "test msg 2"
  }})
  checkResp(r2)
  await checkRespValues(r2, {
    text: "test msg 2"
  })
  await checkHist(r2, 1)

  const r3 = await updateRecord({ agent, repo: handle, collection, rkey, recordUpdates: {
    text: "test msg 4"
  }})
  checkResp(r3)
  await checkRespValues(r3, {
    text: "test msg 4"
  })
  await checkHist(r3, 2)
})

test.only('fail to edit a record with history because of cid', async () => { 
  // create a record
  const record = {
    text: "test msg 1"
  }
  const r1 = await createRecord({
    agent,
    repo: handle,
    collection,
    record
  })
  checkResp(r1)

  const cid = r1.data.cid
  const aturi = r1.data.uri
  const parts = splitAtURI(aturi)
  expect(parts.did).toMatch(info.did)
  expect(parts.collection).toMatch(collection)
  expect(parts.rkey).toBeDefined()

  const rkey = parts.rkey


  const r2 = await updateRecord({ agent, repo: handle, collection, rkey, swapRecord: cid, recordUpdates: {
    text: "test msg 2"
  }})
  checkResp(r2)
  await checkRespValues(r2, {
    text: "test msg 2"
  })
  await checkHist(r2, 1)

  // this should fail
  try {
    await updateRecord({ agent, repo: handle, collection, rkey, swapRecord: cid, recordUpdates: {
      text: "test msg 4"
    }})
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
    expect(e.toString()).toMatch(/^Error: Record was at.*/);
  }
})

//
// helper functions
// 
const checkResp = (resp: any) => {
  expect(resp).toBeDefined()
  expect(resp.data).toBeDefined() 
  expect(resp.data.uri).toBeDefined() 
  expect(resp.data.commit).toBeDefined() 
  expect(resp.data.commit.rev).toBeDefined() 
}

const checkRespValues = async (resp: any, values: any) => {
  // check resp at uri
  const aturi = resp.data.uri
  const parts = splitAtURI(aturi)
  expect(parts.did).toMatch(info.did)
  expect(parts.collection).toMatch(collection)
  expect(parts.rkey).toBeDefined()

  // get record
  const rkey = parts.rkey
  const r = await getRecord({
    agent,
    repo: handle,
    collection,
    rkey
  })
  expect(r).toBeDefined()
  expect(r.data).toBeDefined()
  expect(r.data.value).toBeDefined()

  for (const key in values) {
    expect(r.data.value[key]).toBeDefined()
    expect(r.data.value[key]).toEqual(values[key])
  }
}

const checkHist = async (resp: any, hist: number = 0) => {
  // check resp at uri
  const aturi = resp.data.uri
  const parts = splitAtURI(aturi)
  expect(parts.did).toMatch(info.did)
  expect(parts.collection).toMatch(collection)
  expect(parts.rkey).toBeDefined()

  // get record
  const rkey = parts.rkey
  const r = await getRecord({
    agent,
    repo: handle,
    collection,
    rkey
  })
  expect(r).toBeDefined()
  expect(r.data).toBeDefined()
  expect(r.data.value).toBeDefined()

  // check history
  const value = r.data.value
  expect(value["$hist"]).toBeDefined()
  expect(value["$hist"].length).toEqual(hist)

}

async function setup() {
  expect(handle).toBeDefined()
  expect(password).toBeDefined()

  // create an agent
  agent = await createAuthdAgent(handle, password)
  expect(agent).toBeDefined()

  info = await lookupUserInfo(handle)
  expect(info).toBeDefined()

  await nukeCollection()
}

async function nukeCollection() {
  // delete the test collection
  await delCollection({
    agent,
    repo: handle,
    collection,
    includeHistory: true
  })

  // ensure the test collection is empty
  const getResp = await getCollection({
    agent,
    repo: handle,
    collection
  })
  expect(getResp).toBeDefined()
  expect(getResp.data).toBeDefined()
  expect(getResp.data.records).toBeDefined()
  expect(getResp.data.records.length).toEqual(0)

}