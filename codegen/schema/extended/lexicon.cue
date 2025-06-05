package schema

#Regexp: #String & {
  format: "regexp"
  // the regular expression pattern
  pattern!: string
}

#Lexicon: {
  $flexicon: {
    // semver for the lexicon
    semver: string
    history: bool // whether this lexicon's records support history
  }

  if $flexicon.history == true {
    // the lexicon supports history, so we can use the $history field in records
    defs: main: {
      properties: {
        $history: {
          primary: #Ref
          entries: [...#StrongRef] // old and new here? hashes (cid already encodes hash chain?)
        }
      }
    }
  }
}

#Record: {
  
  record: properties: {
    createdAt: #DateTime
    updatedAt: #DateTime

    // this relies on using copy-on-write to a new record and recording those copies in the the history
    // ATproto does not keep prior versions like git, which is how we can support deletions and content removal
    $history?: {
      primary: #Ref
      entries: [...#StrongRef] // old and new here? hashes (cid already encodes hash chain?)
    }

    $flexicon: #Object & {
      properties: {
        // semver for the lexicon this record was written at
        lver: #String

        // record version
        rver: #String
      }
    }
  }

}

// describes an XRPC Procedure (HTTP POST)
#Procedure: {
  // flexicon extensions
  $flexicon: {
    // not the http method, but the type of procedure, useful for code gen
    method?: "post" | "put" | "patch" | "delete"
  }
}