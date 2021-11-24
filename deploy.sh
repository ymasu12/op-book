#!/bin/bash -x
# readonly S3_PATH="s3://s3react-originbucket-1imq9s5zgv9kh/"
# readonly PJ_NAME="s3react"
readonly S3_PATH="s3://op-dev-storage-staticwebbucket-df1izot1iood/i/"
readonly PJ_NAME="react"
readonly PJ_DIR="./${PJ_NAME}"
readonly N_VERSION="14"
cd ${PJ_DIR}
pwd
echo build start.
nvm exec ${N_VERSION} yarn build
# echo upload to s3
# aws s3 sync ${PJ_DIR}/build/ ${S3_PATH} --include "*" --acl public-read --cache-control "max-age=3600"
# echo end