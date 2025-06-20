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
    
    display_health(characterId: number) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);

        const healthLevels = character.health_levels.split(',');
        const damage = character.damage_taken;

        let display = 'Health Status:\n';
        let penalty = 0;
        const penalties = [0, -1, -1, -2, -2, -5, -5];

        // Create an array to represent the filled boxes
        const filledBoxes = Array(damage.aggravated).fill('*')
                            .concat(Array(damage.lethal).fill('X'))
                            .concat(Array(damage.bashing).fill('/'));
        
        // Pad with empty boxes
        const boxes = filledBoxes.concat(Array(healthLevels.length - filledBoxes.length).fill(' '));

        for (let i = 0; i < healthLevels.length; i++) {
            const levelName = healthLevels[i];
            const levelPenalty = penalties[i] || 0;
            const boxState = `[${boxes[i]}]`;

            display += `${boxState} ${levelName.padEnd(12)} (Penalty: ${levelPenalty})\n`;
        }

        // Determine the current wound penalty
        const totalDamage = damage.aggravated + damage.lethal + damage.bashing;
        if (totalDamage > 0 && totalDamage <= healthLevels.length) {
            penalty = penalties[totalDamage - 1] || 0;
        }
        
        display += `\nCurrent Wound Penalty: ${penalty} to dice pools.`;

        // Return an object with both the visual string and the raw penalty number
        return {
            visual: display,
            penalty: penalty
        };
    }

    spend_experience(characterId: number, traitToImprove: string) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);

        // Determine the cost
        let cost = 0;
        let currentRating = 0;
        let traitType = '';

        const traitPath = traitToImprove.split('.');
        const mainType = traitPath[0]; // e.g., 'attributes', 'abilities', 'powers'

        // Get current rating from nested JSON
        let temp: any = character;
        for (const part of traitPath) {
            if (temp[part] === undefined) throw new Error(`Invalid trait path: ${traitToImprove}`);
            temp = temp[part];
        }
        currentRating = Number(temp);

        // Calculate cost based on WoD rules
        switch (mainType) {
            case 'attributes':
                cost = currentRating * 4;
                traitType = 'Attribute';
                break;
            case 'abilities':
                cost = currentRating * 2;
                traitType = 'Ability';
                break;
            case 'powers': // Assuming disciplines, spheres, gifts etc. are inside 'powers'
                // This is a simplified version; real rules are more complex (clan vs out-of-clan)
                cost = currentRating * 5; // Using a generic 'x5' multiplier
                traitType = 'Power';
                break;
            case 'willpower_permanent':
                 cost = currentRating;
                 traitType = 'Willpower';
                 break;
            default:
                throw new Error(`Unknown trait type for XP expenditure: ${mainType}`);
        }

        if (currentRating >= 5 && mainType !== 'willpower_permanent') { // Most traits cap at 5
            throw new Error(`${traitType} is already at its maximum rating of 5.`);
        }

        const availableXp = character.experience_total - character.experience_spent;
        if (availableXp < cost) {
            throw new Error(`Not enough experience. Needs ${cost}, has ${availableXp}.`);
        }

        // Apply the update
        const newRating = currentRating + 1;
        const newSpentXp = character.experience_spent + cost;
        
        // Use the existing updateCharacter tool for robustness
        this.updateCharacter(characterId, {
            [traitToImprove]: newRating,
            'experience_spent': newSpentXp
        });

        return {
            message: `Success! Spent ${cost} XP to raise ${traitToImprove} to ${newRating}.`,
            remainingXp: availableXp - cost
        };
    }

    generate_character_sheet_html(characterId: number): string {
        const char = this.getCharacter(characterId);
        if (!char) return '<h1>Character not found</h1>';

        const renderDots = (count: number) => '●'.repeat(count || 0) + '○'.repeat(Math.max(0, 5 - (count || 0)));
        const renderWillpower = (current: number, max: number) => '■'.repeat(current || 0) + '□'.repeat(Math.max(0, (max || 0) - (current || 0)));

        // --- Attributes ---
        const attributesHtml = `
            <tr><th>Strength</th><td>${renderDots(char.attributes?.physical?.strength)}</td><th>Charisma</th><td>${renderDots(char.attributes?.social?.charisma)}</td><th>Perception</th><td>${renderDots(char.attributes?.mental?.perception)}</td></tr>
            <tr><th>Dexterity</th><td>${renderDots(char.attributes?.physical?.dexterity)}</td><th>Manipulation</th><td>${renderDots(char.attributes?.social?.manipulation)}</td><th>Intelligence</th><td>${renderDots(char.attributes?.mental?.intelligence)}</td></tr>
            <tr><th>Stamina</th><td>${renderDots(char.attributes?.physical?.stamina)}</td><th>Appearance</th><td>${renderDots(char.attributes?.social?.appearance)}</td><th>Wits</th><td>${renderDots(char.attributes?.mental?.wits)}</td></tr>
        `;

        // --- Abilities ---
        const renderAbilityColumn = (type: 'talents' | 'skills' | 'knowledges') => {
            let html = '';
            const abilities = char.abilities?.[type] || {};
            const abilityKeys = Object.keys(abilities);
            
            // A standard-ish order for display
            const orderedKeys = [
                // Talents
                'Alertness', 'Athletics', 'Brawl', 'Dodge', 'Empathy', 'Intimidation', 'Leadership', 'Streetwise', 'Subterfuge',
                // Skills
                'Animal Ken', 'Crafts', 'Drive', 'Etiquette', 'Firearms', 'Melee', 'Performance', 'Security', 'Stealth', 'Survival', 'Larceny',
                // Knowledges
                'Academics', 'Computer', 'Finance', 'Investigation', 'Law', 'Linguistics', 'Medicine', 'Occult', 'Politics', 'Science'
            ];

            // Sort the character's actual abilities based on the standard order for consistency
            const sortedAbilities = abilityKeys.sort((a, b) => {
                const indexA = orderedKeys.indexOf(a.charAt(0).toUpperCase() + a.slice(1));
                const indexB = orderedKeys.indexOf(b.charAt(0).toUpperCase() + b.slice(1));
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });

            for (const key of sortedAbilities) {
                html += `<tr><th>${key.charAt(0).toUpperCase() + key.slice(1)}</th><td>${renderDots(abilities[key])}</td></tr>`;
            }
            return html;
        };

        // --- Advantages ---
        const renderAdvantages = () => {
            let backgroundsHtml = '';
            for (const key in char.backgrounds) {
                backgroundsHtml += `<tr><th>${key.charAt(0).toUpperCase() + key.slice(1)}</th><td>${renderDots(char.backgrounds[key])}</td></tr>`;
            }

            let powersHtml = '';
            for (const powerType in char.powers) {
                powersHtml += `<tr><th colspan="2" class="subheader">${powerType.charAt(0).toUpperCase() + powerType.slice(1)}</th></tr>`;
                for (const powerName in char.powers[powerType]) {
                    powersHtml += `<tr><th>${powerName.charAt(0).toUpperCase() + powerName.slice(1)}</th><td>${renderDots(char.powers[powerType][powerName])}</td></tr>`;
                }
            }
            return { backgroundsHtml, powersHtml };
        };
        const { backgroundsHtml, powersHtml } = renderAdvantages();

        // --- Health ---
        const renderHealth = () => {
            const healthLevels = char.health_levels.split(',');
            const damage = char.damage_taken;
            const penalties = [0, -1, -1, -2, -2, -5, -5];
            let filledBoxes = Array(damage.aggravated || 0).fill('*')
                              .concat(Array(damage.lethal || 0).fill('X'))
                              .concat(Array(damage.bashing || 0).fill('/'));
            let boxes = filledBoxes.concat(Array(healthLevels.length - filledBoxes.length).fill(' '));
            
            let healthHtml = '';
            for (let i = 0; i < healthLevels.length; i++) {
                healthHtml += `<tr><th>${healthLevels[i]} (${penalties[i] || 0})</th><td>[ ${boxes[i]} ]</td></tr>`;
            }
            return healthHtml;
        };

        // --- Final HTML Assembly ---
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Character Sheet: ${char.name}</title>
            <style>
                body { font-family: 'Times New Roman', Times, serif; background-color: #1a1a1a; color: #ccc; margin: 0; padding: 20px; }
                .sheet { border: 3px double #8B0000; background-image: url('https://www.transparenttextures.com/patterns/crissxcross.png'); background-color: #2a2a2a; padding: 20px; max-width: 850px; margin: auto; box-shadow: 0 0 15px rgba(0,0,0,0.7); }
                h1, h2 { font-family: 'Uncial Antiqua', cursive; color: #990000; text-align: center; border-bottom: 1px solid #8B0000; padding-bottom: 5px; text-shadow: 1px 1px 2px #000; }
                h1 { font-size: 2.5em; margin-top: 0; }
                h2 { font-size: 1.8em; margin-top: 30px; }
                .header-info { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; border-bottom: 1px dashed #555; margin-bottom: 15px; padding: 10px 0; }
                .section { margin-bottom: 20px; }
                .grid-3-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { padding: 4px 8px; text-align: left; }
                th { font-weight: bold; width: 120px; }
                td { font-family: 'Courier New', monospace; font-size: 1.2em; letter-spacing: 2px; color: #fff; }
                .subheader { background-color: #444; color: #ddd; font-style: italic; text-align: center; }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap" rel="stylesheet">
        </head>
        <body>
            <div class="sheet">
                <h1>${char.name}</h1>
                <div class="header-info">
                    <div><strong>Nature:</strong> ${char.nature || ''}</div>
                    <div><strong>Demeanor:</strong> ${char.demeanor || ''}</div>
                    <div><strong>Concept:</strong> ${char.concept || ''}</div>
                    <div><strong>Type:</strong> ${char.character_type}</div>
                    <div><strong>Splat:</strong> ${char.splat1 || ''}</div>
                    <div><strong>XP:</strong> ${(char.experience_total || 0) - (char.experience_spent || 0)} available</div>
                </div>

                <div class="section">
                    <h2>Attributes</h2>
                    <table class="grid-3-col">
                        <thead><tr><th>Physical</th><th></th><th>Social</th><th></th><th>Mental</th><th></th></tr></thead>
                        <tbody>${attributesHtml}</tbody>
                    </table>
                </div>

                <div class="section grid-3-col">
                    <div>
                        <h3>Talents</h3>
                        <table><tbody>${renderAbilityColumn('talents')}</tbody></table>
                    </div>
                    <div>
                        <h3>Skills</h3>
                        <table><tbody>${renderAbilityColumn('skills')}</tbody></table>
                    </div>
                    <div>
                        <h3>Knowledges</h3>
                        <table><tbody>${renderAbilityColumn('knowledges')}</tbody></table>
                    </div>
                </div>

                <div class="section grid-3-col">
                    <div>
                        <h3>Backgrounds</h3>
                        <table><tbody>${backgroundsHtml}</tbody></table>
                    </div>
                    <div>
                        <h3>Powers</h3>
                        <table><tbody>${powersHtml}</tbody></table>
                    </div>
                    <div>
                        <h3>Health</h3>
                        <table><tbody>${renderHealth()}</tbody></table>
                        <h3>Willpower</h3>
                        <table><tr><th>Willpower</th><td class="dots">${renderWillpower(char.willpower_current, char.willpower_permanent)}</td></tr></table>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
        return html;
    }

    getCombatStats(characterId: number, attack_type: string) {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error(`Character with ID ${characterId} not found.`);

        let attack_pool = 0;
        let damage_pool = 0;
        let soak_pool = character.attributes.physical.stamina || 0;
        
        // Determine pools based on attack type. This can be expanded.
        switch (attack_type) {
            case 'brawl_punch':
                attack_pool = (character.attributes.physical.dexterity || 0) + (character.abilities.talents.brawl || 0);
                damage_pool = (character.attributes.physical.strength || 0); // Bashing
                break;
            case 'melee_knife':
                attack_pool = (character.attributes.physical.dexterity || 0) + (character.abilities.skills.melee || 0);
                damage_pool = (character.attributes.physical.strength || 0) + 1; // Str+1 Lethal for a knife
                break;
            case 'firearms_pistol':
                attack_pool = (character.attributes.physical.dexterity || 0) + (character.abilities.skills.firearms || 0);
                // Damage for firearms is fixed, not based on strength
                damage_pool = 4; // Example for a light pistol
                break;
            default:
                throw new Error(`Unknown attack_type: ${attack_type}`);
        }

        // Add Werewolf-specific soak rules
        if (character.character_type === 'Werewolf') {
            // In most forms, Werewolves can soak lethal damage with base Stamina.
            // This is a simplification; a full implementation would check their current form.
            soak_pool += 0; // The logic for soaking lethal is handled by the soak tool, not the pool size itself
        }

        return {
            name: character.name,
            attack_pool,
            damage_pool,
            soak_pool,
            character_type: character.character_type
        };
    }

    close() {
        this.db.close();
    }
}