import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function improve_trait_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id) ||
    typeof args.trait_name !== "string" ||
    args.trait_name.trim().length === 0 ||
    typeof args.amount !== "number" ||
    Number.isNaN(args.amount)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'character_id' and 'amount' must be valid numbers, 'trait_name' must be a non-empty string."
    ]), isError: true };
  }
  const { character_id, trait_name, amount } = args;
  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  if (!character.hasOwnProperty(trait_name)) {
    return { content: makeTextContentArray([`❌ Character does not have trait ${trait_name}.`]), isError: true };
  }

  const newTraitValue = (character[trait_name] || 0) + amount;
  db.characters.updateCharacter(character_id, { [trait_name]: newTraitValue });

  return { content: makeTextContentArray([`✅ Improved ${trait_name} for ${character.name} by ${amount}. New value: ${newTraitValue}`]) };
}