package schema

// this relies on using copy-on-write to a new record and recording those copies in the the history
// ATproto does not keep prior versions like git, which is how we can support deletions and content removal
#Record: {
  
  #entry: {rkey: "rkey", cid: "cid"}
  history?: {
    primary: #entry
    entries: [...#entry] // old and new here? hashes (cid already encodes hash chain?)
  }
}