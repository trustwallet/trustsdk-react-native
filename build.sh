#!/bin/bash

export PATH=node_modules/.bin:$PATH

rm -rf dist/ && mkdir dist
tsc --skipLibCheck
rm -rf example/lib && mkdir example/lib && cp -R dist example/lib && cp package.json example/lib
# npm run test