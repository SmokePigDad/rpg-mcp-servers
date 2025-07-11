import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function list_characters_handler(db: GameDatabase, args: any) {
  const characters = db.characters.listCharacters();

  if (!characters || characters.length === 0) {
    return { content: ["No characters found."].map(makeTextContent) };
  }

  const characterList = characters.map(
    (char: any) => `- ${char.name} (${char.game_line}) [ID: ${char.id}]`
  ).join('\n');

  const output = `🎭 Character Roster:\n${characterList}`;
  return { content: [output].map(makeTextContent) };
}