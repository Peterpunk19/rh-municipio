#!/bin/bash

set -eo pipefail

_create_database() {
  mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS \`$1\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    GRANT ALL PRIVILEGES ON \`$1\`.* TO \`$MYSQL_USER\`@\`%\`;
    FLUSH PRIVILEGES;
EOSQL
}

for DATABASE_NAME in $MYSQL_DATABASE $MYSQL_DATABASE_TEST; do
  _create_database $DATABASE_NAME
done
