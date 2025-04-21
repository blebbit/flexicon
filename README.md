# Flexicon

ATProto Lexicon Utilities

This is a new project, here's what the plan is

1. CUE schema for lexicon
    1. Validate according to the spec
    1. Validate based on best practices
1. Generate lexicon json
1. (tbd) generate client/server/sdk in a TS/Go/Py
1. Various existing lexicon and generated content
1. Several popular app's lexicons and content
1. Fork and add your own to reuse these utilities
1. Several extensions to vanilla lexicon
    1. Versioning
    1. Edit History
    1. [grafana/thema](https://github.com/grafana/thema) / schema lenses / Schema negotiation
    1. Module & dependency management
1. SDKs for these extensions
1. CLI wrapping the above


### Design Your Lexicon

We'll write up how to design lexicon with our CUE schemas and utilities.
For now, poke around the `./design` directory.


### References

- [CUE(lang)](https://cuelang.org) is a purpose built language for configuration, schemas, and data
- [hof](https://hofstadter.io) is a code gen tool and more powered by CUE. It already implements some of the more advanced lens like features too!

### Dev Setup

Ensure CUE and Docker are installed, as well as language runtimes (go, py, ts).
Consider installing https://github.com/hofstadter-io/hof too, we may use it for code gen in the short-term.
Long term the Flexicon CLI will handle code gen and much more

```sh
# fetch TS deps
pnpm i
```
