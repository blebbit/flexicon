import { splitAtURI } from './util'
import { delRecord } from './history'

export async function getCollection({ agent, repo, collection }) {
  const r = await agent.com.atproto.repo.listRecords({
    repo,
    collection,
  })
  return r
}

export async function delCollection({ agent, repo, collection, includeHistory = true }) {
  while (true) {
    const getResp = await getCollection({agent, repo, collection })
    const data = getResp.data
    if (data.records.length === 0) {
      break
    }
    for (const r of data.records) {
      const { rkey } = splitAtURI(r.uri)
      await delRecord({ agent, repo, collection, rkey, includeHistory })
    }
  }
}
