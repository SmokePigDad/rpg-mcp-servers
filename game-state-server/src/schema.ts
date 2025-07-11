// File: game-state-server/src/schema.ts
import type { Database as DatabaseType } from 'better-sqlite3';
import Database from 'better-sqlite3';

/**
 * Initializes all database tables and constraints. This is the single source of truth for the database structure.
 * @param db An open better-sqlite3 Database instance
 */
export function initializeSchema(db: DatabaseType): void {
  console.log("Initializing database schema...");

  // Enable foreign keys to enforce relational integrity
  db.exec('PRAGMA foreign_keys = ON;');

  // --- CORE ENTITY TABLES ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      concept TEXT,
      game_line TEXT NOT NULL,
      strength INTEGER DEFAULT 1, dexterity INTEGER DEFAULT 1, stamina INTEGER DEFAULT 1,
      charisma INTEGER DEFAULT 1, manipulation INTEGER DEFAULT 1, appearance INTEGER DEFAULT 1,
      perception INTEGER DEFAULT 1, intelligence INTEGER DEFAULT 1, wits INTEGER DEFAULT 1,
      willpower_current INTEGER DEFAULT 5, willpower_permanent INTEGER DEFAULT 5,
      health_levels TEXT, -- Stored as valid JSON
      experience INTEGER DEFAULT 0
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS npcs ( -- Canonical table for all non-player characters/antagonists
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      template TEXT,
      concept TEXT,
      game_line TEXT NOT NULL,
      strength INTEGER DEFAULT 1, dexterity INTEGER DEFAULT 1, stamina INTEGER DEFAULT 1,
      charisma INTEGER DEFAULT 1, manipulation INTEGER DEFAULT 1, appearance INTEGER DEFAULT 1,
      perception INTEGER DEFAULT 1, intelligence INTEGER DEFAULT 1, wits INTEGER DEFAULT 1,
      willpower_current INTEGER DEFAULT 1, willpower_permanent INTEGER DEFAULT 1,
      health_levels TEXT, -- Stored as valid JSON
      notes TEXT
    );
  `);

  // --- SPLAT-SPECIFIC TRAIT TABLES ---
  const splatTables = [
    // Character Splats
    { name: 'character_vampire_traits', fk: 'character_id', ref: 'characters', traits: 'clan TEXT, generation INTEGER, blood_pool_current INTEGER, blood_pool_max INTEGER, humanity INTEGER' },
    { name: 'character_werewolf_traits', fk: 'character_id', ref: 'characters', traits: 'breed TEXT, auspice TEXT, tribe TEXT, gnosis_current INTEGER, gnosis_permanent INTEGER, rage_current INTEGER, rage_permanent INTEGER, renown_glory INTEGER, renown_honor INTEGER, renown_wisdom INTEGER' },
    { name: 'character_mage_traits', fk: 'character_id', ref: 'characters', traits: 'tradition_convention TEXT, arete INTEGER, quintessence INTEGER, paradox INTEGER' },
    { name: 'character_changeling_traits', fk: 'character_id', ref: 'characters', traits: 'kith TEXT, seeming TEXT, glamour_current INTEGER, glamour_permanent INTEGER, banality_permanent INTEGER' },
    // NPC Splats
    { name: 'npc_vampire_traits', fk: 'npc_id', ref: 'npcs', traits: 'clan TEXT, generation INTEGER, blood_pool_current INTEGER, blood_pool_max INTEGER, humanity INTEGER' },
    { name: 'npc_werewolf_traits', fk: 'npc_id', ref: 'npcs', traits: 'breed TEXT, auspice TEXT, tribe TEXT, gnosis_current INTEGER, gnosis_permanent INTEGER, rage_current INTEGER, rage_permanent INTEGER, renown_glory INTEGER, renown_honor INTEGER, renown_wisdom INTEGER' },
    { name: 'npc_mage_traits', fk: 'npc_id', ref: 'npcs', traits: 'tradition_convention TEXT, arete INTEGER, quintessence INTEGER, paradox INTEGER' },
    { name: 'npc_changeling_traits', fk: 'npc_id', ref: 'npcs', traits: 'kith TEXT, seeming TEXT, glamour_current INTEGER, glamour_permanent INTEGER, banality_permanent INTEGER' }
  ];

  for (const table of splatTables) {
    db.exec(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.fk} INTEGER PRIMARY KEY, ${table.traits}, FOREIGN KEY (${table.fk}) REFERENCES ${table.ref}(id) ON DELETE CASCADE);`);
  }

  // --- RELATIONAL & STATE TABLES ---
  db.exec(`CREATE TABLE IF NOT EXISTS character_abilities (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, ability_name TEXT NOT NULL, ability_type TEXT NOT NULL, rating INTEGER NOT NULL, specialty TEXT, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
  db.exec(`CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, item_name TEXT NOT NULL, item_type TEXT, description TEXT, quantity INTEGER DEFAULT 1, properties TEXT, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
  db.exec(`CREATE TABLE IF NOT EXISTS world_state (id INTEGER PRIMARY KEY, location TEXT, notes TEXT, data TEXT, last_updated DATETIME DEFAULT CURRENT_TIMESTAMP);`);
  // CORRECTED story_progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS story_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter TEXT NOT NULL,
      scene TEXT NOT NULL,
      summary TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  db.exec(`CREATE TABLE IF NOT EXISTS status_effects (id INTEGER PRIMARY KEY, character_id INTEGER, npc_id INTEGER, effect_name TEXT NOT NULL, description TEXT, mechanical_effect TEXT, duration_type TEXT, duration_value INTEGER, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE, FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE);`);

  // CORRECTED initiative_order and added scenes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS scenes (
      scene_id TEXT PRIMARY KEY,
      current_round INTEGER DEFAULT 1,
      current_turn_order INTEGER DEFAULT 0
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS initiative_order (
      id INTEGER PRIMARY KEY,
      scene_id TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      initiative_score INTEGER NOT NULL,
      turn_order INTEGER NOT NULL,
      character_id INTEGER,
      npc_id INTEGER,
      FOREIGN KEY(character_id) REFERENCES characters(id) ON DELETE CASCADE,
      FOREIGN KEY(npc_id) REFERENCES npcs(id) ON DELETE CASCADE,
      UNIQUE(scene_id, turn_order)
    );
  `);

  console.log("Database schema initialized and verified.");
}

export function createDatabase(dbPath: string): DatabaseType {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}
