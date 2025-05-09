package community

import (
  "github.com/blebbit/flexicon/codegen/schema"

  "github.com/blebbit/flexicon/codegen/design/app/blebbit"
)


// The lexicon records defined in here are managed by Blebbit
// and stored in a dedicated account. Any records outside of this
// account will not be rendered or accepted. This is the core to
// how we manage ACL in the application. Only the dedicated account
// can add records and we manage that in the backend service.
// Management by communities of these records happens through the UI.

Community: schema.#Lexicon & {
  id: "\(blebbit.nsidBase).community.profile"
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