#!/bin/bash

echo "Pay - Deploy Script"

host='10.8.0.1'
remotePath='/var/www/pay/'
user='ung'

filesList[0]='LICENSE'
filesList[1]='README.md'
filesList[2]='deploy.js'
filesList[3]='package.json'
filesList[4]='server.js'

echo "--- config ---"
echo "host       : $host"
echo "remotePath : $remotePath"
echo "user       : $user"

echo "--- git pull ---"
git pull
echo "--- rsync ---"
rsync -rv --exclude='config.json' app ${filesList[*]} ung@"$host":"$remotePath"
echo "--- ssh ---"
ssh "$user"@"$host" cd $remotePath && npm start