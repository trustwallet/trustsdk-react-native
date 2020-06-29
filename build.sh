#!/bin/bash
set -e

export PATH=node_modules/.bin:$PATH

MODEL_NAME=core_models
MODEL_PATH=lib/$MODEL_NAME

yarn pbjs -t static-module wallet-core/src/proto/Ethereum.proto --no-decode --no-verify --no-convert --no-delimited --force-long -o $MODEL_PATH.js
yarn pbts -o $MODEL_PATH.d.ts $MODEL_PATH.js

rm -rf dist/ && mkdir dist
tsc --skipLibCheck
cp $MODEL_PATH.* dist/lib

rm -rf example/lib && mkdir example/lib && cp -R dist example/lib && cp package.json example/lib
