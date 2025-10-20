CREATE SCHEMA IF NOT EXISTS support;

CREATE TABLE support.applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    name citext,
    app_key TEXT,
    domain citext,
    company_id uuid
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  support.applications
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();

ALTER TABLE ONLY support.applications
    ADD CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES general.company(id);
