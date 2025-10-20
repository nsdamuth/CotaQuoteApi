CREATE SCHEMA IF NOT EXISTS userdata;

CREATE TABLE userdata.social_link (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    company_id uuid UNIQUE,
    user_id uuid UNIQUE,
    twitter text,
    instagram text,
    facebook text,
    linkedin text
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  userdata.social_link 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();