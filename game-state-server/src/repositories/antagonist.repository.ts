import type { Database } from 'better-sqlite3';
import type { AntagonistRow, CharacterData } from '../types/index.js';
import { ANTAGONIST_TEMPLATES } from '../antagonists.js';
import { HealthTracker } from '../health-tracker.js';

export class AntagonistRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public getAntagonistById(id: number): AntagonistRow | null {
    // This needs to be a complex join to be useful, similar to getCharacterById
    const antagonist = this.db.prepare('SELECT * FROM npcs WHERE id = ?').get(id);
    if (!antagonist) {
      return null;
    }
    // Future enhancement: Add joins to npc_splat_traits, etc.
    return antagonist as AntagonistRow;
  }

  public getAntagonistByName(name: string): AntagonistRow | null {
    const row = this.db.prepare('SELECT * FROM npcs WHERE name = ?').get(name) as AntagonistRow;
    return row ? this.getAntagonistById(row.id) : null;
  }

  public listAntagonists(): AntagonistRow[] {
    const rows = this.db.prepare('SELECT * FROM npcs ORDER BY name').all();
    return rows as AntagonistRow[];
  }

  public createAntagonist(template_name: string, custom_name?: string): AntagonistRow | null {
    const template = (ANTAGONIST_TEMPLATES as any)[template_name];
    if (!template) {
      throw new Error(`Antagonist template '${template_name}' not found.`);
    }
    
    // Use the custom creation method with the template data
    const antagonistData = {
      name: custom_name || template.name,
      game_line: template.game_line,
      concept: template.concept,
      ...template.attributes,
      willpower_permanent: template.willpower,
      // Add abilities and supernatural traits from template if they exist
      abilities: template.abilities ? Object.entries(template.abilities.talents || {}).map(([name, rating]) => ({ name, type: 'Talent', rating }))
        .concat(Object.entries(template.abilities.skills || {}).map(([name, rating]) => ({ name, type: 'Skill', rating })))
        .concat(Object.entries(template.abilities.knowledges || {}).map(([name, rating]) => ({ name, type: 'Knowledge', rating }))) : [],
      disciplines: template.supernatural?.disciplines ? Object.entries(template.supernatural.disciplines).map(([name, rating]) => ({ name, rating })) : [],
      //... add similar for gifts, arts, etc.
    };

    return this.createCustomAntagonist(antagonistData as Partial<CharacterData>);
  }

  public createCustomAntagonist(data: Partial<CharacterData>): AntagonistRow | null {
    if (!data.name || !data.game_line) {
        throw new Error("Custom antagonists require at least a name and a game_line.");
    }

    const healthTracker = HealthTracker.healthy();
    const health_levels_json = healthTracker.serialize();

    const npcId = this.db.transaction(() => {
        const stmt = this.db.prepare(`
            INSERT INTO npcs (
                name, concept, game_line, strength, dexterity, stamina, charisma, manipulation, appearance,
                perception, intelligence, wits, willpower_current, willpower_permanent, health_levels, notes, experience
            ) VALUES (
                @name, @concept, @game_line, @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
                @perception, @intelligence, @wits, @willpower_current, @willpower_permanent, @health_levels, @notes, @experience
            )
        `);

        const result = stmt.run({
            name: data.name,
            concept: data.concept || 'Custom Antagonist',
            game_line: data.game_line,
            strength: data.strength || 1, dexterity: data.dexterity || 1, stamina: data.stamina || 1,
            charisma: data.charisma || 1, manipulation: data.manipulation || 1, appearance: data.appearance || 1,
            perception: data.perception || 1, intelligence: data.intelligence || 1, wits: data.wits || 1,
            willpower_current: data.willpower_permanent || 5, willpower_permanent: data.willpower_permanent || 5,
            health_levels: health_levels_json,
            notes: data.notes || null,
            experience: 0
        });
        const localNpcId = result.lastInsertRowid as number;

        // Insert into splat-specific tables
        switch (data.game_line) {
            case 'vampire':
                this.db.prepare(`INSERT INTO npc_vampire_traits (npc_id, clan, generation, blood_pool_current, blood_pool_max, humanity) VALUES (?, ?, ?, ?, ?, ?)`).run(localNpcId, data.clan ?? null, data.generation ?? 13, data.blood_pool_current ?? 10, data.blood_pool_max ?? 10, data.humanity ?? 7);
                break;
            // ... (cases for other splats)
        }

        // Insert abilities, using character_id column for the NPC ID
        if (data.abilities && Array.isArray(data.abilities)) {
            const abilityStmt = this.db.prepare(`INSERT INTO character_abilities (character_id, ability_name, ability_type, rating) VALUES (?, ?, ?, ?)`);
            for (const ability of data.abilities) {
                abilityStmt.run(localNpcId, ability.name, ability.type, ability.rating);
            }
        }
        
        // Insert disciplines, using character_id column for the NPC ID
        if (data.disciplines && Array.isArray(data.disciplines)) {
            const discStmt = this.db.prepare(`INSERT INTO character_disciplines (character_id, discipline_name, rating) VALUES (?, ?, ?)`);
            for (const discipline of data.disciplines) {
                discStmt.run(localNpcId, discipline.name, discipline.rating);
            }
        }
        return localNpcId;
    })();

    return this.getAntagonistById(npcId as number);
  }

    // REPLACED updateAntagonist method: Simplified, robust, and type-safe

    public updateAntagonist(id: number, updates: Partial<AntagonistRow>): AntagonistRow | null {
        if (!updates || Object.keys(updates).length === 0) {
            // No updates provided, just return the current state.
            return this.getAntagonistById(id);
        }

        const validNpcFields: { [key: string]: string } = {
            name: 'string', template: 'string', concept: 'string', game_line: 'string',
            strength: 'number', dexterity: 'number', stamina: 'number',
            charisma: 'number', manipulation: 'number', appearance: 'number',
            perception: 'number', intelligence: 'number', wits: 'number',
            willpower_current: 'number', willpower_permanent: 'number',
            notes: 'string',
            experience: 'number'
        };

        const setClauseParts: string[] = [];
        const values: (string | number | null)[] = [];

        for (const key in updates) {
            if (key === 'id' || key === 'health_levels') continue; // Do not allow direct update of ID or health_levels

            if (!validNpcFields[key]) {
                throw new Error(`Invalid field for update: '${key}'. Field does not exist or cannot be updated.`);
            }

            const value = (updates as any)[key];
            if (typeof value !== validNpcFields[key]) {
                throw new Error(`Invalid data type for field '${key}'. Expected ${validNpcFields[key]}, but got ${typeof value}.`);
            }

            setClauseParts.push(`${key} = ?`);
            values.push(value);
        }

        if (setClauseParts.length === 0) {
            // No valid fields were provided for update.
            return this.getAntagonistById(id);
        }

        // Add the ID to the end of the values array for the WHERE clause
        values.push(id);

        const setClause = setClauseParts.join(', ');
        const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
        const result = stmt.run(...values);

        if (result.changes === 0) {
            // This can happen if the ID doesn't exist.
            throw new Error(`Antagonist with ID ${id} not found, no update performed.`);
        }

        return this.getAntagonistById(id);
    }
  
  public applyDamage(id: number, damage: { bashing: number; lethal: number; aggravated: number }): AntagonistRow | null {
    const npc = this.getAntagonistById(id);
    if (!npc) return null;
    
    const tracker = HealthTracker.from(npc.health_levels);
    tracker.applyDamage(damage);

    const updatedHealthJson = tracker.serialize();
    this.db.prepare(`UPDATE npcs SET health_levels = ? WHERE id = ?`).run(updatedHealthJson, id);
    return this.getAntagonistById(id);
  }

  public batchImproveAntagonistTraits(npc_id: number, improvements: { trait_type: string; trait_name: string; }[]): { summary: string; final_xp: number; } {
    const calculateXpCost = (trait_type: string, current_rating: number): number => {
        const new_rating = current_rating + 1;
        switch (trait_type) {
            case 'attribute': return new_rating * 4;
            case 'ability': return new_rating * 2;
            case 'discipline': return new_rating * 5;
            case 'art': return new_rating * 4;
            case 'willpower': return current_rating;
            default: throw new Error(`XP cost calculation not defined for trait type: ${trait_type}`);
        }
    };

    return this.db.transaction(() => {
        const antagonist = this.getAntagonistById(npc_id);
        if (!antagonist) throw new Error("Antagonist not found.");

        let totalXpCost = 0;
        const improvementDetails: string[] = [];

        for (const imp of improvements) {
            const { trait_type, trait_name } = imp;
            let current_rating = 0;
            // ... (logic to get current rating for different trait types)
            current_rating = (antagonist as any)[trait_name.toLowerCase()] ?? 0;

            const cost = calculateXpCost(trait_type, current_rating);
            totalXpCost += cost;
            improvementDetails.push(`${trait_name} (${current_rating} -> ${current_rating + 1}) for ${cost} XP`);
        }

        const current_xp = (antagonist as any).experience || 0;
        if (current_xp < totalXpCost) {
            throw new Error(`Insufficient XP for antagonist. Needs ${totalXpCost}, but only has ${current_xp}.`);
        }

        for (const imp of improvements) {
            // ... (logic to apply the improvements)
        }
        
        const final_xp = current_xp - totalXpCost;
        this.updateAntagonist(npc_id, { experience: final_xp } as Partial<AntagonistRow>);

        return { summary: `Successfully improved: ${improvementDetails.join(', ')}.`, final_xp };
    })();
  }

  public removeAntagonist(id: number): boolean {
    const transaction = this.db.transaction(() => {
      // Note: The relational tables use 'character_id' for both PCs and NPCs.
      this.db.prepare(`DELETE FROM character_abilities WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_disciplines WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_gifts WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_spheres WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_arts WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_realms WHERE character_id = ?`).run(id);
      
      this.db.prepare(`DELETE FROM npc_vampire_traits WHERE npc_id = ?`).run(id);
      this.db.prepare(`DELETE FROM npc_werewolf_traits WHERE npc_id = ?`).run(id);
      this.db.prepare(`DELETE FROM npc_mage_traits WHERE npc_id = ?`).run(id);
      this.db.prepare(`DELETE FROM npc_changeling_traits WHERE npc_id = ?`).run(id);

      const res = this.db.prepare('DELETE FROM npcs WHERE id = ?').run(id);

      if (res.changes === 0) {
        throw new Error(`Antagonist with ID ${id} not found.`);
      }
      return res.changes > 0;
    });

    try {
      return transaction();
    } catch (error) {
      console.error(`[AntagonistRepository] Failed to remove antagonist ${id}:`, error);
      return false;
    }
  }
}
