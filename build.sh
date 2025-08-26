#!/bin/bash

# Build the project
npm run build

# Create required directories on the server
ssh root@188.166.213.71 "mkdir -p /var/www/vhosts/fun.io.vn/public/GG/lib /var/www/vhosts/fun.io.vn/public/GG/css /var/www/vhosts/fun.io.vn/public/GG/imgs"

# Copy the dist contents
scp -r dist/* root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/GG/

# Copy additional required assets
scp -r lib/phaser.min.js root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/GG/lib/
scp -r css/* root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/GG/css/
scp -r imgs/* root@188.166.213.71:/var/www/vhosts/fun.io.vn/public/GG/imgs/
