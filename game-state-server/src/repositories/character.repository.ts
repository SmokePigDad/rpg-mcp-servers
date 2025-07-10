import Database from 'better-sqlite3';
import type { CharacterData } from '../types/character.types.js';

export class CharacterRepository {
  private db: Database.Database;
constructor(db: Database.Database) {
    this.db = db;
  }

  getCharacterByName(name: string): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE name = ?').get(name);
    return row ? (row as CharacterData) : null;
  }

  getCharacterById(id: number): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
    return row ? (row as CharacterData) : null;
  }

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
    listCharacters(): CharacterData[] {
    const rows = this.db.prepare('SELECT * FROM characters').all();
    return rows as CharacterData[];
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
            data.generation ?? 13,
            data.blood_pool_current ?? 10,
            data.blood_pool_max ?? 10,
            data.humanity ?? 7
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
            data.gnosis_current ?? 3, data.gnosis_permanent ?? 3,
            data.rage_current ?? 1, data.rage_permanent ?? 1,
            data.renown_glory ?? 0, data.renown_honor ?? 0, data.renown_wisdom ?? 0
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
            data.arete ?? 1,
            data.quintessence ?? 0,
            data.paradox ?? 0
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
            data.glamour_current ?? 4, data.glamour_permanent ?? 4,
            data.banality_permanent ?? 3
          );
          break;
      }

      // Changeling-specific: arts/realms
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

      // Transactional inserts for all relations as needed
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
}
