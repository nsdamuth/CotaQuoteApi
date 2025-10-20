CREATE TABLE general.trips (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    status_id uuid,
    load_id uuid,
    contact_id uuid,
    truck_id uuid,
    profit numeric(11,2),
    external_number integer,
    driver_id uuid,
    ip text,
    ip_info text,
    cota_id text DEFAULT to_char(nextval('public.sequence_for_trip'::regclass), '"CT-"fm000000'::text),
    company_id uuid,
    autocomplete boolean DEFAULT false,
    distance integer,
    unit text DEFAULT 'imperial'::text,
    margin numeric(11,2),
    created_on character varying(100),
    updated_on character varying(100),
    trailer_id uuid,
    created_by_external uuid,
    updated_by_external uuid,
    trip_id integer
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  general.trips 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();


CREATE SEQUENCE sequence_for_trip
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

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

ALTER TABLE ONLY general.trips
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES general.status(id);

-- ALTER TABLE ONLY general.trips
--     ADD CONSTRAINT fk_load_id FOREIGN KEY (load_id) REFERENCES general.load(id);
