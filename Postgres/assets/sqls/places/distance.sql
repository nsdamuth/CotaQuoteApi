CREATE SCHEMA IF NOT EXISTS places;

CREATE TABLE places.distance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    name text,
    start_location_id uuid REFERENCES places.location(id),
    end_location_id uuid REFERENCES places.location(id),
    start_address_id uuid REFERENCES places.address(id),
    end_address_id uuid REFERENCES places.address(id),
    start_geolocation_id uuid REFERENCES places.geolocation(id),
    end_geolocation_id uuid REFERENCES places.geolocation(id),
    distance integer,
    rating integer,
    complexity numeric(4,2),
    note_id uuid,
    duration integer,
    haversine double precision,
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid,
    UNIQUE (start_location_id, end_location_id),
    UNIQUE (start_address_id, end_address_id),
    UNIQUE (start_geolocation_id, end_geolocation_id)
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  places.distance 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();