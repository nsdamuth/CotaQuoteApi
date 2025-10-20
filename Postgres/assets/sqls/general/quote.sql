CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.quote (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    last_updated_by uuid,
    status_id uuid,
    payor_person_id uuid,
    location_id uuid REFERENCES places.location(id),
    trip_id uuid,
    payor_id uuid,
    company_id uuid,
    dropoff_id uuid REFERENCES places.location(id),
    pickup_id uuid REFERENCES places.location(id),
    carrier_id uuid,
    carrier_quote_number text,
    cost numeric(16,2),
    markup numeric(16,2),
    profit numeric(16,2),
    total numeric(16,2),
    co2 numeric(8,2),
    days int,
    transit text,
    vendor text,
    shipping text,
    effective text,
    expires text,
    raw_quote json,
    commodity text,
    is_hazardous boolean,
    is_oversize boolean,
    pallet_exchange boolean,
    class text,
    volume int,
    density int,
    estimated_shipdate timestamp,
    accessorials text,
    ltl_truckload boolean,
    referenceNumber text,
    Rate_to_Customer int,
    Rate_to_Carrier int,
    weight numeric(12,6),
    length numeric(12,6),
    height numeric(12,6),
    width numeric(12,6),
    value numeric(12,6),
    pallet_number int,
    temperature_from numeric(16,10),
    temperature_to numeric(16,10),
    distance numeric(16,6),
    image text,
    delivery_date timestamp,
    pickup_date timestamp,
    pickup_options text[],
    dropoff_options text[],
    external_number int,
    source varchar(256),
    visibility boolean,
    shipper_requirements text,
    delivery_requirements text,
    NMFC_num text,
    start_zip text,
    end_zip text,
    quote_rate numeric(16,2),
    per_mile numeric(16,2),
    is_calculated boolean,
    trailer_type_id uuid,
    dropoff_date timestamp without time zone,
    email_id uuid,
    email_count_number bigint
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

ALTER TABLE general.quote
  ADD CONSTRAINT quote_location_id_fkey
  FOREIGN KEY (location_id) REFERENCES general.location(id);

ALTER TABLE general.quote
  ADD CONSTRAINT quote_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES general.company(id);

ALTER TABLE general.quote
  ADD CONSTRAINT quote_pickup_id_fkey
  FOREIGN KEY (pickup_id) REFERENCES general.stop(id);

ALTER TABLE general.quote
  ADD CONSTRAINT quote_dropoff_id_fkey
  FOREIGN KEY (dropoff_id) REFERENCES general.stop(id);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.quote 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

CREATE FUNCTION general.quote_email_number_func()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$
DECLARE v_email_id UUID := NEW.email_id; 
BEGIN

IF NOT EXISTS (SELECT * 
            FROM general.quote t 
            WHERE t.email_id = v_email_id)
THEN 
NEW.email_count_number := 1;
ELSE
NEW.email_count_number := (SELECT COUNT(t.email_id)+1
                FROM general.quote t
                WHERE t.email_id = v_email_id);
END IF;
RETURN NEW;
END;
$BODY$;

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
CREATE TRIGGER quote_email_number_trigger
    BEFORE INSERT
    ON general.quote
    FOR EACH ROW
    EXECUTE PROCEDURE general.quote_email_number_func();

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --