#!/bin/bash

CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}

# init nvm
NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"

##############################

# https://opensource.com/article/19/8/navigating-bash-shell-pushd-popd
function run_in_website {
  local WEBSITE_PATH="${CURRENT_PATH}/../website"
  local COMMAND=$1
  pushd ${WEBSITE_PATH}
  ${COMMAND}
  popd
}

##############################

echo "[+] website_apply"

echo "[*] CURRENT_PATH=${CURRENT_PATH}"
echo "[*] ACTION=${PARAM_ACTION}"
echo "[*] WEBSITE_PATH=${CURRENT_PATH}"

case ${PARAM_ACTION} in
  "site-start")
    run_in_website "nvm use"
    run_in_website "yarn install"
    run_in_website "yarn start"
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac

echo "[-] website_apply"
