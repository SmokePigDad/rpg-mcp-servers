// File: game-state-server/src/repositories/character.repository.ts

import type { Database } from 'better-sqlite3';
import type { CharacterData } from '../types/character.types.js';
import { HealthTracker } from '../health-tracker.js';

interface Ability {
  name: string;
  type: string;
  rating: number;
  specialty?: string;
}

interface SupernaturalPower {
  name: string;
  rating: number;
}

export class CharacterRepository {
  private db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  public removeCharacter(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM characters WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  public getCharacterByName(name: string): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE name = ?').get(name);
    if (!row) return null;
    // After getting the base character, enrich it with relational data.
    return this.getCharacterById((row as any).id);
  }

  public getCharacterById(id: number): CharacterData | null {
    const character = this.db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
    if (!character) {
      return null;
    }

    const enrichedCharacter = character as CharacterData;
    
    enrichedCharacter.abilities = this.db.prepare('SELECT ability_name as name, ability_type as type, rating, specialty FROM character_abilities WHERE character_id = ?').all(id) as Ability[];
    
    switch (enrichedCharacter.game_line) {
      case 'vampire':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_vampire_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.disciplines = this.db.prepare('SELECT discipline_name as name, rating FROM character_disciplines WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
      case 'werewolf':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_werewolf_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.gifts = this.db.prepare('SELECT gift_name as name, rank as rating FROM character_gifts WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
      case 'mage':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_mage_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.spheres = this.db.prepare('SELECT sphere_name as name, rating FROM character_spheres WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
      case 'changeling':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_changeling_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.arts = this.db.prepare('SELECT art_name as name, rating FROM character_arts WHERE character_id = ?').all(id) as SupernaturalPower[];
        enrichedCharacter.realms = this.db.prepare('SELECT realm_name as name, rating FROM character_realms WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
    }

    return enrichedCharacter;
  }

  public updateCharacter(id: number, updates: Partial<CharacterData>): CharacterData | null {
    const character = this.getCharacterById(id);
    if (!character) {
        throw new Error(`Character with ID ${id} not found for update.`);
    }

    // Define a schema with expected types for validation
    const validFields: { [key: string]: string } = {
        name: 'string', concept: 'string', strength: 'number', dexterity: 'number', stamina: 'number',
        charisma: 'number', manipulation: 'number', appearance: 'number', perception: 'number',
        intelligence: 'number', wits: 'number', willpower_current: 'number', willpower_permanent: 'number',
        experience: 'number', clan: 'string', generation: 'number', blood_pool_current: 'number',
        blood_pool_max: 'number', humanity: 'number', breed: 'string', auspice: 'string',
        tribe: 'string', gnosis_current: 'number', gnosis_permanent: 'number', rage_current: 'number',
        rage_permanent: 'number', renown_glory: 'number', renown_honor: 'number', renown_wisdom: 'number',
        tradition_convention: 'string', arete: 'number', quintessence: 'number', paradox: 'number',
        kith: 'string', seeming: 'string', glamour_current: 'number', glamour_permanent: 'number',
        banality_permanent: 'number'
    };

    const mainTableFields = [
      'name', 'concept', 'strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance',
      'perception', 'intelligence', 'wits', 'willpower_current', 'willpower_permanent', 'experience'
    ];

    const splatTableFields: Record<string, string[]> = {
      vampire: ['clan', 'generation', 'blood_pool_current', 'blood_pool_max', 'humanity'],
      werewolf: ['breed', 'auspice', 'tribe', 'gnosis_current', 'gnosis_permanent', 'rage_current', 'rage_permanent', 'renown_glory', 'renown_honor', 'renown_wisdom'],
      mage: ['tradition_convention', 'arete', 'quintessence', 'paradox'],
      changeling: ['kith', 'seeming', 'glamour_current', 'glamour_permanent', 'banality_permanent']
    };

    const mainUpdates: Record<string, any> = {};
    const splatUpdates: Record<string, any> = {};

    for (const key in updates) {
        if (!validFields[key]) {
            throw new Error(`Invalid field for update: '${key}'. Field does not exist or cannot be updated.`);
        }
        if (typeof updates[key as keyof typeof updates] !== validFields[key]) {
            throw new Error(`Invalid data type for field '${key}'. Expected ${validFields[key]}, but got ${typeof updates[key as keyof typeof updates]}.`);
        }

        if (mainTableFields.includes(key)) {
            mainUpdates[key] = updates[key as keyof typeof updates];
        } else if (splatTableFields[character.game_line]?.includes(key)) {
            splatUpdates[key] = updates[key as keyof typeof updates];
        }
    }

    this.db.transaction(() => {
        if (Object.keys(mainUpdates).length > 0) {
            const setClause = Object.keys(mainUpdates).map(field => `${field} = ?`).join(', ');
            this.db.prepare(`UPDATE characters SET ${setClause} WHERE id = ?`).run(...Object.values(mainUpdates), id);
        }
        if (Object.keys(splatUpdates).length > 0) {
            const splatTableName = `character_${character.game_line}_traits`;
            const setClause = Object.keys(splatUpdates).map(field => `${field} = ?`).join(', ');
            this.db.prepare(`UPDATE ${splatTableName} SET ${setClause} WHERE character_id = ?`).run(...Object.values(splatUpdates), id);
        }
    })();

    return this.getCharacterById(id);
  }

  public updateOrInsertRelationalTrait(character_id: number, table: string, name_column: string, trait_name: string, new_rating: number, ability_type?: string): void {
    const existing = this.db.prepare(`SELECT rating FROM ${table} WHERE character_id = ? AND ${name_column} = ?`).get(character_id, trait_name);

    if (existing) {
      this.db.prepare(`UPDATE ${table} SET rating = ? WHERE character_id = ? AND ${name_column} = ?`).run(new_rating, character_id, trait_name);
    } else {
      if (table === 'character_abilities') {
        if (!ability_type) {
          throw new Error("Internal error: ability_type is required when adding a new ability.");
        }
        this.db.prepare(`INSERT INTO ${table} (character_id, ${name_column}, ability_type, rating) VALUES (?, ?, ?, ?)`).run(character_id, trait_name, ability_type, new_rating);
      } else {
        this.db.prepare(`INSERT INTO ${table} (character_id, ${name_column}, rating) VALUES (?, ?, ?)`).run(character_id, trait_name, new_rating);
      }
    }
  }

  public listCharacters(): CharacterData[] {
    const rows = this.db.prepare('SELECT * FROM characters').all();
    return rows.map(row => this.getCharacterById((row as any).id)).filter(Boolean) as CharacterData[];
  }

  public applyDamage(characterId: number, dmg: { aggravated?: number; lethal?: number; bashing?: number }): CharacterData | null {
    const character = this.getCharacterById(characterId);
    if (!character) return null;

    const tracker = HealthTracker.from(character.health_levels);
    tracker.applyDamage(dmg);

    const updatedHealthJson = tracker.serialize();
    this.db.prepare(`UPDATE characters SET health_levels = ? WHERE id = ?`).run(updatedHealthJson, characterId);
    return this.getCharacterById(characterId);
  }

  // REPLACE createCharacter
  public createCharacter(data: Partial<CharacterData>): CharacterData | null {
      // ... (health tracker setup remains the same) ...

      const healthTracker = HealthTracker.healthy();
      const health_levels_json = healthTracker.serialize();

      const charId = this.db.transaction(() => {
          const stmt = this.db.prepare(`
              INSERT INTO characters (name, concept, game_line, strength, dexterity, stamina, charisma, manipulation, appearance,
              perception, intelligence, wits, willpower_current, willpower_permanent, health_levels, experience, title, notes)
              VALUES (@name, @concept, @game_line, @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
              @perception, @intelligence, @wits, @willpower_current, @willpower_permanent, @health_levels, @experience, @title, @notes)
          `);
          const result = stmt.run({
              name: data.name,
              concept: data.concept || null,
              game_line: data.game_line,
              strength: data.strength ?? 1,
              dexterity: data.dexterity ?? 1,
              stamina: data.stamina ?? 1,
              charisma: data.charisma ?? 1,
              manipulation: data.manipulation ?? 1,
              appearance: data.appearance ?? 1,
              perception: data.perception ?? 1,
              intelligence: data.intelligence ?? 1,
              wits: data.wits ?? 1,
              willpower_current: data.willpower_permanent ?? 5,
              willpower_permanent: data.willpower_permanent ?? 5,
              health_levels: health_levels_json,
              experience: data.experience ?? 0,
              title: data.title ?? null,
              notes: data.notes ?? null
          });
          const localCharId = result.lastInsertRowid as number;

          switch (data.game_line) {
              case 'vampire':
                  this.db.prepare(`INSERT INTO character_vampire_traits (character_id, clan, generation, blood_pool_current, blood_pool_max, humanity, coterie_name, sect_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.clan ?? null,
                      data.generation ?? 13,
                      data.blood_pool_current ?? 10,
                      data.blood_pool_max ?? 10,
                      data.humanity ?? 7,
                      data.coterie_name ?? null,
                      data.sect_status ?? null
                  );
                  break;
              case 'werewolf':
                  this.db.prepare(`INSERT INTO character_werewolf_traits (character_id, breed, auspice, tribe, gnosis_current, gnosis_permanent, rage_current, rage_permanent, renown_glory, renown_honor, renown_wisdom, pack_name, pack_totem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.breed ?? null,
                      data.auspice ?? null,
                      data.tribe ?? null,
                      data.gnosis_current ?? 3,
                      data.gnosis_permanent ?? 3,
                      data.rage_current ?? 1,
                      data.rage_permanent ?? 1,
                      data.renown_glory ?? 0,
                      data.renown_honor ?? 0,
                      data.renown_wisdom ?? 0,
                      data.pack_name ?? null,
                      data.pack_totem ?? null
                  );
                  break;
              case 'mage':
                  this.db.prepare(`INSERT INTO character_mage_traits (character_id, tradition_convention, arete, quintessence, paradox, cabal_name, paradigm_notes) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.tradition_convention ?? null,
                      data.arete ?? 1,
                      data.quintessence ?? 0,
                      data.paradox ?? 0,
                      data.cabal_name ?? null,
                      data.paradigm_notes ?? null
                  );
                  break;
              case 'changeling':
                  this.db.prepare(`INSERT INTO character_changeling_traits (character_id, kith, seeming, glamour_current, glamour_permanent, banality_permanent, court, house, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.kith ?? null,
                      data.seeming ?? null,
                      data.glamour_current ?? 4,
                      data.glamour_permanent ?? 4,
                      data.banality_permanent ?? 3,
                      data.court ?? null,
                      data.house ?? null,
                      data.title ?? null
                  );
                  break;
          }
          // ... (ability/discipline insertion logic remains the same) ...
          if (data.abilities && Array.isArray(data.abilities)) {
              const abilityStmt = this.db.prepare(`INSERT INTO character_abilities (character_id, ability_name, ability_type, rating, specialty) VALUES (?, ?, ?, ?, ?)`);
              for (const ability of data.abilities) {
                  abilityStmt.run(localCharId, ability.name, ability.type, ability.rating, ability.specialty ?? null);
              }
          }
          return localCharId;
      })();
      return this.getCharacterById(charId as number);
  }

  public batchImproveTraits(character_id: number, improvements: { trait_type: string; trait_name: string; }[]): { summary: string; final_xp: number; } {
      const calculateXpCost = (trait_type: string, current_rating: number): number => {
          const new_rating = current_rating + 1;
          switch (trait_type) {
              case 'attribute': return new_rating * 4;
              case 'ability': return new_rating * 2;
              case 'discipline': return new_rating * 5; // VTM
              case 'arete': return new_rating * 10; // MTA
              case 'art': return new_rating * 4; // CTD
              case 'willpower': return current_rating; // V20 rule
              default: throw new Error(`XP cost calculation not defined for trait type: ${trait_type}`);
          }
      };

      return this.db.transaction(() => {
          const character = this.getCharacterById(character_id);
          if (!character) throw new Error("Character not found.");

          let totalXpCost = 0;
          const improvementDetails: string[] = [];
          const improvementActions: (() => void)[] = [];

          for (const imp of improvements) {
              const { trait_type, trait_name } = imp;
              let current_rating = 0;
              let isRelational = ['ability', 'discipline', 'art', 'sphere', 'gift'].includes(trait_type);

              if (isRelational) {
                  const relationalTraits = (character as any)[`${trait_type}s`] || [];
                  const trait = relationalTraits.find((t: any) => t.name.toLowerCase() === trait_name.toLowerCase());
                  current_rating = trait ? trait.rating : 0;
              } else {
                  current_rating = (character as any)[trait_name.toLowerCase()] ?? 0;
              }
              
              if (typeof current_rating !== 'number') {
                  throw new Error(`Trait '${trait_name}' could not be found or does not have a numeric rating.`);
              }

              const cost = calculateXpCost(trait_type, current_rating);
              totalXpCost += cost;
              improvementDetails.push(`${trait_name} (${current_rating} -> ${current_rating + 1}) for ${cost} XP`);

              const new_rating = current_rating + 1;
              if (isRelational) {
                  const table = `character_${trait_type}s`;
                  const nameCol = `${trait_type}_name`;
                  improvementActions.push(() => this.updateOrInsertRelationalTrait(character_id, table, nameCol, trait_name, new_rating));
              } else {
                  improvementActions.push(() => this.updateCharacter(character_id, { [trait_name]: new_rating }));
              }
          }

          if (character.experience < totalXpCost) {
              throw new Error(`Insufficient XP. Needs ${totalXpCost}, but only has ${character.experience}.`);
          }

          // Execute all improvements
          improvementActions.forEach(action => action());

          const final_xp = character.experience - totalXpCost;
          this.updateCharacter(character_id, { experience: final_xp });

          return { summary: `Successfully improved: ${improvementDetails.join(', ')}.`, final_xp };
      })();
  }
}