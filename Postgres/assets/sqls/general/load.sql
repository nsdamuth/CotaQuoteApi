CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.load (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    payor_id uuid,
    pickup_id uuid,
    pickup_rep_id uuid,
    dropoff_id uuid,
    dropoff_rep_id uuid,
    quote_id uuid,
    status_id uuid,
    trip_id uuid,
    carrier_id uuid,
    trailer_type text,
    special_requirements text,
    po_number text,
    container_number text,
    bol_number text,
    hbol_number text,
    vessel_name text,
    rate double precision,
    days integer,
    co2 numeric(4,2),
    current_stop_id uuid,
    total_width numeric(12,6),
    total_length numeric(12,6),
    total_height numeric(12,6),
    total_amount numeric(12,2),
    total_volume numeric(12,2),
    total_weight numeric(12,2),
    tracking_number text,
    shipper_company_id uuid,
    consignee_company_id uuid,
    trucking_company_id uuid,
    invoice_id uuid,
    is_hazardous boolean,
    is_oversize boolean,
    pallet_exchange boolean,
    pallet_number integer,
    temperature_from numeric(16,10),
    temperature_to numeric(16,10),
    distance numeric(16,6),
    image text,
    source text,
    load_type text,
    dimensions_unit_type text,
    load_accessorials text,
    shipper_requirements text,
    consignee_requirements text,
    is_combined_cota_shipment boolean,
    shipper_appointment boolean,
    consignee_appointment boolean,
    reference_number text,
    delivery_number text,
    total_rate integer,
    rate_type text,
    rate_mile numeric(10,2),
    rate_multiplier text,
    line_item_rate integer,
    rate_to_carrier integer,
    rate_margin integer,
    rate_margin_percentage integer,
    cota_id text DEFAULT to_char(nextval('public.sequence_for_alpha_numeric'::regclass), '"C-"fm000000'::text),
    unit text DEFAULT 'imperial'::text,
    coupon_id uuid,
    ltl_truckload boolean,
    linehaul integer,
    company_load_number integer
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.load 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

CREATE FUNCTION general.load_number_func()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$
DECLARE v_company_id UUID := NEW.company_id; 
BEGIN

IF NOT EXISTS (SELECT * 
            FROM general.load t 
            WHERE t.company_id = v_company_id)
THEN 
NEW.company_load_number := 1;
ELSE
NEW.company_load_number := (SELECT COUNT(t.company_id)+1
                FROM general.load t
                WHERE t.company_id = v_company_id);
END IF;
RETURN NEW;
END;
$BODY$;

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
CREATE TRIGGER load_number_trigger
    BEFORE INSERT
    ON general.load
    FOR EACH ROW
    EXECUTE PROCEDURE general.load_number_func();

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
--  Add the following from other
--  commodity [array]
--  combined_with_cota_shipments [array]
--  asset [array] 
--  documents [array]