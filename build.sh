#!/bin/bash

rm -rf dist/ && mkdir dist
npm run build
rm -rf example/lib && mkdir example/lib
cp -R dist example/lib
cp package.json example/lib