export interface DatabaseResult {
  lastInsertRowid: number | bigint;
  changes: number;
}

export interface QueryResult<T> {
  [key: string]: T | undefined;
}

export interface Lock {
  timestamp: number;
  operation: string;
}

export interface DbResult<T> {
  success: boolean;
}

import type { CharacterRepository } from '../repositories/character.repository.js';
import type { AntagonistRepository } from '../repositories/antagonist.repository.js';
import type { InventoryRepository } from '../repositories/inventory.repository.js';
import type { StatusEffectRepository } from '../repositories/status-effect.repository.js';
import type { WorldStateRepository } from '../repositories/world-state.repository.js';

/**
 * Aggregates all primary repository access under typical domain property names.
 * Properties match the names most widely used in tool handlers: `characters`, `antagonists`, `inventory`, `statusEffects`, `worldState`.
 * This interface is intended for use as the main in-memory database/domain gateway object.
 */
export interface GameDatabase {
  characters: CharacterRepository;
  antagonists: AntagonistRepository;
  inventory: InventoryRepository;
  statusEffects: StatusEffectRepository;
  worldState: WorldStateRepository;
}