CREATE SCHEMA IF NOT EXISTS places;

CREATE TABLE places.countries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    country_name text,
    country_alpha text UNIQUE,
    country_alpha_3 text UNIQUE,
    country_numeric numeric(3),
    country_json json
);