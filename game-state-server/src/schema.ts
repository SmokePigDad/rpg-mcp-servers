// File: game-state-server/src/schema.ts
// Schema initialization module for the game database

import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';

/**
 * Initializes all database tables and constraints
 * @param db An open better-sqlite3 Database instance
 */
export function initializeSchema(db: DatabaseType): void {
  // Core characters table
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      concept TEXT,
      game_line TEXT NOT NULL,
      strength INTEGER NOT NULL DEFAULT 1,
      dexterity INTEGER NOT NULL DEFAULT 1,
      stamina INTEGER NOT NULL DEFAULT 1,
      charisma INTEGER NOT NULL DEFAULT 1,
      manipulation INTEGER NOT NULL DEFAULT 1,
      appearance INTEGER NOT NULL DEFAULT 1,
      perception INTEGER NOT NULL DEFAULT 1,
      intelligence INTEGER NOT NULL DEFAULT 1,
      wits INTEGER NOT NULL DEFAULT 1,
      willpower_current INTEGER NOT NULL DEFAULT 5,
      willpower_permanent INTEGER NOT NULL DEFAULT 5,
      health_levels TEXT,
      experience INTEGER NOT NULL DEFAULT 0
    )
  `);

  // Game-line specific trait tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS character_vampire_traits (
      character_id INTEGER NOT NULL,
      clan TEXT,
      generation INTEGER,
      blood_pool_current INTEGER,
      blood_pool_max INTEGER,
      humanity INTEGER,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS character_werewolf_traits (
      character_id INTEGER NOT NULL,
      breed TEXT,
      auspice TEXT,
      tribe TEXT,
      gnosis_current INTEGER,
      gnosis_permanent INTEGER,
      rage_current INTEGER,
      rage_permanent INTEGER,
      renown_glory INTEGER,
      renown_honor INTEGER,
      renown_wisdom INTEGER,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS character_mage_traits (
      character_id INTEGER NOT NULL,
      tradition_convention TEXT,
      arete INTEGER,
      quintessence INTEGER,
      paradox INTEGER,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS character_changeling_traits (
      character_id INTEGER NOT NULL,
      kith TEXT,
      seeming TEXT,
      glamour_current INTEGER,
      glamour_permanent INTEGER,
      banality_permanent INTEGER,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  // Character abilities and powers
  db.exec(`
    CREATE TABLE IF NOT EXISTS character_abilities (
      character_id INTEGER NOT NULL,
      ability_name TEXT NOT NULL,
      ability_type TEXT NOT NULL,
      rating INTEGER NOT NULL,
      specialty TEXT,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS character_disciplines (
      character_id INTEGER NOT NULL,
      discipline_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS character_arts (
      character_id INTEGER NOT NULL,
      art_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS character_realms (
      character_id INTEGER NOT NULL,
      realm_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  // Status effects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS status_effects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER,
      npc_id INTEGER,
      effect_name TEXT NOT NULL,
      description TEXT,
      mechanical_effect TEXT,
      duration_type TEXT,
      duration_value INTEGER,
      FOREIGN KEY (character_id) REFERENCES characters(id),
      FOREIGN KEY (npc_id) REFERENCES npcs(id)
    )
  `);

  // Antagonists/NPCs table (using 'npcs' name for compatibility)
  db.exec(`
    CREATE TABLE IF NOT EXISTS npcs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      template TEXT,
      concept TEXT NOT NULL,
      game_line TEXT NOT NULL,
      strength INTEGER NOT NULL DEFAULT 1,
      dexterity INTEGER NOT NULL DEFAULT 1,
      stamina INTEGER NOT NULL DEFAULT 1,
      charisma INTEGER NOT NULL DEFAULT 1,
      manipulation INTEGER NOT NULL DEFAULT 1,
      appearance INTEGER NOT NULL DEFAULT 1,
      perception INTEGER NOT NULL DEFAULT 1,
      intelligence INTEGER NOT NULL DEFAULT 1,
      wits INTEGER NOT NULL DEFAULT 1,
      willpower_current INTEGER NOT NULL DEFAULT 1,
      willpower_permanent INTEGER NOT NULL DEFAULT 1,
      health_levels TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // NPC-specific trait tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS npc_vampire_traits (
      npc_id INTEGER NOT NULL,
      clan TEXT,
      generation INTEGER,
      blood_pool_current INTEGER,
      blood_pool_max INTEGER,
      humanity INTEGER,
      FOREIGN KEY (npc_id) REFERENCES npcs(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS npc_werewolf_traits (
      npc_id INTEGER NOT NULL,
      breed TEXT,
      auspice TEXT,
      tribe TEXT,
      gnosis_current INTEGER,
      gnosis_permanent INTEGER,
      rage_current INTEGER,
      rage_permanent INTEGER,
      renown_glory INTEGER,
      renown_honor INTEGER,
      renown_wisdom INTEGER,
      FOREIGN KEY (npc_id) REFERENCES npcs(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS npc_mage_traits (
      npc_id INTEGER NOT NULL,
      tradition_convention TEXT,
      arete INTEGER,
      quintessence INTEGER,
      paradox INTEGER,
      FOREIGN KEY (npc_id) REFERENCES npcs(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS npc_changeling_traits (
      npc_id INTEGER NOT NULL,
      kith TEXT,
      seeming TEXT,
      glamour_current INTEGER,
      glamour_permanent INTEGER,
      banality_permanent INTEGER,
      FOREIGN KEY (npc_id) REFERENCES npcs(id)
    )
  `);

  // Additional tables for supernatural powers
  db.exec(`
    CREATE TABLE IF NOT EXISTS character_gifts (
      character_id INTEGER NOT NULL,
      gift_name TEXT NOT NULL,
      rank INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS character_spheres (
      character_id INTEGER NOT NULL,
      sphere_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  // Inventory system
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      item_type TEXT,
      description TEXT,
      quantity INTEGER DEFAULT 1,
      properties TEXT,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  // World state and story progress
  db.exec(`
    CREATE TABLE IF NOT EXISTS world_state (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT,
      notes TEXT,
      data TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS story_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER,
      chapter INTEGER NOT NULL,
      scene INTEGER NOT NULL,
      summary TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )
  `);

  // Initiative tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS initiative_order (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER,
      antagonist_id INTEGER,
      initiative_value INTEGER NOT NULL,
      has_acted BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (character_id) REFERENCES characters(id),
      FOREIGN KEY (antagonist_id) REFERENCES antagonists(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS combat_state (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      current_turn INTEGER DEFAULT 1,
      current_initiative_id INTEGER,
      round_number INTEGER DEFAULT 1,
      FOREIGN KEY (current_initiative_id) REFERENCES initiative_order(id)
    )
  `);

  console.log("Database schema initialized successfully");
}

/**
 * Creates and configures a new database instance with proper settings
 * @param dbPath Path to the SQLite database file
 * @returns Configured Database instance
 */
export function createDatabase(dbPath: string): DatabaseType {
  const db = new Database(dbPath);
  
  // Configure database settings
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('wal_autocheckpoint = 1000');
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.pragma('foreign_keys = ON');
  
  // Test the connection
  db.prepare('SELECT 1').get();
  
  return db;
}
