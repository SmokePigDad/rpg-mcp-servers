import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function list_characters_handler(db: GameDatabase, args: any) {
  const characters = db.characters.listCharacters();

  if (!characters || characters.length === 0) {
    return { content: makeTextContentArray(["No characters found."]) };
  }

  const characterList = characters.map(
    (char: any) => `- ${char.name} (${char.game_line}) [ID: ${char.id}]`
  ).join('\n');

  const output = `🎭 Character Roster:\n${characterList}`;
  return { content: makeTextContentArray([output]) };
}