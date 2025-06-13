-- Enhanced Database Schema for Complete D&D 5e Combat
-- Adds spatial positioning and advanced action economy

-- Enhanced NPCs table with complete action economy
ALTER TABLE npcs ADD COLUMN legendary_actions TEXT; -- JSON array of legendary actions
ALTER TABLE npcs ADD COLUMN legendary_actions_per_round INTEGER DEFAULT 0;
ALTER TABLE npcs ADD COLUMN legendary_resistance_uses INTEGER DEFAULT 0;
ALTER TABLE npcs ADD COLUMN lair_actions TEXT; -- JSON array of lair actions
ALTER TABLE npcs ADD COLUMN multiattack_actions TEXT; -- Enhanced multiattack definition
ALTER TABLE npcs ADD COLUMN reaction_abilities TEXT; -- JSON array of reactions
ALTER TABLE npcs ADD COLUMN has_lair BOOLEAN DEFAULT FALSE;

-- Enhanced encounters table with spatial and advanced timing
ALTER TABLE encounters ADD COLUMN lair_actions_data TEXT; -- JSON array
ALTER TABLE encounters ADD COLUMN lair_action_used BOOLEAN DEFAULT FALSE;
ALTER TABLE encounters ADD COLUMN current_reactions TEXT; -- JSON tracking reactions this round

-- Enhanced participants table with complete action economy
ALTER TABLE encounter_participants ADD COLUMN legendary_actions_remaining INTEGER DEFAULT 0;
ALTER TABLE encounter_participants ADD COLUMN legendary_resistance_remaining INTEGER DEFAULT 0;
ALTER TABLE encounter_participants ADD COLUMN reaction_used BOOLEAN DEFAULT FALSE;
ALTER TABLE encounter_participants ADD COLUMN reaction_available TEXT; -- JSON
ALTER TABLE encounter_participants ADD COLUMN turn_actions TEXT; -- JSON: current turn action economy

-- Spatial positioning tables
CREATE TABLE IF NOT EXISTS battlefield_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  width INTEGER NOT NULL,      -- Grid width
  height INTEGER NOT NULL,     -- Grid height
  terrain_data TEXT,           -- JSON: terrain features
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

CREATE TABLE IF NOT EXISTS creature_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  participant_type TEXT NOT NULL,
  x INTEGER NOT NULL,          -- Grid X coordinate
  y INTEGER NOT NULL,          -- Grid Y coordinate  
  z INTEGER DEFAULT 0,         -- Elevation in feet
  facing INTEGER,              -- Direction facing (0-7, cardinal + diagonal)
  size_category TEXT,          -- 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

CREATE TABLE IF NOT EXISTS terrain_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  feature_type TEXT NOT NULL,  -- 'wall', 'pillar', 'pit', 'stairs', etc.
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  elevation INTEGER DEFAULT 0,
  blocks_movement BOOLEAN DEFAULT FALSE,
  blocks_los BOOLEAN DEFAULT FALSE,
  cover_type TEXT DEFAULT 'none', -- 'none', 'half', 'three_quarters', 'total'
  properties TEXT,             -- JSON: additional properties
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

CREATE TABLE IF NOT EXISTS area_effects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  effect_name TEXT NOT NULL,
  shape TEXT NOT NULL,         -- 'sphere', 'cube', 'cone', 'line', 'cylinder'
  center_x INTEGER NOT NULL,
  center_y INTEGER NOT NULL,
  center_z INTEGER DEFAULT 0,
  size_parameter INTEGER,      -- Radius for sphere, side for cube, etc.
  direction INTEGER,           -- For cones and lines
  duration_rounds INTEGER,
  effect_data TEXT,            -- JSON: effect details
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

-- Action history tracking
CREATE TABLE IF NOT EXISTS action_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'action', 'reaction', 'legendary_action', etc.
  action_details TEXT, -- JSON
  timing TEXT, -- 'on_turn', 'end_of_turn', 'initiative_20', 'triggered'
  trigger_event TEXT, -- What triggered this action
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Special initiative entries (for lair actions)
CREATE TABLE IF NOT EXISTS initiative_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  initiative_value INTEGER NOT NULL,
  entry_type TEXT NOT NULL, -- 'participant', 'lair_action'
  participant_id INTEGER, -- NULL for lair actions
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Spatial relationship caching for performance
CREATE TABLE IF NOT EXISTS spatial_relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  creature1_id INTEGER NOT NULL,
  creature2_id INTEGER NOT NULL,
  distance_feet INTEGER NOT NULL,
  has_line_of_sight BOOLEAN NOT NULL,
  cover_type TEXT NOT NULL,
  range_category TEXT NOT NULL, -- 'melee', 'close', 'medium', 'long', 'extreme'
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

-- Reaction triggers and timing
CREATE TABLE IF NOT EXISTS reaction_triggers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  trigger_type TEXT NOT NULL,
  triggering_participant_id INTEGER,
  triggering_action TEXT,
  available_reactions TEXT, -- JSON: list of available reactions
  resolved BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Enhanced indexes for performance
CREATE INDEX IF NOT EXISTS idx_battlefield_encounter ON battlefield_states(encounter_id);
CREATE INDEX IF NOT EXISTS idx_positions_battlefield ON creature_positions(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_positions_participant ON creature_positions(participant_id, participant_type);
CREATE INDEX IF NOT EXISTS idx_terrain_battlefield ON terrain_features(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_effects_battlefield ON area_effects(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_action_history_encounter ON action_history(encounter_id, round_number);
CREATE INDEX IF NOT EXISTS idx_initiative_entries_encounter ON initiative_entries(encounter_id);
CREATE INDEX IF NOT EXISTS idx_spatial_relationships_battlefield ON spatial_relationships(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_reaction_triggers_encounter ON reaction_triggers(encounter_id, resolved);