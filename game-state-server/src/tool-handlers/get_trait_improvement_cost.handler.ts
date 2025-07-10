import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_trait_improvement_cost_handler(args: any) {
  const { character_id, trait_name } = args;
  const db = new GameDatabase();
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