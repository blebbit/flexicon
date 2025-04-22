import { AtpAgent } from '@atproto/api'
import { InputSchema as PutRecordInputSchema } from '@atproto/api/dist/client/types/com/atproto/repo/putRecord'
import { splitAtURI } from './util'

// createRecord is called when we write the first version of a record
export async function createRecord({
  agent,
  repo,
  collection,
  record
}: {
  agent: AtpAgent
  repo: string
  collection: string
  record: any
}): Promise<any> {
  const now = new Date().toISOString()
  if (!record.createdAt) {
    record.createdAt = now
  }
  record.updatedAt = now
  return agent.com.atproto.repo.createRecord({
    repo,
    collection,
    record,
  })
}

export async function getRecord({
  agent,
  repo,
  collection,
  rkey,
  cid,
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  cid?: string
}) {
  const i: any = {
    repo,
    collection,
    rkey,
  }

  if (cid) {
    i.cid = cid
  }
  const r = await agent.com.atproto.repo.getRecord(i)
  return r
}

export async function putRecord({
  agent,
  repo,
  collection,
  rkey,
  swapCommit,
  swapRecord,
  record
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  swapCommit?: string
  swapRecord?: string
  record: any
}) {
  record.updatedAt = new Date().toISOString()
  let i: PutRecordInputSchema = {
    repo,
    collection,
    rkey,
    record,
  }
  if (swapCommit) {
    i.swapCommit = swapCommit
  }
  if (swapRecord) {
    i.swapRecord = swapRecord
  }

  return agent.com.atproto.repo.putRecord(i)
}

export async function delRecord({
  agent,
  repo,
  collection,
  rkey,
  includeHistory = true
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  includeHistory?: boolean
}) {
  // get the latest repo commit
  // const c = await getLatestRepoCommit({ agent, did: repo })
  // const swapCommit = c.data.cid

  // add the current record to the writes
  // var writes: any[] = [{
  //   $type: 'com.atproto.repo.applyWrites#delete',
  //   collection,
  //   rkey,
  // }]

  // get latest record to get at history
  if (includeHistory) {
    const r = await getRecord({ agent, repo, collection, rkey })
    if (r.data.value["$hist"]) {
      for (const h of r.data.value["$hist"] as any[]) {
        const { rkey: hRkey } = splitAtURI(h.uri)
        // TODO, check response and throw if not 200?
        await agent.com.atproto.repo.deleteRecord({
          repo,
          collection,
          rkey: hRkey,
        })
        // writes.push({
        //   $type: 'com.atproto.repo.applyWrites#delete',
        //   collection,
        //   rkey: hRkey,
        // })
      }
    }
  }
  return await agent.com.atproto.repo.deleteRecord({
    repo,
    collection,
    rkey: rkey,
  })

  // delete the main record
  // const i = {
  //   repo,
  //   writes, 
  //   swapCommit,
  // }
  // console.log("applyWrites:", i)
  // try {
  //   const r = await agent.com.atproto.repo.applyWrites(i)
  //   return r
  // }
  // catch (e) {
  //   console.log("delRecord err:", e)
  //   throw e
  // }
}

export async function copyRecord({
  agent,
  repo,
  collection,
  rkey,
  swapCommit,
  swapRecord,
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  swapCommit?: string
  swapRecord?: string
}) {
  const r = await getRecord({ agent, repo, collection, rkey })
  const copy = {
    ...r.data.value,
    // store a strongRef to record copied from
    "$orig": { uri: r.data.uri, cid: r.data.cid }
   }
  const c = await createRecord({ agent, repo, collection, record: copy })
  return [c, r]
}

export async function updateRecord({
  agent,
  repo,
  collection,
  rkey,
  swapCommit,
  swapRecord,
  recordUpdates
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  swapCommit?: string
  swapRecord?: string
  recordUpdates: any
}) {
  // copy record
  const [copyResp, origResp] = await copyRecord({ agent, repo, collection, rkey, swapCommit, swapRecord })
  const copy = copyResp.data
  const orig = origResp.data.value

  // init history
  if (!orig["$hist"]) {
    orig["$hist"] = []
  }
  // add strongRef to record copy
  orig["$hist"].push({uri: copy.uri, cid: copy.cid})

  // copy in updated content
  for (const [key, value] of Object.entries(recordUpdates)) {
    orig[key] = value
  }

  try {
    // replace the record in data repo
    const i = { 
      agent,
      repo, collection, rkey,
      swapCommit,
      swapRecord: swapRecord || origResp?.data?.cid,
      record: orig
    }
    // console.log("i:", i)
    const putResp = await putRecord(i)
    // console.log("putResp:", putResp)
    return putResp
  } catch (e) {
    // what if the copy passes but the put fails?
    // we need to delete the copy
    const { rkey: copyRkey } = splitAtURI(copyResp.data.uri)
    const d = { agent, repo, collection, rkey: copyRkey }
    // console.log("delRecord:", d)
    await delRecord(d)
    throw e
  }

  
}
