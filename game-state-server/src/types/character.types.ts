import type { InventoryItem } from "./inventory.types.js";
import type { StatusEffect } from "./status-effect.types.js";

export type GameLine = 'vampire' | 'werewolf' | 'mage' | 'changeling';

export interface CharacterAttributes {
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
}

export interface CharacterData extends CharacterAttributes {
  id: number;
  name: string;
  concept?: string | null;
  game_line: GameLine;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  experience: number;
  power_stat_rating?: number;
  power_stat_name?: string;
  abilities: Ability[];
  disciplines: SupernaturalPower[];
  arts?: SupernaturalPower[];
  realms?: SupernaturalPower[];
  spheres?: SupernaturalPower[];
  gifts?: SupernaturalPower[];
  inventory: InventoryItem[];
  status_effects: StatusEffect[];
  [key: string]: any;

  // --- NEW OPTIONAL FIELDS (ALL SPLATS) ---
  title?: string | null;      // Changeling, Vampire (Prince, etc.)
  notes?: string | null;      // Generic notes for any character

  // Vampire
  coterie_name?: string | null;
  sect_status?: string | null;

  // Werewolf
  pack_name?: string | null;
  pack_totem?: string | null;

  // Mage
  cabal_name?: string | null;
  paradigm_notes?: string | null;

  // Changeling
  court?: string | null;
  house?: string | null;
  seeming?: string | null; // Already present but good to confirm
}

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

interface Derangement {
  name: string;
  description: string;
}

// The following types will be imported from their own files after all types are moved:
// - InventoryItem (from inventory.types.ts)
// - StatusEffect (from status-effect.types.ts)

export type CharacterSheetOptions = {
  character: CharacterData,                   // Core character object (db shape)
  extra?: Record<string, number>,      // Game-line-specific joined data (e.g., disciplines)
  derangements?: Derangement[],             // Array of derangement objects
};