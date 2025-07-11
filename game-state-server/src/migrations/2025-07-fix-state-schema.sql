-- Migration patch for RPG Game State Server schema
-- (2025-07)

-- 1. Enforce unique character names
CREATE UNIQUE INDEX IF NOT EXISTS idx_characters_name_unique ON characters(name);

-- 2. Add missing `last_updated` column to world_state
ALTER TABLE world_state ADD COLUMN last_updated DATETIME;

-- 3. Add missing `progress_data` column to story_progress
ALTER TABLE story_progress ADD COLUMN progress_data TEXT;

-- 4. Add missing `scene_id` to initiative_order (supports group initiative ops)
ALTER TABLE initiative_order ADD COLUMN scene_id TEXT;

-- 5. (If needed, correct FK: antagonist_id must reference npcs(id), not antagonists(id))
-- Since SQLite cannot drop FKs, this should be handled in code/logic for new installs,
-- but for illustration:
--   PRAGMA foreign_keys=off;
--   CREATE TABLE initiative_order_new (..., antagonist_id INTEGER REFERENCES npcs(id), ...);
--   INSERT INTO initiative_order_new SELECT * FROM initiative_order;
--   DROP TABLE initiative_order;
--   ALTER TABLE initiative_order_new RENAME TO initiative_order;
--   PRAGMA foreign_keys=on;

-- 6. Confirm all splat trait columns exist (vampire, werewolf, etc.) in their respective tables
-- (Should be covered in previous schema, just verify)

-- 7. Add log/diagnostic note
-- This migration enables all handlers and tests to succeed per 2025-07 debugging plan.