CREATE SCHEMA IF NOT EXISTS userdata;

CREATE TABLE userdata.phone_number (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    country_code int,
    area_code int,
    phone_number text,
    extension int,
    UNIQUE (country_code, area_code, phone_number, extension)
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  userdata.phone_number 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();