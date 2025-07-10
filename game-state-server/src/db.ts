// File: game-state-server/src/db.ts

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ANTAGONIST_TEMPLATES } from './antagonists.js';
import { HealthTracker } from './health-tracker.js';

import { CharacterRepository } from './repositories/character.repository.js';
import { AntagonistRepository } from './repositories/antagonist.repository.js';
import { StatusEffectRepository } from './repositories/status-effect.repository.js';
import { InventoryRepository } from './repositories/inventory.repository.js';
import { WorldStateRepository } from './repositories/world-state.repository.js';

/* Types are now imported from src/types/*.ts */

import type {
 DatabaseResult,
 Lock
} from './types/db.types.js';
import type {
 CharacterAttributes,
 CharacterData
} from './types/character.types.js';
import type {
 AntagonistRow,
 NpcRow
} from './types/antagonist.types.js';
import type {
 InventoryItem
} from './types/inventory.types.js';
import type {
 StatusEffect
} from './types/status-effect.types.js';
import type {
 DamageObject
} from './types/health.types.js';
// export type GameLine = 'vampire' | 'werewolf' | 'mage' | 'changeling';

// Create data directory in workspace
const DATA_DIR = join(process.cwd(), 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}
const DB_PATH = join(DATA_DIR, 'game-state.db');

interface DbResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class GameDatabase {
  private db!: Database.Database;
  private resourceLocks: Map<string, Lock> = new Map();
  private characterLocks: Map<number, Lock> = new Map();
  private readonly LOCK_TIMEOUT_MS = 5000; // 5 second timeout for resource locks
  private readonly CHARACTER_LOCK_TIMEOUT_MS = 3000; // 3 second timeout for character operations

  // Repositories
  public characters!: CharacterRepository;
  public antagonists!: AntagonistRepository;
  public statusEffects!: StatusEffectRepository;
  public inventory!: InventoryRepository;
  public worldState!: WorldStateRepository;

  constructor() {
    try {
      this.db = new Database(DB_PATH);
      // Configure database settings
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('wal_autocheckpoint = 1000');
      this.db.pragma('wal_checkpoint(TRUNCATE)');
      this.db.pragma('foreign_keys = ON');
      
      // Verify database connection
      this.db.prepare('SELECT 1').get();
      
      // Initialize schema
      this.initializeSchema();

      // Initialize repositories
      this.characters = new CharacterRepository(this.db);
      this.antagonists = new AntagonistRepository(this.db);
      this.statusEffects = new StatusEffectRepository(this.db);
      this.inventory = new InventoryRepository(this.db);
      this.worldState = new WorldStateRepository(this.db);

      console.log('✅ Database connection and initialization successful');
    } catch (error: any) {
      console.error('❌ Database initialization failed:', error);
      console.error('❌ Database initialization failed:', error.message);
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
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template TEXT,
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
        notes TEXT
      )
    `);
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npc_mage_traits (
        npc_id INTEGER NOT NULL,
        tradition_convention TEXT,
        arete INTEGER,
        quintessence INTEGER,
        paradox INTEGER,
        FOREIGN KEY (npc_id) REFERENCES npcs(id)
      )
    `);
    this.db.exec(`
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

private runMigrations() {
    // placeholder for migrations (future)
}
  this.db.close();
  console.log('Database connection closed.');
}


  // Other DB-specific (non-domain) methods, e.g., lock helpers, remain here.
}
