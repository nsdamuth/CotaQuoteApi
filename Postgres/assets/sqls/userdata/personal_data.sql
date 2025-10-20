CREATE SCHEMA IF NOT EXISTS userdata;

CREATE TABLE userdata.personal_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    last_login timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    first_name public.citext,
    last_name public.citext,
    image_url text,
    web_url text,
    credit_limit numeric(8,1),
    credit_term_id uuid,
    social_id uuid,
    twic text,
    drivers_license text,
    drivers_license_state text,
    safety_info text,
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid
);