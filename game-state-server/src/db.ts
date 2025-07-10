// File: game-state-server/src/db.ts

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create data directory in workspace
const DATA_DIR = join(process.cwd(), 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}
const DB_PATH = join(DATA_DIR, 'game-state.db');

export class GameDatabase {
  private db: Database.Database;

  constructor() {
    try {
      this.db = new Database(DB_PATH);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('wal_autocheckpoint = 1000');
      this.db.pragma('wal_checkpoint(TRUNCATE)');
      this.db.pragma('foreign_keys = ON');
      this.db.prepare('SELECT 1').get();
      this.initializeSchema();
    } catch (error: any) {
      throw new Error(`Failed to initialize database: ${error.message}`);
    }
  }

  private initializeSchema() {
    this.db.exec(`
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
    // Game-line specific tables
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_mage_traits (
        character_id INTEGER NOT NULL,
        tradition_convention TEXT,
        arete INTEGER,
        quintessence INTEGER,
        paradox INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_abilities (
        character_id INTEGER NOT NULL,
        ability_name TEXT NOT NULL,
        ability_type TEXT NOT NULL,
        rating INTEGER NOT NULL,
        specialty TEXT,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_disciplines (
        character_id INTEGER NOT NULL,
        discipline_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_arts (
        character_id INTEGER NOT NULL,
        art_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_realms (
        character_id INTEGER NOT NULL,
        realm_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
  }

  public getInstance(): Database.Database {
    return this.db;
  }

  public close() {
    this.db.close();
  }
}
