#!/bin/bash

# Create directories
mkdir -p lib/bootstrap lib/fontawesome/css lib/fontawesome/webfonts

# Download Bootstrap files
curl -o lib/bootstrap/bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css
curl -o lib/bootstrap/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js

# Download Font Awesome files
curl -o lib/fontawesome/css/all.min.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css

# Download Font Awesome webfonts
WEBFONTS=(
  "fa-brands-400.ttf"
  "fa-brands-400.woff2"
  "fa-regular-400.ttf"
  "fa-regular-400.woff2"
  "fa-solid-900.ttf"
  "fa-solid-900.woff2"
  "fa-v4compatibility.ttf"
  "fa-v4compatibility.woff2"
)

for font in "${WEBFONTS[@]}"
do
  curl -o "lib/fontawesome/webfonts/$font" "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/$font"
done
