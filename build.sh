#/bin/zsh

yarn install
yarn tsc -p ./craftswain/ &
yarn tsc -p ./craftswain-selenium/ &
clear