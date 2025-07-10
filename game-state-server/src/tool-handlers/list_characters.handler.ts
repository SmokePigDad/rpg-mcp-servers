import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function list_characters_handler(db: GameDatabase, args: any) {
  const characters = db.characters.listCharacters();

  const characterList = characters.map(character => `${character.name} (ID: ${character.id})`).join('\n');

  return { content: makeTextContentArray([characterList || "No characters found."]) };
}