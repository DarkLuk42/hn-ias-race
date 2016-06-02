#!/bin/sh

fuser -k 8080/tcp;
git pull origin develop;
nohup ./server.py 1>/dev/null 2>err.log &
