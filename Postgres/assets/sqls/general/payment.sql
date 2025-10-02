CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.payment (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    po_number varchar(256),
    bol_number varchar(256),
    load_id uuid
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.payment 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();