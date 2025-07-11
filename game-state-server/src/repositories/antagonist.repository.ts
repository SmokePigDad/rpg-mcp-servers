import type { Database } from 'better-sqlite3';
import type { AntagonistRow } from '../types/antagonist.types.js';
import { ANTAGONIST_TEMPLATES } from '../antagonists.js';

export class AntagonistRepository {
  private db: Database;
constructor(db: Database) {
    this.db = db;
  }

  getAntagonistByName(name: string): AntagonistRow | null {
    const stmt = this.db.prepare('SELECT * FROM npcs WHERE name = ?');
    const row = stmt.get(name) as AntagonistRow;
    return row ? row : null;
  }

  getAntagonistById(id: number): AntagonistRow | null {
    const stmt = this.db.prepare('SELECT * FROM npcs WHERE id = ?');
    const row = stmt.get(id) as AntagonistRow;
    return row ? row : null;
  }
  /**
   * Apply health damage (bashing, lethal, aggravated) to an NPC.
   * Updates health_levels, returns updated AntagonistRow or null if not found.
   */
  applyDamage(id: number, damage: { bashing: number, lethal: number, aggravated: number }): AntagonistRow | null {
    const npc = this.getAntagonistById(id);
    if (!npc) return null;
    // Parse existing health levels (should be stringified JSON or object).
    let healthObj: Record<string, number> = {};
    if (typeof npc.health_levels === "string") {
      try {
        healthObj = JSON.parse(npc.health_levels);
      } catch {
        healthObj = {};
      }
    } else if (typeof npc.health_levels === "object" && npc.health_levels !== null) {
      healthObj = typeof npc.health_levels === "object" && npc.health_levels !== null
        ? JSON.parse(JSON.stringify(npc.health_levels))
        : {};
    }
    // Default health levels if missing
    const order = ["bruised", "hurt", "injured", "wounded", "mauled", "crippled", "incapacitated"];
    order.forEach(lvl => { if (!(lvl in healthObj)) healthObj[lvl] = 0; });

    // Assign damage in order (bashing → lethal → aggravated). Each call adds one type only, for total provided.
    // We'll simply increment bashing/lethal/agg in that order, by damage amount, similar to characters.
    if (damage.bashing) healthObj["bruised"] += damage.bashing;
    if (damage.lethal) healthObj["hurt"] += damage.lethal;
    if (damage.aggravated) healthObj["mauled"] += damage.aggravated;

    // Save updated health levels
    this.db.prepare("UPDATE npcs SET health_levels = ? WHERE id = ?").run(JSON.stringify(healthObj), id);
    return this.getAntagonistById(id);
  }
  
  createAntagonist(template_name: string, custom_name?: string): AntagonistRow | null {
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
        strength: data.attributes?.strength || 1,
        dexterity: data.attributes?.dexterity || 1,
        stamina: data.attributes?.stamina || 1,
        charisma: data.attributes?.charisma || 1,
        manipulation: data.attributes?.manipulation || 1,
        appearance: data.attributes?.appearance || 1,
        perception: data.attributes?.perception || 1,
        intelligence: data.attributes?.intelligence || 1,
        wits: data.attributes?.wits || 1,
        willpower_current: data.willpower || 1,
        willpower_permanent: data.willpower || 1,
        health_levels: JSON.stringify(data.health_levels ?? {}),
        notes: data.description || null
      });
      npcId = result.lastInsertRowid as number;
      // 2. Modular splat trait tables
      switch (data.game_line) {
        case 'vampire':
          this.db.prepare(`
            INSERT INTO npc_vampire_traits
            (npc_id, clan, generation, blood_pool_current, blood_pool_max, humanity)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.supernatural?.clan ?? null,
            data.supernatural?.generation ?? null,
            data.supernatural?.blood_pool_current ?? null,
            data.supernatural?.blood_pool_max ?? null,
            data.supernatural?.humanity ?? null
          );
          break;
        case 'werewolf':
          this.db.prepare(`
            INSERT INTO npc_werewolf_traits
            (npc_id, breed, auspice, tribe, gnosis_current, gnosis_permanent, rage_current, rage_permanent, renown_glory, renown_honor, renown_wisdom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.supernatural?.breed ?? null,
            data.supernatural?.auspice ?? null,
            data.supernatural?.tribe ?? null,
            data.supernatural?.gnosis_current ?? null,
            data.supernatural?.gnosis_permanent ?? null,
            data.supernatural?.rage_current ?? null,
            data.supernatural?.rage_permanent ?? null,
            data.supernatural?.renown_glory ?? null,
            data.supernatural?.renown_honor ?? null,
            data.supernatural?.renown_wisdom ?? null
          );
          break;
        case 'mage':
          this.db.prepare(`
            INSERT INTO npc_mage_traits
            (npc_id, tradition_convention, arete, quintessence, paradox)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.supernatural?.tradition_convention ?? null,
            data.supernatural?.arete ?? null,
            data.supernatural?.quintessence ?? null,
            data.supernatural?.paradox ?? null
          );
          break;
        case 'changeling':
          this.db.prepare(`
            INSERT INTO npc_changeling_traits
            (npc_id, kith, seeming, glamour_current, glamour_permanent, banality_permanent)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.supernatural?.kith ?? null,
            data.supernatural?.seeming ?? null,
            data.supernatural?.glamour_current ?? null,
            data.supernatural?.glamour_permanent ?? null,
            data.supernatural?.banality_permanent ?? null
          );
          break;
      }

      // 3. Relational data (abilities, disciplines, gifts, spheres, arts, realms)
      if (data.abilities) {
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
        for (const [name, rating] of Object.entries(template.supernatural.gifts)) {
          giftStmt.run(npcId, name, rating);
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

  updateAntagonist(id: number, updates: Partial<AntagonistRow>): AntagonistRow | null {
    if (!updates || Object.keys(updates).length === 0) {
      return this.getAntagonistById(id);
    }

    const allowedFields = Object.keys(updates).filter(key => key !== "id");
    if (allowedFields.length === 0) {
      return this.getAntagonistById(id);
    }

    const setClause = allowedFields.map(field => `${field} = ?`).join(', ');
    const values = allowedFields.map(field => (updates as any)[field]);

    const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);

    return this.getAntagonistById(id);
  }

  listAntagonists(): AntagonistRow[] {
    const rows = this.db.prepare('SELECT * FROM npcs').all();
    return rows as AntagonistRow[];
  }

   removeAntagonist(id: number): boolean {
    const stmt = this.db.prepare(`DELETE FROM npcs WHERE id = ?`);
    const res = stmt.run(id);
    return res.changes > 0;
  }
}
