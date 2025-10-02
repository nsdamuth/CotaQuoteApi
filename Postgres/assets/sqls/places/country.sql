CREATE SCHEMA IF NOT EXISTS places;

CREATE TABLE places.countries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    name text,
    country character varying(2),
    country_international character varying(3),
    country_international_code character varying(3),
    country_currency character varying(3),
    country_name text,
    currency_symbol text[],
    ip text,
    ip_info text,
    created_on character varying(100),
    updated_on character varying(100),
    created_by_external uuid,
    updated_by_external uuid
);
ALTER TABLE ONLY places.countries
    ADD CONSTRAINT countries_country_currency_key UNIQUE (country_currency);




ALTER TABLE ONLY places.countries
    ADD CONSTRAINT countries_country_international_code_key UNIQUE (country_international_code);




ALTER TABLE ONLY places.countries
    ADD CONSTRAINT countries_country_international_key UNIQUE (country_international);



ALTER TABLE ONLY places.countries
    ADD CONSTRAINT countries_country_key UNIQUE (country);




ALTER TABLE ONLY places.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  places.countries 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();