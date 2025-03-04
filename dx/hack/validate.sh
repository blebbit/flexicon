#!/bin/bash
set -uo pipefail

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )


DIR=${1:?requires one arg of directory of file to validate}

CMD="cue vet -c $SCRIPT_DIR/validate.cue"

for file in `find $DIR -type file`; do
  echo $file
  $CMD $file
done