#!/bin/bash

DB_NAME="cota"
DB_USER="cota"
DB_HOST="localhost"
DB_PORT="5432"
DATA_FILE="distance.tsv"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\COPY places.distance (
  id, public_id, created_date, updated_date, created_by, updated_by,
  name, start_location_id, end_location_id,
  start_address_id, end_address_id, start_geolocation_id, end_geolocation_id,
  distance, rating, complexity, note_id, duration, haversine,
  ip, ip_info, created_on, updated_on,
  created_by_external, updated_by_external
) FROM '$DATA_FILE' WITH (FORMAT text, NULL '\N');"
