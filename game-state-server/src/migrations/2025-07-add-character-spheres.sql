-- Migration: Add character_spheres table for tracking Spheres per Mage character

CREATE TABLE IF NOT EXISTS character_spheres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    sphere_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_spheres_unique 
ON character_spheres(character_id, sphere_name);