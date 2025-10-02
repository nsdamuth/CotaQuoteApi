CREATE SCHEMA IF NOT EXISTS places;

CREATE TABLE places.address (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    address text,
    sub_address_id uuid,
    location_id uuid,
    geolocation_id uuid,
    note_id uuid
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  places.address 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();