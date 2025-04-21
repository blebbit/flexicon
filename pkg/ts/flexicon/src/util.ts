// helpful functions

export function splitAtURI(atURI: string) {
  const parts = atURI.split("/")
  if (parts.length !== 5) {
    throw new Error("Invalid AT URI: " + atURI)
  }
  return {
    did: parts[2],
    collection: parts[3],
    rkey: parts[4],
  }
}

export async function describeRepo({ agent, repo }) {
  const r = await agent.com.atproto.repo.describeRepo({
    repo
  })
  return r
}

export async function getLatestRepoCommit({ agent, did }) {
  const r = await agent.com.atproto.sync.getLatestCommit({
   did 
  })
  return r
}
