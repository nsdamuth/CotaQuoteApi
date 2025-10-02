CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.stop_type (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    code varchar(256),
    name varchar(256),
    title varchar(256),
    type varchar(256),
    note_id uuid,
    target varchar(256),
    preposition varchar(32),
    state varchar(256),
    description text,
    metadata json
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.stop_type 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();