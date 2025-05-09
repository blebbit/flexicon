package channel

import (
  "github.com/blebbit/flexicon/codegen/schema"

  "github.com/blebbit/flexicon/codegen/design/app/blebbit"
)

// discussions, question-answer, mod-post only
// pull ideas from Reddit & Github

Channel: schema.#Lexicon & {
  id: "\(blebbit.nsidBase).community.channel"
  description: "represents a channel"

  defs: {
    main: schema.#Record & {
      key: "tid"
      record: schema.#Object & {
        required: ["community", "slug", "name", "private"]
        properties: {
          // what community does this belong to
          community: schema.#Ref & {
            ref: "\(blebbit.nsidBase).community.community"
            description: "The Blebbit community this ACL applies to"
          }

          name: schema.#String
          slug: schema.#String // TODO, make a string refinement to limit to regex
          private: schema.#Boolean

          // profile

          kind:  schema.#String

        }
      }
    }
  }
}