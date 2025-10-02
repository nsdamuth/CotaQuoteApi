CREATE SCHEMA IF NOT EXISTS userdata;

CREATE TABLE userdata.cota_user (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    keycloak_id text UNIQUE,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'ACTIVE',
    given_name text,
    family_name text,
    name text,
    username text,
    salt text,
    email_id uuid,
    note_id uuid,
    image_url_id uuid,
    web_url_id uuid,
    socials_id uuid,
    credit_term_id uuid,
    credit_term text,
    twic text,
    drivers_license text,
    drivers_license_state text,
    drivers_license_state_id uuid,
    safety_info text,
    dbids boolean
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  userdata.cota_user 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();