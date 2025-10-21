CREATE TABLE pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    breed TEXT,
    adoption_status TEXT CHECK(adoption_status IN ('available', 'adopted')) DEFAULT 'available'
);

CREATE TABLE adopters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    adoption_history TEXT
);