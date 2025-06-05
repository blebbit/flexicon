#!/bin/bash

VERSION=${1:?"Usage: $0 <version>"}

GIT_ROOT=$(git rev-parse --show-toplevel)

mkdir -p "$GIT_ROOT/.flexicon/publish-cue-module"

include=(
  cue.mod
  LICENSE
  README.md
  codegen
)

for file in "${include[@]}"; do
  cp -rf "$GIT_ROOT/$file" "$GIT_ROOT/.flexicon/publish-cue-module/"
done

pushd "$GIT_ROOT/.flexicon/publish-cue-module"

cue mod publish $VERSION

popd
# rm -rf "$GIT_ROOT/.flexicon/publish-cue-module"