import { makeTextContentArray } from '../index.js';
import { CharacterRepository } from '../repositories/character.repository.js';
import { GameDatabase } from '../db.js';

// -- XP cost logic: oWoD standard: (current rating + 1) × multiplier (usually 5-7)
function getTraitXPCost(traitName: string, currentVal: number): number {
  // These values are often set by rules, but we'll use 5 as a sane default XP multiplier.
  const attrNames = [
    "Strength", "Dexterity", "Stamina", "Charisma", "Manipulation", "Appearance", "Perception", "Intelligence", "Wits"
  ];
  const abilNames = [
    "Alertness", "Athletics", "Brawl", "Empathy", "Expression", "Intimidation", "Leadership", "Subterfuge",
    "Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Melee", "Performance", "Stealth", "Survival"
  ];
  let multiplier = 5;
  if (abilNames.includes(traitName)) multiplier = 2;
  if (attrNames.includes(traitName)) multiplier = 5;
  return (currentVal + 1) * multiplier;
}

import type { CharacterData } from '../types/character.types.js';

export interface SpendXPArgs {
  character_id: number;
  amount: number;
  reason?: string;
  trait_name: string;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function spend_xp_handler(
  args: SpendXPArgs
): Promise<HandlerResponse> {
  const { character_id, amount, reason, trait_name } = args;

  // --- Input Validation: Numeric & Enum ---
  let errorMsgs: string[] = [];
  const allowedTraitNames = [
    "Strength", "Dexterity", "Stamina", "Charisma", "Manipulation", "Appearance", "Perception", "Intelligence", "Wits",
    "Alertness", "Athletics", "Brawl", "Empathy", "Expression", "Intimidation", "Leadership", "Subterfuge",
    "Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Melee", "Performance", "Stealth", "Survival"
  ];
  if (typeof character_id !== "number" || !Number.isInteger(character_id) || character_id <= 0) {
    errorMsgs.push("Error: 'character_id' must be a positive integer.");
  }
  if (typeof amount !== "number" || !Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0 || amount > 500) {
    errorMsgs.push("Error: 'amount' must be a positive integer not exceeding 500.");
  }
  if (typeof trait_name !== "string" || !allowedTraitNames.includes(trait_name)) {
    errorMsgs.push(`Error: 'trait_name' must be one of: ${allowedTraitNames.join(", ")}`);
  }
  if (errorMsgs.length > 0) {
    return {
      content: makeTextContentArray(errorMsgs),
      isError: true
    };
  }

  // -- Fetch character & compute cost atomically --
  // Use raw db for transactions and repo (from GameDatabase class)
  const db = new GameDatabase();
  const repo = db.characters;
  let result;
  try {
    const character = repo.getCharacterById(character_id);
    if (!character) {
      throw new Error("Error: Character not found.");
    }
    if (typeof character.experience !== 'number') {
      throw new Error("Error: Character has invalid or missing XP/experience.");
    }
    // Defensive: trait must exist (should be present by type)
    const currVal = character[trait_name] ?? undefined;
    if (typeof currVal !== 'number') {
      throw new Error(`Error: Character does not have the trait '${trait_name}'.`);
    }
    const xpCost = getTraitXPCost(trait_name, currVal);
    if (amount !== xpCost) {
      throw new Error(`Error: Amount must equal the XP cost (${xpCost}) to raise '${trait_name}' from ${currVal} to ${currVal + 1}.`);
    }
    if (character.experience < xpCost) {
      throw new Error(`Error: Not enough XP. ${xpCost} required to improve '${trait_name}'.`);
    }
    // Mutate and save
    const updates: any = {
      [trait_name]: currVal + 1,
      experience: character.experience - xpCost
    };
    repo.updateCharacter(character_id, updates);

    // Fetch updated
    const updated = repo.getCharacterById(character_id);
    result = {
      content: makeTextContentArray([`Trait '${trait_name}' improved from ${currVal} to ${currVal + 1}. XP spent: ${xpCost}. XP remaining: ${updated?.experience ?? 0}`])
    };
  } catch (err: any) {
    return {
      content: makeTextContentArray([err?.message || "Unknown error."]),
      isError: true
    };
  }
  return result;
}