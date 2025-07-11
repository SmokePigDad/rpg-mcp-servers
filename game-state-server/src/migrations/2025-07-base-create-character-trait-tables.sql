-- Migration: Base creation for all splat-specific character trait tables

CREATE TABLE IF NOT EXISTS character_vampire_traits (
  character_id INTEGER PRIMARY KEY,
  clan TEXT,
  generation INTEGER DEFAULT 13,
  blood_pool_current INTEGER DEFAULT 10,
  blood_pool_max INTEGER DEFAULT 10,
  humanity INTEGER DEFAULT 7
);

CREATE TABLE IF NOT EXISTS character_werewolf_traits (
  character_id INTEGER PRIMARY KEY,
  breed TEXT,
  auspice TEXT,
  tribe TEXT,
  gnosis_current INTEGER DEFAULT 3,
  gnosis_permanent INTEGER DEFAULT 3,
  rage_current INTEGER DEFAULT 1,
  rage_permanent INTEGER DEFAULT 1,
  renown_glory INTEGER DEFAULT 0,
  renown_honor INTEGER DEFAULT 0,
  renown_wisdom INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS character_mage_traits (
  character_id INTEGER PRIMARY KEY,
  tradition_convention TEXT,
  arete INTEGER DEFAULT 1,
  quintessence INTEGER DEFAULT 0,
  paradox INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS character_changeling_traits (
  character_id INTEGER PRIMARY KEY,
  kith TEXT,
  seeming TEXT,
  glamour_current INTEGER DEFAULT 4,
  glamour_permanent INTEGER DEFAULT 4,
  banality_permanent INTEGER DEFAULT 3
);