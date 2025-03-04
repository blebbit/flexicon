package hack

import "blebbit.app/flexicon/schema"

// Posts on blebbit, which can be long form and doublely shared as a bsky post

schema.#Lexicon

lexicon: 1
id: "app.blebbit.community.post"

defs: {
  main: schema.#Record & {
    key: "tid"
    record: schema.#Object & {
      required: ["community"]
      properties: {
        community: schema.#Ref & {
          ref: "app.blebbit.community.profile#foo3"
          description: "The Blebbit community this ACL applies to"
        }
      }
    }
  }
  foo: schema.#Token & {
    description: "foo token"
  }
}