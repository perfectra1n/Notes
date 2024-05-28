#!/usr/bin/env bash

VERSION='develop'
SERIES=${VERSION:0:4}-latest

cat package.json | grep -v electron > server-package.json

sudo docker build -t notes:$VERSION --network host -t notes:$SERIES .

if [[ $VERSION != *"beta"* ]]; then
  sudo docker tag notes:$VERSION notes:latest
fi
