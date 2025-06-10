// Monster templates for common creatures
export const MONSTER_TEMPLATES = {
    // CR 1/8
    bandit: {
        name: 'Bandit',
        creature_type: 'humanoid',
        size: 'medium',
        max_hp: 11,
        armor_class: 12,
        speed: 30,
        strength: 11,
        dexterity: 12,
        constitution: 12,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        proficiency_bonus: 2,
        initiative_modifier: 1,
        attacks: JSON.stringify([
            { name: 'Scimitar', bonus: 3, damage: '1d6+1', type: 'slashing' },
            { name: 'Light Crossbow', bonus: 3, damage: '1d8+1', type: 'piercing', range: 80 }
        ]),
        challenge_rating: 0.125,
        experience_value: 25
    },
    // CR 1/4
    goblin: {
        name: 'Goblin',
        creature_type: 'humanoid',
        size: 'small',
        max_hp: 7,
        armor_class: 15,
        speed: 30,
        strength: 8,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 8,
        charisma: 8,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Scimitar', bonus: 4, damage: '1d6+2', type: 'slashing' },
            { name: 'Shortbow', bonus: 4, damage: '1d6+2', type: 'piercing', range: 80 }
        ]),
        abilities: JSON.stringify({
            'Nimble Escape': 'Can take Disengage or Hide as bonus action'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    skeleton: {
        name: 'Skeleton',
        creature_type: 'undead',
        size: 'medium',
        max_hp: 13,
        armor_class: 13,
        speed: 30,
        strength: 10,
        dexterity: 14,
        constitution: 15,
        intelligence: 6,
        wisdom: 8,
        charisma: 5,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Shortsword', bonus: 4, damage: '1d6+2', type: 'piercing' },
            { name: 'Shortbow', bonus: 4, damage: '1d6+2', type: 'piercing', range: 80 }
        ]),
        abilities: JSON.stringify({
            'Damage Vulnerabilities': 'Bludgeoning',
            'Damage Immunities': 'Poison',
            'Condition Immunities': 'Exhaustion, Poisoned'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    wolf: {
        name: 'Wolf',
        creature_type: 'beast',
        size: 'medium',
        max_hp: 11,
        armor_class: 13,
        speed: 40,
        strength: 12,
        dexterity: 15,
        constitution: 12,
        intelligence: 3,
        wisdom: 12,
        charisma: 6,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Bite', bonus: 4, damage: '2d4+2', type: 'piercing', special: 'DC 11 STR save or knocked prone' }
        ]),
        abilities: JSON.stringify({
            'Keen Hearing and Smell': 'Advantage on Perception checks using hearing or smell',
            'Pack Tactics': 'Advantage on attacks if ally is within 5 ft of target'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    zombie: {
        name: 'Zombie',
        creature_type: 'undead',
        size: 'medium',
        max_hp: 22,
        armor_class: 8,
        speed: 20,
        strength: 13,
        dexterity: 6,
        constitution: 16,
        intelligence: 3,
        wisdom: 6,
        charisma: 5,
        proficiency_bonus: 2,
        initiative_modifier: -2,
        attacks: JSON.stringify([
            { name: 'Slam', bonus: 3, damage: '1d6+1', type: 'bludgeoning' }
        ]),
        abilities: JSON.stringify({
            'Undead Fortitude': 'If reduced to 0 HP, make CON save (DC = 5 + damage taken). Success = 1 HP instead',
            'Damage Immunities': 'Poison',
            'Condition Immunities': 'Poisoned'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    // CR 1/2
    orc: {
        name: 'Orc',
        creature_type: 'humanoid',
        size: 'medium',
        max_hp: 15,
        armor_class: 13,
        speed: 30,
        strength: 16,
        dexterity: 12,
        constitution: 16,
        intelligence: 7,
        wisdom: 11,
        charisma: 10,
        proficiency_bonus: 2,
        initiative_modifier: 1,
        attacks: JSON.stringify([
            { name: 'Greataxe', bonus: 5, damage: '1d12+3', type: 'slashing' },
            { name: 'Javelin', bonus: 5, damage: '1d6+3', type: 'piercing', range: 30 }
        ]),
        abilities: JSON.stringify({
            'Aggressive': 'Can move up to speed toward hostile creature as bonus action'
        }),
        challenge_rating: 0.5,
        experience_value: 100
    },
    // CR 1
    dire_wolf: {
        name: 'Dire Wolf',
        creature_type: 'beast',
        size: 'large',
        max_hp: 37,
        armor_class: 14,
        speed: 50,
        strength: 17,
        dexterity: 15,
        constitution: 15,
        intelligence: 3,
        wisdom: 12,
        charisma: 7,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Bite', bonus: 5, damage: '2d6+3', type: 'piercing', special: 'DC 13 STR save or knocked prone' }
        ]),
        abilities: JSON.stringify({
            'Keen Hearing and Smell': 'Advantage on Perception checks using hearing or smell',
            'Pack Tactics': 'Advantage on attacks if ally is within 5 ft of target'
        }),
        challenge_rating: 1,
        experience_value: 200
    },
    // CR 2
    ogre: {
        name: 'Ogre',
        creature_type: 'giant',
        size: 'large',
        max_hp: 59,
        armor_class: 11,
        speed: 40,
        strength: 19,
        dexterity: 8,
        constitution: 16,
        intelligence: 5,
        wisdom: 7,
        charisma: 7,
        proficiency_bonus: 2,
        initiative_modifier: -1,
        attacks: JSON.stringify([
            { name: 'Greatclub', bonus: 6, damage: '2d8+4', type: 'bludgeoning' },
            { name: 'Javelin', bonus: 6, damage: '2d6+4', type: 'piercing', range: 30 }
        ]),
        challenge_rating: 2,
        experience_value: 450
    },
    // Guards and soldiers
    guard: {
        name: 'Guard',
        creature_type: 'humanoid',
        size: 'medium',
        max_hp: 11,
        armor_class: 16,
        speed: 30,
        strength: 13,
        dexterity: 12,
        constitution: 12,
        intelligence: 10,
        wisdom: 11,
        charisma: 10,
        proficiency_bonus: 2,
        initiative_modifier: 1,
        attacks: JSON.stringify([
            { name: 'Spear', bonus: 3, damage: '1d6+1', type: 'piercing', versatile: '1d8+1' }
        ]),
        challenge_rating: 0.125,
        experience_value: 25
    }
};
// Helper function to roll hit dice
export function rollHitDice(notation) {
    const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match)
        return 10; // default
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || '0');
    let total = modifier;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return Math.max(1, total); // Minimum 1 HP
}
// Helper to calculate ability modifier
export function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}
//# sourceMappingURL=monsters.js.map