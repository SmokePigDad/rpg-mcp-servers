-- Migration: Add optional flavor and status fields to all splat-specific character tables.

-- For Vampire: Add 'coterie' and 'status' (in the Camarilla/Sabbat).
ALTER TABLE character_vampire_traits ADD COLUMN coterie_name TEXT;
ALTER TABLE character_vampire_traits ADD COLUMN sect_status TEXT;

-- For Werewolf: Add 'pack_name' and 'pack_totem'.
ALTER TABLE character_werewolf_traits ADD COLUMN pack_name TEXT;
ALTER TABLE character_werewolf_traits ADD COLUMN pack_totem TEXT;

-- For Mage: Add 'cabal_name' and 'paradigm_notes'.
ALTER TABLE character_mage_traits ADD COLUMN cabal_name TEXT;
ALTER TABLE character_mage_traits ADD COLUMN paradigm_notes TEXT;

-- For Changeling: Add 'court', 'house', and 'title'.
-- (Note: 'seeming' is already in the schema)
ALTER TABLE character_changeling_traits ADD COLUMN court TEXT;
ALTER TABLE character_changeling_traits ADD COLUMN house TEXT;
ALTER TABLE character_changeling_traits ADD COLUMN title TEXT;