import Database from 'better-sqlite3';
import type { AntagonistRow } from '../types/antagonist.types.js';
import { ANTAGONIST_TEMPLATES } from '../antagonists.js';

export class AntagonistRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
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

  getAntagonistByName(name: string): AntagonistRow | null {
    const row = this.db.prepare('SELECT * FROM npcs WHERE name = ?').get(name);
    return row ? (row as AntagonistRow) : null;
  }

  getAntagonistById(id: number): AntagonistRow | null {
    const row = this.db.prepare('SELECT * FROM npcs WHERE id = ?').get(id);
    return row ? (row as AntagonistRow) : null;
  }
}
