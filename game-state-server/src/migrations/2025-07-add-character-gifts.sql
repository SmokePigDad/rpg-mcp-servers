-- Migration: Add character_gifts table for tracking Gifts per character

CREATE TABLE IF NOT EXISTS character_gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    gift_name TEXT NOT NULL,
    rank INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_gifts_unique 
ON character_gifts(character_id, gift_name);