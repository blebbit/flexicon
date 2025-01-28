# Lexicon Versioning


Versioning is a useful mechanic for applications,
both for themselves, their dependencies, and of the payloads they process.
In this regard, Lexicon are the schemas in ATProto
and applications on the network could benefit from their versioning.

_Note, examples are written in CUE for brevity_

#### ATProto Today

The ATproto spec has the following to offer us

##### Lexicon Files

from  (https://atproto.com/specs/lexicon#lexicon-files):

- `lexicon` (integer, required): indicates Lexicon language version. In this version, a fixed value of `1`
- `id` (string, required): the NSID of the Lexicon
- `revision` (integer, optional): indicates the version of this Lexicon, if changes have occurred

> The semantics of the revision field have not been worked out yet, but are intended to help third parties identity the most recent among multiple versions or copies of a Lexicon.

```cue
{
  lexicon:   1
  revision?: int
  id:!       string

  ...
}
```

__Note, in practice, the revision field is not used. I'm not sure why.__

##### Lexicon Evolution

from: (https://atproto.com/specs/lexicon#lexicon-evolution)

Lexicons are allowed to change over time, within some bounds to ensure both forwards and backwards compatibility. The basic principle is that all old data must still be valid under the updated Lexicon, and new data must be valid under the old Lexicon.

- Any new fields must be optional
- Non-optional fields can not be removed. A best practice is to retain all fields in the Lexicon and mark them as deprecated if they are no longer used.
- Types can not change
- Fields can not be renamed

If larger breaking changes are necessary, a new Lexicon name must be used.

It can be ambiguous when a Lexicon has been published and becomes "set in stone". At a minimum, public adoption and implementation by a third party, even without explicit permission, indicates that the Lexicon has been released and should not break compatibility. A best practice is to clearly indicate in the Lexicon type name any experimental or development status. Eg, `com.corp.experimental.newRecord`.


### Version Identifiers

There are various versioning schemes, some examples are
(in increasing flexibility order)

- ATProto `revision`, a monotonic int
- Name with version suffix, used in Bluesky lexicon today
- Kubernetes `apiVersion`, a `vX` with an optional `{alpha,beta}Y`
- Semver, a widely used format with notions of sizing and compatibility


### Examples

We can use or represent versioned lexicon in several ways today.

##### Monotonic Int (using the ATProto Lexicon.revision)

version 1:

```cue
{
  lexicon: 1
  revision: 1
  id: "app.blebbit.example"
  defs: {
    foo: { type: "string" }
  }
}
```

version 2:

```cue
{
  lexicon: 1
  revision: 2
  id: "app.blebbit.example"
  defs: {
    foo: { type: "string" }
    bar: { type: "boolean" }
  }
}
```

It is unclear to me how one refers to a specific revision of a lexicon today

##### Name with Version Suffix

Bluesky has the following pattern in their own Lexicon.

([atproto/lexicons/app/bsky/actor/def.json](https://github.com/bluesky-social/atproto/blob/cc2a1222bd2b8ddd70d70dad174c1c63246a2d87/lexicons/app/bsky/actor/defs.json#L223))

(`ref: "app.bsky.actor.defs#savedFeedsPrefV2"`)

```json
"savedFeedsPrefV2": {
  "type": "object",
  "required": ["items"],
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "ref",
        "ref": "app.bsky.actor.defs#savedFeed"
      }
    }
  }
},
"savedFeedsPref": {
  "type": "object",
  "required": ["pinned", "saved"],
  "properties": {
    "pinned": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "at-uri"
      }
    },
    "saved": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "at-uri"
      }
    },
    "timelineIndex": {
      "type": "integer"
    }
  }
},
```

##### Kubernetes Style

This is just an extension of what Bluesky is already doing

```cue
{
  lexicon: 1
  revision: 2
  id: "app.blebbit.example"
  defs: {
    v1: {
      ...
      foo: { type: "string" }
    }
    v2alpha1: {
      ...
      foo: { type: "string" }
      bar: { type: "boolean" }
    }
  }
}
```

We can then refer to a specific version using fragments

```cue
{
  type: "ref"
  ref: "app.example#v2alpha1"
}
```

##### Semver Style

This would work like the previous examples,
but with semver def names and fragments,
assuming the charset needed is valid in the ATProto spec.



### Discussion

Today, with no one using revisions.
We are essentially always using the "latest" version of a Lexicon.
If we publish a new version, consuming applications will start using it,
and can break from externally changing factors beyond their control.
We could declare this is the expected behavior and contract, but I think we can do better.
Application developers would benefit from having some amount of control
over the versions they use for dependencies beyond their control.
Even Bluesky has found versioning useful for their own Lexicon,
as evident with `app.bsky.actor.defs#savedFeedsPrefV2`.

The ATProto spec says we should not ship backwards incompatible changes,
but in practice this is unrealistic.
Indeed, Bluesky has shipped "breaking changes" themselves,
between `#savedFeedsPref` and `#savedFeedsPrefV2`.
Doing this is valid and allowed within the Lexicon spec
because you are only "adding new fields".
Is the Bluesky application filling in both fields when a user updates
their preferences today? Are older app views that only understand `v1` seeing those updates?

Monotonic int gives us the most basic versioning on the full lexicon,
while using `fieldVX` give us this versioning within a lexicon, but still on
full defs as is done in the `app.bsky.actor.defs#savedFeedsPrefV2`.
When using the field level versioning of defs, omitting the lexicon `revision`
is probably the correct thing to do so you are always getting the most up to date
list of available versions. We are essentially publishing every version forever.
Both options lack the ability to express maturity like `alpha|beta` or `major.minor.patch`.

Kubernetes style is an extension of the `fieldVX` and would give us maturity markers.
Semver is common and widely adopted, offering the greatest flexibility,
with both maturity and breaking change semantics. (`major.minor.patch-<extra>`)

#### Where do we set the version?

We should also consider where the version is specified.
Ideally the version is separate from the record details,
as is with the `revision` field on Lexicon.
The methods we see being used merge the name and version into a single string.
This, in example, complicates both the construction and decomposition of a ref
if you want to present a different view of a record depending on its version.
Without a clear delineation marker, this makes the decomposition even more difficult.

In order to have richer versioning as a stand alone field
would require changing the spec, something I would support.
At this point, I prefer the `vXbetaY` (Kubernetes style).

Another consideration for version location is the depth or scope of versioning.
Are we versioning the full lexicon or definitions within them?
Should the practice of versioning Lexicon like Bluesky has be recommended against?
(with `app.bsky.actor.defs#savedFeedsPrefV2` and `"v1"` intermixed with other defs)
Is the better practice to make them separate lexicon? (using the `revision` field,
which would be equivalent, at least in terms of information)


#### Other

@sdboyer also has some interesting ideas and insights around many interacting components
with lots of versioning of the objects and nested references.
Schemas should be able to evolve and we should also be able to express
how we move between versions directly in the schema system.
This is some pretty advance stuff and is a good vision to keep in mind.
Even without all of this, there are complexities in a system with lots
of records, each having their own version, and referring to each other at various version.
Sam can surely articulate these better than I can.

https://github.com/grafana/thema is the CUE project that implements these ideas.
