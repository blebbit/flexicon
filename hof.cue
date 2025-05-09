package main

import (
  "github.com/blebbit/flexicon/codegen/gen"

  "github.com/blebbit/flexicon/codegen/design/app/blebbit/next/channel"
  "github.com/blebbit/flexicon/codegen/design/app/blebbit/next/community"
)

Generator: gen.Generator & {
  @gen()

  Outdir: "./tmp"

  In: {
    Lexicon: [
      channel.Channel,
      community.Community,
    ]
  }
}