package blebbit

import (
  "blebbit.app/lexicon/schema"
)


// The lexicon records defined in here are managed by Blebbit
// and stored in a dedicated account. Any records outside of this
// account will not be rendered or accepted. This is the core to
// how we manage ACL in the application. Only the dedicated account
// can add records and we manage that in the backend service.
// Management by communities of these records happens through the UI.

community: schema.#Lexicon & {
  id: "\(nsidBase).community.profile"
  revision: 1
  description: "Lexicon for communities on Blebbit"

  defs: {
    main: schema.#Record & {
      key: "tid"
      record: schema.#Object & {
        properties: {
          name: schema.#String
          display: schema.#String
          description: schema.#String
          private: schema.#Boolean
        }
      }
    }
  }
}

//
// ACL related
//

_roles: ["owner", "admin", "moderator", "subscriber", "member", "user", "anon"]

// Tokens
for role in _roles {
  (role): schema.#Lexicon & {
    id: "\(nsidBase).community.role.\(role)"
    defs: main: schema.#Token & { description: "Blebbit Community ACL Role representing \(role)"}
  }
}

// should this be a def?
rolebinding: schema.#Lexicon & {
  id: "\(nsidBase).community.rolebinding"
  defs: {
    main: schema.#Record & {
      key: "tid"
      record: schema.#Object & {
        required: ["account", "role"]
        properties: {
          account: schema.#DID
          role: schema.#String & {
            knownValues: [ for role in _roles { "\(nsidBase).community.role.\(role)"}]
          }
        }
      }
    }
  }
}

communityACL: schema.#Lexicon & {
  id: "\(nsidBase).community.acl"
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