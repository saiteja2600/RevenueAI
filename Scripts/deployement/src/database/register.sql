DROP TABLE IF EXISTS register;

CREATE TABLE IF NOT EXISTS register (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(250) NOT NULL,
    company_name VARCHAR(250) NOT NULL,
    work_email VARCHAR(250) NOT NULL UNIQUE,
    password_hash VARCHAR(250) NOT NULL
);