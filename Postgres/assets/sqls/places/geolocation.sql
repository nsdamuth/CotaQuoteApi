CREATE SCHEMA IF NOT EXISTS places;

CREATE TABLE places.geolocation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    latlong point,
    latitude double precision,
    longitude double precision,
    label character varying(256),
    metadata json,
    boundaries polygon,
    radius circle,
    altitude double precision,
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid
);

ALTER TABLE ONLY places.geolocation
    ADD CONSTRAINT geolocation_latitude_longitude_key UNIQUE (latitude, longitude);


CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  places.geolocation 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();