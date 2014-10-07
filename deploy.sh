#!/bin/bash

host='10.8.0.1'
remotePath='/var/www/pay/'
user='ung'

filesList[0] = 'LICENSE'
filesList[1] = 'README'
filesList[2] = 'deploy.js'
filesList[3] = 'package.json'
filesList[4] = 'server.js'

git pull
scp -r app ${filesList[*]} ung@'$host':'$remotePath'
ssh '$user'@'$host' npm start