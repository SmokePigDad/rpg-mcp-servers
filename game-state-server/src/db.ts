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
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS characters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            character_type TEXT NOT NULL,
            splat1 TEXT, splat2 TEXT, concept TEXT,
            nature TEXT, demeanor TEXT, attributes TEXT,
            abilities TEXT, willpower_permanent INTEGER,
            willpower_current INTEGER,
            health_levels TEXT DEFAULT 'Bruised,Hurt,Hurt,Wounded,Wounded,Mauled,Crippled,Incapacitated',
            damage_taken TEXT DEFAULT '{"bashing": 0, "lethal": 0, "aggravated": 0}',
            resources TEXT, powers TEXT, backgrounds TEXT,
            virtues_or_traits TEXT, experience_total INTEGER DEFAULT 0,
            experience_spent INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            character_id INTEGER NOT NULL,
            item_name TEXT NOT NULL, item_type TEXT,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
          )
        `);
    }

    createCharacter(data: any) {
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
            attributes: JSON.stringify(data.attributes || {}),
            abilities: JSON.stringify(data.abilities || {}),
            willpower_permanent: data.willpower_permanent || 1,
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
                character.attributes = JSON.parse(character.attributes || '{}');
                character.abilities = JSON.parse(character.abilities || '{}');
                character.resources = JSON.parse(character.resources || '{}');
                character.powers = JSON.parse(character.powers || '{}');
                character.backgrounds = JSON.parse(character.backgrounds || '{}');
                character.virtues_or_traits = JSON.parse(character.virtues_or_traits || '{}');
                character.damage_taken = JSON.parse(character.damage_taken || '{}');
            } catch (e) { console.error(`Error parsing JSON for character ID ${id}:`, e); }
        }
        return character;
    }

    updateCharacter(id: number, updates: Record<string, any>) {
        const transaction = this.db.transaction(() => {
            for (const key in updates) {
                const value = updates[key];
                if (key.includes('.')) {
                    const pathParts = key.split('.');
                    const topLevelField = String(pathParts.shift());
                    const nestedPath = `$.${pathParts.join('.')}`;
                    if (!(topLevelField in this.getCharacter(id))) throw new Error(`Invalid field: ${topLevelField}`);
                    const stmt = this.db.prepare(`UPDATE characters SET "${topLevelField}" = json_set("${topLevelField}", ?, ?) WHERE id = ?`);
                    stmt.run(nestedPath, value, id);
                } else {
                    const stmt = this.db.prepare(`UPDATE characters SET "${key}" = ? WHERE id = ?`);
                    const finalValue = (typeof value === 'object' && value !== null) ? JSON.stringify(value) : value;
                    stmt.run(finalValue, id);
                }
            }
        });
        try { transaction(); } catch (err) { console.error("Transaction failed:", err); throw err; }
        return this.getCharacter(id);
    }
    
    inflictDamage(targetId: number, amount: number, type: 'bashing' | 'lethal' | 'aggravated') {
        const character = this.getCharacter(targetId);
        if (!character) throw new Error(`Character with ID ${targetId} not found.`);
        const totalLevels = (character.health_levels || '').split(',').length;
        let currentDamageCount = (character.damage_taken.bashing || 0) + (character.damage_taken.lethal || 0) + (character.damage_taken.aggravated || 0);
        for (let i = 0; i < amount; i++) {
            if (currentDamageCount >= totalLevels) break;
            if (type === 'aggravated') character.damage_taken.aggravated = (character.damage_taken.aggravated || 0) + 1;
            else if (type === 'lethal') character.damage_taken.lethal = (character.damage_taken.lethal || 0) + 1;
            else if (type === 'bashing') {
                if ((currentDamageCount + 1) >= totalLevels) character.damage_taken.lethal = (character.damage_taken.lethal || 0) + 1;
                else character.damage_taken.bashing = (character.damage_taken.bashing || 0) + 1;
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

    spend_experience(characterId: number, traitToImprove: string) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);
        let cost = 0;
        let traitType = '';
        const getTraitRating = (path: string): number => {
            try { let p = path.split('.'), c: any = character; for (const part of p) c = c?.[part]; return Number(c) || 0; }
            catch (e) { return 0; }
        };
        const currentRating = getTraitRating(traitToImprove);
        const mainType = traitToImprove.split('.')[0];
        switch (mainType) {
            case 'attributes': cost = currentRating * 4; traitType = 'Attribute'; break;
            case 'abilities': cost = currentRating === 0 ? 3 : currentRating * 2; traitType = 'Ability'; break;
            case 'powers': cost = currentRating * 5; traitType = 'Power'; break;
            case 'willpower_permanent': cost = currentRating; traitType = 'Willpower'; break;
            default: throw new Error(`Unknown trait type for XP expenditure: ${mainType}`);
        }
        if (currentRating >= 5 && mainType !== 'willpower_permanent') throw new Error(`${traitType} is already at its maximum rating.`);
        const availableXp = (character.experience_total || 0) - (character.experience_spent || 0);
        if (availableXp < cost) throw new Error(`Not enough experience. Needs ${cost}, has ${availableXp}.`);
        this.updateCharacter(characterId, { [traitToImprove]: currentRating + 1, 'experience_spent': (character.experience_spent || 0) + cost });
        return { message: `Success! Spent ${cost} XP to raise ${traitToImprove} to ${currentRating + 1}.`, remainingXp: availableXp - cost };
    }

    display_health(characterId: number) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);
        const healthLevels = (character.health_levels || '').split(',');
        const damage = character.damage_taken;
        const penalties = [0, -1, -1, -2, -2, -5, -5, 0];
        const filledBoxes = Array(damage.aggravated || 0).fill('*').concat(Array(damage.lethal || 0).fill('X')).concat(Array(damage.bashing || 0).fill('/'));
        const boxes = filledBoxes.concat(Array(healthLevels.length - filledBoxes.length).fill(' '));
        let display = 'Health Status:\n';
        for (let i = 0; i < healthLevels.length; i++) { display += `[${boxes[i]}] ${healthLevels[i].padEnd(12)} (Penalty: ${penalties[i] || 0})\n`; }
        const totalDamage = (damage.aggravated || 0) + (damage.lethal || 0) + (damage.bashing || 0);
        let penalty = 0;
        if (totalDamage > 0 && totalDamage <= healthLevels.length) penalty = penalties[totalDamage - 1] || 0;
        display += `\nCurrent Wound Penalty: ${penalty} to dice pools.`;
        return { visual: display, penalty: penalty };
    }
    
    getCombatStats(characterId: number, attack_type: string) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);
        let attack_pool = 0, damage_pool = 0;
        const soak_pool = character.attributes?.physical?.stamina || 0;
        switch (attack_type) {
            case 'brawl_punch':
                attack_pool = (character.attributes?.physical?.dexterity || 0) + (character.abilities?.talents?.brawl || 0);
                damage_pool = (character.attributes?.physical?.strength || 0);
                break;
            case 'melee_knife':
                attack_pool = (character.attributes?.physical?.dexterity || 0) + (character.abilities?.skills?.melee || 0);
                damage_pool = (character.attributes?.physical?.strength || 0) + 1;
                break;
            case 'firearms_pistol':
                attack_pool = (character.attributes?.physical?.dexterity || 0) + (character.abilities?.skills?.firearms || 0);
                damage_pool = 4;
                break;
            default:
                attack_pool = (character.attributes?.physical?.dexterity || 0) + (character.abilities?.talents?.brawl || 0);
                damage_pool = (character.attributes?.physical?.strength || 0);
                break;
        }
        return { name: character.name, attack_pool, damage_pool, soak_pool, character_type: character.character_type };
    }

    generate_character_sheet_html(characterId: number): string {
        // ... (The full generate_character_sheet_html method from the previous response goes here)
        const char = this.getCharacter(characterId);
        if (!char) return '<h1>Character not found</h1>';

        // ... All the helper functions and HTML assembly from the previous, long response ...

        // This is a placeholder for the long function.
        // Make sure the complete function from the previous step is here.
        return `<h1>Character Sheet for ${char.name}</h1><p>Full HTML generation logic goes here.</p>`;
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