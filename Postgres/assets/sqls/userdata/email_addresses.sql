CREATE SCHEMA IF NOT EXISTS userdata;

CREATE TABLE userdata.email_addresses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    email citext UNIQUE,
    user_id uuid,
    company_id uuid,
    people_id uuid
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  userdata.email_addresses 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();