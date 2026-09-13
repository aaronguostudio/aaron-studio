#!/bin/zsh
cd "${0:A:h}"
nohup python3 serve.py > qa/server.log 2>&1 < /dev/null &
open http://127.0.0.1:8775/review.html
