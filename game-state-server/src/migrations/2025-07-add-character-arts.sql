-- Migration: Add character_arts table for tracking Arts per Changeling character

CREATE TABLE IF NOT EXISTS character_arts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    art_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_arts_unique 
ON character_arts(character_id, art_name);