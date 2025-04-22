# ts/flexicon

TypeScript package for

- ATProto record editing with history based on https://verdverm.com/blog/adding-record-editing-with-history-to-atprotocol
- more to come...
  - versioning
  - lenses


## Usage

```
pnpm install @blebbit/flexicon
```

### __All functions require an authenticated agent to be provided.__

#### createRecord

```ts
export async function createRecord({
  agent,
  repo,
  collection,
  record
}: {
  agent: AtpAgent
  repo: string
  collection: string
  record: any
})
```

Adds `createdAt` and `updatedAt` fields to record for you.

#### updateRecord

```ts
export async function updateRecord({
  agent,
  repo,
  collection,
  rkey,
  swapCommit,
  swapRecord,
  recordUpdates
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  swapCommit?: string
  swapRecord?: string
  recordUpdates: any
})
```

The main helper.

1. Performs a copy-on-write of the current record, adds `$orig` to the copy which points at main record.
2. Performs the update to the main record, adding or extending the `$hist` list.


#### getRecord

```ts
export async function getRecord({
  agent,
  repo,
  collection,
  rkey,
  cid,
  includeHistory = false,
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  cid?: string
  includeHistory?: boolean
})
```

Same as the normal `getRecord` with an option to fetch history and embed the value into the `$hist` entries.

#### deleteRecord

```ts
export async function deleteRecord({
  agent,
  repo,
  collection,
  rkey,
  includeHistory = true
}: {
  agent: AtpAgent
  repo: string
  collection: string
  rkey: string
  includeHistory?: boolean
})
```

Same as the normal `deleteRecord` with the option
to also delete any history of the record.


### lookupUserInfo

```ts
export async function lookupUserInfo(handleOrDID: string) {
  ...
  const url = "https://plc.blebbit.dev/info/" + handleOrDID
  ...
}
```

Gets basic info about an account from our PLC mirror++

```json
{
  "did": "did:plc:veavz5io7eocwh7dbrhr2thi",
  "pds": "https://mycena.us-west.host.bsky.network",
  "handle": "blebbit.app",
  "plcTime": "2025-01-31T10:21:15.423Z",
  "lastTime": "2025-03-08T02:59:08.017025Z"
}
```

### createAgent

```ts
export async function createAgent(handleOrDID: string)
```

Returns an Agent setup for the account and ready for auth.

### createAuthdAgent

```ts
export async function createAuthdAgent(handleOrDID: string, password: string)
```

Returns an auth'd Agent for the account using basic auth.


## Development

### Setup

Run the following in the repo root to fetch tools and deps for all packages

```sh
pnpm i
```

Create a `.test.env` file with the following contents

```env
BLUESKY_USERNAME=<handle>
BLUESKY_PASSWORD=<app-password>
```

__Highly recommended to use an app password__

[https://bsky.app/settings/app-passwords](https://bsky.app/settings/app-passwords)


### Running tests

```sh
pnpm test
```
