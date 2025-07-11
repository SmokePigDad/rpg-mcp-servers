-- Migration: Add character_disciplines table for tracking disciplines per character

CREATE TABLE IF NOT EXISTS character_disciplines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    discipline TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_disciplines_unique ON character_disciplines(character_id, discipline);