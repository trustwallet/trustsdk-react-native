#!/bin/bash
set -e

export PATH=node_modules/.bin:$PATH

rm -rf dist/ && mkdir dist
tsc --skipLibCheck

if [ ! -f lib/models.d.ts ]; then
    yarn pbjs -t static-module wallet-core/src/proto/*.proto -o lib/models.js
    yarn pbts lib/models.js -o lib/models.d.ts
fi

cp lib/models.* dist/lib

# rm -rf example/lib && mkdir example/lib && cp -R dist example/lib && cp package.json example/lib
# npm run test
