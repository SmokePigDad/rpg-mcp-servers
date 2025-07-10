import Database from 'better-sqlite3';

export class StatusEffectRepository {
  private db: Database.Database;
  constructor(db: Database.Database) {
    this.db = db;
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
}
