// File: game-state-server/src/db.ts

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ANTAGONIST_TEMPLATES } from './antagonists.js';
import { HealthTracker, DamageObject } from './health-tracker.js';

// --- Interface Definitions ---
// --- Type Definitions (Cleaned) ---
/*
 * --- Normalized Type and Interface Definitions ---
 */
export interface DatabaseResult {
  lastInsertRowid: number | bigint;
  changes: number;
}
export interface QueryResult<T> {
  [key: string]: T | undefined;
}
export interface Lock {
  timestamp: number;
  operation: string;
}
export type GameLine = 'vampire' | 'werewolf' | 'mage' | 'changeling';

export interface CharacterAttributes {
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
}
export interface InventoryItem {
  id: number;
  character_id: number;
  item_name: string;
  item_type: string;
  quantity: number;
  description?: string;
  properties?: any;
  equipped: boolean;
  condition: string;
  last_modified: string;
}
export interface StatusEffect {
  id: number;
  character_id?: number;
  npc_id?: number;
  effect_name: string;
  description?: string;
  mechanical_effect?: any;
  duration_type: string;
  duration_value?: number;
}
export interface CharacterData extends CharacterAttributes {
  id: number;
  name: string;
  concept?: string | null;
  game_line: GameLine;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  experience: number;
  power_stat_rating?: number;
  power_stat_name?: string;
  abilities: any[];
  disciplines: any[];
  arts?: any[];
  realms?: any[];
  spheres?: any[];
  gifts?: any[];
  inventory: InventoryItem[];
  status_effects: StatusEffect[];
  [key: string]: any;
}
export interface AntagonistRow {
  id: number;
  name: string;
  template: string;
  concept: string;
  game_line: string;
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  blood_pool_current: number;
  notes: string;
}

export interface NpcRow {
  id: number;
  name: string;
  template: string;
  concept: string;
  game_line: string;
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  blood_pool_current: number;
  notes: string;
}

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
  private db: Database.Database;
  private resourceLocks: Map<string, Lock> = new Map();
  private characterLocks: Map<number, Lock> = new Map();
  private readonly LOCK_TIMEOUT_MS = 5000; // 5 second timeout for resource locks
  private readonly CHARACTER_LOCK_TIMEOUT_MS = 3000; // 3 second timeout for character operations

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
    
    console.log('✅ Database connection and initialization successful');
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error.message);
    throw new Error(`Failed to initialize database: ${error.message}`);
  }
}

  private initializeSchema() {
    // --- oWoD-centric Core Character Table ---
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        concept TEXT,
        game_line TEXT NOT NULL,
        -- Core Attributes
        strength INTEGER DEFAULT 1, dexterity INTEGER DEFAULT 1, stamina INTEGER DEFAULT 1,
        charisma INTEGER DEFAULT 1, manipulation INTEGER DEFAULT 1, appearance INTEGER DEFAULT 1,
        perception INTEGER DEFAULT 1, intelligence INTEGER DEFAULT 1, wits INTEGER DEFAULT 1,
        -- Core Traits
        willpower_current INTEGER DEFAULT 1,
        willpower_permanent INTEGER DEFAULT 1,
        health_levels TEXT NOT NULL, -- JSON
        experience INTEGER DEFAULT 0
      );
    `);

    // --- Database Migrations ---
    this.runMigrations();

    // --- Relational Tables ---
    this.db.exec(`CREATE TABLE IF NOT EXISTS character_abilities (character_id INTEGER, ability_name TEXT, ability_type TEXT, rating INTEGER, specialty TEXT, PRIMARY KEY(character_id, ability_name), FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS character_disciplines (character_id INTEGER, discipline_name TEXT, rating INTEGER, specialty TEXT, PRIMARY KEY(character_id, discipline_name), FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS character_arts (character_id INTEGER, art_name TEXT, rating INTEGER, specialty TEXT, PRIMARY KEY(character_id, art_name), FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS character_realms (character_id INTEGER, realm_name TEXT, rating INTEGER, specialty TEXT, PRIMARY KEY(character_id, realm_name), FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS character_gifts (character_id INTEGER, gift_name TEXT, rank INTEGER, PRIMARY KEY(character_id, gift_name), FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS character_spheres (character_id INTEGER, sphere_name TEXT, rating INTEGER, specialty TEXT, PRIMARY KEY(character_id, sphere_name), FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
    this.db.exec(`CREATE TABLE IF NOT EXISTS character_derangements (id INTEGER PRIMARY KEY, character_id INTEGER, derangement TEXT, description TEXT, UNIQUE(character_id, derangement), FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);

    // --- Inventory Table ---
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_type TEXT, -- e.g., 'Weapon', 'Trinket', 'Consumable'
        quantity INTEGER DEFAULT 1,
        description TEXT,
        properties TEXT, -- JSON for stats like weapon damage, etc.
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);

    // --- World & Story Persistence Tables ---
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY, -- Use a single row for the whole campaign for simplicity
        location TEXT,
        notes TEXT,
        data TEXT, -- Flexible JSON blob for NPCs, events, etc.
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS story_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter INTEGER,
        scene TEXT,
        summary TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // --- Game-line Specific Trait Tables (modular) ---
    // Vampire
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_vampire_traits (
        character_id INTEGER PRIMARY KEY,
        clan TEXT,
        generation INTEGER,
        blood_pool_current INTEGER,
        blood_pool_max INTEGER,
        humanity INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );`);
    // Werewolf
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_werewolf_traits (
        character_id INTEGER PRIMARY KEY,
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
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );`);
    // Mage
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_mage_traits (
        character_id INTEGER PRIMARY KEY,
        tradition_convention TEXT,
        arete INTEGER,
        quintessence INTEGER,
        paradox INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );`);
    // Changeling
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_changeling_traits (
        character_id INTEGER PRIMARY KEY,
        kith TEXT,
        seeming TEXT,
        glamour_current INTEGER,
        glamour_permanent INTEGER,
        banality_permanent INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );`);

    // ADDITION: Experience Ledger table for character XP transactions
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS experience_ledger (
        id INTEGER PRIMARY KEY,
        character_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        reason TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);

    // --- Refactored Modular Antagonists/NPCs Table ---
    this.db.exec(`DROP TABLE IF EXISTS npcs;`); // Backup data first!
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        template TEXT,
        concept TEXT,
        game_line TEXT NOT NULL,
        strength INTEGER DEFAULT 1, dexterity INTEGER DEFAULT 1, stamina INTEGER DEFAULT 1,
        charisma INTEGER DEFAULT 1, manipulation INTEGER DEFAULT 1, appearance INTEGER DEFAULT 1,
        perception INTEGER DEFAULT 1, intelligence INTEGER DEFAULT 1, wits INTEGER DEFAULT 1,
        willpower_current INTEGER DEFAULT 1,
        willpower_permanent INTEGER DEFAULT 1,
        health_levels TEXT NOT NULL, -- JSON
        notes TEXT
      );
    `);
    // Modular splat trait tables for NPCs -- structure mirrors player traits
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npc_vampire_traits (
        npc_id INTEGER PRIMARY KEY,
        clan TEXT,
        generation INTEGER,
        blood_pool_current INTEGER,
        blood_pool_max INTEGER,
        humanity INTEGER,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );`);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npc_werewolf_traits (
        npc_id INTEGER PRIMARY KEY,
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
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );`);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npc_mage_traits (
        npc_id INTEGER PRIMARY KEY,
        tradition_convention TEXT,
        arete INTEGER,
        quintessence INTEGER,
        paradox INTEGER,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );`);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npc_changeling_traits (
        npc_id INTEGER PRIMARY KEY,
        kith TEXT,
        seeming TEXT,
        glamour_current INTEGER,
        glamour_permanent INTEGER,
        banality_permanent INTEGER,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );`);

    // --- Initiative Tracking Table ---
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS initiative_order (
        scene_id TEXT NOT NULL,
        character_id INTEGER,
        npc_id INTEGER,
        actor_name TEXT NOT NULL,
        initiative_score INTEGER NOT NULL,
        turn_order INTEGER NOT NULL,
        PRIMARY KEY(scene_id, turn_order),
        FOREIGN KEY(character_id) REFERENCES characters(id) ON DELETE SET NULL,
        FOREIGN KEY(npc_id) REFERENCES npcs(id) ON DELETE SET NULL
      );
    `);
      // --- Turn Management Table for Combat Scenes ---
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS scenes (
          scene_id TEXT PRIMARY KEY,
          current_round INTEGER NOT NULL DEFAULT 1,
          current_turn_order INTEGER NOT NULL DEFAULT 0
        );
      `);
    // --- Generic Status Effects Table ---
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS status_effects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER,
        npc_id INTEGER,
        effect_name TEXT NOT NULL,
        description TEXT,
        mechanical_effect TEXT,
        duration_type TEXT DEFAULT 'indefinite',
        duration_value INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
        FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
      );
    `);
  }

  createCharacter(data: any) {
    if (!['vampire', 'werewolf', 'mage', 'changeling'].includes(data.game_line)) {
      throw new Error(`Invalid game_line: ${data.game_line}. Must be one of: vampire, werewolf, mage, changeling`);
    }

    const health_levels = data.health_levels || { bruised: 0, hurt: 0, injured: 0, wounded: 0, mauled: 0, crippled: 0, incapacitated: 0 };
    let charId: number | undefined = undefined;

    // Transactional logic: all sub-table inserts are done atomically
    charId = this.db.transaction(() => {
      let localCharId: number;
      // Insert core character data
      const stmt = this.db.prepare(`
        INSERT INTO characters (
          name, concept, game_line,
          strength, dexterity, stamina, charisma, manipulation, appearance,
          perception, intelligence, wits,
          willpower_current, willpower_permanent, health_levels, experience
        ) VALUES (
          @name, @concept, @game_line,
          @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
          @perception, @intelligence, @wits,
          @willpower_current, @willpower_permanent, @health_levels, @experience
        )
      `);

      const result = stmt.run({
        name: data.name,
        concept: data.concept || null,
        game_line: data.game_line,
        strength: data.strength || 1,
        dexterity: data.dexterity || 1,
        stamina: data.stamina || 1,
        charisma: data.charisma || 1,
        manipulation: data.manipulation || 1,
        appearance: data.appearance || 1,
        perception: data.perception || 1,
        intelligence: data.intelligence || 1,
        wits: data.wits || 1,
        willpower_current: data.willpower_current || 1,
        willpower_permanent: data.willpower_permanent || 1,
        health_levels: JSON.stringify(health_levels),
        experience: data.experience || 0
      });
      localCharId = result.lastInsertRowid as number;

      // --- Insert into game-line-specific tables ---

      switch (data.game_line) {
        case 'vampire':
          this.db.prepare(`
            INSERT INTO character_vampire_traits
            (character_id, clan, generation, blood_pool_current, blood_pool_max, humanity)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.clan ?? null,
            data.generation ?? 13,  // Default generation for new vampires
            data.blood_pool_current ?? 10,  // Default current blood pool
            data.blood_pool_max ?? 10,      // Default max blood pool
            data.humanity ?? 7              // Default humanity
          );
          break;
        case 'werewolf':
          this.db.prepare(`
            INSERT INTO character_werewolf_traits
            (character_id, breed, auspice, tribe, gnosis_current, gnosis_permanent, rage_current, rage_permanent, renown_glory, renown_honor, renown_wisdom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.breed ?? null, data.auspice ?? null, data.tribe ?? null,
            data.gnosis_current ?? 3, data.gnosis_permanent ?? 3,  // Default gnosis
            data.rage_current ?? 1, data.rage_permanent ?? 1,      // Default rage
            data.renown_glory ?? 0, data.renown_honor ?? 0, data.renown_wisdom ?? 0  // Default renown
          );
          break;
        case 'mage':
          this.db.prepare(`
            INSERT INTO character_mage_traits
            (character_id, tradition_convention, arete, quintessence, paradox)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.tradition_convention ?? null,
            data.arete ?? 1,         // Default arete
            data.quintessence ?? 0,  // Default quintessence
            data.paradox ?? 0        // Default paradox
          );
          break;
        case 'changeling':
          this.db.prepare(`
            INSERT INTO character_changeling_traits
            (character_id, kith, seeming, glamour_current, glamour_permanent, banality_permanent)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.kith ?? null, data.seeming ?? null,
            data.glamour_current ?? 4, data.glamour_permanent ?? 4,  // Default glamour
            data.banality_permanent ?? 3  // Default banality
          );
          break;
        // Additional splats can be added here in similar fashion
      }

      // Changeling-specific: arts/reals
      if (data.game_line === "changeling") {
        if (data.arts && Array.isArray(data.arts)) {
          const artStmt = this.db.prepare(
            `INSERT INTO character_arts (character_id, art_name, rating) VALUES (?, ?, ?)`
          );
          for (const a of data.arts) {
            artStmt.run(localCharId, a.art_name ?? a.name ?? a.label ?? '', Number(a.rating) || 0);
          }
        }
        if (data.realms && Array.isArray(data.realms)) {
          const realmStmt = this.db.prepare(
            `INSERT INTO character_realms (character_id, realm_name, rating) VALUES (?, ?, ?)`
          );
          for (const r of data.realms) {
            realmStmt.run(localCharId, r.realm_name ?? r.name ?? r.label ?? '', Number(r.rating) || 0);
          }
        }
      }

      // Example sub-table transactional inserts; expand for all relations as needed
      if (data.abilities && Array.isArray(data.abilities)) {
        const abilityStmt = this.db.prepare(
          `INSERT INTO character_abilities (character_id, ability_name, ability_type, rating, specialty)
           VALUES (?, ?, ?, ?, ?)`
        );
        for (const ability of data.abilities) {
          abilityStmt.run(localCharId, ability.name, ability.type, ability.rating, ability.specialty ?? null);
        }
      }
      if (data.disciplines && Array.isArray(data.disciplines)) {
        const discStmt = this.db.prepare(
          `INSERT INTO character_disciplines (character_id, discipline_name, rating)
           VALUES (?, ?, ?)`
        );
        for (const d of data.disciplines) {
          discStmt.run(localCharId, d.name, d.rating);
        }
      }
      // ... perform additional transactional inserts for arts, realms, gifts, etc., as needed
      return localCharId;
    })();

    return this.getCharacterById(charId!);
  }
    
  createAntagonist(template_name: string, custom_name?: string) {
    const template = (ANTAGONIST_TEMPLATES as any)[template_name];
    if (!template) return null;
    // Fill missing health_levels from default if template omits it
    const defaultHealthLevels = { bruised: 0, hurt: 0, injured: 0, wounded: 0, mauled: 0, crippled: 0, incapacitated: 0 };
    const data = {
      ...template,
      name: custom_name || template.name || template_name,
      template: template_name,
      health_levels: template.health_levels ?? defaultHealthLevels
    };
    let npcId: number | undefined = undefined;

    // Validate required fields after filling health_levels
    if (!data.name || !data.game_line || !data.health_levels) {
      console.error("Missing required fields in antagonist template:", template_name, data);
      return null;
    }

    
    // Transaction to insert core NPC and relational data
    this.db.transaction(() => {
      // 1. Insert into new lean core npcs table (no game-line-specific splat traits here)
      const stmt = this.db.prepare(`
        INSERT INTO npcs (
          name, template, concept, game_line,
          strength, dexterity, stamina, charisma, manipulation, appearance,
          perception, intelligence, wits,
          willpower_current, willpower_permanent, health_levels, notes
        ) VALUES (
          @name, @template, @concept, @game_line,
          @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
          @perception, @intelligence, @wits,
          @willpower_current, @willpower_permanent, @health_levels, @notes
        )
      `);
      const result = stmt.run({
        name: data.name,
        template: data.template,
        concept: data.concept || null,
        game_line: data.game_line,
        strength: data.strength || 1,
        dexterity: data.dexterity || 1,
        stamina: data.stamina || 1,
        charisma: data.charisma || 1,
        manipulation: data.manipulation || 1,
        appearance: data.appearance || 1,
        perception: data.perception || 1,
        intelligence: data.intelligence || 1,
        wits: data.wits || 1,
        willpower_current: data.willpower_current || 1,
        willpower_permanent: data.willpower_permanent || 1,
        health_levels: JSON.stringify(data.health_levels ?? {}),
        notes: data.notes || null
      });
      npcId = result.lastInsertRowid as number;
      // 2. Modular splat trait tables
      switch (template.game_line) {
        case 'vampire':
          this.db.prepare(`
            INSERT INTO npc_vampire_traits
            (npc_id, clan, generation, blood_pool_current, blood_pool_max, humanity)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            template.clan ?? null,
            template.generation ?? null,
            template.blood_pool_current ?? null,
            template.blood_pool_max ?? null,
            template.humanity ?? null
          );
          break;
        case 'werewolf':
          this.db.prepare(`
            INSERT INTO npc_werewolf_traits
            (npc_id, breed, auspice, tribe, gnosis_current, gnosis_permanent, rage_current, rage_permanent, renown_glory, renown_honor, renown_wisdom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            template.breed ?? null,
            template.auspice ?? null,
            template.tribe ?? null,
            template.gnosis_current ?? null,
            template.gnosis_permanent ?? null,
            template.rage_current ?? null,
            template.rage_permanent ?? null,
            template.renown_glory ?? null,
            template.renown_honor ?? null,
            template.renown_wisdom ?? null
          );
          break;
        case 'mage':
          this.db.prepare(`
            INSERT INTO npc_mage_traits
            (npc_id, tradition_convention, arete, quintessence, paradox)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            npcId,
            template.tradition_convention ?? null,
            template.arete ?? null,
            template.quintessence ?? null,
            template.paradox ?? null
          );
          break;
        case 'changeling':
          this.db.prepare(`
            INSERT INTO npc_changeling_traits
            (npc_id, kith, seeming, glamour_current, glamour_permanent, banality_permanent)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            template.kith ?? null,
            template.seeming ?? null,
            template.glamour_current ?? null,
            template.glamour_permanent ?? null,
            template.banality_permanent ?? null
          );
          break;
        // Expand for other splats as needed
      }

      // 3. Relational data (abilities, disciplines, gifts, spheres, arts, realms)
      if (template.abilities) {
        const abilities = template.abilities;
        const abilityStmt = this.db.prepare(`INSERT INTO character_abilities (character_id, ability_name, ability_type, rating, specialty) VALUES (?, ?, ?, ?, NULL)`);
        if (abilities.talents) {
          for (const [name, rating] of Object.entries(abilities.talents)) {
            abilityStmt.run(npcId, name, 'Talent', rating);
          }
        }
        if (abilities.skills) {
          for (const [name, rating] of Object.entries(abilities.skills)) {
            abilityStmt.run(npcId, name, 'Skill', rating);
          }
        }
        if (abilities.knowledges) {
          for (const [name, rating] of Object.entries(abilities.knowledges)) {
            abilityStmt.run(npcId, name, 'Knowledge', rating);
          }
        }
      }

      // 4. Supernatural powers (disciplines, gifts, spheres, arts, realms)
      if (template.supernatural?.disciplines) {
        const discStmt = this.db.prepare(`INSERT INTO character_disciplines (character_id, discipline_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.disciplines)) {
          discStmt.run(npcId, name, rating);
        }
      }
      if (template.supernatural?.gifts) {
        const giftStmt = this.db.prepare(`INSERT INTO character_gifts (character_id, gift_name, rank) VALUES (?, ?, ?)`);
        for (const [name, rank] of Object.entries(template.supernatural.gifts)) {
          giftStmt.run(npcId, name, rank);
        }
      }
      if (template.supernatural?.spheres) {
        const sphStmt = this.db.prepare(`INSERT INTO character_spheres (character_id, sphere_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.spheres)) {
          sphStmt.run(npcId, name, rating);
        }
      }
      if (template.supernatural?.arts) {
        const artStmt = this.db.prepare(`INSERT INTO character_arts (character_id, art_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.arts)) {
          artStmt.run(npcId, name, rating);
        }
      }
      if (template.supernatural?.realms) {
        const realmStmt = this.db.prepare(`INSERT INTO character_realms (character_id, realm_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.realms)) {
          realmStmt.run(npcId, name, rating);
        }
      }
    })();

    return this.getAntagonistById(npcId!);
  }

  removeStatusEffect(effect_id: number): boolean {
    const stmt = this.db.prepare(`DELETE FROM status_effects WHERE id = ?`);
    const res = stmt.run(effect_id);
    return res.changes > 0;
  }

  listStatusEffects(target_type: string, target_id: number): any[] {
    if (!target_type || !target_id) return [];
    const col = target_type === "character"
      ? "character_id"
      : target_type === "npc"
      ? "npc_id"
      : null;
    if (!col) return [];
    return this.db.prepare(
      `SELECT * FROM status_effects WHERE ${col} = ?`
    ).all(target_id).map((e: any) => ({
      ...e,
      mechanical_effect: e.mechanical_effect ? JSON.parse(e.mechanical_effect) : {}
    }));
  }

  addStatusEffect(opts: {
    target_type: 'character' | 'npc',
    target_id: number,
    effect_name: string,
    description?: string,
    mechanical_effect?: any,
    duration_type?: string,
    duration_value?: number | null
  }): number {
    const {
      target_type, target_id, effect_name,
      description = '', mechanical_effect = {},
      duration_type = 'indefinite', duration_value = null
    } = opts;
    const targetKey = target_type === 'character' ? 'character_id' : 'npc_id';
    const dbres = this.db.prepare(
      `INSERT INTO status_effects (${targetKey}, effect_name, description, mechanical_effect, duration_type, duration_value)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      target_id,
      effect_name,
      description,
      JSON.stringify(mechanical_effect ?? {}),
      duration_type,
      duration_value
    );
    return dbres.lastInsertRowid as number;
  }

  getCharacterByName(name: string): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE name = ?').get(name);
    return row ? (row as CharacterData) : null;
  }

  getAntagonistByName(name: string): AntagonistRow | null {
    const row = this.db.prepare('SELECT * FROM npcs WHERE name = ?').get(name);
    return row ? (row as AntagonistRow) : null;
  }

  getAntagonistById(id: number): AntagonistRow | null {
    const row = this.db.prepare('SELECT * FROM npcs WHERE id = ?').get(id);
    return row ? (row as AntagonistRow) : null;
  }

  getCharacterById(id: number): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
    return row ? (row as CharacterData) : null;
  }
  /**
   * Updates a character record by id, applying only the fields specified in updates.
   * Uses parameterized queries to prevent SQL injection.
   * Returns the updated character, or null if not found.
   * @param id Character id
   * @param updates Partial fields to update
   */
  public updateCharacter(id: number, updates: Partial<CharacterData>): CharacterData | null {
    if (!updates || Object.keys(updates).length === 0) {
      return this.getCharacterById(id);
    }
    const allowedFields = Object.keys(updates).filter(key => key !== "id");
    if (allowedFields.length === 0) {
      return this.getCharacterById(id);
    }
    const setClause = allowedFields.map(field => `${field} = ?`).join(', ');
    const values = allowedFields.map(field => (updates as any)[field]);
    const stmt = this.db.prepare(`UPDATE characters SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);
    return this.getCharacterById(id);
  }
  /**
   * Returns an array of all characters.
   * Used for DB health checks and general listing.
   */
  listCharacters(): CharacterData[] {
    const rows = this.db.prepare('SELECT * FROM characters').all();
    return rows as CharacterData[];
  }

  private runMigrations() {
    console.log('Starting database migrations...');
    
    this.db.transaction(() => {
      try {
        // Handle inventory schema updates

    // --- INVENTORY SCHEMA UPDATES ---
    // Add 'equipped' column to inventory if not present
    try {
      this.db.prepare('SELECT equipped FROM inventory LIMIT 1').get();
      console.log("'equipped' column already exists in inventory");
    } catch (error) {
      console.log("Adding 'equipped' column to inventory table...");
      try {
        this.db.exec("ALTER TABLE inventory ADD COLUMN equipped BOOLEAN DEFAULT 0");
        console.log("✅ 'equipped' column added to inventory");
      } catch (alterError: any) {
        console.log("⚠️ Could not add 'equipped' column:", alterError.message);
      }
    }
    // Add 'condition' column to inventory if not present
    try {
      this.db.prepare("SELECT condition FROM inventory LIMIT 1").get();
      console.log("'condition' column already exists in inventory");
    } catch (error) {
      console.log("Adding 'condition' column to inventory table...");
      try {
        this.db.exec("ALTER TABLE inventory ADD COLUMN condition TEXT DEFAULT 'good'");
        console.log("✅ 'condition' column added to inventory");
      } catch (alterError: any) {
        console.log("⚠️ Could not add 'condition' column:", alterError.message);
      }
    }
    // Add 'last_modified' column to inventory if not present
    try {
      this.db.prepare("SELECT last_modified FROM inventory LIMIT 1").get();
      console.log("'last_modified' column already exists in inventory");
    } catch (error) {
      console.log("Adding 'last_modified' column to inventory table...");
      try {
        this.db.exec("ALTER TABLE inventory ADD COLUMN last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        console.log("✅ 'last_modified' column added to inventory");
      } catch (alterError: any) {
        console.log("⚠️ Could not add 'last_modified' column:", alterError.message);
      }
    }
    // Create inventory_history table if not exists
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS inventory_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inventory_item_id INTEGER NOT NULL,
          change_type TEXT NOT NULL,
          old_value TEXT,
          new_value TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (inventory_item_id) REFERENCES inventory(id) ON DELETE CASCADE
        );
      `);
      console.log("✅ inventory_history table present/created");
    } catch (error: any) {
      console.log("⚠️ Could not create inventory_history table:", error.message);
    }

    // (Preserve previous runMigrations below)
    // Check if experience column exists, if not add it
    try {
      this.db.prepare('SELECT experience FROM characters LIMIT 1').get();
      console.log('Experience column already exists');
    } catch (error) {
      // Column doesn't exist, add it
      console.log('Adding experience column to characters table...');
      try {
        this.db.exec('ALTER TABLE characters ADD COLUMN experience INTEGER DEFAULT 0');
        console.log('✅ Experience column added successfully');
      } catch (alterError: any) {
        console.log('⚠️ Could not add experience column:', alterError.message);
      }
    }

    // Check if power_stat_rating column exists, if not add it
    try {
      this.db.prepare('SELECT power_stat_rating FROM characters LIMIT 1').get();
      console.log('Power stat rating column already exists');
    } catch (error) {
      // Column doesn't exist, add it
      console.log('Adding power_stat_rating column to characters table...');
      try {
        this.db.exec('ALTER TABLE characters ADD COLUMN power_stat_rating INTEGER DEFAULT 0');
        console.log('✅ Power stat rating column added successfully');
      } catch (alterError: any) {
        console.log('⚠️ Could not add power_stat_rating column:', alterError.message);
      }
    }

    // Check if power_stat_name column exists, if not add it
    try {
      this.db.prepare('SELECT power_stat_name FROM characters LIMIT 1').get();
      console.log('Power stat name column already exists');
    } catch (error) {
      // Column doesn't exist, add it
      console.log('Adding power_stat_name column to characters table...');
      try {
        this.db.exec('ALTER TABLE characters ADD COLUMN power_stat_name TEXT');
        console.log('✅ Power stat name column added successfully');
      } catch (alterError: any) {
        console.log('⚠️ Could not add power_stat_name column:', alterError.message);
      }
    }
  } catch (e) {
    console.error("Migration failed:", e);
    throw e;
  }
}); // closes transaction

}
}
  