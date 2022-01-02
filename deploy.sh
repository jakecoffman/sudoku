#!/bin/zsh

node run build
git add docs
git commit -m deplpoy
git push
