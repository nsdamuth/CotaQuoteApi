CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.trailer_type (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    code character varying(256),
    name character varying(256),
    metadata json,
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid
);

CREATE TRIGGER sync_lastmod BEFORE UPDATE ON lookups.trailer_type_lookup FOR EACH ROW EXECUTE FUNCTION public.sync_lastmod();