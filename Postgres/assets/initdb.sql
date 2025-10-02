CREATE EXTENSION IF NOT EXISTS citext;

-- LATEST VERSION OF SYNC_LASTMOD

CREATE OR REPLACE FUNCTION sync_lastmod() RETURNS TRIGGER AS $$
BEGIN
  IF REGEXP_LIKE(current_query(), 'updated_date', 'i') THEN
			-- RAISE EXCEPTION 'current_query (%)', current_query();
          return NEW;
        ELSE 
          NEW.updated_date := NOW();
          RETURN NEW;
        END IF;
END;
$$ LANGUAGE plpgsql;