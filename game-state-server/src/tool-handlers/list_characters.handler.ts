import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function list_characters_handler(args: any) {
  const db = new GameDatabase();
  const characters = db.characters.listCharacters();

  const characterList = characters.map(character => `${character.name} (ID: ${character.id})`).join('\n');

  return { content: makeTextContentArray([characterList || "No characters found."]) };
}