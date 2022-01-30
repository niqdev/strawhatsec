#!/bin/bash

CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}

# init nvm
NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"

##############################

# `nvm` supports only current path
# `yarn --cwd` specify the work dir, but you can't specify which version to use
# if yarn v1 is installed globally you won't be able to use v2 in the sub-path unless you change directory
# https://opensource.com/article/19/8/navigating-bash-shell-pushd-popd
function run_in_website {
  local WEBSITE_PATH="${CURRENT_PATH}/../website"
  local COMMAND=$1
  echo "[+] change directory WEBSITE: ${COMMAND}"
  pushd ${WEBSITE_PATH}
  ${COMMAND}
  popd
  echo "[-] change directory WEBSITE"
}

##############################

echo "[+] website_apply"

echo "[*] CURRENT_PATH=${CURRENT_PATH}"
echo "[*] ACTION=${PARAM_ACTION}"

case ${PARAM_ACTION} in
  "site-start")
    run_in_website "nvm use"
    run_in_website "yarn install"
    # starts with livereload
    run_in_website "yarn start"
  ;;
  "site-deploy-local")
    run_in_website "nvm use"
    run_in_website "yarn install"
    # generates static site
    run_in_website "yarn run build"
    run_in_website "yarn run serve"
  ;;
  "site-deploy-gh-manual")
    PARAM_GH_USER=${2:?"Missing GH_USER"}
    echo "[*] GH_USER=${PARAM_GH_USER}"

    run_in_website "nvm use"
    run_in_website "yarn install"
    run_in_website "yarn run build"
    # publishes to gh-pages
    USE_SSH=true
    CURRENT_BRANCH="main"
    GIT_USER=${PARAM_GH_USER}
    run_in_website "yarn deploy"
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac

echo "[-] website_apply"
