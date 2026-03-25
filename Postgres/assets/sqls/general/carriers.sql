CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.carriers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    company_id uuid,
    address_id uuid,
    factoring_company_id uuid,
    billing_details_id uuid,
    insurance_id uuid,
    name text,
    air_ride boolean DEFAULT false,
    liftgate boolean DEFAULT false,
    ein text,
    tenninenine boolean DEFAULT false,
    same_billing_address boolean DEFAULT false,
    email_id uuid,
    phone_id uuid,
    fax_id uuid,
    ip text,
    ip_info text,
    location_id uuid,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid
);

CREATE TRIGGER sync_lastmod BEFORE UPDATE ON general.carriers FOR EACH ROW EXECUTE FUNCTION public.sync_lastmod();
