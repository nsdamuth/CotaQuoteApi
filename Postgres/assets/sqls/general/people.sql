CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.people (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    first_name text,
    last_name text,
    email_id uuid,
    phone_id uuid,
    user_id uuid
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.people 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();