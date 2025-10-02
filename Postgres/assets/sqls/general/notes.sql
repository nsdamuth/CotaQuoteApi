CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    note_text text,
    metadata json,
    web_resource_id uuid,
    viewable BOOLEAN default true
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.notes 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();