-- Migration: Add an experience column to the npcs table for antagonist progression.

ALTER TABLE npcs ADD COLUMN experience INTEGER DEFAULT 0;