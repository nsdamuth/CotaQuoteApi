CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    kind_id uuid,
    image_id uuid,
    status_id uuid,
    location_id uuid,
    trailer_type_id uuid,
    external_number character varying(256),
    make character varying(256),
    model character varying(256),
    color character varying(256),
    year integer,
    weight numeric(16,10),
    registration_number character varying(256),
    registration_state character varying(256),
    registration_date text,
    starting_miles numeric(20,10),
    starting_zip character varying(256),
    length numeric(16,10),
    current_miles numeric(20,10),
    weight_capacity numeric(16,10),
    support_air_ride boolean,
    metadata json,
    asset_type public.asset_type,
    vin_number text,
    trailer_truck boolean,
    truck_number text,
    trailer_number text,
    license_plate text,
    current_location character varying(100),
    status_toggle boolean,
    company_id uuid,
    asset_id uuid,
    ip text,
    ip_info text,
    asset_number text,
    last_location text,
    created_on character varying(100),
    updated_on character varying(100),
    is_boxtruck boolean,
    created_by_external uuid,
    updated_by_external uuid
);

CREATE TRIGGER sync_lastmod BEFORE UPDATE ON general.assets FOR EACH ROW EXECUTE FUNCTION public.sync_lastmod();

ALTER TABLE general.assets
  ADD CONSTRAINT quote_kind_id_fkey
  FOREIGN KEY (kind_id) REFERENCES general.kind(id);

ALTER TABLE general.assets
  ADD CONSTRAINT quote_image_id_fkey
  FOREIGN KEY (image_id) REFERENCES general.web_resource(id);

ALTER TABLE general.assets
  ADD CONSTRAINT quote_status_id_fkey
  FOREIGN KEY (status_id) REFERENCES general.status(id);

ALTER TABLE general.assets
  ADD CONSTRAINT quote_location_id_fkey
  FOREIGN KEY (location_id) REFERENCES general.location(id);

ALTER TABLE general.assets
  ADD CONSTRAINT quote_trailer_type_id_fkey
  FOREIGN KEY (trailer_type_id) REFERENCES general.trailer_type(id);

ALTER TABLE general.assets
  ADD CONSTRAINT quote_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES general.company(id);

ALTER TABLE general.assets
  ADD CONSTRAINT quote_asset_id_fkey
  FOREIGN KEY (asset_id) REFERENCES general.assets(id);