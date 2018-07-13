#!/bin/bash -ex
# Deploy battleground-marketplace.

BUCKET_PATH="$1"
if [ "$1" == '' ]; then
  echo "Sanity check failed: Expected the full bucket path, eg s3://blockexplorer.example.com/ ."
  exit 1
fi

yarn install
yarn run build

echo "Using bucket $BUCKET_PATH."
cd dist
aws s3 cp --recursive . $BUCKET_PATH --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
