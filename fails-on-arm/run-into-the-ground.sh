#!/bin/bash
set -e 

# this will eventually fail with a parse error
while true
do
  sleep 0.1
  node ./hello.js
done
