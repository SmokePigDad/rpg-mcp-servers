// File: game-state-server/src/repositories/world-state.repository.ts

import type { Database } from 'better-sqlite3';

export class WorldStateRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  saveWorldState(state: { location?: string; notes?: string; data?: any }): void {
    const dataStr = state.data ? JSON.stringify(state.data) : null;
    // Use UPSERT for a single world state row
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

  getWorldState(): any {
    const worldState = this.db.prepare('SELECT * FROM world_state WHERE id = 1').get() as any;
    if (worldState && worldState.data) {
      try {
        worldState.data = JSON.parse(worldState.data);
      } catch (err) {
        console.error("Error parsing world state data:", err);
        worldState.data = null;
      }
    }
    return worldState;
  }

  // CORRECTED: This method now matches the simpler schema.
  saveStoryProgress(progress: { chapter: string; scene: string; summary: string }): void {
    this.db.prepare(
      'INSERT INTO story_progress (chapter, scene, summary) VALUES (?, ?, ?)'
    ).run(progress.chapter, progress.scene, progress.summary);
  }

  // --- CORRECTED INITIATIVE & TURN MANAGEMENT ---

  setInitiative(sceneId: string, entries: any[]): void {
    const getCharacterName = this.db.prepare('SELECT name FROM characters WHERE id = ?');
    const getNpcName = this.db.prepare('SELECT name FROM npcs WHERE id = ?');

    // Start a transaction to ensure all operations succeed or fail together
    this.db.transaction(() => {
        // Clear old data for this scene to ensure a fresh start
        this.db.prepare(`DELETE FROM initiative_order WHERE scene_id = ?`).run(sceneId);
        this.db.prepare(`DELETE FROM scenes WHERE scene_id = ?`).run(sceneId);

        // Initialize the scene state
        this.db.prepare(`INSERT INTO scenes (scene_id, current_round, current_turn_order) VALUES (?, 1, 0)`).run(sceneId);

        const insertStmt = this.db.prepare(`
            INSERT INTO initiative_order (scene_id, actor_name, initiative_score, turn_order, character_id, npc_id)
            VALUES (@scene_id, @actor_name, @initiative_score, @turn_order, @character_id, @npc_id)
        `);

        for (const entry of entries) {
            let actor_name = entry.actor_name;

            // --- THIS IS THE FIX ---
            // If actor_name is missing, fetch it from the database using the ID.
            if (!actor_name) {
                if (entry.character_id) {
                    const char = getCharacterName.get(entry.character_id);
                    if (char) actor_name = (char as any).name;
                } else if (entry.npc_id) {
                    const npc = getNpcName.get(entry.npc_id);
                    if (npc) actor_name = (npc as any).name;
                }
            }

            // If we still don't have a name, the entry is invalid.
            if (!actor_name) {
                throw new Error(`Could not determine actor_name for entry with initiative ${entry.initiative_score}. Provide a name or a valid character/npc ID.`);
            }

            insertStmt.run({
                scene_id: sceneId,
                actor_name: actor_name,
                initiative_score: entry.initiative_score,
                turn_order: entry.turn_order,
                character_id: entry.character_id ?? null,
                npc_id: entry.npc_id ?? null,
            });
        }
    })();
  }
  
  getInitiativeOrder(scene_id: string): any[] {
    return this.db.prepare('SELECT * FROM initiative_order WHERE scene_id = ? ORDER BY turn_order ASC').all(scene_id);
  }
  
  advanceTurn(scene_id: string): { success: boolean; message?: string; next_actor?: any; new_round?: number; new_turn_order?: number } {
    const scene = this.db.prepare('SELECT * FROM scenes WHERE scene_id = ?').get(scene_id) as any;

    if (!scene) {
        return { success: false, message: `Scene with ID '${scene_id}' has not been started. Use set_initiative first.` };
    }

    const order = this.getInitiativeOrder(scene_id);
    if (order.length === 0) {
        return { success: false, message: "Initiative order is empty for this scene." };
    }

    // FIX: Correctly handle the very first turn of a scene
    let currentTurnOrder = scene.current_turn_order === 0 ? 1 : scene.current_turn_order + 1;
    let currentRound = scene.current_round;

    if (currentTurnOrder > order.length) {
        currentTurnOrder = 1;
        currentRound++;
    }

    this.db.prepare('UPDATE scenes SET current_turn_order = ?, current_round = ? WHERE scene_id = ?').run(currentTurnOrder, currentRound, scene_id);
    
    const nextActor = order[currentTurnOrder - 1]; // Array is 0-indexed

    return {
      success: true,
      next_actor: nextActor,
      new_round: currentRound,
      new_turn_order: currentTurnOrder,
    };
  }

  getCurrentTurn(scene_id: string): any {
    const scene = this.db.prepare('SELECT * FROM scenes WHERE scene_id = ?').get(scene_id) as any;
    if (!scene || scene.current_turn_order === 0) {
      return { success: false, message: "Combat has not started or initiative is not set." };
    }
    
    const actor = this.db.prepare('SELECT * FROM initiative_order WHERE scene_id = ? AND turn_order = ?').get(scene_id, scene.current_turn_order);
    
    return {
      success: true,
      current_round: scene.current_round,
      current_turn: scene.current_turn_order,
      actor: actor
    };
  }
}