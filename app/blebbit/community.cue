package blebbit

import (
  "strings"

  "blebbit.app/lexicon/schema"
)

// The lexicon records defined in here are managed by Blebbit
// and stored in a dedicated account. Any records outside of this
// account will not be rendered or accepted. This is the core to
// how we manage ACL in the application. Only the dedicated account
// can add records and we manage that in the backend service.
// Management by communities of these records happens through the UI.

Community: schema.#Lexicon & {
  id: "app.blebbit.priv.community"
  revision: 1
  description: "Lexicon for communities on Blebbit"

  defs: {
    main: schema.#Record & {
      key: "tid"
      record: schema.#Object & {
        properties: {
          name: schema.#String
          description: schema.#String
        }
      }
    }
  }
}

//
// ACL related
//

_roles: ["owner", "admin", "mod"]

// Tokens
for role in _roles {
  (strings.ToTitle(role)): schema.#Lexicon & {
    id: Community.id + ".role.\(role)"
    defs: main: schema.#Token & { description: "Blebbit Community ACL Role representing \(role)"}
  }
}

CommunityACL: schema.#Lexicon & {
  id: Community.id + ".acl"
  defs: main: schema.#Record & {
    key: "tid"
    record: schema.#Object & {
      required: ["community", "members"]
      properties: {
        community: schema.#Ref & {
          ref: Community.id
          description: "The Blebbit community this ACL applies to"
        }
        members: schema.#Array & {
          items: schema.#Object & {
            required: ["account", "role"]
            properties: {
              account: schema.#DID
              role: schema.#String & {
                knownValues: [ for role in _roles { Community.id + ".role.\(role)"}]
              }
            }
          }
        }
      }
    }
  }
}