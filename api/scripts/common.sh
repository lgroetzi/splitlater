# Important paths
ROOT=$(git rev-parse --show-toplevel)/server
APP=`[ "$NODE_ENV" = "docker" ] && echo "/usr/src/app" || echo $ROOT`
JSBIN=$APP/node_modules/.bin/
PATH=$PATH:$JSBIN

# Database
DBPREFIX=patient_tracker_
DBPASSWD=foo                    # XXX: Read from config file
DBHOST=`[ "$NODE_ENV" = "docker" ] && echo "mysql" || echo 127.0.0.1`
