CREATE TABLE properties (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
    price       INTEGER NOT NULL,
    location    TEXT NOT NULL,
    bedrooms    INTEGER,
    bathrooms   INTEGER,
    lot_area    TEXT,
    floor_area  TEXT,
    bed_frame   TEXT,
    sofa_set    TEXT,
    refrigerator TEXT,
    thumbnail   TEXT,
    images      TEXT[] NOT NULL DEFAULT '{}',
    map_query   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    seller_phone TEXT
);

CREATE TABLE admins (
    id            SERIAL PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inquiries (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    message     TEXT NOT NULL,
    property_id TEXT REFERENCES properties(id) ON DELETE SET NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);