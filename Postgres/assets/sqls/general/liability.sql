CREATE SCHEMA IF NOT EXISTS general;


CREATE TABLE general.liability (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    carrier_id uuid,
    insurance_id uuid,
    general bigint,
    cargo bigint,
    workmens_comp bigint,
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid
);


CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.liability 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();