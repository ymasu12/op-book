#!/bin/bash -x

readonly PJ_NAME="react"
readonly REACT_DIR="./${PJ_NAME}"
readonly SEO_DIR="./seo"
readonly N_VERSION="14"

REACT_DEPLOY_PATH=""
SEO_DEPLOY_PATH=""

if [[ $REACT_MYENV == development ]]; then
  export REACT_APP_API="https://devapi.open-pamphlet.com"
  export REACT_APP_CONTENTS_URL="https://dev.open-pamphlet.com"
  REACT_DEPLOY_PATH="s3://op-dev-storage-staticwebbucket-df1izot1iood/spa/"
  SEO_DEPLOY_PATH="s3://op-dev-storage-staticwebbucket-df1izot1iood/seo"
elif [[ $REACT_MYENV == production ]]; then
  REACT_DEPLOY_PATH="s3://op-prd-storage-staticwebbucket-1807bh74y569p/spa/"
  SEO_DEPLOY_PATH="s3://op-prd-storage-staticwebbucket-1807bh74y569p/seo"
else
  echo unknown REACT_MYENV.
  exit 0
fi

cd ${REACT_DIR}
echo build start.
nvm exec ${N_VERSION} yarn build
echo upload react app to s3
aws s3 sync "./build/" ${REACT_DEPLOY_PATH} --include "*" --acl public-read --cache-control "max-age=3600"

cd ..
cd ${SEO_DIR}
echo upload seo to s3
aws s3 sync "." ${SEO_DEPLOY_PATH} --include "*" --acl public-read --cache-control "max-age=3600"

echo end