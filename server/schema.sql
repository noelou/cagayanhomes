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
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);