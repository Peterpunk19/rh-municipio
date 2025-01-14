#!/bin/bash

set -eo pipefail

_create_database() {
  mysql_note "Create database: ${1}"
  docker_process_sql --database=mysql <<-EOSQL
    CREATE DATABASE IF NOT EXISTS \`$1\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOSQL

  mysql_note "Grant user: ${MYSQL_USER} privileges on: ${1}"
  docker_process_sql --database=mysql <<-EOSQL
    GRANT ALL PRIVILEGES ON \`$1\`.* TO \`$MYSQL_USER\`@\`%\`;
    FLUSH PRIVILEGES;
EOSQL
}

mysql_note "Start creating databases"
for DATABASE_NAME in $MYSQL_DATABASE $MYSQL_DATABASE_TEST; do
  _create_database $DATABASE_NAME
done
