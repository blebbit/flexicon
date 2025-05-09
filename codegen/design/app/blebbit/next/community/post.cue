package blebbit

import "github.com/blebbit/flexicon/codegen/schema"

// Posts on blebbit, which can be long form and doublely shared as a bsky post

post: schema.#Lexicon & {
  id: "\(nsidBase).post"

  defs: {
    main: schema.#Record & {
      key: "tid"
      record: schema.#Object & {
        required: ["community", "bindings"]
        properties: {
          community: schema.#Ref & {
            ref: community.id
            description: "The Blebbit community this ACL applies to"
          }
          bindings: schema.#Array & {
            items: schema.#Ref & {
              ref: rolebinding.id
            }
          }
        }
      }
    }
  }
}