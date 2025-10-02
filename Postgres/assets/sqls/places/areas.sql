CREATE SCHEMA IF NOT EXISTS places;

CREATE TABLE places.areas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    name text,
    province varchar(256),
    province_name text,
    region varchar(256),
    region_name text,
    state varchar(256),
    state_name text,
    country_id uuid,
    UNIQUE (state, country_id),
    UNIQUE (province, country_id)
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  places.areas 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();