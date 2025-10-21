#!/bin/bash

# Initialize the SQLite database for the pet adoption application

# Define the database file
DB_FILE="pet_adoption.db"

# Check if the database file already exists
if [ -f "$DB_FILE" ]; then
    echo "Database file already exists. Removing it..."
    rm "$DB_FILE"
fi

# Create a new SQLite database
echo "Creating a new SQLite database..."
sqlite3 "$DB_FILE" <<EOF
-- Run the schema SQL to create tables
.read src/db/schema.sql

-- Run the migration SQL to create initial tables
.read src/db/migrations/001_create_tables.sql

-- Seed the database with initial data
.read src/db/seeds/initial_data.sql
EOF

echo "Database initialized successfully."