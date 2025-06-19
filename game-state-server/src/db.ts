import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export class GameDatabase {
    private db: Database.Database;

    constructor() {
        const DATA_DIR = join(homedir(), '.rpg-dungeon-data');
        if (!existsSync(DATA_DIR)) {
            mkdirSync(DATA_DIR, { recursive: true });
        }
        const DB_PATH = join(DATA_DIR, 'game-state.db');
        this.db = new Database(DB_PATH);
        this.db.pragma('journal_mode = WAL');
        this.initializeSchema();
    }

    private initializeSchema() {
        // Universal Character Table for World of Darkness
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS characters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            character_type TEXT NOT NULL,
            splat1 TEXT,
            splat2 TEXT,
            concept TEXT,
            nature TEXT,
            demeanor TEXT,
            attributes TEXT,
            abilities TEXT,
            willpower_permanent INTEGER,
            willpower_current INTEGER,
            health_levels TEXT DEFAULT 'Bruised,Hurt,Hurt,Wounded,Wounded,Mauled,Crippled,Incapacitated',
            damage_taken TEXT DEFAULT '{"bashing": 0, "lethal": 0, "aggravated": 0}',
            resources TEXT,
            powers TEXT,
            backgrounds TEXT,
            virtues_or_traits TEXT,
            experience_total INTEGER DEFAULT 0,
            experience_spent INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        // Other tables can be added here if needed, like inventory
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            character_id INTEGER NOT NULL,
            item_name TEXT NOT NULL,
            item_type TEXT,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
          )
        `);
    }

    createCharacter(data: {
        name: string;
        character_type: string;
        splat1?: string;
        splat2?: string;
        concept?: string;
        nature?: string;
        demeanor?: string;
        attributes: object;
        abilities: object;
        willpower_permanent: number;
        resources?: object;
        powers?: object;
        backgrounds?: object;
        virtues_or_traits?: object;
    }) {
        const stmt = this.db.prepare(`
            INSERT INTO characters (
                name, character_type, splat1, splat2, concept, nature, demeanor,
                attributes, abilities, willpower_permanent, willpower_current,
                resources, powers, backgrounds, virtues_or_traits
            ) VALUES (
                @name, @character_type, @splat1, @splat2, @concept, @nature, @demeanor,
                json(@attributes), json(@abilities), @willpower_permanent, @willpower_permanent,
                json(@resources), json(@powers), json(@backgrounds), json(@virtues_or_traits)
            )
        `);

        const result = stmt.run({
            name: data.name,
            character_type: data.character_type,
            splat1: data.splat1 || null,
            splat2: data.splat2 || null,
            concept: data.concept || 'Unnamed Concept',
            nature: data.nature || 'Survivor',
            demeanor: data.demeanor || 'Loner',
            attributes: JSON.stringify(data.attributes),
            abilities: JSON.stringify(data.abilities),
            willpower_permanent: data.willpower_permanent,
            resources: data.resources ? JSON.stringify(data.resources) : '{}',
            powers: data.powers ? JSON.stringify(data.powers) : '{}',
            backgrounds: data.backgrounds ? JSON.stringify(data.backgrounds) : '{}',
            virtues_or_traits: data.virtues_or_traits ? JSON.stringify(data.virtues_or_traits) : '{}'
        });

        return this.getCharacter(result.lastInsertRowid as number);
    }

    getCharacter(id: number) {
        const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?');
        const character = stmt.get(id) as any;

        if (character) {
            try {
                character.attributes = JSON.parse(character.attributes);
                character.abilities = JSON.parse(character.abilities);
                character.resources = JSON.parse(character.resources);
                character.powers = JSON.parse(character.powers);
                character.backgrounds = JSON.parse(character.backgrounds);
                character.virtues_or_traits = JSON.parse(character.virtues_or_traits);
                character.damage_taken = JSON.parse(character.damage_taken);
            } catch (e) {
                console.error(`Error parsing JSON for character ID ${id}:`, e);
            }
        }
        return character;
    }

    updateCharacter(id: number, updates: Record<string, any>) {
        const setClauses: string[] = [];
        const values: any[] = [];

        for (const key in updates) {
            const value = updates[key];
            if (key.includes('.')) {
                const [field, path] = key.split('.', 2);
                const apath = path.replace(/\./g, '.');
                setClauses.push(`${field} = json_set(${field}, '$.${apath}', json(?))`);
                values.push(JSON.stringify(value));
            } else {
                const isJson = typeof value === 'object' && value !== null;
                setClauses.push(`${key} = ${isJson ? 'json(?)' : '?'}`);
                values.push(isJson ? JSON.stringify(value) : value);
            }
        }

        if (setClauses.length === 0) throw new Error("No valid fields provided for update.");

        const stmt = this.db.prepare(`UPDATE characters SET ${setClauses.join(', ')} WHERE id = ?`);
        stmt.run(...values, id);
        return this.getCharacter(id);
    }
    
    inflictDamage(targetId: number, amount: number, type: 'bashing' | 'lethal' | 'aggravated') {
        const character = this.getCharacter(targetId);
        if (!character) throw new Error(`Character with ID ${targetId} not found.`);

        const totalLevels = character.health_levels.split(',').length;
        let currentDamageCount: number = (character.damage_taken.bashing || 0) +
                                         (character.damage_taken.lethal || 0) +
                                         (character.damage_taken.aggravated || 0);
        
        for (let i = 0; i < amount; i++) {
            if (currentDamageCount >= totalLevels) break; // Can't take more damage than health levels

            if (type === 'bashing') {
                character.damage_taken.bashing++;
            } else if (type === 'lethal') {
                character.damage_taken.lethal++;
            } else if (type === 'aggravated') {
                character.damage_taken.aggravated++;
            }
            currentDamageCount++;
        }

        return this.updateCharacter(targetId, { "damage_taken": character.damage_taken });
    }

    spendResource(characterId: number, resourceName: string, amount: number) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);

        if (character.resources[resourceName] === undefined) throw new Error(`Character does not have resource: ${resourceName}`);
        if (character.resources[resourceName] < amount) throw new Error(`Not enough ${resourceName}. Has ${character.resources[resourceName]}, needs ${amount}.`);

        const newAmount = character.resources[resourceName] - amount;
        return this.updateCharacter(characterId, { [`resources.${resourceName}`]: newAmount });
    }

    spendWillpower(characterId: number) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);
        if (character.willpower_current < 1) throw new Error(`Character is out of Willpower.`);
        
        return this.updateCharacter(characterId, { "willpower_current": character.willpower_current - 1 });
    }

    addItem(characterId: number, item: { name: string, type: string, quantity: number }) {
        const stmt = this.db.prepare(`INSERT INTO inventory (character_id, item_name, item_type, quantity) VALUES (?, ?, ?, ?)`);
        const result = stmt.run(characterId, item.name, item.type, item.quantity);
        return { id: result.lastInsertRowid, ...item };
    }

    getInventory(characterId: number) {
        const stmt = this.db.prepare(`SELECT * FROM inventory WHERE character_id = ?`);
        return stmt.all(characterId);
    }
    
    close() {
        this.db.close();
    }
}