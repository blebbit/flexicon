// helper functions for working with the ATProto Agent

import { AtpAgent } from '@atproto/api';


export async function lookupUserInfo(handleOrDID: string) {
  try {
    const url = "https://plc.blebbit.dev/info/" + handleOrDID
    const response = await fetch(url,{
      headers: {
        accept: "application/json"
      }
    })
    if (response.status !== 200) {  
      const text = await response.text()
      // console.log("lookupUserInfo err:", response.status, response.statusText)
      throw new Error("lookupUserInfo err: " + response.status + " " + text)
    }
    const data = await response.json()
    return data
  } catch(err) {
    // console.log("account info lookup err:", err)
    throw err
  }
}

export function publicAgent() {
  return new AtpAgent({
    // service: 'https://bsky.social',
    service: "https://public.api.bsky.app",
  })
}

export async function createAgent(handleOrDID: string) {
  const info = await lookupUserInfo(handleOrDID)
  const agent = new AtpAgent({
    service: info.pds,
  })
  return agent
}

export async function createAuthdAgent(handleOrDID: string, password: string) {
  const info = await lookupUserInfo(handleOrDID)
  const agent = new AtpAgent({
    service: info.pds,
  })
  await agent.login({
    identifier: info.handle,
    password: password,
  })
  return agent
}