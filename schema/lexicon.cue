package schema

// Schema for 
// derived from https://atproto.com/specs/lexicon

// Schema for an ATProto Lexicon
#Lexicon: {

  // Lexicon language version. In this version, a fixed value of '1'
  lexicon: 1

  // the NSID of the Lexicon
  id: string

  //  indicates the version of this Lexicon, if changes have occurred
  revision: string

  // short overview of the Lexicon, usually one or two sentences
  description: string

  // set of definitions, each with a distinct name (key)
  defs: [string]: #Def
  
}

#Def: #Record | #Query | #Procedure | #Subscription

_#Base: {
  // fixed value for each type
  type:        string

  // short, usually only a sentence or two
  description: string
}

//
// Primary
//

// describes an object that can be stored in a repository record
#Record: {
  _#Base
  type: "record"
  key: string
  record: #Object
}

// describes an XRPC Query (HTTP GET)
#Query: {
  _#Base
  type: "query"

  // schema definition describing the HTTP query parameters for this endpoint
  parameters?: #Params

  // describes the HTTP response body
  output?: {

    // MIME type for the body contents
    encoding: string

    // short description
    description?: string

    // schema definition used to describe JSON encoded response
    schema?: #Object | #Ref | #Union
  }

  errors?: [...{
    // short name for the error type, with no whitespace
    name: string
    // short description, one or two sentences
    description?: string
  }]
}

// describes an XRPC Procedure (HTTP POST)
#Procedure: {
  _#Base
  type: "procedure"

  // schema definition describing the HTTP query parameters for this endpoint
  parameters?: #Params

  // describes HTTP request body schema
  input?: {
    // MIME type for the body contents
    encoding: string

    // short description
    description?: string

    // schema definition used to describe JSON encoded response
    schema?: #Object | #Ref | #Union
  }

  // describes the HTTP response body
  output?: {
    // MIME type for the body contents
    encoding: string

    // short description
    description?: string

    // schema definition used to describe JSON encoded response
    schema?: #Object | #Ref | #Union
  }

  errors?: [...{
    // short name for the error type, with no whitespace
    name: string
    // short description, one or two sentences
    description?: string
  }]
}

// Event Stream (WebSocket)
#Subscription: {
  _#Base
  type: "subscription"

  // schema definition describing the HTTP query parameters for this endpoint
  parameters?: #Params

  // specifies what messages can be
  messages: {
    // short description, one or two sentences
    description?: string

    // schema definition, must be union of refs
    schema: #Union
  }

  errors?: [...{
    // short name for the error type, with no whitespace
    name: string
    // short description, one or two sentences
    description?: string
  }]
}

//
// Meta
//

// Refs are a mechanism for re-using a schema definition in multiple places.
#Ref: {
  _#Base
  type: "ref"

  // reference to another schema definition
  ref: string
}

// Unions represent that multiple possible types could be present at this location in the schema.
#Union: {
  _#Base
  type: "union"

  // references to schema definitions
  refs: [...string]

  closed?: bool | *false
}

// Tokens are empty data values which exist only to be referenced by name. They are used to define a set of values with specific meanings. The description field should clarify the meaning of the token.
#Token: {
  _#Base
  type: "token"
}

// Indicates than any data object could appear at this location, with no specific validation.
#Unknown: {
  _#Base
  type: "unknown"
}

//
// Containers
//

#Array: {
  _#BaseField
  type: "array"

  // describes the schema elements of this array
  items: {...}

  // minimum count of elements in array
  minLength?: int

  // maximum count of elements in array
  maxLength?: int
}

#Object: {
  _#BaseField
  type: "object"

  // defines the properties (fields) by name, each with their own schema
  properties: [string]: {...}

  // indicates which properties are required
  required?: [...string]

  // indicates which properties can have null as a value
  nullable?: [...string]
}

#Params: {
  _#BaseField
  type: "params"

  // defines the properties (fields) by name, each with their own schema
  properties: [string]: #Boolean | #Integer | #String | #Array | #Unknown

  // indicates which properties are required
  required?: [...string]

  // indicates which properties can have null as a value
  nullable?: [...string]
}

//
// Fields
//

#Field:
  #Null |
  #CIDLink |
  #Boolean |
  #Integer |
  #Bytes   |
  #String  |
  #Blob

_#BaseField: {
}

#Null: {
  _#BaseField
  type: "null"
}

#CIDLink: {
  _#BaseField
  type: "cid-link"
}

#Boolean: {
  _#BaseField
  type:     "boolean"

  // a default value for this field
  default?: bool

  // a fixed (constant) value for this field
  const?: bool
}

#Integer: {
  _#BaseField
  type:     "integer"

  // minimum acceptable value
  minimum?: int

  // maximum acceptable value
  maximum?: int

  // a closed set of allowed values
  enum?: [...int]

  // a default value for this field
  default?: int

  // a fixed (constant) value for this field
  const?: int
}

#Blob: {
  _#BaseField
  type: "blob"

  // list of acceptable MIME types. Each may end in * as a glob pattern (eg, image/*). Use */* to indicate that any MIME type is accepted.
  accept?: [...string]

  // maximum size in bytes
  maxSize?: int
}

#Bytes: {
  _#BaseField
  type: "bytes"

  // minimum size of value, as raw bytes with no encoding
  minLength?: int

  // maximum size of value, as raw bytes with no encoding
  maxLength?: int
}

#String: {
  _#BaseField
  type: "string"

  // string format restriction
  format?: string

  // minimum length of value, in UTF-8 bytes
  minLength?: int

  // maximum length of value, in UTF-8 bytes
  maxLength?: int

  // minimum length of value, counted as Unicode Grapheme Clusters
  minGraphemes?: int

  // maximum length of value, counted as Unicode Grapheme Clusters
  maxGraphemes?: int

  // a set of suggested or common values for this field. Values are not limited to this set (aka, not a closed enum)
  knownValues?: [...string]

  // a closed set of allowed values
  enum?: [...string]

  // a default value for this field
  default?: string

  // a fixed (constant) value for this field
  const?: string
}

//
// String Formats
//

#AtID: #String & { format: "at-identifier" }
#AtURI: #String & { format: "at-uri" }
#CID: #String & { format: "cid" }
#DateTime: #String & { format: "datetime" }
#DID: #String & { format: "did" }
#Handle: #String & { format: "handle" }
#NSID: #String & { format: "nsid" }
#TID: #String & { format: "tid" }
#RecordKey: #String & { format: "record-key" }
#URI: #String & { format: "uri" }
#Lang: #String & { format: "language" }
