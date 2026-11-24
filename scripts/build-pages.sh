#!/bin/sh
set -eu
mkdir -p dist
cp index.html portal.js portal.css icon.svg manifest.webmanifest sw.js security-config.js captcha.js _headers dist/
