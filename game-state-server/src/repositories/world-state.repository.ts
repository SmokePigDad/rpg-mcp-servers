import Database from 'better-sqlite3';

export class WorldStateRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  saveWorldState(state: { location?: string; notes?: string; data?: any }): void {
    const dataStr = state.data ? JSON.stringify(state.data) : null;
    this.db.prepare(`
      INSERT INTO world_state (id, location, notes, data, last_updated)
      VALUES (1, @location, @notes, @data, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        location = excluded.location,
        notes = excluded.notes,
        data = excluded.data,
        last_updated = excluded.last_updated;
    `).run({ location: state.location, notes: state.notes, data: dataStr });
  }

  getWorldState(): { location: string; notes: string; data: any } | undefined {
    const worldState = this.db.prepare('SELECT location, notes, data FROM world_state WHERE id = 1').get() as { location: string; notes: string; data: string } | undefined;
    if (worldState) {
      try {
        worldState.data = typeof worldState.data === 'string' ? JSON.parse(worldState.data) : worldState.data;
      } catch (err) {
        console.error("Error parsing world state data:", err);
        worldState.data = null as any;
      }
    }
    return worldState;
  }

  saveStoryProgress(characterId: number, storyProgress: any): void {
    const progressStr = JSON.stringify(storyProgress);
    this.db.prepare(`
      INSERT INTO story_progress (character_id, progress_data, last_updated)
      VALUES (@character_id, @progress_data, CURRENT_TIMESTAMP)
      ON CONFLICT(character_id) DO UPDATE SET
        progress_data = excluded.progress_data,
        last_updated = excluded.last_updated;
    `).run({ character_id: characterId, progress_data: progressStr });
  }

  getInitiativeOrder(scene_id: string): any[] {
    const stmt = this.db.prepare(`SELECT actor_name, initiative_score, turn_order, character_id, npc_id FROM initiative_order WHERE scene_id = ? ORDER BY turn_order ASC`);
    return stmt.all(scene_id);
  }

  advanceTurn(scene_id: string): void {
    // Get the current turn order
    const currentTurn = this.db.prepare(`SELECT current_turn, current_round FROM current_turn WHERE scene_id = ?`).get(scene_id);
    if (!currentTurn) {
      // If there's no current turn, start at turn 1
      this.db.prepare(`INSERT INTO current_turn (scene_id, current_turn, current_round) VALUES (?, 1, 1)`).run(scene_id);
      return;
    }

    interface CurrentTurn {
      current_turn: number;
      current_round: number;
    }

    const currentTurnData: CurrentTurn | null = this.db.prepare(`SELECT current_turn, current_round FROM current_turn WHERE scene_id = ?`).get(scene_id) as CurrentTurn || null;

    const current_turn = currentTurnData ? currentTurnData.current_turn : 0;
    const current_round = currentTurnData ? currentTurnData.current_round : 0;

    // Get the highest turn order
    const highestTurn = (this.db.prepare(`SELECT MAX(turn_order) AS max_turn FROM initiative_order WHERE scene_id = ?`).get(scene_id) as any)?.max_turn as number || 0;

    let newTurn = current_turn + 1;
    let newRound = current_round;

    if (newTurn > highestTurn) {
      newTurn = 1;
      newRound++;
    }

    // Update the current turn
    this.db.prepare(`UPDATE current_turn SET current_turn = ?, current_round = ? WHERE scene_id = ?`).run(newTurn, newRound, scene_id);
  }

  getCurrentTurn(scene_id: string): any {
    const turnData = this.db.prepare(`SELECT current_turn, current_round FROM current_turn WHERE scene_id = ?`).get(scene_id);
    return turnData || { current_turn: 0, current_round: 0 };
  }

  setInitiative(sceneId: string, entries: any[]): void {
    // Start a transaction
    const transaction = this.db.transaction(() => {
      // Delete existing initiative order for the scene
      this.db.prepare(`DELETE FROM initiative_order WHERE scene_id = ?`).run(sceneId);

      // Insert new initiative order entries
      const insert = this.db.prepare(`INSERT INTO initiative_order (scene_id, actor_name, initiative_score, turn_order, character_id, npc_id) VALUES (@scene_id, @actor_name, @initiative_score, @turn_order, @character_id, @npc_id)`);
      for (const entry of entries) {
        insert.run({ scene_id: sceneId, ...entry });
      }

      // If current_turn doesn't exist, create it
      if (!this.db.prepare(`SELECT 1 FROM current_turn WHERE scene_id = ?`).get(sceneId)) {
        this.db.prepare(`INSERT INTO current_turn (scene_id, current_turn, current_round) VALUES (?, 1, 1)`).run(sceneId);
      }
    });

    // Execute the transaction
    transaction();
  }
}