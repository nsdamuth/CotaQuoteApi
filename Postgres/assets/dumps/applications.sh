#!/bin/bash

DB_NAME="cota"
DB_USER="cota"
DB_HOST="localhost"
DB_PORT="5432"
DATA_FILE="applications.tsv"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\COPY support.applications (
  id, public_id, name, app_key, domain, company_id
) FROM '$DATA_FILE' WITH (FORMAT text, NULL '\N');"
