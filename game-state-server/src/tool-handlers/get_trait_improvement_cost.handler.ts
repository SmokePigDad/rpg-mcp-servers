import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_trait_improvement_cost_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id) ||
    typeof args.trait_name !== "string" ||
    args.trait_name.trim().length === 0
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments. 'character_id' must be a valid number and 'trait_name' must be a non-empty string."
      ]),
      isError: true
    };
  }
  const { character_id, trait_name } = args;
  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  let cost = 5; // Default cost
  switch (character.game_line) {
    case 'vampire':
      cost = 7;
      break;
    case 'werewolf':
      cost = 8;
      break;
    case 'mage':
      cost = 9;
      break;
    case 'changeling':
      cost = 6;
      break;
  }

  return { content: makeTextContentArray([`The cost to improve ${trait_name} is ${cost} XP.`]) };
}