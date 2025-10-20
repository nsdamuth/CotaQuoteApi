CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.insurance (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    producer text,
    name text,
    email_id uuid,
    phone_id uuid,
    general_liability text,
    cargo_liability text,
    workmens_comp text,
    expiration text
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.insurance 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();