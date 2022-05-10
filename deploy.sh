#!/bin/bash

cd ../lskaxiefam.github.io
find . -not -path '*/\.*' -delete

cd ..

cp -R $(pwd)/lsk-tracker/dist/lsk-tracker/ $(pwd)/lskaxiefam.github.io

cd lskaxiefam.github.io

git add *
git commit -a -m "auto commit and push"
git push origin main