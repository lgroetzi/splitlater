#!/bin/sh

. `echo "$(dirname $(readlink -f "$0"))/common.sh"`

if ! mysqladmin ping --silent --host=$DBHOST \
                 --user=$DBUSER --password=$DBPASSWD; then
    >&2 echo "Database is unavailable - bailing"
    exit 1
fi

echo '* Create Development Database'
mysql --user=root --password=$DBPASSWD --host=$DBHOST \
      --execute="create database if not exists ${DBPREFIX}development"

echo '* Create Test Database'
mysql --user=root --password=$DBPASSWD --host=$DBHOST \
      --execute="create database if not exists ${DBPREFIX}test";
