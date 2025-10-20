CREATE SCHEMA IF NOT EXISTS userdata;

CREATE TABLE userdata.role_data (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    public_id uuid DEFAULT gen_random_uuid(),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    licence citext,
    licence_state varchar(256),
    licence_type varchar(256),
    safety_date TIMESTAMP,
    user_type citext,
    pay_type citext,
    pay_amount integer,
    stop_pay_amount integer,
    fuel_pay_amount integer,
    detention_pay_amount integer,
    accessorial_pay_amount integer,
    geolocation_id uuid,
    status_id uuid,
    label citext,
    role_type citext,
    permission citext
);

CREATE TRIGGER
  sync_lastmod
BEFORE UPDATE ON
  userdata.role_data 
FOR EACH ROW EXECUTE PROCEDURE
  sync_lastmod();