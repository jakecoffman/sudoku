#!/bin/zsh

npm run build
git add docs
git commit -m deploy
git push
