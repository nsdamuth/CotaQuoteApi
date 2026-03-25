CREATE SCHEMA IF NOT EXISTS support;

CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE support.applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    name public.citext,
    app_key text NOT NULL DEFAULT (
               regexp_replace(
                 upper(
                   translate(encode(gen_random_bytes(24), 'base64'), '+/', 'AB')
                 ),
                 '=', '', 'g'
               )
             ),
    domain public.citext,
    company_id uuid,
    active boolean DEFAULT true,
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    api_key text,
    access_level integer,
    created_by_external uuid,
    updated_by_external uuid,
    multiplier numeric(10,2),
    user_id uuid,
    UNIQUE (app_key),                           -- ensure no duplicates
    CHECK (app_key ~ '^[A-Z0-9]+$')   
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  support.applications
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();

ALTER TABLE ONLY support.applications
    ADD CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES general.company(id);

ALTER TABLE ONLY support.applications
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES userdata.cota_user(id);