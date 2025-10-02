#!/bin/bash

# statement for if backup.sql exists run cmd to restore db
# if not load initdb.sql
BACKUP=/tmp/backup.sql
DUMP=/tmp/dump.sql

# copies file into docker-entrypoint-initdb.d
if test -f "$DUMP"; then
    echo "$DUMP exists."
    cp "$DUMP" /docker-entrypoint-initdb.d/
else 
    echo "$DUMP does not exist."
    cp /tmp/initdb.sql /docker-entrypoint-initdb.d/01_initdb.sql
fi

find "/tmp/" -type f -name "*.sql" -exec cp {} "/docker-entrypoint-initdb.d/" \;

echo "Loading SQLs and starting Postgres..."

# Hand off to the official entrypoint; ensure we pass a command
# If nothing was passed to this script, default to 'postgres'
if [[ $# -eq 0 ]]; then
  set -- postgres
fi

exec /usr/local/bin/docker-entrypoint.sh "$@"
# /usr/local/bin/docker-entrypoint.sh postgres -c wal_level=logical &
# For future incase you have to load anything after postgres loads.
# bash /tmp/wait-for-postgres.sh

