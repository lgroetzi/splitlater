#!/bin/sh

SCRIPTPATH="$(dirname $(readlink -f "$0"))"

. `echo "${SCRIPTPATH}/common.sh"`

${SCRIPTPATH}/createdbs.sh

cd $APP && npm run dist
cd $APP && npm start
