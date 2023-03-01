#/bin/zsh

yarn install
tsc -p ./craftswain/ &
tsc -p ./craftswain-selenium/ &
clear