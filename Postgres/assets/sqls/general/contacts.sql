CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    personal_data_id uuid,
    company_id uuid,
    user_id uuid,
    name text,
    same_billing_address boolean DEFAULT false,
    hours_open text,
    hours_close text,
    require_appointments boolean DEFAULT false,
    liftgate boolean DEFAULT false,
    address_id uuid,
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

CREATE TRIGGER sync_lastmod BEFORE UPDATE ON general.contacts FOR EACH ROW EXECUTE FUNCTION public.sync_lastmod();