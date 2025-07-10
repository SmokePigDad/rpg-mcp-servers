import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function improve_trait_handler(args: any) {
  const { character_id, trait_name, amount } = args;
  const db = new GameDatabase();
  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  const newTraitValue = (character[trait_name] || 0) + amount;
  db.characters.updateCharacter(character_id, { [trait_name]: newTraitValue });

  return { content: makeTextContentArray([`✅ Improved ${trait_name} for ${character.name} by ${amount}. New value: ${newTraitValue}`]) };
}