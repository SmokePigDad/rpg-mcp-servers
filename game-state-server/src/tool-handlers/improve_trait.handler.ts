// game-state-server/src/tool-handlers/improve_trait.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

function calculateXpCost(trait_type: string, current_rating: number): number {
    const new_rating = current_rating + 1;
    switch (trait_type) {
        case 'attribute': return new_rating * 4;
        case 'ability': return new_rating * 2;
        case 'discipline': return new_rating * 5;
        case 'art': return new_rating * 4;
        case 'willpower': return current_rating; // This is often current rating, not new rating
        default: throw new Error(`XP cost not defined for trait type: ${trait_type}`);
    }
}

export async function improve_trait_handler(db: GameDatabase, args: any) {
    const { character_id, trait_type, trait_name } = args;
    if (!character_id || !trait_type || !trait_name) {
        return { content: ["❌ Missing required arguments."].map(makeTextContent), isError: true };
    }
    
    const character = db.characters.getCharacterById(character_id);
    if (!character) {
        return { content: [`❌ Character with ID ${character_id} not found.`].map(makeTextContent), isError: true };
    }

    let current_rating = 0;
    let isRelational = false;

    const relationalMap: any = {
        'ability': { table: 'character_abilities', nameCol: 'ability_name' },
        'discipline': { table: 'character_disciplines', nameCol: 'discipline_name' },
        'art': { table: 'character_arts', nameCol: 'art_name' },
        'realm': { table: 'character_realms', nameCol: 'realm_name' },
        'sphere': { table: 'character_spheres', nameCol: 'sphere_name' }
    };
    const coreAttributes = ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception', 'intelligence', 'wits', 'willpower_permanent'];

    // This lookup map determines which category an ability falls into.
    const abilityTypeMap: Record<string, string> = {
        'Brawl': 'Talents', 'Dodge': 'Talents', 'Intimidation': 'Talents', 'Subterfuge': 'Talents',
        'Firearms': 'Skills', 'Melee': 'Skills', 'Stealth': 'Skills', 'Drive': 'Skills',
        'Academics': 'Knowledges', 'Occult': 'Knowledges', 'Science': 'Knowledges'
        // Add more mappings as needed.
    };

    if (coreAttributes.includes(trait_name.toLowerCase())) {
        current_rating = (character as any)[trait_name.toLowerCase()] ?? 0;
    } else if (relationalMap[trait_type]) {
        isRelational = true;
        const relationalTraits = (character as any)[`${trait_type}s`] || [];
        const trait = relationalTraits.find((t: any) => t.name === trait_name);
        current_rating = trait ? trait.rating : 0;
    } else {
        return { content: [`❌ Invalid trait type or name.`].map(makeTextContent), isError: true };
    }

    const xp_cost = calculateXpCost(trait_type, current_rating);
    if (character.experience < xp_cost) {
        return { content: [`❌ Not enough XP. Needs ${xp_cost}, has ${character.experience}.`].map(makeTextContent), isError: true };
    }

    const new_rating = current_rating + 1;
    const new_experience = character.experience - xp_cost;

    try {
        await db.characters.updateCharacter(character_id, { experience: new_experience });
        
        if (trait_type === 'ability') {
            // Always supply ability_type based on map/default for ability traits
            let ability_type = args.ability_type || abilityTypeMap[trait_name] || 'Talents';
            db.characters.updateOrInsertRelationalTrait(
                character_id,
                'character_abilities',
                'ability_name',
                trait_name,
                new_rating,
                ability_type
            );
        } else if (isRelational) {
            const mapping = relationalMap[trait_type];
            db.characters.updateOrInsertRelationalTrait(
                character_id,
                mapping.table,
                mapping.nameCol,
                trait_name,
                new_rating
            );
        } else {
            await db.characters.updateCharacter(character_id, { [trait_name]: new_rating });
        }
    } catch (e: any) {
        return { content: [`❌ DB Error during trait improvement: ${e.message}`].map(makeTextContent), isError: true };
    }

    return { content: [`✅ ${character.name} improved ${trait_name} to ${new_rating} for ${xp_cost} XP. Remaining XP: ${new_experience}.`].map(makeTextContent) };
}