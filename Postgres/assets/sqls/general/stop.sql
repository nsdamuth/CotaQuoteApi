CREATE SCHEMA IF NOT EXISTS general;

CREATE TABLE general.stop (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    load_id uuid,
    contact_id uuid,
    contact_person_id uuid,
    number text,
    passed boolean,
    note text,
    metadata json,
    appointment_required boolean,
    stop_type stop_type,
    piece_count integer,
    geolocation_id uuid,
    address_id uuid,
    location_id uuid,
    start_time integer,
    end_time integer,
    scheduled_date TIMESTAMP,
    date text,
    time text
);

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