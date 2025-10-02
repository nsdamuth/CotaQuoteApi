# EXAMPLE LOAD

psql -U cota -d cota -h localhost -p 5432 -c "\COPY places.location (id, public_id, created_date, updated_date, created_by, updated_by, zip, postal, city, province, region, state, county, country, geolocation_id, ip, ip_info, apo, fpo, created_on, updated_on, created_by_external, updated_by_external) FROM 'location.tsv' WITH (FORMAT text, NULL '\N');"


psql -U cota -d cota -h localhost -p 5432 -c "\COPY places.geolocation (id, public_id, created_date, updated_date, created_by, updated_by, latlong, latitude, longitude, label, metadata, boundaries, radius, altitude, ip, ip_info, created_on, updated_on, created_by_external, updated_by_external) FROM 'geolocation.tsv' WITH (FORMAT text, NULL '\N');"


psql -U cota -d cota -h localhost -p 5432 -c "\COPY places.distance (id, public_id, created_date, updated_date, created_by, updated_by, latlong, latitude, longitude, label, metadata, boundaries, radius, altitude, ip, ip_info, created_on, updated_on, created_by_external, updated_by_external) FROM 'distance.tsv' WITH (FORMAT text, NULL '\N');"
