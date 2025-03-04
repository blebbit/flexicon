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
1. CLI powering the above


### Design Your Lexicon

We'll write up how to design lexicon with our CUE schemas and utilities.
For now, poke around the `./design` directory.


### References

- [CUE(lang)](https://cuelang.org) is a purpose built language for configuration, schemas, and data