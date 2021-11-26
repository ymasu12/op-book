#!/bin/bash -x

readonly PJ_NAME="react"
readonly PJ_DIR="./${PJ_NAME}"
readonly N_VERSION="14"

S3_PATH=""

if [[ $REACT_MYENV == development ]]; then
  export REACT_APP_API="https://devapi.open-pamphlet.com"
  export REACT_APP_CONTENTS_URL="https://dev.open-pamphlet.com"
  S3_PATH="s3://op-dev-storage-staticwebbucket-df1izot1iood/spa/"
elif [[ $REACT_MYENV == production ]]; then
  S3_PATH="s3://op-prd-storage-staticwebbucket-1807bh74y569p/spa/"
else
  echo unknown REACT_MYENV.
  exit 0
fi

cd ${PJ_DIR}
echo build start.
nvm exec ${N_VERSION} yarn build
echo upload to s3
aws s3 sync "./build/" ${S3_PATH} --include "*" --acl public-read --cache-control "max-age=3600"
echo end