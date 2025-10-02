CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.company (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    name citext,
    phone_id uuid,
    billing_email_id uuid,
    email_id uuid,
    billing_phone_id uuid,
    billing_fax_id uuid,
    fax_id uuid,
    insurance_id uuid,
    liability_id uuid,
    website_id uuid,
    image_id uuid,
    billing_details_id uuid,
    factoring_company_id uuid,
    socials_id uuid,
    credit_term_id uuid,
    address_id uuid,
    location_id uuid,
    motor_carrier varchar(256) UNIQUE,
    transport_dept varchar(256),
    dot_number varchar(256),
    tax_id varchar(256),
    scac_code text,
    factoring boolean,
    number_of_trucks INTEGER,
    safety_rating varchar(256),
    importer_number varchar(256),
    broker_filer_code varchar(256),
    hours_open text,
    hours_close text,
    ein text,
    is_factoring boolean DEFAULT false
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.company 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();

INSERT INTO general.company (name) VALUES ('Cota');