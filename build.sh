#!/bin/bash

# Build the project
npm run build

# Create required directories on the server
ssh root@188.166.213.71 "mkdir -p /var/www/vhosts/fun.io.vn/public/lib /var/www/vhosts/fun.io.vn/public/css /var/www/vhosts/fun.io.vn/public/imgs"

# Copy the dist contents
scp -r dist/* root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/

# Copy additional required assets
scp -r lib/phaser.min.js root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/lib/
scp -r css/* root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/css/
scp -r imgs/* root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/imgs/
