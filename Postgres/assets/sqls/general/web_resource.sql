CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.web_resource (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    url text,
    metadata json,
    resource_type character varying(256),
    resource_key text,
    name text,
    resource_ext text,
    document_type_id uuid,
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    is_profile_pic boolean DEFAULT false,
    created_by_external uuid,
    updated_by_external uuid,
    custom_name text,
    feedback_info_id uuid
);


CREATE TRIGGER sync_lastmod BEFORE UPDATE ON general.web_resource FOR EACH ROW EXECUTE FUNCTION public.sync_lastmod();
