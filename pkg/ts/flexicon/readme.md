# flexicon-history

TypeScript implmentation of ATProto record editing with history.

https://verdverm.com/blog/adding-record-editing-with-history-to-atprotocol


### Setup

Run the following in the repo root to fetch tools and deps for all packages

```sh
pnpm i
```

### Running tests

Create a `.test.env` file with the following contents

```env
BLUESKY_USERNAME=<handle>
BLUESKY_PASSWORD=<app-password>
```

Then run `pnpm test`