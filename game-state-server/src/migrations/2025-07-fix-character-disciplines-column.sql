-- Migration: Fix column name in character_disciplines (should be "discipline_name")

PRAGMA foreign_keys=off;

CREATE TABLE IF NOT EXISTS character_disciplines_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    discipline_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Copy data from old table (if any)
INSERT INTO character_disciplines_new (id, character_id, discipline_name, rating)
SELECT id, character_id, discipline, rating FROM character_disciplines;

DROP TABLE character_disciplines;
ALTER TABLE character_disciplines_new RENAME TO character_disciplines;

PRAGMA foreign_keys=on;

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_disciplines_unique ON character_disciplines(character_id, discipline_name);