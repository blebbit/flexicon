// tests the various agent helpr functions

import {describe, expect, test} from '@jest/globals';

import {
  lookupUserInfo,
  createAgent,
} from '../src/agent';

const handle = "blebbit.app"
const did = "did:plc:veavz5io7eocwh7dbrhr2thi"

test('lookupUserInfo by handle', async () => {
  const info = await lookupUserInfo(handle)
  
  expect(info).toBeDefined()
  expect(info.pds).toBeDefined()
  expect(info.handle).toBeDefined()
  expect(info.handle).toBe(handle)
  expect(info.did).toBeDefined()
  expect(info.did).toMatch(/^did:plc:/)
  expect(info.did).toMatch(new RegExp(`^${did}$`))
})

test('lookupUserInfo by did', async () => {
  const info = await lookupUserInfo(did)
  
  expect(info).toBeDefined()
  expect(info.pds).toBeDefined()
  expect(info.handle).toBeDefined()
  expect(info.handle).toBe(handle)
  expect(info.did).toBeDefined()
  expect(info.did).toMatch(/^did:plc:/)
  expect(info.did).toMatch(new RegExp(`^${did}$`))
})

test('lookupUserInfo with unknown handle', async () => {
  expect.assertions(2);

  try {
    await lookupUserInfo("foobar")
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
    expect(e.toString()).toMatch('404 unknown handle');
  }
})

test('create authenticated agent', async () => {
  // load some env vars
  const handle = process.env.BLUESKY_USERNAME
  const password = process.env.BLUESKY_PASSWORD
  expect(handle).toBeDefined()
  expect(password).toBeDefined()

  // create an agent
  const agent = await createAgent(handle, password)
  expect(agent).toBeDefined()

  // use agent to get describeRepo
  const resp = await agent.com.atproto.repo.describeRepo({
    repo: handle
  })
  expect(resp).toBeDefined()
  expect(resp.data).toBeDefined()
  expect(resp.data.handle).toBeDefined()
  expect(resp.data.handle).toMatch(handle)
})