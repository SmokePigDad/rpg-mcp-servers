// game-state-server/src/tool-handlers/spend_resource.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function spend_resource_handler(db: GameDatabase, args: any) {
    const { character_id, resource_name, amount = 1 } = args;

    const character = db.characters.getCharacterById(character_id);
    if (!character) return { content: [`❌ Character with ID ${character_id} not found.`].map(makeTextContent), isError: true };

    const validResources: Record<string, string[]> = {
        vampire: ['willpower', 'blood'],
        werewolf: ['willpower', 'rage', 'gnosis'],
        mage: ['willpower', 'quintessence'],
        changeling: ['willpower', 'glamour']
    };

    if (!validResources[character.game_line]?.includes(resource_name)) {
        return { content: [`❌ Invalid or inapplicable resource '${resource_name}' for this character's game line.`].map(makeTextContent), isError: true };
    }

    const resourceMap: Record<string, string> = {
        willpower: 'willpower_current', blood: 'blood_pool_current', rage: 'rage_current',
        gnosis: 'gnosis_current', glamour: 'glamour_current', quintessence: 'quintessence'
    };

    const col = resourceMap[resource_name];
    if (!col) return { content: [`❌ Unknown resource '${resource_name}'`].map(makeTextContent), isError: true };

    const currentValue = (character as any)[col] ?? 0;
    if (currentValue < amount) {
        return { content: [`❌ Not enough ${resource_name}. Has ${currentValue}, needs ${amount}.`].map(makeTextContent), isError: true };
    }

    const newValue = currentValue - amount;
    await db.characters.updateCharacter(character_id, { [col]: newValue });

    const updatedChar = db.characters.getCharacterById(character_id);
    // FIX: Use the correct column name 'col' to get the new total
    const newTotal = updatedChar ? (updatedChar as any)[col] : 'N/A';
    
    return { content: [`✅ ${character.name} spent ${amount} ${resource_name}. New total: ${newTotal}`].map(makeTextContent) };
}