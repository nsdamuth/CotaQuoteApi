-- CREATE FUNCTION sync_lastmod() RETURNS trigger AS $$
-- BEGIN
--   NEW.updated_date := NOW();

--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- LATEST VERSION OF SYNC_LASTMOD

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

--
-- Name: sequence_for_alpha_numeric; Type: SEQUENCE; Schema: public; Owner: cota
--

CREATE SEQUENCE public.sequence_for_alpha_numeric
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    CYCLE;


ALTER TABLE public.sequence_for_alpha_numeric OWNER TO cota;