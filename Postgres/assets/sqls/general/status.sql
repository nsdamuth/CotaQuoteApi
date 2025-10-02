CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.status (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    name varchar(256) UNIQUE,
    label varchar(256),
    metadata json,
    code integer,
    value varchar(256),
    note_id uuid
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.status 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();
