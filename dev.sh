#!/bin/bash
export NVM_DIR="/tmp/claude-501/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export npm_config_cache="$TMPDIR/npm-cache"
cd "/Users/tejxshrivastava/Claude/Kimondo Website"
exec npx next dev --port 3777
