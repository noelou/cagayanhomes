-- Adds the "For sale" detail columns to an EXISTING database.
-- Safe to run more than once. New databases get these from schema.sql.
ALTER TABLE properties
    ADD COLUMN IF NOT EXISTS ownership_status TEXT CHECK (ownership_status IN ('clean_title', 'mortgage')),
    ADD COLUMN IF NOT EXISTS availability     TEXT CHECK (availability IN ('available', 'reserved', 'sold')),
    ADD COLUMN IF NOT EXISTS payment_terms    TEXT CHECK (payment_terms IN ('cash', 'installment')),
    ADD COLUMN IF NOT EXISTS downpayment      INTEGER,
    ADD COLUMN IF NOT EXISTS monthly_payment  INTEGER,
    ADD COLUMN IF NOT EXISTS payment_note     TEXT,
    ADD COLUMN IF NOT EXISTS financing        BOOLEAN,
    ADD COLUMN IF NOT EXISTS requirements     TEXT,
    ADD COLUMN IF NOT EXISTS amenities        TEXT;
