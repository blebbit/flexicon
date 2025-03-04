package blebbit


#Defs: {
  defs: {
    markdown: {
      name: string  // title, path
      content: string
      frontmatterContent: string
      frontmatterEncoding: string
      metadata: [string]: string

      // facets? most markdown renderers extract this
      // how would the producer extract them to add as data on this record
      // what would they be used for
    }
  }
}