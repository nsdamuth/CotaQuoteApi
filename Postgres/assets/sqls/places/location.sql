CREATE SCHEMA IF NOT EXISTS places;

CREATE TABLE places.location (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    zip character varying(20),
    postal character varying(256),
    city character varying(256),
    province character varying(256),
    region character varying(256),
    state character varying(256),
    county character varying(256),
    country character varying(256),
    geolocation_id uuid REFERENCES places.geolocation(id),
    ip text,
    ip_info text,
    apo boolean DEFAULT false,
    fpo boolean DEFAULT false,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid
);


-- ALTER TABLE ONLY places.location
--     ADD CONSTRAINT location_pkey PRIMARY KEY (id);


CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  places.location 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();