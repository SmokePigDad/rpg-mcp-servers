// game-state-server/src/repositories/game-database.ts

/**
 * Module: GameDatabase composition/facade
 * 
 * This module provides a single function to aggregate core domain repositories under the canonical names
 * used in all database handler code (`characters`, `antagonists`, `inventory`, `statusEffects`, `worldState`).
 * It is intended as the main gateway for all game state persistence and retrieval operations,
 * facilitating unified domain access for tool handlers.
 * 
 * Usage:
 *   import Database from 'better-sqlite3';
 *   import { createGameDatabase } from './game-database.js';
 *   const db = new Database('data.sqlite');
 *   const gameDb = createGameDatabase(db);
 *   // gameDb.characters, gameDb.worldState, etc.
 */

import type { Database } from 'better-sqlite3';

import { CharacterRepository } from './character.repository.js';
import { AntagonistRepository } from './antagonist.repository.js';
import { InventoryRepository } from './inventory.repository.js';
import { StatusEffectRepository } from './status-effect.repository.js';
import { WorldStateRepository } from './world-state.repository.js';

import type { GameDatabase } from '../types/db.types.js';

/**
 * Aggregates all primary repositories under canonical db property names.
 * @param db An open better-sqlite3 Database instance
 * @returns {GameDatabase} Aggregated repository interface for handler use
 */
export function createGameDatabase(db: Database): GameDatabase {
  return {
    characters: new CharacterRepository(db),
    antagonists: new AntagonistRepository(db),
    inventory: new InventoryRepository(db),
    statusEffects: new StatusEffectRepository(db),
    worldState: new WorldStateRepository(db),
  };
}