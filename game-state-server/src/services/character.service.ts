// game-state-server/src/services/character.service.ts
import type { CharacterRepository } from '../repositories/character.repository.js';
import type { CharacterData } from '../types/index.js';

export class CharacterService {
  constructor(private characterRepo: CharacterRepository) {}

  async getCharacter(id: number): Promise<CharacterData> {
    const character = await this.characterRepo.getCharacterById(id);
    if (!character) {
      throw new Error(`Character with ID ${id} not found.`);
    }
    // You can add more logic here, e.g., fetching and attaching related data
    return character;
  }

  async createCharacter(data: Partial<CharacterData>): Promise<CharacterData> {
    if (!data.name || !data.game_line) {
      throw new Error("Name and game_line are required to create a character.");
    }
    const character = await this.characterRepo.createCharacter(data);
    if (!character) {
      throw new Error("Database failed to create character.");
    }
    return character;
  }
  
  // ... add other methods like updateCharacter, listCharacters etc.
}

