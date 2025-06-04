import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { homedir } from 'os';
import { MONSTER_TEMPLATES, rollHitDice, getAbilityModifier } from './monsters.js';

// Define interfaces for Monster Templates
interface MonsterAttack {
  name: string;
  bonus: number;
  damage: string;
  type: string;
  range?: number;
  special?: string;
  versatile?: string;
}

interface MonsterTemplate {
  name: string;
  creature_type: string;
  size: string;
  max_hp: number;
  armor_class: number;
  speed: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiency_bonus: number;
  initiative_modifier: number;
  attacks: string; // JSON string of MonsterAttack[]
  abilities?: string; // JSON string of Record<string, string>
  challenge_rating: number;
  experience_value: number;
  'Damage Vulnerabilities'?: string;
  'Damage Immunities'?: string;
  'Condition Immunities'?: string;
}

type MonsterTemplatesCollection = Record<string, MonsterTemplate>;

// Define EncounterParticipant locally to avoid import issues for now
// Ideally, this would be in a shared types.ts file
interface EncounterParticipant {
  id: number;
  encounter_id: number;
  participant_type: 'character' | 'npc';
  participant_id: number;
  initiative: number;
  initiative_order?: number | null;
  has_acted: boolean;
  conditions?: string | null;
  is_active: boolean;
  // Properties from JOIN
  name: string;
  current_hp: number;
  max_hp: number;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  objectives: string; // JSON string
  rewards: string; // JSON string
  created_at: string;
}

interface CharacterQuest {
  id: number;
  character_id: number;
  quest_id: number;
  status: 'active' | 'completed' | 'failed';
  progress?: string | null; // JSON string for detailed objective tracking
  assigned_at: string;
  updated_at: string;
  // Properties from JOIN with quests table
  title?: string;
  description?: string;
  objectives?: string; // JSON string
  rewards?: string; // JSON string
}

// Create data directory in user's home folder
const DATA_DIR = join(homedir(), '.rpg-dungeon-data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = join(DATA_DIR, 'game-state.db');

export class GameDatabase {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  private initializeSchema() {
    // Characters table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        class TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        current_hp INTEGER,
        max_hp INTEGER,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        gold INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_played DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // NPCs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'enemy',
        creature_type TEXT,
        size TEXT DEFAULT 'medium',
        current_hp INTEGER NOT NULL,
        max_hp INTEGER NOT NULL,
        armor_class INTEGER NOT NULL,
        speed INTEGER DEFAULT 30,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        proficiency_bonus INTEGER DEFAULT 2,
        initiative_modifier INTEGER DEFAULT 0,
        attacks TEXT,
        abilities TEXT,
        conditions TEXT,
        is_alive BOOLEAN DEFAULT TRUE,
        challenge_rating REAL DEFAULT 0,
        experience_value INTEGER DEFAULT 0,
        template_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Encounters table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        current_round INTEGER DEFAULT 0,
        current_turn INTEGER DEFAULT 0,
        environment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);

    // Encounter participants table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounter_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encounter_id INTEGER NOT NULL,
        participant_type TEXT NOT NULL,
        participant_id INTEGER NOT NULL,
        initiative INTEGER NOT NULL,
        initiative_order INTEGER,
        has_acted BOOLEAN DEFAULT FALSE,
        conditions TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (encounter_id) REFERENCES encounters(id)
      )
    `);

    // Inventory table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_type TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        equipped BOOLEAN DEFAULT FALSE,
        properties TEXT, -- JSON string
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // Story progress table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS story_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        chapter TEXT NOT NULL,
        scene TEXT NOT NULL,
        description TEXT,
        flags TEXT, -- JSON string
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // World state table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        location TEXT NOT NULL,
        npcs TEXT, -- JSON string
        events TEXT, -- JSON string
        environment TEXT, -- JSON string
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // Combat log table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS combat_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        action TEXT NOT NULL,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
            )
          `);
      
          // Quests table
          this.db.exec(`
            CREATE TABLE IF NOT EXISTS quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              objectives TEXT, -- JSON string, e.g., [{id: "obj1", text: "Do X", completed: false}]
              rewards TEXT,    -- JSON string, e.g., {gold: 100, exp: 50, items: ["item_id_1"]}
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
      
          // Character Quests table (join table)
          this.db.exec(`
            CREATE TABLE IF NOT EXISTS character_quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              character_id INTEGER NOT NULL,
              quest_id INTEGER NOT NULL,
              status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'
              progress TEXT, -- JSON string for detailed objective tracking
              assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
              FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
              UNIQUE (character_id, quest_id)
            )
          `);
      
          // Create indexes
          this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_inventory_character ON inventory(character_id);
      CREATE INDEX IF NOT EXISTS idx_story_character ON story_progress(character_id);
      CREATE INDEX IF NOT EXISTS idx_world_character ON world_state(character_id);
      CREATE INDEX IF NOT EXISTS idx_combat_character ON combat_log(character_id);
      CREATE INDEX IF NOT EXISTS idx_npc_type ON npcs(type);
      CREATE INDEX IF NOT EXISTS idx_npc_alive ON npcs(is_alive);
      CREATE INDEX IF NOT EXISTS idx_encounter_character ON encounters(character_id);
      CREATE INDEX IF NOT EXISTS idx_encounter_status ON encounters(status);
      CREATE INDEX IF NOT EXISTS idx_participants_encounter ON encounter_participants(encounter_id);
      CREATE INDEX IF NOT EXISTS idx_participants_order ON encounter_participants(encounter_id, initiative_order);
      CREATE INDEX IF NOT EXISTS idx_quests_title ON quests(title);
      CREATE INDEX IF NOT EXISTS idx_character_quests_character_id ON character_quests(character_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_quest_id ON character_quests(quest_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_status ON character_quests(status);
    `);
  }

  // Character operations
  createCharacter(data: {
    name: string;
    class: string;
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  }) {
    const maxHp = 10 + (data.constitution || 10);
    
    const stmt = this.db.prepare(`
      INSERT INTO characters (
        name, class, max_hp, current_hp,
        strength, dexterity, constitution,
        intelligence, wisdom, charisma
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.class,
      maxHp,
      maxHp,
      data.strength || 10,
      data.dexterity || 10,
      data.constitution || 10,
      data.intelligence || 10,
      data.wisdom || 10,
      data.charisma || 10
    );

    return this.getCharacter(result.lastInsertRowid as number);
  }

  getCharacter(id: number) {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?');
    return stmt.get(id);
  }

  getCharacterByName(name: string) {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE name = ?');
    return stmt.get(name);
  }

  listCharacters() {
    const stmt = this.db.prepare('SELECT * FROM characters ORDER BY last_played DESC');
    return stmt.all();
  }

  updateCharacter(id: number, updates: Record<string, any>) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`
      UPDATE characters 
      SET ${setClause}, last_played = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.getCharacter(id);
  }

  // Inventory operations
  addItem(characterId: number, item: {
    name: string;
    type: string;
    quantity?: number;
    properties?: Record<string, any>;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO inventory (character_id, item_name, item_type, quantity, properties)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      characterId,
      item.name,
      item.type,
      item.quantity || 1,
      item.properties ? JSON.stringify(item.properties) : null
    );

    return { id: result.lastInsertRowid, ...item };
  }

  getInventory(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM inventory WHERE character_id = ? ORDER BY item_type, item_name
    `);
    
    const items = stmt.all(characterId);
    return items.map((item: any) => ({
      ...item,
      properties: item.properties ? JSON.parse(item.properties as string) : null
    }));
  }

  updateItem(id: number, updates: { quantity?: number; equipped?: boolean }) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
    
    stmt.run(...values, id);
  }

  removeItem(id: number) {
    const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
    stmt.run(id);
  }

  // Story operations
  saveStoryProgress(characterId: number, data: {
    chapter: string;
    scene: string;
    description?: string;
    flags?: Record<string, any>;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO story_progress (character_id, chapter, scene, description, flags)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      characterId,
      data.chapter,
      data.scene,
      data.description || null,
      data.flags ? JSON.stringify(data.flags) : null
    );
  }

  getLatestStoryProgress(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM story_progress 
      WHERE character_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);
    
    const result = stmt.get(characterId) as any;
    if (result && result.flags) {
      result.flags = JSON.parse(result.flags as string);
    }
    return result;
  }

  // World state operations
  saveWorldState(characterId: number, data: {
    location: string;
    npcs?: Record<string, any>;
    events?: Record<string, any>;
    environment?: Record<string, any>;
  }) {
    // Check if world state exists
    const existing = this.db.prepare(
      'SELECT id FROM world_state WHERE character_id = ?'
    ).get(characterId);

    if (existing) {
      // Update existing
      const stmt = this.db.prepare(`
        UPDATE world_state 
        SET location = ?, npcs = ?, events = ?, environment = ?, last_updated = CURRENT_TIMESTAMP
        WHERE character_id = ?
      `);
      
      stmt.run(
        data.location,
        data.npcs ? JSON.stringify(data.npcs) : null,
        data.events ? JSON.stringify(data.events) : null,
        data.environment ? JSON.stringify(data.environment) : null,
        characterId
      );
    } else {
      // Insert new
      const stmt = this.db.prepare(`
        INSERT INTO world_state (character_id, location, npcs, events, environment)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        characterId,
        data.location,
        data.npcs ? JSON.stringify(data.npcs) : null,
        data.events ? JSON.stringify(data.events) : null,
        data.environment ? JSON.stringify(data.environment) : null
      );
    }
  }

  getWorldState(characterId: number) {
    const stmt = this.db.prepare('SELECT * FROM world_state WHERE character_id = ?');
    const result = stmt.get(characterId) as any;
    
    if (result) {
      if (result.npcs) result.npcs = JSON.parse(result.npcs as string);
      if (result.events) result.events = JSON.parse(result.events as string);
      if (result.environment) result.environment = JSON.parse(result.environment as string);
    }
    
    return result;
  }

  // Combat log operations
  logCombat(characterId: number, sessionId: string, action: string, result?: string) {
    const stmt = this.db.prepare(`
      INSERT INTO combat_log (character_id, session_id, action, result)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(characterId, sessionId, action, result || null);
  }

  getCombatLog(characterId: number, sessionId?: string) {
    if (sessionId) {
      const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ? AND session_id = ?
        ORDER BY timestamp
      `);
      return stmt.all(characterId, sessionId);
    } else {
      const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ?
        ORDER BY timestamp DESC
        LIMIT 50
      `);
      return stmt.all(characterId);
    }
  }

  // NPC operations
  createNPC(data: {
    name: string;
    template?: string;
    type?: string;
    customStats?: Record<string, any>;
  }) {
    let npcData: any = {
      name: data.name,
      type: data.type || 'enemy'
    };

    // Apply template if specified
    if (data.template && (MONSTER_TEMPLATES as MonsterTemplatesCollection)[data.template]) {
      const template = (MONSTER_TEMPLATES as MonsterTemplatesCollection)[data.template];
      npcData = { ...template, ...npcData };
    }

    // Apply custom stats
    if (data.customStats) {
      npcData = { ...npcData, ...data.customStats };
    }

    // Ensure required fields
    if (!npcData.max_hp) npcData.max_hp = 10;
    if (!npcData.current_hp) npcData.current_hp = npcData.max_hp;
    if (!npcData.armor_class) npcData.armor_class = 10;

    // Calculate initiative modifier if not set
    if (npcData.initiative_modifier === undefined) {
      npcData.initiative_modifier = getAbilityModifier(npcData.dexterity || 10);
    }

    const stmt = this.db.prepare(`
      INSERT INTO npcs (
        name, type, creature_type, size, current_hp, max_hp, armor_class, speed,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        proficiency_bonus, initiative_modifier, attacks, abilities, conditions,
        challenge_rating, experience_value, template_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      npcData.name,
      npcData.type,
      npcData.creature_type || null,
      npcData.size || 'medium',
      npcData.current_hp,
      npcData.max_hp,
      npcData.armor_class,
      npcData.speed || 30,
      npcData.strength || 10,
      npcData.dexterity || 10,
      npcData.constitution || 10,
      npcData.intelligence || 10,
      npcData.wisdom || 10,
      npcData.charisma || 10,
      npcData.proficiency_bonus || 2,
      npcData.initiative_modifier,
      npcData.attacks || null,
      npcData.abilities || null,
      npcData.conditions || null,
      npcData.challenge_rating || 0,
      npcData.experience_value || 0,
      data.template || null
    );

    return this.getNPC(result.lastInsertRowid as number);
  }

  createNPCGroup(template: string, count: number, namePrefix?: string) {
    const npcs = [];
    const prefix = namePrefix || (MONSTER_TEMPLATES as MonsterTemplatesCollection)[template]?.name || 'NPC';
    
    for (let i = 1; i <= count; i++) {
      const npc = this.createNPC({
        name: `${prefix} ${i}`,
        template: template
      });
      npcs.push(npc);
    }
    
    return npcs;
  }

  getNPC(id: number) {
    const stmt = this.db.prepare('SELECT * FROM npcs WHERE id = ?');
    const npc = stmt.get(id) as any;
    
    if (npc) {
      // Parse JSON fields
      if (npc.attacks) npc.attacks = JSON.parse(npc.attacks);
      if (npc.abilities) npc.abilities = JSON.parse(npc.abilities);
      if (npc.conditions) npc.conditions = JSON.parse(npc.conditions);
    }
    
    return npc;
  }

  listNPCs(type?: string, aliveOnly: boolean = true) {
    let query = 'SELECT * FROM npcs WHERE 1=1';
    const params: any[] = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (aliveOnly) {
      query += ' AND is_alive = TRUE';
    }
    
    query += ' ORDER BY name';
    
    const stmt = this.db.prepare(query);
    const npcs = stmt.all(...params);
    
    return npcs.map((npc: any) => {
      if (npc.attacks) npc.attacks = JSON.parse(npc.attacks);
      if (npc.abilities) npc.abilities = JSON.parse(npc.abilities);
      if (npc.conditions) npc.conditions = JSON.parse(npc.conditions);
      return npc;
    });
  }

  updateNPC(id: number, updates: Record<string, any>) {
    // Handle JSON fields
    if (updates.attacks && typeof updates.attacks === 'object') {
      updates.attacks = JSON.stringify(updates.attacks);
    }
    if (updates.abilities && typeof updates.abilities === 'object') {
      updates.abilities = JSON.stringify(updates.abilities);
    }
    if (updates.conditions && typeof updates.conditions === 'object') {
      updates.conditions = JSON.stringify(updates.conditions);
    }
    
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
    
    stmt.run(...values, id);
    return this.getNPC(id);
  }

  removeNPC(id: number) {
    const stmt = this.db.prepare('DELETE FROM npcs WHERE id = ?');
    stmt.run(id);
  }

  // Encounter operations
  createEncounter(data: {
    character_id: number;
    name: string;
    description?: string;
    environment?: string;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO encounters (character_id, name, description, environment)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.character_id,
      data.name,
      data.description || null,
      data.environment || null
    );

    return this.getEncounter(result.lastInsertRowid as number);
  }

  getEncounter(id: number) {
    const stmt = this.db.prepare('SELECT * FROM encounters WHERE id = ?');
    return stmt.get(id);
  }

  getActiveEncounter(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM encounters 
      WHERE character_id = ? AND status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    return stmt.get(characterId);
  }

  addEncounterParticipant(encounterId: number, type: string, participantId: number, initiative: number) {
    const stmt = this.db.prepare(`
      INSERT INTO encounter_participants (encounter_id, participant_type, participant_id, initiative)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(encounterId, type, participantId, initiative);
    
    // Recalculate initiative order
    this.updateInitiativeOrder(encounterId);
  }

  updateInitiativeOrder(encounterId: number) {
    // Get all participants sorted by initiative (descending)
    const participants = this.db.prepare(`
      SELECT id, initiative FROM encounter_participants 
      WHERE encounter_id = ? AND is_active = TRUE
      ORDER BY initiative DESC
    `).all(encounterId) as EncounterParticipant[];
    
    // Update initiative order
    const updateStmt = this.db.prepare(`
      UPDATE encounter_participants SET initiative_order = ? WHERE id = ?
    `);
    
    participants.forEach((p: EncounterParticipant, index) => {
      updateStmt.run(index + 1, p.id);
    });
  }

  getEncounterParticipants(encounterId: number) {
    const stmt = this.db.prepare(`
      SELECT ep.*, 
        CASE 
          WHEN ep.participant_type = 'character' THEN c.name
          WHEN ep.participant_type = 'npc' THEN n.name
        END as name,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.current_hp
          WHEN ep.participant_type = 'npc' THEN n.current_hp
        END as current_hp,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.max_hp
          WHEN ep.participant_type = 'npc' THEN n.max_hp
        END as max_hp
      FROM encounter_participants ep
      LEFT JOIN characters c ON ep.participant_type = 'character' AND ep.participant_id = c.id
      LEFT JOIN npcs n ON ep.participant_type = 'npc' AND ep.participant_id = n.id
      WHERE ep.encounter_id = ? AND ep.is_active = TRUE
      ORDER BY ep.initiative_order
    `);
    
    return stmt.all(encounterId) as EncounterParticipant[];
  }

  nextTurn(encounterId: number) {
    const encounter = this.getEncounter(encounterId) as any;
    if (!encounter || encounter.status !== 'active') return null;
    
    // Get active participants
    const participants: EncounterParticipant[] = this.getEncounterParticipants(encounterId);
    if (participants.length === 0) return null;
    
    // Mark current participant as having acted
    if (encounter.current_turn > 0) {
      const currentParticipant: EncounterParticipant | undefined = participants.find((p: EncounterParticipant) => p.initiative_order === encounter.current_turn);
      if (currentParticipant) {
        this.db.prepare(`
          UPDATE encounter_participants SET has_acted = TRUE WHERE id = ?
        `).run(currentParticipant.id);
      }
    }
    
    // Find next participant
    let nextTurn = encounter.current_turn + 1;
    
    // If we've gone through all participants, start new round
    if (nextTurn > participants.length) {
      nextTurn = 1;
      encounter.current_round += 1;
      
      // Reset has_acted for all participants
      this.db.prepare(`
        UPDATE encounter_participants 
        SET has_acted = FALSE 
        WHERE encounter_id = ?
      `).run(encounterId);
    }
    
    // Update encounter
    this.db.prepare(`
      UPDATE encounters 
      SET current_turn = ?, current_round = ? 
      WHERE id = ?
    `).run(nextTurn, encounter.current_round, encounterId);
    
    // Return the participant whose turn it is
    return participants.find((p: EncounterParticipant) => p.initiative_order === nextTurn);
  }

  endEncounter(id: number, outcome: string = 'completed') {
    const stmt = this.db.prepare(`
      UPDATE encounters 
      SET status = ?, ended_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(outcome, id);
  }

  applyDamage(targetType: string, targetId: number, damage: number) {
    let stmt;
    
    if (targetType === 'character') {
      stmt = this.db.prepare(`
        UPDATE characters 
        SET current_hp = MAX(0, current_hp - ?) 
        WHERE id = ?
      `);
    } else if (targetType === 'npc') {
      stmt = this.db.prepare(`
        UPDATE npcs 
        SET current_hp = MAX(0, current_hp - ?),
            is_alive = CASE WHEN current_hp - ? <= 0 THEN FALSE ELSE TRUE END
        WHERE id = ?
      `);
      stmt.run(damage, damage, targetId);
      
      // Check if NPC died and remove from active encounters
      const npc = this.getNPC(targetId);
      if (npc && !npc.is_alive) {
        this.db.prepare(`
          UPDATE encounter_participants 
          SET is_active = FALSE 
          WHERE participant_type = 'npc' AND participant_id = ?
        `).run(targetId);
      }
      
      return npc;
    }
    
    if (stmt && targetType === 'character') {
      stmt.run(damage, targetId);
      return this.getCharacter(targetId);
    }
  }

  // Quest Operations
  addQuest(data: {
    title: string;
    description: string;
    objectives: Record<string, any>[] | string[]; // Array of objective strings or objects
    rewards: Record<string, any>; // e.g., { gold: 100, experience: 50, items: ["item_id_1"] }
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO quests (title, description, objectives, rewards)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.title,
      data.description,
      JSON.stringify(data.objectives),
      JSON.stringify(data.rewards)
    );
    return this.getQuestById(result.lastInsertRowid as number);
  }

  getQuestById(id: number): Quest | null {
    const stmt = this.db.prepare('SELECT * FROM quests WHERE id = ?');
    const quest = stmt.get(id) as Quest | undefined;
    if (quest) {
      // objectives and rewards are stored as JSON, parse them if needed by caller
      // For now, return as stored. Parsing can be done in handler or by caller.
    }
    return quest || null;
  }

  assignQuestToCharacter(characterId: number, questId: number, status: 'active' | 'completed' | 'failed' = 'active') {
    // Check if character and quest exist
    const character = this.getCharacter(characterId);
    if (!character) throw new Error(`Character with ID ${characterId} not found.`);
    const quest = this.getQuestById(questId);
    if (!quest) throw new Error(`Quest with ID ${questId} not found.`);

    const stmt = this.db.prepare(`
      INSERT INTO character_quests (character_id, quest_id, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(character_id, quest_id) DO UPDATE SET
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
      WHERE character_quests.status != 'completed' AND character_quests.status != 'failed'
            OR excluded.status = 'active' -- Allow re-activating if previously completed/failed for some reason
    `);
    const result = stmt.run(characterId, questId, status);
    if (result.changes > 0) {
        // Need to get the ID of the inserted/updated row.
        // If it was an insert, result.lastInsertRowid works.
        // If it was an update due to conflict, we need to query it.
        const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
        const cq = cqStmt.get(characterId, questId) as { id: number } | undefined;
        return cq ? this.getCharacterQuestById(cq.id) : null;
    }
    // If no changes, it means the quest was already completed/failed and we tried to assign it as active again without override.
    // Or some other edge case. Return existing record.
    const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
    const cq = cqStmt.get(characterId, questId) as { id: number } | undefined;
    return cq ? this.getCharacterQuestById(cq.id) : null;
  }

  getCharacterQuestById(characterQuestId: number): CharacterQuest | null {
    const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.id = ?
    `);
    const cq = stmt.get(characterQuestId) as CharacterQuest | undefined;
    if (cq) {
      // Parse JSON fields
      if (cq.objectives) cq.objectives = JSON.parse(cq.objectives as string);
      if (cq.rewards) cq.rewards = JSON.parse(cq.rewards as string);
      if (cq.progress) cq.progress = JSON.parse(cq.progress as string);
    }
    return cq || null;
  }

  getCharacterActiveQuests(characterId: number): CharacterQuest[] {
    const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.character_id = ? AND cq.status = 'active'
      ORDER BY cq.assigned_at DESC
    `);
    const quests = stmt.all(characterId) as CharacterQuest[];
    return quests.map(q => {
      if (q.objectives) q.objectives = JSON.parse(q.objectives as string);
      if (q.rewards) q.rewards = JSON.parse(q.rewards as string);
      if (q.progress) q.progress = JSON.parse(q.progress as string);
      return q;
    });
  }

  updateCharacterQuestStatus(characterQuestId: number, status: 'active' | 'completed' | 'failed', progress?: Record<string, any> | null) {
    const fieldsToUpdate: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [status];

    if (progress !== undefined) {
      fieldsToUpdate.push('progress = ?');
      values.push(progress ? JSON.stringify(progress) : null);
    }
    values.push(characterQuestId);

    const stmt = this.db.prepare(`
      UPDATE character_quests
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = ?
    `);
    const result = stmt.run(...values);
    if (result.changes > 0) {
      return this.getCharacterQuestById(characterQuestId);
    }
    return null; // Or throw error if not found/not updated
  }

  close() {
    this.db.close();
  }
}
