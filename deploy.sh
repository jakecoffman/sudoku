#!/bin/zsh

set -e

npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:jakecoffman/sudoku.git master:gh-pages
cd -
