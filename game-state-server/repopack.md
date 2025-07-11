This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
config.json
package.json
src/antagonists.ts
src/characterSheets.ts
src/health-tracker.ts
src/index.ts
src/migrations/2025-07-add-character-arts.sql
src/migrations/2025-07-add-character-disciplines.sql
src/migrations/2025-07-add-character-gifts.sql
src/migrations/2025-07-add-character-spheres.sql
src/migrations/2025-07-add-npc-experience.sql
src/migrations/2025-07-add-splat-flavor-fields.sql
src/migrations/2025-07-base-create-character-trait-tables.sql
src/migrations/2025-07-fix-character-disciplines-column.sql
src/migrations/2025-07-fix-state-schema.sql
src/repositories/antagonist.repository.ts
src/repositories/character.repository.ts
src/repositories/game-database.ts
src/repositories/index.ts
src/repositories/inventory.repository.ts
src/repositories/status-effect.repository.ts
src/repositories/world-state.repository.ts
src/schema.ts
src/services/character.service.ts
src/tool-definitions.ts
src/tool-handlers/add_item.handler.ts
src/tool-handlers/advance_turn.handler.ts
src/tool-handlers/apply_damage.handler.ts
src/tool-handlers/apply_status_effect.handler.ts
src/tool-handlers/award_xp.handler.ts
src/tool-handlers/batch_improve_antagonist_traits.handler.ts
src/tool-handlers/batch_improve_traits.handler.ts
src/tool-handlers/create_antagonist.handler.ts
src/tool-handlers/create_character.handler.ts
src/tool-handlers/create_custom_antagonist.handler.ts
src/tool-handlers/gain_resource.handler.ts
src/tool-handlers/get_antagonist.handler.ts
src/tool-handlers/get_character_by_name.handler.ts
src/tool-handlers/get_character.handler.ts
src/tool-handlers/get_current_turn.handler.ts
src/tool-handlers/get_initiative_order.handler.ts
src/tool-handlers/get_inventory.handler.ts
src/tool-handlers/get_status_effects.handler.ts
src/tool-handlers/get_trait_improvement_cost.handler.ts
src/tool-handlers/get_world_state.handler.ts
src/tool-handlers/improve_trait.handler.ts
src/tool-handlers/index.ts
src/tool-handlers/list_antagonists.handler.ts
src/tool-handlers/list_characters.handler.ts
src/tool-handlers/remove_antagonist.handler.ts
src/tool-handlers/remove_character.handler.ts
src/tool-handlers/remove_item.handler.ts
src/tool-handlers/remove_status_effect.handler.ts
src/tool-handlers/restore_resource.handler.ts
src/tool-handlers/save_story_progress.handler.ts
src/tool-handlers/save_world_state.handler.ts
src/tool-handlers/set_initiative.handler.ts
src/tool-handlers/spend_resource.handler.ts
src/tool-handlers/spend_xp.handler.ts
src/tool-handlers/update_antagonist.handler.ts
src/tool-handlers/update_character.handler.ts
src/tool-handlers/update_item.handler.ts
src/types/antagonist.types.ts
src/types/character.types.ts
src/types/db.types.ts
src/types/health.types.ts
src/types/index.ts
src/types/inventory.types.ts
src/types/status-effect.types.ts
tsconfig.json
```

# Files

## File: config.json
```json
{
  "mcp_servers": [
    {
      "name": "combat-engine-server",
      "address": "http://localhost:3001"
    }
  ]
}
```

## File: package.json
```json
{
  "name": "rpg-game-state-server",
  "version": "1.0.0",
  "description": "MCP server for RPG game state management using SQLite",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "better-sqlite3": "^9.2.2",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/express": "^5.0.3",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

## File: src/antagonists.ts
```typescript
// oWoD antagonist templates for Storyteller System NPC creation

export interface AntagonistSheet {
  name: string;
  game_line: string;
  type: string; // 'enemy', 'ally', 'neutral'
  /** A brief archetypal summary, e.g. "Ruthless footsoldier," "Master manipulator" */
  concept: string;
  attributes: {
    strength: number;
    dexterity: number;
    stamina: number;
    charisma: number;
    manipulation: number;
    appearance: number;
    perception: number;
    intelligence: number;
    wits: number;
  };
  abilities: Partial<{
    talents: Record<string, number>;
    skills: Record<string, number>;
    knowledges: Record<string, number>;
  }>;
  willpower: number;
  health_levels: Record<string, number>;
  supernatural?: Record<string, any>;
  description?: string;
}

type AntagonistTemplates = Record<string, AntagonistSheet>;

/**
 * oWoD antagonist archetypes for use with the create_antagonist tool.
 * Each template provides a ready-to-use NPC for the Storyteller.
 */
export const ANTAGONIST_TEMPLATES: AntagonistTemplates = {

  // =================================================================
  // VAMPIRE: THE MASQUERADE
  // =================================================================

  'Sabbat Shovelhead': {
    name: 'Sabbat Shovelhead',
    concept: 'Expendable vampire soldier—fodder for the Sword of Caine.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 2, stamina: 2, charisma: 2, manipulation: 1, appearance: 1, perception: 2, intelligence: 1, wits: 2 },
    abilities: { talents: { Brawl: 3, Intimidation: 2 }, skills: { Melee: 2, Drive: 1 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 2, Celerity: 1 } },
    description: 'A freshly Embraced neonate, hastily trained and thrown into battle by the Sabbat. Fueled by fanaticism and mob mentality.',
  },
  'Camarilla Sheriff': {
    name: 'Camarilla Sheriff',
    concept: 'Enforcer of Kindred law—pragmatic, ruthless, and loyal to the Prince.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 3, stamina: 4, charisma: 3, manipulation: 3, appearance: 2, perception: 3, intelligence: 3, wits: 4 },
    abilities: { talents: { Brawl: 4, Alertness: 4, Intimidation: 3 }, skills: { Melee: 3, Firearms: 3, Stealth: 2 }, knowledges: { Investigation: 3, Law: 2 } },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Celerity: 2, Potence: 3, Fortitude: 2 } },
    description: 'An elite law enforcer of the Camarilla, skilled in Kindred justice and utterly dedicated to upholding the Traditions.',
  },
  'Nosferatu Information Broker': {
    name: 'Nosferatu Information Broker',
    concept: 'Sewer-dwelling spymaster who trades in secrets.',
    game_line: 'vampire',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 3, charisma: 1, manipulation: 4, appearance: 0, perception: 4, intelligence: 4, wits: 4 },
    abilities: { talents: { Subterfuge: 4, Alertness: 3 }, skills: { Stealth: 5, Larceny: 3 }, knowledges: { Investigation: 4, CitySecrets: 4, Technology: 2 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Obfuscate: 4, Animalism: 3, Potence: 1 } },
    description: 'A creature of the shadows who knows everything that happens in the city. Their information is reliable, but it always comes at a price.',
  },
  'Toreador Harpy': {
    name: 'Toreador Harpy',
    concept: 'The queen bee of Elysium, whose words can make or break reputations.',
    game_line: 'vampire',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 2, charisma: 4, manipulation: 5, appearance: 4, perception: 3, intelligence: 3, wits: 4 },
    abilities: { talents: { Empathy: 3, Expression: 4, Subterfuge: 4 }, skills: { Etiquette: 5, Performance: 3 }, knowledges: { Politics: 4, KindredLore: 3 } },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Presence: 4, Auspex: 3, Celerity: 2 } },
    description: 'A master of social combat, this Toreador wields influence and status as deadly weapons. Crossing them is social suicide.',
  },

  // =================================================================
  // WEREWOLF: THE APOCALYPSE
  // =================================================================
  
  'Black Spiral Dancer': {
    name: 'Black Spiral Dancer',
    concept: 'Wyrm-corrupted Garou—chaotic, insane, and predatory.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 3, stamina: 3, charisma: 2, manipulation: 2, appearance: 1, perception: 3, intelligence: 2, wits: 3 },
    abilities: { talents: { Brawl: 4, Intimidation: 4 }, skills: { Stealth: 3, Survival: 3 }, knowledges: { Occult: 3 } },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: { 'Balefire': 2, 'Sense Wyrm': 1 } },
    description: 'A corrupted Garou who has danced the Black Spiral and now serves the Wyrm. They are malicious, insane, and a twisted mockery of Gaia\'s warriors.',
  },
  'Pentex First-Team': {
    name: 'Pentex First-Team',
    concept: 'Corporate paramilitary anti-werewolf commando.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 4, stamina: 4, charisma: 2, manipulation: 3, appearance: 2, perception: 3, intelligence: 3, wits: 3 },
    abilities: { talents: { Brawl: 4, Alertness: 3 }, skills: { Firearms: 5, Drive: 3, Melee: 3 }, knowledges: { Science: 2, Investigation: 2 } },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { equipment: 'Silver-jacketed rounds, advanced body armor, communication gear.' },
    description: "Pentex's elite paramilitary squad, equipped with the best technology and silver weaponry to hunt and exterminate Garou.",
  },
  'Fomori': {
    name: 'Fomori',
    concept: 'Possessed and mutated human—a walking vessel for a Bane.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 2, stamina: 3, charisma: 1, manipulation: 1, appearance: 0, perception: 2, intelligence: 1, wits: 2 },
    abilities: { talents: { Brawl: 2 }, skills: { Melee: 2 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { powers: { 'Armored Hide': 2, 'Toxic Saliva': 1 } },
    description: 'A human warped by the possession of a Bane spirit, now a monstrous creature with grotesque powers and a burning hatred for all life.',
  },
  'Corrupted Theurge': {
    name: 'Corrupted Theurge',
    concept: 'A werewolf shaman who communes with malevolent spirits.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 2, dexterity: 3, stamina: 2, charisma: 2, manipulation: 4, appearance: 2, perception: 4, intelligence: 4, wits: 4 },
    abilities: { talents: { Alertness: 3 }, skills: { Survival: 2 }, knowledges: { Occult: 5, Enigmas: 4, SpiritLore: 4 } },
    willpower: 8,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { rage: 4, gnosis: 8, gifts: { 'Command Spirit': 3, 'Pulse of the Invisible': 2, 'Spirit Drain': 3 } },
    description: 'A former mystic of the Garou who now binds Banes and other dark spirits to their will, twisting the Umbra to serve the Wyrm.',
  },

  // =================================================================
  // MAGE: THE ASCENSION
  // =================================================================

  'Technocracy Hit Squad': {
    name: 'Technocracy Hit Squad',
    concept: 'Team of paramilitary Convention operatives.',
    game_line: 'mage',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 4, stamina: 3, charisma: 2, manipulation: 3, appearance: 2, perception: 4, intelligence: 3, wits: 4 },
    abilities: { talents: { Alertness: 4, Subterfuge: 3 }, skills: { Firearms: 5, Drive: 2, Melee: 2 }, knowledges: { Technology: 4, Science: 4 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Forces: 3, Correspondence: 2 }, equipment: 'Enhanced weaponry, counter-magick fields.' },
    description: 'A team of trained Technocracy Operatives with access to technomantic devices designed to enforce Consensus and eliminate Reality Deviants.',
  },
  'Nephandus': {
    name: 'Nephandus',
    concept: 'A sorcerer utterly corrupted by dark, cosmic powers.',
    game_line: 'mage',
    type: 'enemy',
    attributes: { strength: 2, dexterity: 2, stamina: 2, charisma: 2, manipulation: 3, appearance: 1, perception: 4, intelligence: 4, wits: 3 },
    abilities: { talents: { Subterfuge: 3, Intimidation: 2 }, skills: { Melee: 2 }, knowledges: { Occult: 4 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Entropy: 3, Spirit: 2, Prime: 3 } },
    description: 'A diabolist who practices the arts of destruction and corruption, seeking to unravel reality itself.',
  },
  'New World Order "Man in Black"': {
    name: 'NWO Man in Black',
    concept: 'An unnervingly bland agent of conformity and control.',
    game_line: 'mage',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 3, charisma: 2, manipulation: 4, appearance: 2, perception: 4, intelligence: 3, wits: 4 },
    abilities: { talents: { Alertness: 3, Subterfuge: 4 }, skills: { Drive: 3, Firearms: 2, Stealth: 3 }, knowledges: { Investigation: 4, Technology: 3, Law: 2 } },
    willpower: 8,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Mind: 3, Correspondence: 2 } },
    description: 'An agent of the New World Order, specialized in psychic infiltration, surveillance, and enforcing the status quo. They are rarely seen, but always watching.',
  },

  // =================================================================
  // CHANGELING: THE DREAMING
  // =================================================================

  'Autumn Person': {
    name: 'Autumn Person',
    concept: 'A mundane human so steeped in Banality they are toxic to the fae.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: { strength: 2, dexterity: 2, stamina: 2, charisma: 1, manipulation: 2, appearance: 1, perception: 3, intelligence: 3, wits: 2 },
    abilities: { talents: { Alertness: 2 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { banality: 8 },
    description: 'A mortal whose disbelief and mundane nature can unravel fae magic and even harm Changelings on contact.',
  },
  'Hostile Chimera': {
    name: 'Hostile Chimera',
    concept: 'An aggressive dream-being or nightmare given form.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 4, stamina: 2, charisma: 1, manipulation: 1, appearance: 0, perception: 3, intelligence: 2, wits: 3 },
    abilities: { talents: { Alertness: 3, Brawl: 3 }, skills: { Stealth: 2 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { chimerical_powers: ['Claws', 'Fear Aura'] },
    description: 'A dangerous creature born from the Dreaming, often manifested from fear or rage. It is only visible to those with fae sight.',
  },
  'Thallain Nightmare': {
    name: 'Thallain Nightmare',
    concept: 'A twisted, corrupted fae embodying a dark concept.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: { strength: 5, dexterity: 3, stamina: 4, charisma: 0, manipulation: 3, appearance: 0, perception: 3, intelligence: 2, wits: 3 },
    abilities: { talents: { Brawl: 4, Intimidation: 5 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { banality: 6, arts: { 'Infliction': 4 } },
    description: 'The dark reflection of a Changeling, a creature of the Shadow Court that embodies despair, pain, or terror. Its touch brings nightmares to life.',
  },

  // =================================================================
  // MORTALS & OTHERS
  // =================================================================

  'Street Thug': {
    name: 'Street Thug',
    concept: 'Violent, street-level criminal opportunist.',
    game_line: 'mortal',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 2, stamina: 3, charisma: 2, manipulation: 1, appearance: 1, perception: 2, intelligence: 2, wits: 2 },
    abilities: { talents: { Brawl: 3, Alertness: 2, Intimidation: 2 }, skills: { Melee: 1, Stealth: 1 } },
    willpower: 3,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A typical street-level tough engaged in criminal activity, likely armed with a knife or a cheap pistol.',
  },
  'Seasoned Police Detective': {
    name: 'Seasoned Police Detective',
    concept: 'A cynical but sharp investigator who has seen too much.',
    game_line: 'mortal',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 2, charisma: 2, manipulation: 3, appearance: 2, perception: 4, intelligence: 3, wits: 4 },
    abilities: { talents: { Alertness: 3, Intimidation: 2 }, skills: { Drive: 2, Firearms: 3, Melee: 2 }, knowledges: { Investigation: 4, Law: 3, CitySecrets: 2 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A veteran detective who is hard to fool and notices things others miss. A significant obstacle for any supernatural trying to operate covertly.',
  },
  'Poltergeist': {
    name: 'Poltergeist',
    concept: 'A violent, chaotic, and non-corporeal spirit.',
    game_line: 'ghost',
    type: 'enemy',
    attributes: { strength: 0, dexterity: 0, stamina: 0, charisma: 0, manipulation: 0, appearance: 0, perception: 3, intelligence: 1, wits: 2 },
    abilities: {},
    willpower: 7,
    health_levels: {}, // Ghosts often use a different system, like Corpus or Essence, tracked via Willpower or a custom pool.
    supernatural: { powers: { 'Telekinesis': 3, 'Manifest Fear': 2 }, essence_pool: 15 },
    description: 'An angry and tormented spirit that lashes out at the physical world, throwing objects and creating an atmosphere of terror. It cannot be fought with fists.',
  }
};
```

## File: src/characterSheets.ts
```typescript
/**
 * Modular Character Sheet Formatters
 * -----------------------------------
 * Provides template-driven, game-line-specific character sheet output, supporting
 * Vampire, Werewolf, Mage, Changeling, and a generic fallback. Formatting is
 * functionally and thematically correct for each game. Cleanly integrates
 * conditions/status, derangements, and XP reporting.
 *
 * To add a new game line: Add a function here with the signature below and update
 * the formatSheetByGameLine selector below.
 *
 * API: Each formatter receives a CharacterSheetOptions object and returns
 *      { type: 'text', text: string }
 */
import { HealthTracker } from './health-tracker.js';
export type CharacterSheetOptions = {
  character: any,                   // Core character object (db shape)
  extra?: Record<string, any>,      // Game-line-specific joined data (e.g., disciplines)
  derangements?: any[],             // Array of derangement objects
  conditions?: any[],               // Array of active conditions
  xpHistory?: any[]                 // Array of XP change records (optional; fallback if empty)
};

/**
 * Utility to format derangements/status/XP blocks for all sheets.
 */
function formatStatusBlocks({
  derangements = [],
  conditions = [],
  xpHistory = []
}: Partial<CharacterSheetOptions>): string {
  let blocks = '';
  // Mental State / Derangements
  if (derangements.length) {
    blocks += `🧠 Mental State / Derangements:\n`;
    derangements.forEach(d => {
      blocks += `  - ${d.derangement}${d.description ? `: ${d.description}` : ''}\n`;
    });
  }
  // Conditions/Status Effects
  if (conditions.length) {
    blocks += `🦠 Conditions / Status Effects:\n`;
    conditions.forEach(c => {
      blocks += `  - ${c.condition_name}`;
      if (c.duration !== null && c.duration !== undefined) blocks += ` [${c.duration} rounds left]`;
      if (c.effect_json) blocks += `: ${typeof c.effect_json === 'object' ? JSON.stringify(c.effect_json) : c.effect_json}`;
      blocks += `\n`;
    });
  }
  // XP History (if any)
  if (xpHistory.length) {
    blocks += `📈 XP History (last ${xpHistory.length}):\n`;
    xpHistory.forEach(xp => {
      blocks += `  - ${xp.amount > 0 ? '+' : ''}${xp.amount} XP: ${xp.reason || ''} (${xp.timestamp ? new Date(xp.timestamp).toLocaleDateString() : ''})\n`;
    });
  }
  return blocks;
}
/** Fallback: All WoD lines share these core blocks */
function formatCoreBlocks(character: any): string {
  // Helper: lookup ability rating by case-insensitive name
  function getAbilityRating(abilities: any[], name: string): number {
    if (!Array.isArray(abilities)) return 0;
    const found = abilities.find(
      ab => typeof ab.ability_name === "string" && ab.ability_name.toLowerCase() === name.toLowerCase()
    );
    return found ? Number(found.rating) || 0 : 0;
  }
  // COMMON DICE POOLS for Vampire
  function formatCommonDicePools(character: any): string {
    const abilities = character.abilities || [];
    // For Vampire/oWoD, most frequent pools:
    const pools = [
      {
        label: "Perception + Alertness",
        total:
          Number(character.perception || 0) +
          getAbilityRating(abilities, "Alertness"),
      },
      {
        label: "Dexterity + Brawl",
        total:
          Number(character.dexterity || 0) +
          getAbilityRating(abilities, "Brawl"),
      },
      {
        label: "Manipulation + Subterfuge",
        total:
          Number(character.manipulation || 0) +
          getAbilityRating(abilities, "Subterfuge"),
      },
      // Add more as needed (optional):
      {
        label: "Wits + Intimidation",
        total:
          Number(character.wits || 0) +
          getAbilityRating(abilities, "Intimidation"),
      },
      {
        label: "Dexterity + Firearms",
        total:
          Number(character.dexterity || 0) +
          getAbilityRating(abilities, "Firearms"),
      },
    ];
    // Only show pools where at least one component is nonzero or ability is present
    const filtered = pools.filter(
      p => p.total > 0
    );
    if (filtered.length === 0) return "";
    let block = "🎲 Most-Used Dice Pools:\n";
    block += filtered
      .map((p) => `  - ${p.label}: ${p.total}`)
      .join("\n");
    return block + "\n─────────────────────────────────────────────\n";
  }

  // HEALTH using HealthTracker for graphic block
  let healthBlock = '';
  try {
    const tracker = HealthTracker.from(character.health_levels);
    const healthBoxes = tracker.getBoxArray(); // Array of "", "/", "X", "*", or custom symbols per wound
    const woundPenalty = tracker.getWoundPenalty();
    healthBlock = '❤️ Health Levels:\n';
    healthBlock += `  [${healthBoxes.map((b: string) => b ? b : ' ').join('][')}] (Penalty: ${woundPenalty})\n`;
  } catch (e) {
    // fallback (should never trigger)
    healthBlock = '';
  }

  return [
    `👤 Name: ${character.name}`,
    character.concept ? `🧠 Concept: ${character.concept}` : '',
    character.title ? `👑 Title: ${character.title}` : '',
    (() => {
      let splatInfo = '';
      switch ((character.game_line || '').toLowerCase()) {
        case 'vampire':
          splatInfo = `${character.clan || 'Unknown Clan'}, Gen: ${character.generation || '?'}`;
          break;
        case 'werewolf':
          splatInfo = `${character.tribe || 'Unknown Tribe'}, ${character.auspice || 'Unknown Auspice'}`;
          break;
        case 'mage':
          splatInfo = `${character.tradition_convention || 'Unknown Tradition'}`;
          break;
        case 'changeling':
          splatInfo = `${character.kith || 'Unknown Kith'}, ${character.seeming || 'Unknown Seeming'}`;
          break;
      }
      const gameLine = character.game_line?.[0]?.toUpperCase() + character.game_line?.slice(1);
      return `🗂️  Game Line: ${gameLine}${splatInfo ? ` (${splatInfo})` : ''}`;
    })(),
    '',
    `💪 Strength: ${character.strength}\n🏃 Dexterity: ${character.dexterity}\n❤️ Stamina: ${character.stamina}`,
    `🎭 Charisma: ${character.charisma}\n🗣️ Manipulation: ${character.manipulation}\n🌟 Appearance: ${character.appearance}`,
    `👁️ Perception: ${character.perception}\n🧠 Intelligence: ${character.intelligence}\n⚡ Wits: ${character.wits}`,
    '',
    '────────────── ABILITIES ──────────────',
    character.abilities?.length
      ? character.abilities.map(
          // FIX: Use the correct property names ('name' and 'type') from the repository's aliased query result.
          (ab: any) => `  - ${ab.name} (${ab.type}): ${ab.rating}${ab.specialty ? `, Specialty: ${ab.specialty}` : ''}`
        ).join('\n')
      : '  (none recorded)',
    '',
    formatCommonDicePools(character),
    healthBlock,
    '────────────── CORE TRAITS ──────────────',
    `🔵 Willpower: ${character.willpower_current}/${character.willpower_permanent}`,
    `⭐ Experience: ${character.experience || 0}`,
    character.power_stat_name && character.power_stat_rating !== undefined
      ? `🪄 ${character.power_stat_name}: ${character.power_stat_rating}` : ''
  ].filter(Boolean).join('\n');
}
/**
 * Vampire: Adds Disciplines, Blood Pool, Humanity
 */
export function formatVampireSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: VAMPIRE Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.coterie_name) out += `Coterie: ${character.coterie_name}\n`;
  if (character.sect_status) out += `Sect Status: ${character.sect_status}\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.coterie_name) out += `Coterie: ${character.coterie_name}\n`;
  if (character.sect_status) out += `Sect Status: ${character.sect_status}\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Disciplines, Blood Pool, Humanity
  if (extra.disciplines?.length) {
    out += "\n🩸 Disciplines:\n";
    extra.disciplines.forEach((d: any) => {
      out += `  - ${d.discipline_name}: ${d.rating}\n`;
    });
  }
  out += `Blood Pool: ${character.blood_pool_current || 0}/${character.blood_pool_max || 0}, Humanity: ${character.humanity ?? ''}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Werewolf: Adds Gifts, Rage, Gnosis, Renown
 */
export function formatWerewolfSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: WEREWOLF Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.pack_name) out += `Pack: ${character.pack_name}`;
  if (character.pack_totem) out += ` (Totem: ${character.pack_totem})`;
  if (character.pack_name || character.pack_totem) out += `\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Gifts, Rage, Gnosis, Renown
  if (extra.gifts?.length) {
    out += "\n🐺 Gifts:\n";
    extra.gifts.forEach((g: any) => {
      out += `  - ${g.gift_name} (Rank ${g.rank})\n`;
    });
  }
  out += `Rage: ${character.rage_current || 0}, Gnosis: ${character.gnosis_current || 0}, Renown: Glory ${character.renown_glory || 0}, Honor ${character.renown_honor || 0}, Wisdom ${character.renown_wisdom || 0}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Mage: Adds Spheres, Arete, Quintessence, Paradox
 */
export function formatMageSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: MAGE Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.cabal_name) out += `Cabal: ${character.cabal_name}\n`;
  if (character.paradigm_notes) out += `Paradigm Notes: ${character.paradigm_notes}\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Spheres, Arete, Quintessence, Paradox
  if (extra.spheres?.length) {
    out += "\n🕯️ Spheres:\n";
    extra.spheres.forEach((s: any) => {
      out += `  - ${s.sphere_name}: ${s.rating}\n`;
    });
  }
  out += `Arete: ${character.arete || 0}, Quintessence: ${character.quintessence || 0}, Paradox: ${character.paradox || 0}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Changeling: Adds Arts, Realms, Glamour, Banality
 */
export function formatChangelingSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: CHANGELING Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.court) out += `Court: ${character.court}\n`;
  if (character.house) out += `House: ${character.house}\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  if (extra.arts?.length) {
    out += "\n✨ Arts:\n";
    extra.arts.forEach((a: any) => {
      out += `  - ${a.art_name}: ${a.rating}\n`;
    });
  }
  if (extra.realms?.length) {
    out += "🌐 Realms:\n";
    extra.realms.forEach((r: any) => {
      out += `  - ${r.realm_name}: ${r.rating}\n`;
    });
  }
  out += `Glamour: ${character.glamour_current || 0}/${character.glamour_permanent || 0}, Banality: ${character.banality_permanent || 0}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Fallback: Core WoD sheet structure
 */
export function formatGenericWoDSheet(opts: CharacterSheetOptions) {
  const { character } = opts;
  let out = `🎲 World of Darkness Character Sheet (Generic)\n\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Power stat if present
  if (character.power_stat_name && character.power_stat_rating !== undefined) {
    out += `${character.power_stat_name}: ${character.power_stat_rating}\n`;
  }
  return { type: 'text', text: out };
}
/**
 * Selector for formatter function (UI/readability extensibility point)
 */
export function formatSheetByGameLine(opts: CharacterSheetOptions) {
  switch ((opts.character.game_line || '').toLowerCase()) {
    case 'vampire':    return formatVampireSheet(opts);
    case 'werewolf':   return formatWerewolfSheet(opts);
    case 'mage':       return formatMageSheet(opts);
    case 'changeling': return formatChangelingSheet(opts);
    default:           return formatGenericWoDSheet(opts);
  }
}
/**
 * To extend for a new game line:
 * 1. Write `function formatHunterSheet(opts: CharacterSheetOptions) {...}`
 * 2. Add `case 'hunter': return formatHunterSheet(opts);` to formatSheetByGameLine
 * 3. (Optionally) update docs/UI layer
 */
```

## File: src/health-tracker.ts
```typescript
// File: game-state-server/src/health-tracker.ts

/**
 * HealthTracker handles World of Darkness health-level tracking,
 * including damage application, wound penalties, serialization,
 * and robust fallback for malformed/corrupt health state objects.
 */
import type { HealthLevel, DamageObject, DamageType } from './types/health.types.js';

const HEALTH_LEVELS: HealthLevel[] = [
  'bruised',
  'hurt',
  'injured',
  'wounded',
  'mauled',
  'crippled',
  'incapacitated'
];

const PENALTIES: Record<HealthLevel, number> = {
  bruised: 0,
  hurt: -1,
  injured: -1,
  wounded: -2,
  mauled: -2,
  crippled: -5,
  incapacitated: 0
};

const DAMAGE_SYMBOL: Record<DamageType, string> = {
  bashing: '/',
  lethal: 'X',
  aggravated: '*'
};


export class HealthTracker {
  private boxes: ('' | '/' | 'X' | '*')[] = Array(7).fill('');
  /**
   * Initializes with a JSON or record describing the current health boxes.
   * Accepts both V20 object and count formats. Handles corrupted state robustly.
   */
  constructor(public health: any = undefined) {
    this.deserializeBoxArray(health);
  }

  private fallbackFullHealth() {
    this.boxes = Array(7).fill('');
  }

  /**
   * Accepts legacy/modern JSON, string, or nothing; parses to 7-boxes.
   */
  private deserializeBoxArray(source: any) {
    let healthObj: Record<string, any>;
    try {
      if (typeof source === 'string') {
        healthObj = JSON.parse(source ?? '{}');
      } else if (typeof source === 'object' && source) {
        healthObj = source;
      } else {
        throw new Error();
      }
      if (typeof healthObj !== 'object' || healthObj === null) throw new Error();
    } catch (e) {
      healthObj = HEALTH_LEVELS.reduce((acc, lvl) => {
        acc[lvl] = {};
        return acc;
      }, {} as any);
    }
    // preferred fill-in per box: support V20 {b:1,l:0,a:0} or just number (count of filled damage)
    const out: ('' | '/' | 'X' | '*')[] = [];
    for (const lvl of HEALTH_LEVELS) {
      let boxVal = healthObj[lvl];
      if (typeof boxVal === 'object' && boxVal !== null) {
        // V20 style: {b:1,l:0,a:0}
        if (boxVal.a > 0) out.push('*');
        else if (boxVal.l > 0) out.push('X');
        else if (boxVal.b > 0) out.push('/');
        else out.push('');
      } else if (typeof boxVal === 'number') {
        // Simple number: count of filled boxes, no type
        out.push(boxVal > 0 ? '/' : '');
      } else {
        out.push('');
      }
    }
    // If corrupt, fallback
    if (out.length !== HEALTH_LEVELS.length || out.some(x => typeof x !== 'string' || x.length > 1)) {
      this.fallbackFullHealth();
    } else {
      this.boxes = out;
    }
  }

  /**
   * Returns simple JSON health object (V20 style, e.g. {bruised: {b:1}, ...})
   */
  public toJSON(): Record<HealthLevel, any> {
    const out: Record<HealthLevel, any> = {} as any;
    for (let i = 0; i < HEALTH_LEVELS.length; ++i) {
      const symbol = this.boxes[i];
      if (symbol === '*') out[HEALTH_LEVELS[i]] = { a: 1 };
      else if (symbol === 'X') out[HEALTH_LEVELS[i]] = { l: 1 };
      else if (symbol === '/') out[HEALTH_LEVELS[i]] = { b: 1 };
      else out[HEALTH_LEVELS[i]] = {};
    }
    return out;
  }

  /**
   * Returns printable visual status: e.g. "/|*|/|X|...|"
   */
  public getBoxArray(): ('' | '/' | 'X' | '*')[] {
    return [...this.boxes];
  }

  /** Returns wound penalty for current state according to most severe filled box. */
  public getWoundPenalty(): number {
    for (let i = this.boxes.length - 1; i >= 0; --i) {
      if (this.boxes[i] !== '') {
        return PENALTIES[HEALTH_LEVELS[i]];
      }
    }
    return 0;
  }

  /** Returns true if the character is incapacitated (incapacitated health level is filled). */
  public isIncapacitated(): boolean {
    return this.boxes[6] !== ''; // incapacitated is the 7th (index 6) health level
  }

  /** Returns the current health status as a descriptive string. */
  public getHealthStatus(): string {
    if (this.isIncapacitated()) {
      return 'Incapacitated';
    }

    for (let i = this.boxes.length - 1; i >= 0; --i) {
      if (this.boxes[i] !== '') {
        return HEALTH_LEVELS[i].charAt(0).toUpperCase() + HEALTH_LEVELS[i].slice(1);
      }
    }
    return 'Healthy';
  }

  /** Applies any combination of bashing, lethal, aggravated (any falsy is 0). Returns {changed: bool}. */
  public applyDamage(dmg: DamageObject): boolean {
    let orig = this.getBoxArray().join('');
    // Application order: aggravated > lethal > bashing
    const applyType = (count: number, symbol: '/' | 'X' | '*') => {
      for (let i = 0; i < (count || 0); ++i) {
        // aggravated: first '', then upgrade '/' or 'X' to '*'
        // lethal: first '', then upgrade '/' to 'X'
        // bashing: first '', only
        let idx = -1;
        if (symbol === '*') {
          idx = this.boxes.findIndex(x => x === '' || x === '/' || x === 'X');
        } else if (symbol === 'X') {
          idx = this.boxes.findIndex(x => x === '' || x === '/');
        } else if (symbol === '/') {
          idx = this.boxes.findIndex(x => x === '');
        }
        if (idx !== -1) {
          // Upgrading existing
          if (
            this.boxes[idx] === '' ||
            (symbol === 'X' && this.boxes[idx] === '/') ||
            (symbol === '*' && (this.boxes[idx] === '/' || this.boxes[idx] === 'X'))
          ) {
            this.boxes[idx] = symbol;
          }
        }
      }
    };

    applyType(dmg.aggravated || 0, '*');
    applyType(dmg.lethal || 0, 'X');
    applyType(dmg.bashing || 0, '/');

    // overflow: if >7, last become aggravated
    let over = this.boxes.filter(c => c === '*' || c === 'X' || c === '/').length - 7;
    if (over > 0) {
      for (let i = this.boxes.length - 1; i >= 0 && over > 0; --i) {
        if (this.boxes[i] !== '*') {
          this.boxes[i] = '*';
          over--;
        }
      }
    }
    return this.getBoxArray().join('') !== orig;
  }

  /**
   * Serializes to JSON-string.
   */
  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Static: build from DB (object or JSON-string) and always get a valid instance.
   */
  static from(source: any): HealthTracker {
    return new HealthTracker(source);
  }

  /**
   * Static: returns a fully healthy instance.
   */
  static healthy(): HealthTracker {
    return new HealthTracker();
  }
}
```

## File: src/index.ts
```typescript
// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Local Imports
import { createDatabase, initializeSchema } from './schema.js';
import { createGameDatabase } from './repositories/game-database.js';
import type { GameDatabase as GameDatabaseType } from './types/db.types.js';

// === THIS IS THE CRITICAL PART ===
// Import the single source of truth for all tool definitions and handlers
import { toolDefinitions } from './tool-definitions.js';
import { toolDispatcher } from './tool-handlers/index.js';

/**
 * Utility to ensure all MCP content is correctly formatted as text.
 */
export function makeTextContent(text: string): { type: 'text'; text: string } {
    return { type: 'text', text };
}

async function startServer() {
  try {
    console.log("Initializing game-state-server...");

    // --- 1. Database Setup ---
    const DATA_DIR = join(process.cwd(), '..', 'data');
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    const DB_PATH = join(DATA_DIR, 'game-state.db');
    const db = createDatabase(DB_PATH);
    initializeSchema(db);
    const gameDatabase: GameDatabaseType = createGameDatabase(db);
    console.log("Database initialized successfully.");

    // --- 2. Initialize the Server with the Correct Tool Definitions Object ---
    const server = new Server(
      { name: 'rpg-game-state-server', version: '3.0.0' },
      {
        capabilities: {
          // Use the imported toolDefinitions object directly.
          // The SDK expects a map of { [tool_name]: tool_definition }.
          tools: toolDefinitions 
        },
      }
    );

    // --- 3. Set Up Request Handlers ---
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      // For the ListTools request, the SDK expects an array of the definitions.
      return { tools: Object.values(toolDefinitions) };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;
      const handler = toolDispatcher[name];

      if (handler) {
        try {
          return await handler(gameDatabase, args);
        } catch (error: any) {
          return { content: [makeTextContent(`❌ Error in tool '${name}': ${error.message}`)], isError: true };
        }
      }

      return { content: [makeTextContent(`❌ Unknown tool in game-state-server: ${name}`)], isError: true };
    });

    // --- 4. Connect and Start Listening ---
    const transport = new StdioServerTransport();
    server.connect(transport);
    console.error('✅ oWoD Game State Server v3.0.0 running on stdio');

  } catch (error: any)
  {
    console.error('❌ FATAL: Server failed to start:', error.message);
    process.exit(1);
  }
}

// Run the server
startServer();
```

## File: src/migrations/2025-07-add-character-arts.sql
```sql
-- Migration: Add character_arts table for tracking Arts per Changeling character

CREATE TABLE IF NOT EXISTS character_arts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    art_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_arts_unique 
ON character_arts(character_id, art_name);
```

## File: src/migrations/2025-07-add-character-disciplines.sql
```sql
-- Migration: Add character_disciplines table for tracking disciplines per character

CREATE TABLE IF NOT EXISTS character_disciplines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    discipline TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_disciplines_unique ON character_disciplines(character_id, discipline);
```

## File: src/migrations/2025-07-add-character-gifts.sql
```sql
-- Migration: Add character_gifts table for tracking Gifts per character

CREATE TABLE IF NOT EXISTS character_gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    gift_name TEXT NOT NULL,
    rank INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_gifts_unique 
ON character_gifts(character_id, gift_name);
```

## File: src/migrations/2025-07-add-character-spheres.sql
```sql
-- Migration: Add character_spheres table for tracking Spheres per Mage character

CREATE TABLE IF NOT EXISTS character_spheres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    sphere_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_spheres_unique 
ON character_spheres(character_id, sphere_name);
```

## File: src/migrations/2025-07-add-npc-experience.sql
```sql
-- Migration: Add an experience column to the npcs table for antagonist progression.

ALTER TABLE npcs ADD COLUMN experience INTEGER DEFAULT 0;
```

## File: src/migrations/2025-07-add-splat-flavor-fields.sql
```sql
-- Migration: Add optional flavor and status fields to all splat-specific character tables.

-- For Vampire: Add 'coterie' and 'status' (in the Camarilla/Sabbat).
ALTER TABLE character_vampire_traits ADD COLUMN coterie_name TEXT;
ALTER TABLE character_vampire_traits ADD COLUMN sect_status TEXT;

-- For Werewolf: Add 'pack_name' and 'pack_totem'.
ALTER TABLE character_werewolf_traits ADD COLUMN pack_name TEXT;
ALTER TABLE character_werewolf_traits ADD COLUMN pack_totem TEXT;

-- For Mage: Add 'cabal_name' and 'paradigm_notes'.
ALTER TABLE character_mage_traits ADD COLUMN cabal_name TEXT;
ALTER TABLE character_mage_traits ADD COLUMN paradigm_notes TEXT;

-- For Changeling: Add 'court', 'house', and 'title'.
-- (Note: 'seeming' is already in the schema)
ALTER TABLE character_changeling_traits ADD COLUMN court TEXT;
ALTER TABLE character_changeling_traits ADD COLUMN house TEXT;
ALTER TABLE character_changeling_traits ADD COLUMN title TEXT;
```

## File: src/migrations/2025-07-base-create-character-trait-tables.sql
```sql
-- Migration: Base creation for all splat-specific character trait tables

CREATE TABLE IF NOT EXISTS character_vampire_traits (
  character_id INTEGER PRIMARY KEY,
  clan TEXT,
  generation INTEGER DEFAULT 13,
  blood_pool_current INTEGER DEFAULT 10,
  blood_pool_max INTEGER DEFAULT 10,
  humanity INTEGER DEFAULT 7
);

CREATE TABLE IF NOT EXISTS character_werewolf_traits (
  character_id INTEGER PRIMARY KEY,
  breed TEXT,
  auspice TEXT,
  tribe TEXT,
  gnosis_current INTEGER DEFAULT 3,
  gnosis_permanent INTEGER DEFAULT 3,
  rage_current INTEGER DEFAULT 1,
  rage_permanent INTEGER DEFAULT 1,
  renown_glory INTEGER DEFAULT 0,
  renown_honor INTEGER DEFAULT 0,
  renown_wisdom INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS character_mage_traits (
  character_id INTEGER PRIMARY KEY,
  tradition_convention TEXT,
  arete INTEGER DEFAULT 1,
  quintessence INTEGER DEFAULT 0,
  paradox INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS character_changeling_traits (
  character_id INTEGER PRIMARY KEY,
  kith TEXT,
  seeming TEXT,
  glamour_current INTEGER DEFAULT 4,
  glamour_permanent INTEGER DEFAULT 4,
  banality_permanent INTEGER DEFAULT 3
);
```

## File: src/migrations/2025-07-fix-character-disciplines-column.sql
```sql
-- Migration: Fix column name in character_disciplines (should be "discipline_name")

PRAGMA foreign_keys=off;

CREATE TABLE IF NOT EXISTS character_disciplines_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    discipline_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Copy data from old table (if any)
INSERT INTO character_disciplines_new (id, character_id, discipline_name, rating)
SELECT id, character_id, discipline, rating FROM character_disciplines;

DROP TABLE character_disciplines;
ALTER TABLE character_disciplines_new RENAME TO character_disciplines;

PRAGMA foreign_keys=on;

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_disciplines_unique ON character_disciplines(character_id, discipline_name);
```

## File: src/migrations/2025-07-fix-state-schema.sql
```sql
-- Migration patch for RPG Game State Server schema
-- (2025-07)

-- 1. Enforce unique character names
CREATE UNIQUE INDEX IF NOT EXISTS idx_characters_name_unique ON characters(name);

-- 2. Add missing `last_updated` column to world_state
ALTER TABLE world_state ADD COLUMN last_updated DATETIME;

-- 3. Add missing `progress_data` column to story_progress
ALTER TABLE story_progress ADD COLUMN progress_data TEXT;

-- 4. Add missing `scene_id` to initiative_order (supports group initiative ops)
ALTER TABLE initiative_order ADD COLUMN scene_id TEXT;

-- 5. (If needed, correct FK: antagonist_id must reference npcs(id), not antagonists(id))
-- Since SQLite cannot drop FKs, this should be handled in code/logic for new installs,
-- but for illustration:
--   PRAGMA foreign_keys=off;
--   CREATE TABLE initiative_order_new (..., antagonist_id INTEGER REFERENCES npcs(id), ...);
--   INSERT INTO initiative_order_new SELECT * FROM initiative_order;
--   DROP TABLE initiative_order;
--   ALTER TABLE initiative_order_new RENAME TO initiative_order;
--   PRAGMA foreign_keys=on;

-- 6. Confirm all splat trait columns exist (vampire, werewolf, etc.) in their respective tables
-- (Should be covered in previous schema, just verify)

-- 7. Add log/diagnostic note
-- This migration enables all handlers and tests to succeed per 2025-07 debugging plan.
```

## File: src/repositories/antagonist.repository.ts
```typescript
import type { Database } from 'better-sqlite3';
import type { AntagonistRow, CharacterData } from '../types/index.js';
import { ANTAGONIST_TEMPLATES } from '../antagonists.js';
import { HealthTracker } from '../health-tracker.js';

export class AntagonistRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public getAntagonistById(id: number): AntagonistRow | null {
    // This needs to be a complex join to be useful, similar to getCharacterById
    const antagonist = this.db.prepare('SELECT * FROM npcs WHERE id = ?').get(id);
    if (!antagonist) {
      return null;
    }
    // Future enhancement: Add joins to npc_splat_traits, etc.
    return antagonist as AntagonistRow;
  }

  public getAntagonistByName(name: string): AntagonistRow | null {
    const row = this.db.prepare('SELECT * FROM npcs WHERE name = ?').get(name) as AntagonistRow;
    return row ? this.getAntagonistById(row.id) : null;
  }

  public listAntagonists(): AntagonistRow[] {
    const rows = this.db.prepare('SELECT * FROM npcs ORDER BY name').all();
    return rows as AntagonistRow[];
  }

  public createAntagonist(template_name: string, custom_name?: string): AntagonistRow | null {
    const template = (ANTAGONIST_TEMPLATES as any)[template_name];
    if (!template) {
      throw new Error(`Antagonist template '${template_name}' not found.`);
    }
    
    // Use the custom creation method with the template data
    const antagonistData = {
      name: custom_name || template.name,
      game_line: template.game_line,
      concept: template.concept,
      ...template.attributes,
      willpower_permanent: template.willpower,
      // Add abilities and supernatural traits from template if they exist
      abilities: template.abilities ? Object.entries(template.abilities.talents || {}).map(([name, rating]) => ({ name, type: 'Talent', rating }))
        .concat(Object.entries(template.abilities.skills || {}).map(([name, rating]) => ({ name, type: 'Skill', rating })))
        .concat(Object.entries(template.abilities.knowledges || {}).map(([name, rating]) => ({ name, type: 'Knowledge', rating }))) : [],
      disciplines: template.supernatural?.disciplines ? Object.entries(template.supernatural.disciplines).map(([name, rating]) => ({ name, rating })) : [],
      //... add similar for gifts, arts, etc.
    };

    return this.createCustomAntagonist(antagonistData as Partial<CharacterData>);
  }

  public createCustomAntagonist(data: Partial<CharacterData>): AntagonistRow | null {
    if (!data.name || !data.game_line) {
        throw new Error("Custom antagonists require at least a name and a game_line.");
    }

    const healthTracker = HealthTracker.healthy();
    const health_levels_json = healthTracker.serialize();

    const npcId = this.db.transaction(() => {
        const stmt = this.db.prepare(`
            INSERT INTO npcs (
                name, concept, game_line, strength, dexterity, stamina, charisma, manipulation, appearance,
                perception, intelligence, wits, willpower_current, willpower_permanent, health_levels, notes, experience
            ) VALUES (
                @name, @concept, @game_line, @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
                @perception, @intelligence, @wits, @willpower_current, @willpower_permanent, @health_levels, @notes, @experience
            )
        `);

        const result = stmt.run({
            name: data.name,
            concept: data.concept || 'Custom Antagonist',
            game_line: data.game_line,
            strength: data.strength || 1, dexterity: data.dexterity || 1, stamina: data.stamina || 1,
            charisma: data.charisma || 1, manipulation: data.manipulation || 1, appearance: data.appearance || 1,
            perception: data.perception || 1, intelligence: data.intelligence || 1, wits: data.wits || 1,
            willpower_current: data.willpower_permanent || 5, willpower_permanent: data.willpower_permanent || 5,
            health_levels: health_levels_json,
            notes: data.notes || null,
            experience: 0
        });
        const localNpcId = result.lastInsertRowid as number;

        // Insert into splat-specific tables
        switch (data.game_line) {
            case 'vampire':
                this.db.prepare(`INSERT INTO npc_vampire_traits (npc_id, clan, generation, blood_pool_current, blood_pool_max, humanity) VALUES (?, ?, ?, ?, ?, ?)`).run(localNpcId, data.clan ?? null, data.generation ?? 13, data.blood_pool_current ?? 10, data.blood_pool_max ?? 10, data.humanity ?? 7);
                break;
            // ... (cases for other splats)
        }

        // Insert abilities, using character_id column for the NPC ID
        if (data.abilities && Array.isArray(data.abilities)) {
            const abilityStmt = this.db.prepare(`INSERT INTO character_abilities (character_id, ability_name, ability_type, rating) VALUES (?, ?, ?, ?)`);
            for (const ability of data.abilities) {
                abilityStmt.run(localNpcId, ability.name, ability.type, ability.rating);
            }
        }
        
        // Insert disciplines, using character_id column for the NPC ID
        if (data.disciplines && Array.isArray(data.disciplines)) {
            const discStmt = this.db.prepare(`INSERT INTO character_disciplines (character_id, discipline_name, rating) VALUES (?, ?, ?)`);
            for (const discipline of data.disciplines) {
                discStmt.run(localNpcId, discipline.name, discipline.rating);
            }
        }
        return localNpcId;
    })();

    return this.getAntagonistById(npcId as number);
  }

  public updateAntagonist(id: number, updates: Partial<AntagonistRow>): AntagonistRow | null {
    // ... (This method should be the one with full validation as created in the previous step)
    // For brevity, assuming the robust version is here.
    const setClause = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`).run(...Object.values(updates), id);
    return this.getAntagonistById(id);
  }
  
  public applyDamage(id: number, damage: { bashing: number; lethal: number; aggravated: number }): AntagonistRow | null {
    const npc = this.getAntagonistById(id);
    if (!npc) return null;
    
    const tracker = HealthTracker.from(npc.health_levels);
    tracker.applyDamage(damage);

    const updatedHealthJson = tracker.serialize();
    this.db.prepare(`UPDATE npcs SET health_levels = ? WHERE id = ?`).run(updatedHealthJson, id);
    return this.getAntagonistById(id);
  }

  public batchImproveAntagonistTraits(npc_id: number, improvements: { trait_type: string; trait_name: string; }[]): { summary: string; final_xp: number; } {
    const calculateXpCost = (trait_type: string, current_rating: number): number => {
        const new_rating = current_rating + 1;
        switch (trait_type) {
            case 'attribute': return new_rating * 4;
            case 'ability': return new_rating * 2;
            case 'discipline': return new_rating * 5;
            case 'art': return new_rating * 4;
            case 'willpower': return current_rating;
            default: throw new Error(`XP cost calculation not defined for trait type: ${trait_type}`);
        }
    };

    return this.db.transaction(() => {
        const antagonist = this.getAntagonistById(npc_id);
        if (!antagonist) throw new Error("Antagonist not found.");

        let totalXpCost = 0;
        const improvementDetails: string[] = [];

        for (const imp of improvements) {
            const { trait_type, trait_name } = imp;
            let current_rating = 0;
            // ... (logic to get current rating for different trait types)
            current_rating = (antagonist as any)[trait_name.toLowerCase()] ?? 0;

            const cost = calculateXpCost(trait_type, current_rating);
            totalXpCost += cost;
            improvementDetails.push(`${trait_name} (${current_rating} -> ${current_rating + 1}) for ${cost} XP`);
        }

        const current_xp = (antagonist as any).experience || 0;
        if (current_xp < totalXpCost) {
            throw new Error(`Insufficient XP for antagonist. Needs ${totalXpCost}, but only has ${current_xp}.`);
        }

        for (const imp of improvements) {
            // ... (logic to apply the improvements)
        }
        
        const final_xp = current_xp - totalXpCost;
        this.updateAntagonist(npc_id, { experience: final_xp } as Partial<AntagonistRow>);

        return { summary: `Successfully improved: ${improvementDetails.join(', ')}.`, final_xp };
    })();
  }

  public removeAntagonist(id: number): boolean {
    const transaction = this.db.transaction(() => {
      // Note: The relational tables use 'character_id' for both PCs and NPCs.
      this.db.prepare(`DELETE FROM character_abilities WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_disciplines WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_gifts WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_spheres WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_arts WHERE character_id = ?`).run(id);
      this.db.prepare(`DELETE FROM character_realms WHERE character_id = ?`).run(id);
      
      this.db.prepare(`DELETE FROM npc_vampire_traits WHERE npc_id = ?`).run(id);
      this.db.prepare(`DELETE FROM npc_werewolf_traits WHERE npc_id = ?`).run(id);
      this.db.prepare(`DELETE FROM npc_mage_traits WHERE npc_id = ?`).run(id);
      this.db.prepare(`DELETE FROM npc_changeling_traits WHERE npc_id = ?`).run(id);

      const res = this.db.prepare('DELETE FROM npcs WHERE id = ?').run(id);

      if (res.changes === 0) {
        throw new Error(`Antagonist with ID ${id} not found.`);
      }
      return res.changes > 0;
    });

    try {
      return transaction();
    } catch (error) {
      console.error(`[AntagonistRepository] Failed to remove antagonist ${id}:`, error);
      return false;
    }
  }
}
```

## File: src/repositories/character.repository.ts
```typescript
// File: game-state-server/src/repositories/character.repository.ts

import type { Database } from 'better-sqlite3';
import type { CharacterData } from '../types/character.types.js';
import { HealthTracker } from '../health-tracker.js';

interface Ability {
  name: string;
  type: string;
  rating: number;
  specialty?: string;
}

interface SupernaturalPower {
  name: string;
  rating: number;
}

export class CharacterRepository {
  private db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  public removeCharacter(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM characters WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  public getCharacterByName(name: string): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE name = ?').get(name);
    if (!row) return null;
    // After getting the base character, enrich it with relational data.
    return this.getCharacterById((row as any).id);
  }

  public getCharacterById(id: number): CharacterData | null {
    const character = this.db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
    if (!character) {
      return null;
    }

    const enrichedCharacter = character as CharacterData;
    
    enrichedCharacter.abilities = this.db.prepare('SELECT ability_name as name, ability_type as type, rating, specialty FROM character_abilities WHERE character_id = ?').all(id) as Ability[];
    
    switch (enrichedCharacter.game_line) {
      case 'vampire':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_vampire_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.disciplines = this.db.prepare('SELECT discipline_name as name, rating FROM character_disciplines WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
      case 'werewolf':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_werewolf_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.gifts = this.db.prepare('SELECT gift_name as name, rank as rating FROM character_gifts WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
      case 'mage':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_mage_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.spheres = this.db.prepare('SELECT sphere_name as name, rating FROM character_spheres WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
      case 'changeling':
        Object.assign(enrichedCharacter, this.db.prepare('SELECT * FROM character_changeling_traits WHERE character_id = ?').get(id) || {});
        enrichedCharacter.arts = this.db.prepare('SELECT art_name as name, rating FROM character_arts WHERE character_id = ?').all(id) as SupernaturalPower[];
        enrichedCharacter.realms = this.db.prepare('SELECT realm_name as name, rating FROM character_realms WHERE character_id = ?').all(id) as SupernaturalPower[];
        break;
    }

    return enrichedCharacter;
  }

  public updateCharacter(id: number, updates: Partial<CharacterData>): CharacterData | null {
    const character = this.getCharacterById(id);
    if (!character) {
        throw new Error(`Character with ID ${id} not found for update.`);
    }

    // Define a schema with expected types for validation
    const validFields: { [key: string]: string } = {
        name: 'string', concept: 'string', strength: 'number', dexterity: 'number', stamina: 'number',
        charisma: 'number', manipulation: 'number', appearance: 'number', perception: 'number',
        intelligence: 'number', wits: 'number', willpower_current: 'number', willpower_permanent: 'number',
        experience: 'number', clan: 'string', generation: 'number', blood_pool_current: 'number',
        blood_pool_max: 'number', humanity: 'number', breed: 'string', auspice: 'string',
        tribe: 'string', gnosis_current: 'number', gnosis_permanent: 'number', rage_current: 'number',
        rage_permanent: 'number', renown_glory: 'number', renown_honor: 'number', renown_wisdom: 'number',
        tradition_convention: 'string', arete: 'number', quintessence: 'number', paradox: 'number',
        kith: 'string', seeming: 'string', glamour_current: 'number', glamour_permanent: 'number',
        banality_permanent: 'number'
    };

    const mainTableFields = [
      'name', 'concept', 'strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance',
      'perception', 'intelligence', 'wits', 'willpower_current', 'willpower_permanent', 'experience'
    ];

    const splatTableFields: Record<string, string[]> = {
      vampire: ['clan', 'generation', 'blood_pool_current', 'blood_pool_max', 'humanity'],
      werewolf: ['breed', 'auspice', 'tribe', 'gnosis_current', 'gnosis_permanent', 'rage_current', 'rage_permanent', 'renown_glory', 'renown_honor', 'renown_wisdom'],
      mage: ['tradition_convention', 'arete', 'quintessence', 'paradox'],
      changeling: ['kith', 'seeming', 'glamour_current', 'glamour_permanent', 'banality_permanent']
    };

    const mainUpdates: Record<string, any> = {};
    const splatUpdates: Record<string, any> = {};

    for (const key in updates) {
        if (!validFields[key]) {
            throw new Error(`Invalid field for update: '${key}'. Field does not exist or cannot be updated.`);
        }
        if (typeof updates[key as keyof typeof updates] !== validFields[key]) {
            throw new Error(`Invalid data type for field '${key}'. Expected ${validFields[key]}, but got ${typeof updates[key as keyof typeof updates]}.`);
        }

        if (mainTableFields.includes(key)) {
            mainUpdates[key] = updates[key as keyof typeof updates];
        } else if (splatTableFields[character.game_line]?.includes(key)) {
            splatUpdates[key] = updates[key as keyof typeof updates];
        }
    }

    this.db.transaction(() => {
        if (Object.keys(mainUpdates).length > 0) {
            const setClause = Object.keys(mainUpdates).map(field => `${field} = ?`).join(', ');
            this.db.prepare(`UPDATE characters SET ${setClause} WHERE id = ?`).run(...Object.values(mainUpdates), id);
        }
        if (Object.keys(splatUpdates).length > 0) {
            const splatTableName = `character_${character.game_line}_traits`;
            const setClause = Object.keys(splatUpdates).map(field => `${field} = ?`).join(', ');
            this.db.prepare(`UPDATE ${splatTableName} SET ${setClause} WHERE character_id = ?`).run(...Object.values(splatUpdates), id);
        }
    })();

    return this.getCharacterById(id);
  }

  public updateOrInsertRelationalTrait(character_id: number, table: string, name_column: string, trait_name: string, new_rating: number, ability_type?: string): void {
    const existing = this.db.prepare(`SELECT rating FROM ${table} WHERE character_id = ? AND ${name_column} = ?`).get(character_id, trait_name);

    if (existing) {
      this.db.prepare(`UPDATE ${table} SET rating = ? WHERE character_id = ? AND ${name_column} = ?`).run(new_rating, character_id, trait_name);
    } else {
      if (table === 'character_abilities') {
        if (!ability_type) {
          throw new Error("Internal error: ability_type is required when adding a new ability.");
        }
        this.db.prepare(`INSERT INTO ${table} (character_id, ${name_column}, ability_type, rating) VALUES (?, ?, ?, ?)`).run(character_id, trait_name, ability_type, new_rating);
      } else {
        this.db.prepare(`INSERT INTO ${table} (character_id, ${name_column}, rating) VALUES (?, ?, ?)`).run(character_id, trait_name, new_rating);
      }
    }
  }

  public listCharacters(): CharacterData[] {
    const rows = this.db.prepare('SELECT * FROM characters').all();
    return rows.map(row => this.getCharacterById((row as any).id)).filter(Boolean) as CharacterData[];
  }

  public applyDamage(characterId: number, dmg: { aggravated?: number; lethal?: number; bashing?: number }): CharacterData | null {
    const character = this.getCharacterById(characterId);
    if (!character) return null;

    const tracker = HealthTracker.from(character.health_levels);
    tracker.applyDamage(dmg);

    const updatedHealthJson = tracker.serialize();
    this.db.prepare(`UPDATE characters SET health_levels = ? WHERE id = ?`).run(updatedHealthJson, characterId);
    return this.getCharacterById(characterId);
  }

  // REPLACE createCharacter
  public createCharacter(data: Partial<CharacterData>): CharacterData | null {
      // ... (health tracker setup remains the same) ...

      const healthTracker = HealthTracker.healthy();
      const health_levels_json = healthTracker.serialize();

      const charId = this.db.transaction(() => {
          const stmt = this.db.prepare(`
              INSERT INTO characters (name, concept, game_line, strength, dexterity, stamina, charisma, manipulation, appearance,
              perception, intelligence, wits, willpower_current, willpower_permanent, health_levels, experience, title, notes)
              VALUES (@name, @concept, @game_line, @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
              @perception, @intelligence, @wits, @willpower_current, @willpower_permanent, @health_levels, @experience, @title, @notes)
          `);
          const result = stmt.run({
              name: data.name,
              concept: data.concept || null,
              game_line: data.game_line,
              strength: data.strength ?? 1,
              dexterity: data.dexterity ?? 1,
              stamina: data.stamina ?? 1,
              charisma: data.charisma ?? 1,
              manipulation: data.manipulation ?? 1,
              appearance: data.appearance ?? 1,
              perception: data.perception ?? 1,
              intelligence: data.intelligence ?? 1,
              wits: data.wits ?? 1,
              willpower_current: data.willpower_permanent ?? 5,
              willpower_permanent: data.willpower_permanent ?? 5,
              health_levels: health_levels_json,
              experience: data.experience ?? 0,
              title: data.title ?? null,
              notes: data.notes ?? null
          });
          const localCharId = result.lastInsertRowid as number;

          switch (data.game_line) {
              case 'vampire':
                  this.db.prepare(`INSERT INTO character_vampire_traits (character_id, clan, generation, blood_pool_current, blood_pool_max, humanity, coterie_name, sect_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.clan ?? null,
                      data.generation ?? 13,
                      data.blood_pool_current ?? 10,
                      data.blood_pool_max ?? 10,
                      data.humanity ?? 7,
                      data.coterie_name ?? null,
                      data.sect_status ?? null
                  );
                  break;
              case 'werewolf':
                  this.db.prepare(`INSERT INTO character_werewolf_traits (character_id, breed, auspice, tribe, gnosis_current, gnosis_permanent, rage_current, rage_permanent, renown_glory, renown_honor, renown_wisdom, pack_name, pack_totem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.breed ?? null,
                      data.auspice ?? null,
                      data.tribe ?? null,
                      data.gnosis_current ?? 3,
                      data.gnosis_permanent ?? 3,
                      data.rage_current ?? 1,
                      data.rage_permanent ?? 1,
                      data.renown_glory ?? 0,
                      data.renown_honor ?? 0,
                      data.renown_wisdom ?? 0,
                      data.pack_name ?? null,
                      data.pack_totem ?? null
                  );
                  break;
              case 'mage':
                  this.db.prepare(`INSERT INTO character_mage_traits (character_id, tradition_convention, arete, quintessence, paradox, cabal_name, paradigm_notes) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.tradition_convention ?? null,
                      data.arete ?? 1,
                      data.quintessence ?? 0,
                      data.paradox ?? 0,
                      data.cabal_name ?? null,
                      data.paradigm_notes ?? null
                  );
                  break;
              case 'changeling':
                  this.db.prepare(`INSERT INTO character_changeling_traits (character_id, kith, seeming, glamour_current, glamour_permanent, banality_permanent, court, house, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
                      localCharId,
                      data.kith ?? null,
                      data.seeming ?? null,
                      data.glamour_current ?? 4,
                      data.glamour_permanent ?? 4,
                      data.banality_permanent ?? 3,
                      data.court ?? null,
                      data.house ?? null,
                      data.title ?? null
                  );
                  break;
          }
          // ... (ability/discipline insertion logic remains the same) ...
          if (data.abilities && Array.isArray(data.abilities)) {
              const abilityStmt = this.db.prepare(`INSERT INTO character_abilities (character_id, ability_name, ability_type, rating, specialty) VALUES (?, ?, ?, ?, ?)`);
              for (const ability of data.abilities) {
                  abilityStmt.run(localCharId, ability.name, ability.type, ability.rating, ability.specialty ?? null);
              }
          }
          return localCharId;
      })();
      return this.getCharacterById(charId as number);
  }

  public batchImproveTraits(character_id: number, improvements: { trait_type: string; trait_name: string; }[]): { summary: string; final_xp: number; } {
      const calculateXpCost = (trait_type: string, current_rating: number): number => {
          const new_rating = current_rating + 1;
          switch (trait_type) {
              case 'attribute': return new_rating * 4;
              case 'ability': return new_rating * 2;
              case 'discipline': return new_rating * 5; // VTM
              case 'arete': return new_rating * 10; // MTA
              case 'art': return new_rating * 4; // CTD
              case 'willpower': return current_rating; // V20 rule
              default: throw new Error(`XP cost calculation not defined for trait type: ${trait_type}`);
          }
      };

      return this.db.transaction(() => {
          const character = this.getCharacterById(character_id);
          if (!character) throw new Error("Character not found.");

          let totalXpCost = 0;
          const improvementDetails: string[] = [];
          const improvementActions: (() => void)[] = [];

          for (const imp of improvements) {
              const { trait_type, trait_name } = imp;
              let current_rating = 0;
              let isRelational = ['ability', 'discipline', 'art', 'sphere', 'gift'].includes(trait_type);

              if (isRelational) {
                  const relationalTraits = (character as any)[`${trait_type}s`] || [];
                  const trait = relationalTraits.find((t: any) => t.name.toLowerCase() === trait_name.toLowerCase());
                  current_rating = trait ? trait.rating : 0;
              } else {
                  current_rating = (character as any)[trait_name.toLowerCase()] ?? 0;
              }
              
              if (typeof current_rating !== 'number') {
                  throw new Error(`Trait '${trait_name}' could not be found or does not have a numeric rating.`);
              }

              const cost = calculateXpCost(trait_type, current_rating);
              totalXpCost += cost;
              improvementDetails.push(`${trait_name} (${current_rating} -> ${current_rating + 1}) for ${cost} XP`);

              const new_rating = current_rating + 1;
              if (isRelational) {
                  const table = `character_${trait_type}s`;
                  const nameCol = `${trait_type}_name`;
                  improvementActions.push(() => this.updateOrInsertRelationalTrait(character_id, table, nameCol, trait_name, new_rating));
              } else {
                  improvementActions.push(() => this.updateCharacter(character_id, { [trait_name]: new_rating }));
              }
          }

          if (character.experience < totalXpCost) {
              throw new Error(`Insufficient XP. Needs ${totalXpCost}, but only has ${character.experience}.`);
          }

          // Execute all improvements
          improvementActions.forEach(action => action());

          const final_xp = character.experience - totalXpCost;
          this.updateCharacter(character_id, { experience: final_xp });

          return { summary: `Successfully improved: ${improvementDetails.join(', ')}.`, final_xp };
      })();
  }
}
```

## File: src/repositories/game-database.ts
```typescript
// game-state-server/src/repositories/game-database.ts

/**
 * Module: GameDatabase composition/facade
 * 
 * This module provides a single function to aggregate core domain repositories under the canonical names
 * used in all database handler code (`characters`, `antagonists`, `inventory`, `statusEffects`, `worldState`).
 * It is intended as the main gateway for all game state persistence and retrieval operations,
 * facilitating unified domain access for tool handlers.
 * 
 * Usage:
 *   import Database from 'better-sqlite3';
 *   import { createGameDatabase } from './game-database.js';
 *   const db = new Database('data.sqlite');
 *   const gameDb = createGameDatabase(db);
 *   // gameDb.characters, gameDb.worldState, etc.
 */

import type { Database } from 'better-sqlite3';

import { CharacterRepository } from './character.repository.js';
import { AntagonistRepository } from './antagonist.repository.js';
import { InventoryRepository } from './inventory.repository.js';
import { StatusEffectRepository } from './status-effect.repository.js';
import { WorldStateRepository } from './world-state.repository.js';

import type { GameDatabase } from '../types/db.types.js';

/**
 * Aggregates all primary repositories under canonical db property names.
 * @param db An open better-sqlite3 Database instance
 * @returns {GameDatabase} Aggregated repository interface for handler use
 */
export function createGameDatabase(db: Database): GameDatabase {
  return {
    characters: new CharacterRepository(db),
    antagonists: new AntagonistRepository(db),
    inventory: new InventoryRepository(db),
    statusEffects: new StatusEffectRepository(db),
    worldState: new WorldStateRepository(db),
  };
}
```

## File: src/repositories/index.ts
```typescript
export * from './antagonist.repository.js';
export * from './character.repository.js';
export * from './inventory.repository.js';
export * from './status-effect.repository.js';
```

## File: src/repositories/inventory.repository.ts
```typescript
import type { Database } from 'better-sqlite3';
import type { InventoryItem } from '../types/index.js';

export class InventoryRepository {
  private db: Database;
constructor(db: Database) {
    this.db = db;
  }
  
  add(character_id: number, item: any): any {
    const stmt = this.db.prepare(`
      INSERT INTO inventory (character_id, item_name, item_type, quantity, description, properties)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      character_id,
      item.name,
      item.type || 'misc',
      item.quantity || 1,
      item.description || null,
      item.properties ? JSON.stringify(item.properties) : null
    );
    return { id: result.lastInsertRowid, ...item };
  }

  getInventory(character_id: number): InventoryItem[] {
    const stmt = this.db.prepare('SELECT * FROM inventory WHERE character_id = ?');
    const rows = stmt.all(character_id);
    return rows.map(row => {
      const r = row as any;
      return {
        id: r.id,
        character_id: r.character_id,
        item_name: r.item_name,
        item_type: r.item_type,
        quantity: r.quantity,
        description: r.description,
        properties: r.properties ? JSON.parse(r.properties) : null,
        equipped: r.equipped,
        condition: r.condition,
        last_modified: r.last_modified
      }
    });
  }

  private getInventoryItemById(item_id: number): InventoryItem | null {
    const stmt = this.db.prepare('SELECT * FROM inventory WHERE id = ?');
    const row = stmt.get(item_id) as any;
    if (!row) return null;
    return {
      id: row.id,
      character_id: row.character_id,
      item_name: row.item_name,
      item_type: row.item_type,
      quantity: row.quantity,
      description: row.description,
      properties: row.properties ? JSON.parse(row.properties) : null,
      equipped: row.equipped,
      condition: row.condition,
      last_modified: row.last_modified
    };
  }

  // In inventory.repository.ts, replace the existing updateItem method
  // In game-state-server/src/repositories/inventory.repository.ts

  // REPLACE the existing updateItem method
  updateItem(item_id: number, updates: any): any {
    const allowedFields = Object.keys(updates).filter(key => key !== "id");
    if (allowedFields.length === 0) {
      return this.getInventoryItemById(item_id);
    }

    const setClause = allowedFields.map(field => `${field} = ?`).join(', ');
    const values = allowedFields.map(field => (updates as any)[field]);

    const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
    const result = stmt.run(...values, item_id);

    // THE FIX: Check if the update actually changed any rows. If not, the item didn't exist.
    if (result.changes === 0) {
      throw new Error(`Item with ID ${item_id} not found, no update performed.`);
    }

    return this.getInventoryItemById(item_id);
  }

  removeItem(item_id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
    const res = stmt.run(item_id);
    return res.changes > 0;
  }

  // Inventory-related methods will be moved here if/when implemented
}
```

## File: src/repositories/status-effect.repository.ts
```typescript
import type { Database } from 'better-sqlite3';

export class StatusEffectRepository {
  private db: Database;
constructor(db: Database) {
    this.db = db;
  }

  removeStatusEffect(effect_id: number): boolean {
    const stmt = this.db.prepare(`DELETE FROM status_effects WHERE id = ?`);
    const res = stmt.run(effect_id);
    return res.changes > 0;
  }

  listStatusEffects(target_type: string, target_id: number): any[] {
    if (!target_type || !target_id) return [];
    const col = target_type === "character"
      ? "character_id"
      : target_type === "npc"
        ? "npc_id"
        : null;
    if (!col) return [];
    return this.db.prepare(
      `SELECT * FROM status_effects WHERE ${col} = ?`
    ).all(target_id).map((e: any) => ({
      ...e,
      mechanical_effect: e.mechanical_effect ? JSON.parse(e.mechanical_effect) : {}
    }));
  }

  addStatusEffect(opts: {
    target_type: 'character' | 'npc',
    target_id: number,
    effect_name: string,
    description?: string,
    mechanical_effect?: any,
    duration_type?: string,
    duration_value?: number | null
  }): number {
    const {
      target_type, target_id, effect_name,
      description = '', mechanical_effect = {},
      duration_type = 'indefinite', duration_value = null
    } = opts;
    const targetKey = target_type === 'character' ? 'character_id' : 'npc_id';
    const dbres = this.db.prepare(
      `INSERT INTO status_effects (${targetKey}, effect_name, description, mechanical_effect, duration_type, duration_value)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      target_id,
      effect_name,
      description,
      JSON.stringify(mechanical_effect ?? {}),
      duration_type,
      duration_value
    );
    return dbres.lastInsertRowid as number;
  }
}
```

## File: src/repositories/world-state.repository.ts
```typescript
// File: game-state-server/src/repositories/world-state.repository.ts

import type { Database } from 'better-sqlite3';

export class WorldStateRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  saveWorldState(state: { location?: string; notes?: string; data?: any }): void {
    const dataStr = state.data ? JSON.stringify(state.data) : null;
    // Use UPSERT for a single world state row
    this.db.prepare(`
      INSERT INTO world_state (id, location, notes, data, last_updated)
      VALUES (1, @location, @notes, @data, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        location = excluded.location,
        notes = excluded.notes,
        data = excluded.data,
        last_updated = excluded.last_updated;
    `).run({ location: state.location, notes: state.notes, data: dataStr });
  }

  getWorldState(): any {
    const worldState = this.db.prepare('SELECT * FROM world_state WHERE id = 1').get() as any;
    if (worldState && worldState.data) {
      try {
        worldState.data = JSON.parse(worldState.data);
      } catch (err) {
        console.error("Error parsing world state data:", err);
        worldState.data = null;
      }
    }
    return worldState;
  }

  // CORRECTED: This method now matches the simpler schema.
  saveStoryProgress(progress: { chapter: string; scene: string; summary: string }): void {
    this.db.prepare(
      'INSERT INTO story_progress (chapter, scene, summary) VALUES (?, ?, ?)'
    ).run(progress.chapter, progress.scene, progress.summary);
  }

  // --- CORRECTED INITIATIVE & TURN MANAGEMENT ---

  setInitiative(sceneId: string, entries: any[]): void {
    const getCharacterName = this.db.prepare('SELECT name FROM characters WHERE id = ?');
    const getNpcName = this.db.prepare('SELECT name FROM npcs WHERE id = ?');

    // Start a transaction to ensure all operations succeed or fail together
    this.db.transaction(() => {
        // Clear old data for this scene to ensure a fresh start
        this.db.prepare(`DELETE FROM initiative_order WHERE scene_id = ?`).run(sceneId);
        this.db.prepare(`DELETE FROM scenes WHERE scene_id = ?`).run(sceneId);

        // Initialize the scene state
        this.db.prepare(`INSERT INTO scenes (scene_id, current_round, current_turn_order) VALUES (?, 1, 0)`).run(sceneId);

        const insertStmt = this.db.prepare(`
            INSERT INTO initiative_order (scene_id, actor_name, initiative_score, turn_order, character_id, npc_id)
            VALUES (@scene_id, @actor_name, @initiative_score, @turn_order, @character_id, @npc_id)
        `);

        for (const entry of entries) {
            let actor_name = entry.actor_name;

            // --- THIS IS THE FIX ---
            // If actor_name is missing, fetch it from the database using the ID.
            if (!actor_name) {
                if (entry.character_id) {
                    const char = getCharacterName.get(entry.character_id);
                    if (char) actor_name = (char as any).name;
                } else if (entry.npc_id) {
                    const npc = getNpcName.get(entry.npc_id);
                    if (npc) actor_name = (npc as any).name;
                }
            }

            // If we still don't have a name, the entry is invalid.
            if (!actor_name) {
                throw new Error(`Could not determine actor_name for entry with initiative ${entry.initiative_score}. Provide a name or a valid character/npc ID.`);
            }

            insertStmt.run({
                scene_id: sceneId,
                actor_name: actor_name,
                initiative_score: entry.initiative_score,
                turn_order: entry.turn_order,
                character_id: entry.character_id ?? null,
                npc_id: entry.npc_id ?? null,
            });
        }
    })();
  }
  
  getInitiativeOrder(scene_id: string): any[] {
    return this.db.prepare('SELECT * FROM initiative_order WHERE scene_id = ? ORDER BY turn_order ASC').all(scene_id);
  }
  
  advanceTurn(scene_id: string): { success: boolean; message?: string; next_actor?: any; new_round?: number; new_turn_order?: number } {
    const scene = this.db.prepare('SELECT * FROM scenes WHERE scene_id = ?').get(scene_id) as any;

    if (!scene) {
        return { success: false, message: `Scene with ID '${scene_id}' has not been started. Use set_initiative first.` };
    }

    const order = this.getInitiativeOrder(scene_id);
    if (order.length === 0) {
        return { success: false, message: "Initiative order is empty for this scene." };
    }

    // FIX: Correctly handle the very first turn of a scene
    let currentTurnOrder = scene.current_turn_order === 0 ? 1 : scene.current_turn_order + 1;
    let currentRound = scene.current_round;

    if (currentTurnOrder > order.length) {
        currentTurnOrder = 1;
        currentRound++;
    }

    this.db.prepare('UPDATE scenes SET current_turn_order = ?, current_round = ? WHERE scene_id = ?').run(currentTurnOrder, currentRound, scene_id);
    
    const nextActor = order[currentTurnOrder - 1]; // Array is 0-indexed

    return {
      success: true,
      next_actor: nextActor,
      new_round: currentRound,
      new_turn_order: currentTurnOrder,
    };
  }

  getCurrentTurn(scene_id: string): any {
    const scene = this.db.prepare('SELECT * FROM scenes WHERE scene_id = ?').get(scene_id) as any;
    if (!scene || scene.current_turn_order === 0) {
      return { success: false, message: "Combat has not started or initiative is not set." };
    }
    
    const actor = this.db.prepare('SELECT * FROM initiative_order WHERE scene_id = ? AND turn_order = ?').get(scene_id, scene.current_turn_order);
    
    return {
      success: true,
      current_round: scene.current_round,
      current_turn: scene.current_turn_order,
      actor: actor
    };
  }
}
```

## File: src/schema.ts
```typescript
// game-state-server/src/schema.ts
import type { Database as DatabaseType } from 'better-sqlite3';
import Database from 'better-sqlite3';

export function initializeSchema(db: DatabaseType): void {
  console.log("Initializing database schema...");
  db.exec('PRAGMA foreign_keys = ON;');

  // --- CORE ENTITY TABLES ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, concept TEXT, game_line TEXT NOT NULL,
      strength INTEGER DEFAULT 1, dexterity INTEGER DEFAULT 1, stamina INTEGER DEFAULT 1,
      charisma INTEGER DEFAULT 1, manipulation INTEGER DEFAULT 1, appearance INTEGER DEFAULT 1,
      perception INTEGER DEFAULT 1, intelligence INTEGER DEFAULT 1, wits INTEGER DEFAULT 1,
      willpower_current INTEGER DEFAULT 5, willpower_permanent INTEGER DEFAULT 5,
      health_levels TEXT, experience INTEGER DEFAULT 0
    );
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS npcs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, template TEXT, concept TEXT,
      game_line TEXT NOT NULL, strength INTEGER DEFAULT 1, dexterity INTEGER DEFAULT 1, stamina INTEGER DEFAULT 1,
      charisma INTEGER DEFAULT 1, manipulation INTEGER DEFAULT 1, appearance INTEGER DEFAULT 1,
      perception INTEGER DEFAULT 1, intelligence INTEGER DEFAULT 1, wits INTEGER DEFAULT 1,
      willpower_current INTEGER DEFAULT 1, willpower_permanent INTEGER DEFAULT 1,
      health_levels TEXT, notes TEXT
    );
  `);

  // --- SPLAT-SPECIFIC TRAIT TABLES ---
  const splatTables = [
    { name: 'character_vampire_traits', fk: 'character_id', ref: 'characters', traits: 'clan TEXT, generation INTEGER, blood_pool_current INTEGER, blood_pool_max INTEGER, humanity INTEGER' },
    { name: 'character_werewolf_traits', fk: 'character_id', ref: 'characters', traits: 'breed TEXT, auspice TEXT, tribe TEXT, gnosis_current INTEGER, gnosis_permanent INTEGER, rage_current INTEGER, rage_permanent INTEGER, renown_glory INTEGER, renown_honor INTEGER, renown_wisdom INTEGER' },
    { name: 'character_mage_traits', fk: 'character_id', ref: 'characters', traits: 'tradition_convention TEXT, arete INTEGER, quintessence INTEGER, paradox INTEGER' },
    { name: 'character_changeling_traits', fk: 'character_id', ref: 'characters', traits: 'kith TEXT, seeming TEXT, glamour_current INTEGER, glamour_permanent INTEGER, banality_permanent INTEGER' }
    // Add NPC splat tables if they need different fields than characters
  ];
  for (const table of splatTables) {
    db.exec(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.fk} INTEGER PRIMARY KEY, ${table.traits}, FOREIGN KEY (${table.fk}) REFERENCES ${table.ref}(id) ON DELETE CASCADE);`);
  }

  // --- NPC SPLAT-SPECIFIC TRAIT TABLES ---
  const npc_splatTables = [
    { name: 'npc_vampire_traits', fk: 'npc_id', ref: 'npcs', traits: 'clan TEXT, generation INTEGER, blood_pool_current INTEGER, blood_pool_max INTEGER, humanity INTEGER' },
    { name: 'npc_werewolf_traits', fk: 'npc_id', ref: 'npcs', traits: 'breed TEXT, auspice TEXT, tribe TEXT, gnosis_current INTEGER, gnosis_permanent INTEGER, rage_current INTEGER, rage_permanent INTEGER, renown_glory INTEGER, renown_honor INTEGER, renown_wisdom INTEGER' },
    { name: 'npc_mage_traits', fk: 'npc_id', ref: 'npcs', traits: 'tradition_convention TEXT, arete INTEGER, quintessence INTEGER, paradox INTEGER' },
    { name: 'npc_changeling_traits', fk: 'npc_id', ref: 'npcs', traits: 'kith TEXT, seeming TEXT, glamour_current INTEGER, glamour_permanent INTEGER, banality_permanent INTEGER' }
  ];
  for (const table of npc_splatTables) {
    db.exec(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.fk} INTEGER PRIMARY KEY, ${table.traits}, FOREIGN KEY (${table.fk}) REFERENCES ${table.ref}(id) ON DELETE CASCADE);`);
  }
  
  // --- RELATIONAL & STATE TABLES ---
  db.exec(`CREATE TABLE IF NOT EXISTS character_abilities (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, ability_name TEXT NOT NULL, ability_type TEXT NOT NULL, rating INTEGER NOT NULL, specialty TEXT, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE, UNIQUE(character_id, ability_name));`);
  db.exec(`CREATE TABLE IF NOT EXISTS character_disciplines (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, discipline_name TEXT NOT NULL, rating INTEGER NOT NULL, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE, UNIQUE(character_id, discipline_name));`);
  db.exec(`CREATE TABLE IF NOT EXISTS character_gifts (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, gift_name TEXT NOT NULL, rank INTEGER NOT NULL, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE, UNIQUE(character_id, gift_name));`);
  db.exec(`CREATE TABLE IF NOT EXISTS character_spheres (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, sphere_name TEXT NOT NULL, rating INTEGER NOT NULL, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE, UNIQUE(character_id, sphere_name));`);
  db.exec(`CREATE TABLE IF NOT EXISTS character_arts (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, art_name TEXT NOT NULL, rating INTEGER NOT NULL, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE, UNIQUE(character_id, art_name));`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS character_realms (
      id INTEGER PRIMARY KEY,
      character_id INTEGER NOT NULL,
      realm_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
      UNIQUE(character_id, realm_name)
    );
  `);
  db.exec(`CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, character_id INTEGER NOT NULL, item_name TEXT NOT NULL, item_type TEXT, description TEXT, quantity INTEGER DEFAULT 1, properties TEXT, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`);
  db.exec(`CREATE TABLE IF NOT EXISTS world_state (id INTEGER PRIMARY KEY, location TEXT, notes TEXT, data TEXT, last_updated DATETIME DEFAULT CURRENT_TIMESTAMP);`);
  db.exec(`CREATE TABLE IF NOT EXISTS story_progress (id INTEGER PRIMARY KEY, chapter TEXT NOT NULL, scene TEXT NOT NULL, summary TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);`);
  db.exec(`CREATE TABLE IF NOT EXISTS status_effects (id INTEGER PRIMARY KEY, character_id INTEGER, npc_id INTEGER, effect_name TEXT NOT NULL, description TEXT, mechanical_effect TEXT, duration_type TEXT, duration_value INTEGER, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE, FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE);`);
  db.exec(`CREATE TABLE IF NOT EXISTS scenes (scene_id TEXT PRIMARY KEY, current_round INTEGER DEFAULT 1, current_turn_order INTEGER DEFAULT 0);`);
  db.exec(`CREATE TABLE IF NOT EXISTS initiative_order (id INTEGER PRIMARY KEY, scene_id TEXT NOT NULL, actor_name TEXT NOT NULL, initiative_score INTEGER NOT NULL, turn_order INTEGER NOT NULL, character_id INTEGER, npc_id INTEGER, FOREIGN KEY(character_id) REFERENCES characters(id) ON DELETE CASCADE, FOREIGN KEY(npc_id) REFERENCES npcs(id) ON DELETE CASCADE, UNIQUE(scene_id, turn_order));`);

  console.log("Database schema initialized and verified.");
}

export function createDatabase(dbPath: string): DatabaseType {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}
```

## File: src/services/character.service.ts
```typescript
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
```

## File: src/tool-definitions.ts
```typescript
// File: game-state-server/src/tool-definitions.ts

export const toolDefinitions = {
  create_character: {
    name: "create_character",
    description: "Create a new character.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        game_line: { type: "string", enum: ["vampire", "werewolf", "mage", "changeling"] },
        concept: { type: "string" },
        title: { type: "string" },
        notes: { type: "string" }
      },
      required: ["name", "game_line"],
    },
  },
  get_character: {
    name: "get_character",
    description: "Retrieve a character by ID.",
    inputSchema: {
      type: "object",
      properties: { character_id: { type: "number" } },
      required: ["character_id"],
    },
  },
  get_character_by_name: {
    name: "get_character_by_name",
    description: "Retrieve a character by name.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
  list_characters: {
    name: "list_characters",
    description: "List all created characters.",
    inputSchema: { type: "object", properties: {} },
  },
  remove_character: {
    name: "remove_character",
    description: "Permanently delete a character.",
    inputSchema: {
      type: "object",
      properties: { character_id: { type: "number" } },
      required: ["character_id"],
    },
  },
  update_character: {
    name: "update_character",
    description: "Update character traits.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        updates: { type: "object" },
      },
      required: ["character_id", "updates"],
    },
  },
  create_antagonist: {
    name: "create_antagonist",
    description: "Create an NPC from a template.",
    inputSchema: {
      type: "object",
      properties: {
        template_name: { type: "string" },
        custom_name: { type: "string" },
      },
      required: ["template_name"],
    },
  },
  create_custom_antagonist: {
    name: "create_custom_antagonist",
    description: "Creates a unique NPC from scratch.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        game_line: { type: "string", enum: ["vampire", "werewolf", "mage", "changeling", "mortal"] }
      },
      required: ["name", "game_line"],
    },
  },
  get_antagonist: {
    name: "get_antagonist",
    description: "Retrieve an antagonist by ID.",
    inputSchema: {
      type: "object",
      properties: { antagonist_id: { type: "number" } },
      required: ["antagonist_id"],
    },
  },
  list_antagonists: {
    name: "list_antagonists",
    description: "List all antagonists.",
    inputSchema: { type: "object", properties: {} },
  },
  remove_antagonist: {
    name: "remove_antagonist",
    description: "Remove an antagonist.",
    inputSchema: {
      type: "object",
      properties: { antagonist_id: { type: "number" } },
      required: ["antagonist_id"],
    },
  },
  update_antagonist: {
    name: "update_antagonist",
    description: "Update an antagonist's traits.",
    inputSchema: {
      type: "object",
      properties: {
        antagonist_id: { type: "number" },
        updates: { type: "object" },
      },
      required: ["antagonist_id", "updates"],
    },
  },
  apply_damage: {
    name: "apply_damage",
    description: "Apply damage to a target.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] },
        damage_successes: { type: "number" },
        damage_type: { type: "string", enum: ["bashing", "lethal", "aggravated"] },
      },
      required: ["target_id", "target_type", "damage_successes", "damage_type"],
    },
  },
  spend_resource: {
    name: "spend_resource",
    description: "Spend a character resource.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        amount: { type: "number", default: 1 },
      },
      required: ["character_id", "resource_name"],
    },
  },
  restore_resource: {
    name: "restore_resource",
    description: "Restore a character resource.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        amount: { type: "number", default: 1 },
      },
      required: ["character_id", "resource_name"],
    },
  },
  gain_resource: {
    name: "gain_resource",
    description: "Gain a resource from an action.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        roll_successes: { type: "number" },
      },
      required: ["character_id", "resource_name", "roll_successes"],
    },
  },
  award_xp: {
    name: "award_xp",
    description: "Award experience points.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] },
        amount: { type: "number", minimum: 1 },
        reason: { type: "string" },
      },
      required: ["target_id", "target_type", "amount", "reason"],
    },
  },
  improve_trait: {
    name: "improve_trait",
    description: "Spend XP to improve a single trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        trait_type: { type: "string" },
        trait_name: { type: "string" },
      },
      required: ["character_id", "trait_type", "trait_name"],
    },
  },
  batch_improve_traits: {
    name: "batch_improve_traits",
    description: "Spend XP to improve multiple character traits.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        improvements: {
          type: "array",
          items: {
            type: "object",
            properties: { trait_type: { type: "string" }, trait_name: { type: "string" } },
            required: ["trait_type", "trait_name"],
          },
        },
      },
      required: ["character_id", "improvements"],
    },
  },
  batch_improve_antagonist_traits: {
    name: "batch_improve_antagonist_traits",
    description: "Spend XP to improve multiple antagonist traits.",
    inputSchema: {
      type: "object",
      properties: {
        antagonist_id: { type: "number" },
        improvements: {
          type: "array",
          items: {
            type: "object",
            properties: { trait_type: { type: "string" }, trait_name: { type: "string" } },
            required: ["trait_type", "trait_name"],
          },
        },
      },
      required: ["antagonist_id", "improvements"],
    },
  },
  get_trait_improvement_cost: {
    name: "get_trait_improvement_cost",
    description: "Calculate the XP cost to improve a trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        trait_type: { type: "string" },
        trait_name: { type: "string" },
      },
      required: ["character_id", "trait_type", "trait_name"],
    },
  }, // <--- THIS IS THE MISSING COMMA
  add_item: {
    name: "add_item",
    description: "Add an item to a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        item: { type: "object" }
      },
      required: ["character_id", "item"],
    },
  },
  get_inventory: {
    name: "get_inventory",
    description: "Get a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" }
      },
      required: ["character_id"],
    },
  },
  update_item: {
    name: "update_item",
    description: "Update an item in inventory.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "number" },
        updates: { type: "object" }
      },
      required: ["item_id", "updates"],
    },
  },
  remove_item: {
    name: "remove_item",
    description: "Remove an item from inventory.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "number" }
      },
      required: ["item_id"],
    },
  },
  apply_status_effect: {
    name: "apply_status_effect",
    description: "Apply a status effect.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] },
        effect_name: { type: "string" }
      },
      required: ["target_id", "target_type", "effect_name"],
    }
  },
  get_status_effects: {
    name: "get_status_effects",
    description: "Get all status effects on a target.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] }
      },
      required: ["target_id", "target_type"],
    },
  },
  remove_status_effect: {
    name: "remove_status_effect",
    description: "Remove a status effect by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        effect_id: { type: "number" }
      },
      required: ["effect_id"],
    },
  },
  save_world_state: {
    name: "save_world_state",
    description: "Save the current world state.",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string" },
        notes: { type: "string" },
        data: { type: "object" }
      }
    },
  },
  get_world_state: {
    name: "get_world_state",
    description: "Get the current world state.",
    inputSchema: { type: "object", properties: {} }
  },
  save_story_progress: {
      name: "save_story_progress",
      description: "Save story progress.",
      inputSchema: {
          type: "object",
          properties: {
              chapter: { type: "string" },
              scene: { type: "string" },
              summary: { type: "string" }
          },
          required: ["chapter", "scene", "summary"]
      }
  },
  set_initiative: {
    name: "set_initiative",
    description: "Set the initiative order.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" },
        entries: { type: "array" }
      },
      required: ["scene_id", "entries"],
    },
  },
  get_initiative_order: {
    name: "get_initiative_order",
    description: "Get the initiative order for a scene.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"],
    },
  },
  get_current_turn: {
    name: "get_current_turn",
    description: "Get the current turn for a scene.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"],
    },
  },
  advance_turn: {
    name: "advance_turn",
    description: "Advance to the next turn in initiative.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"],
    },
  }
};
```

## File: src/tool-handlers/add_item.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function add_item_handler(db: GameDatabase, args: any) {
  const { character_id, item } = args; // FIX
  if (typeof character_id !== 'number' || !item || typeof item.name !== 'string') {
    return { content: ["❌ Invalid input: 'character_id' must be a number and 'item' must be an object with a 'name' string."].map(makeTextContent), isError: true };
  }
  try {
    const newItem = await db.inventory.add(character_id, item); // Pass item object
    return { content: [`✅ Added item "${item.name}" (ID: ${newItem.id}) to character (ID: ${character_id}).`].map(makeTextContent) };
  } catch (error: any) {
    return { content: [`❌ Error adding item: ${error.message}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/advance_turn.handler.ts
```typescript
// In game-state-server/src/tool-handlers/advance_turn.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function advance_turn_handler(db: GameDatabase, args: any) {
  if (!args || typeof args.scene_id !== 'string') {
    return { 
      content: ["❌ Invalid or missing 'scene_id'. Must be a string."].map(makeTextContent),
      isError: true
    };
  }

  const { scene_id } = args;
  
  try {
    const result = db.worldState.advanceTurn(scene_id);

    if (!result.success || !result.next_actor) {
      return { content: [`❌ ${result.message || 'Could not advance turn.'}`].map(makeTextContent), isError: true };
    }

    const { next_actor, new_round, new_turn_order } = result;

    // Create a human-readable summary
    const output = `🔄 Turn Advanced in Scene: '${scene_id}'\n\n` +
                   `▶️ **Current Actor:** ${next_actor.actor_name} (Initiative: ${next_actor.initiative_score})\n` +
                   `**Round:** ${new_round}, **Turn:** ${new_turn_order}`;
    
    // --- FIX: Embed the structured data as a JSON string inside the single text content block ---
    const fullResponseText = `${output}\n\n---\n${JSON.stringify(result, null, 2)}`;

    return {
      // The content array now contains only ONE text object, which is compliant.
      content: [{ type: 'text', text: fullResponseText }]
    };

  } catch (error: any) {
    console.error(`[advance_turn_handler] Error:`, error);
    return { 
      content: [`❌ An unexpected error occurred while advancing the turn: ${error.message}`].map(makeTextContent),
      isError: true
    };
  }
}
```

## File: src/tool-handlers/apply_damage.handler.ts
```typescript
// game-state-server/src/tool-handlers/apply_damage.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';

export async function apply_damage_handler(db: GameDatabase, args: any) {
  const { target_id, target_type, damage_successes, damage_type } = args;

  if (typeof target_id !== 'number' || !target_type) {
    return { content: ["❌ target_id and target_type are required."].map(makeTextContent), isError: true };
  }
  
  // THE FIX: Construct a DamageObject based on the input.
  const damage = {
    bashing: damage_type === 'bashing' ? damage_successes : 0,
    lethal: damage_type === 'lethal' ? damage_successes : 0,
    aggravated: damage_type === 'aggravated' ? damage_successes : 0,
  };

  const repository = target_type === 'character' ? db.characters : db.antagonists;
  const target = await repository.applyDamage(target_id, damage);
  
  if (!target) {
    return { content: [`❌ ${target_type} with ID ${target_id} not found.`].map(makeTextContent), isError: true };
  }
  
  return { content: [`💥 ${damage_successes} ${damage_type} damage applied to ${target.name}.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/apply_status_effect.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function apply_status_effect_handler(
  db: GameDatabase,
  args: any
) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== 'string' ||
    (args.target_type !== 'character' && args.target_type !== 'npc') ||
    !Object.prototype.hasOwnProperty.call(args, 'target_id') ||
    typeof args.target_id !== 'number' ||
    Number.isNaN(args.target_id) ||
    typeof args.effect_name !== 'string' ||
    args.effect_name.trim().length === 0
  ) {
    return { content: [
      "❌ Invalid or missing arguments. 'target_type' must be 'character' or 'npc', 'target_id' must be a valid number, 'effect_name' must be a non-empty string."
    ].map(makeTextContent), isError: true };
  }
  const { target_type, target_id, effect_name, description, mechanical_effect, duration_type, duration_value } = args;

  const effectId = db.statusEffects.addStatusEffect({
    target_type,
    target_id,
    effect_name,
    description,
    mechanical_effect,
    duration_type,
    duration_value,
  });

  return { content: [`✅ Applied status effect \"${effect_name}\" (ID: ${effectId}) to ${target_type} with ID ${target_id}.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/award_xp.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function award_xp_handler(db: GameDatabase, args: any) {
  // --- Input Validation ---
  if (
    !args ||
    typeof args.target_id !== 'number' ||
    !['character', 'antagonist'].includes(args.target_type) ||
    typeof args.amount !== 'number' || args.amount <= 0 ||
    typeof args.reason !== 'string'
  ) {
    return { 
      content: ["❌ Invalid arguments. Requires 'target_id', 'target_type' ('character' or 'antagonist'), a positive 'amount', and a 'reason'."].map(makeTextContent),
      isError: true
    };
  }

  const { target_id, target_type, amount, reason } = args;

  try {
    let target: any;
    let newExperience: number;

    if (target_type === 'character') {
      target = await db.characters.getCharacterById(target_id);
      if (!target) {
        throw new Error(`Character with ID ${target_id} not found.`);
      }
      newExperience = (target.experience || 0) + amount;
      await db.characters.updateCharacter(target_id, { experience: newExperience });
    } else { // target_type is 'antagonist'
      target = await db.antagonists.getAntagonistById(target_id);
      if (!target) {
        throw new Error(`Antagonist with ID ${target_id} not found.`);
      }
      newExperience = (target.experience || 0) + amount;
      await db.antagonists.updateAntagonist(target_id, { experience: newExperience });
    }

    const output = `✅ Awarded ${amount} XP to ${target.name} (${target_type}).\nNew total: ${newExperience}.\nReason: ${reason}`;
    return { content: [output].map(makeTextContent) };

  } catch (error: any) {
    return { 
      content: [`❌ Error awarding XP: ${error.message}`].map(makeTextContent),
      isError: true
    };
  }
}
```

## File: src/tool-handlers/batch_improve_antagonist_traits.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function batch_improve_antagonist_traits_handler(db: GameDatabase, args: any) {
  const { antagonist_id, improvements } = args;

  if (!antagonist_id || !Array.isArray(improvements) || improvements.length === 0) {
    return { 
      content: ["❌ Invalid input: 'antagonist_id' and a non-empty 'improvements' array are required."].map(makeTextContent),
      isError: true 
    };
  }

  try {
    const result = db.antagonists.batchImproveAntagonistTraits(antagonist_id, improvements);
    const antagonist = db.antagonists.getAntagonistById(antagonist_id);
    const output = `🌟 Antagonist '${antagonist?.name}' Traits Improved!\n\n${result.summary}\n\nRemaining XP: ${result.final_xp}`;
    return { content: [output].map(makeTextContent) };
  } catch (error: any) {
    return { content: [`❌ Error improving antagonist traits: ${error.message}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/batch_improve_traits.handler.ts
```typescript
import type { GameDatabase } from '../types/db.types.js';

export async function batch_improve_traits_handler(db: GameDatabase, input: any) {
  const { character_id, improvements } = input;
  if (typeof character_id !== 'number' || !Array.isArray(improvements)) {
    throw new Error('Invalid input for batch_improve_traits');
  }
  const result = db.characters.batchImproveTraits(character_id, improvements);
  return result;
}
```

## File: src/tool-handlers/create_antagonist.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function create_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.template_name !== 'string' ||
    args.template_name.trim().length === 0 ||
    (args.custom_name && typeof args.custom_name !== 'string')
  ) {
    return { content: [
      "❌ Invalid or missing arguments: 'template_name' must be a non-empty string, and 'custom_name' (if provided) must be a string."
    ].map(makeTextContent), isError: true };
  }
  const { template_name, custom_name } = args;

  const antagonist = db.antagonists.createAntagonist(template_name, custom_name);

  if (!antagonist) {
    return { content: [`❌ Error creating antagonist from template: ${template_name}`].map(makeTextContent), isError: true };
  }

  return { content: [`Antagonist \"${antagonist.name}\" created (ID: ${antagonist.id})`].map(makeTextContent) };
}
```

## File: src/tool-handlers/create_character.handler.ts
```typescript
// game-state-server/src/tool-handlers/create_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

/**
 * Creates a new character from the provided arg fields.
 * args: Opaque; expected to match CharacterData fields.
 * TODO: Specify arg type if possible.
 */
export async function create_character_handler(
  db: GameDatabase,
  args: Record<string, unknown>
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.name !== 'string' ||
    args.name.trim().length === 0 ||
    typeof args.game_line !== 'string' ||
    args.game_line.trim().length === 0 ||
    !['vampire', 'werewolf', 'mage', 'changeling'].includes(args.game_line as string)
  ) {
    return { content: [
      "❌ Invalid or missing arguments: 'name' must be a non-empty string and 'game_line' must be one of: vampire, werewolf, mage, changeling."
    ].map(makeTextContent), isError: true };
  }
  try {
    console.log('[CREATE_CHARACTER] Input args:', args);
    // Check uniqueness for name
    const existing = await db.characters.getCharacterByName?.(args.name);
    if (existing) {
      console.warn('[CREATE_CHARACTER] Duplicate name detected:', args.name);
      return {
        content: [
          `❌ Duplicate character name "${args.name}" is not allowed.`
        ].map(makeTextContent),
        isError: true
      };
    }
    const character = await db.characters.createCharacter(args);
    if (!character) {
      return { content: [`❌ Error creating character: Character not found after creation.`].map(makeTextContent), isError: true };
    }
    return { content: [`Character \"${character.name}\" created with ID ${character.id}`].map(makeTextContent) };
  } catch (error: unknown) {
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("[CREATE_CHARACTER] Handler error:", error);
    return { content: [`❌ Error creating character: ${errMsg}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/create_custom_antagonist.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function create_custom_antagonist_handler(db: GameDatabase, args: any) {
  if (!args.name || !args.game_line) {
    return { 
      content: ["❌ Invalid input: 'name' and 'game_line' are required to create a custom antagonist."].map(makeTextContent),
      isError: true 
    };
  }

  try {
    const antagonist = db.antagonists.createCustomAntagonist(args);
    if (!antagonist) {
        throw new Error("Database failed to create the antagonist.");
    }
    const output = `✅ Custom antagonist '${antagonist.name}' (ID: ${antagonist.id}) has been created with the specified traits.`;
    return { content: [output].map(makeTextContent) };
  } catch (error: any) {
    return { content: [`❌ Error creating custom antagonist: ${error.message}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/gain_resource.handler.ts
```typescript
// In game-state-server/src/tool-handlers/gain_resource.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function gain_resource_handler(db: GameDatabase, args: any) {
  const { character_id, resource_name, roll_successes } = args;

  // Input Validation
  if (typeof character_id !== 'number') {
    return { content: ["❌ character_id must be a number."].map(makeTextContent), isError: true };
  }
  if (typeof resource_name !== 'string') {
    return { content: ["❌ resource_name must be a string."].map(makeTextContent), isError: true };
  }
  if (typeof roll_successes !== 'number' || roll_successes < 0) {
    return { content: ["❌ roll_successes must be a non-negative number."].map(makeTextContent), isError: true };
  }
  
  // Use the logic from restore_resource but with the value from roll_successes
  const { restore_resource_handler } = await import('./restore_resource.handler.js');
  return restore_resource_handler(db, { character_id, resource_name, amount: roll_successes });
}
```

## File: src/tool-handlers/get_antagonist.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_antagonist_handler(db: GameDatabase, args: any) {
  // Validate input
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "antagonist_id") ||
    (typeof args.antagonist_id !== "string" && typeof args.antagonist_id !== "number")
  ) {
    return {
      content: [
        "❌ Invalid or missing 'antagonist_id'. It must be a string or number."
      ].map(makeTextContent),
      isError: true
    };
  }

  const { antagonist_id } = args;
  const antagonist = db.antagonists.getAntagonistById(antagonist_id);

  if (!antagonist) {
    return { content: [`❌ Antagonist with ID ${antagonist_id} not found.`].map(makeTextContent), isError: true };
  }

  return { content: [JSON.stringify(antagonist, null, 2)].map(makeTextContent) };
}
```

## File: src/tool-handlers/get_character_by_name.handler.ts
```typescript
// game-state-server/src/tool-handlers/get_character_by_name.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export interface GetCharacterByNameHandlerArgs {
  name: string;
}

export async function get_character_by_name_handler(
  db: GameDatabase,
  args: GetCharacterByNameHandlerArgs
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.name !== "string" ||
    args.name.trim().length === 0
  ) {
    return {
      content: [
        "❌ Invalid or missing 'name'. A non-empty string is required."
      ].map(makeTextContent),
      isError: true
    };
  }
  try {
    const character = await db.characters.getCharacterByName(args.name);
    if (!character) {
      return { content: [`❌ Character with name ${args.name} not found.`].map(makeTextContent), isError: true };
    }
    return { content: [JSON.stringify(character, null, 2)].map(makeTextContent) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("get_character_by_name_handler error:", error);
    return { content: [`❌ Error getting character: ${errMsg}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/get_character.handler.ts
```typescript
// game-state-server/src/tool-handlers/get_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';
import { CharacterService } from '../services/character.service.js';
import { formatSheetByGameLine } from '../characterSheets.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export interface GetCharacterHandlerArgs {
  character_id: number;
}

export async function get_character_handler(
  db: GameDatabase,
  args: GetCharacterHandlerArgs
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id)
  ) {
    return {
      content: [
        "❌ Invalid or missing 'character_id'. Must provide a valid number."
      ].map(makeTextContent),
      isError: true
    };
  }
  
  // The service abstracts away the repository details
  const characterService = new CharacterService(db.characters);

  try {
    const character = await characterService.getCharacter(args.character_id);
    // The formatting logic can be moved into a dedicated formatter function
    const sheet = formatSheetByGameLine({ character }); // Assuming you have this function
    return { content: [sheet] };
  } catch (error: any) {
    return { content: [`❌ ${error.message}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/get_current_turn.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_current_turn_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "scene_id") ||
    (typeof args.scene_id !== "string" && typeof args.scene_id !== "number")
  ) {
    return {
      content: [
        "❌ Invalid or missing 'scene_id'. Must provide a string or number."
      ].map(makeTextContent),
      isError: true
    };
  }
  const { scene_id } = args;
  const currentTurn = db.worldState.getCurrentTurn(scene_id);
  return { content: [JSON.stringify(currentTurn, null, 2)].map(makeTextContent) };
}
```

## File: src/tool-handlers/get_initiative_order.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_initiative_order_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "scene_id") ||
    (typeof args.scene_id !== "string" && typeof args.scene_id !== "number")
  ) {
    return {
      content: [
        "❌ Invalid or missing 'scene_id'. Must provide a string or number."
      ].map(makeTextContent),
      isError: true
    };
  }
  const { scene_id } = args;
  const initiativeOrder = db.worldState.getInitiativeOrder(scene_id);
  return { content: [JSON.stringify(initiativeOrder, null, 2)].map(makeTextContent) };
}
```

## File: src/tool-handlers/get_inventory.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_inventory_handler(db: GameDatabase, args: any) {
    const { character_id } = args;
    if (typeof character_id !== 'number') {
        return { content: ["❌ Invalid 'character_id'."].map(makeTextContent), isError: true };
    }
    const inventory = db.inventory.getInventory(character_id);
    const output = `🎒 Inventory for Character #${character_id}:\n` +
        (inventory.length > 0
        ? inventory.map((item: any) => `- ${item.item_name} (x${item.quantity}) [ID: ${item.id}]`).join('\n')
        : '  (Empty)');
    return { content: [output].map(makeTextContent) };
}
```

## File: src/tool-handlers/get_status_effects.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_status_effects_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== "string" ||
    args.target_type.trim().length === 0 ||
    !Object.prototype.hasOwnProperty.call(args, "target_id") ||
    typeof args.target_id !== "number" ||
    Number.isNaN(args.target_id)
  ) {
    return {
      content: [
        "❌ Invalid or missing arguments. 'target_type' must be a non-empty string, 'target_id' must be a valid number."
      ].map(makeTextContent),
      isError: true
    };
  }
  const { target_type, target_id } = args;
  const effects = db.statusEffects.listStatusEffects(target_type, target_id);

  const effectList = effects.map(effect => `${effect.effect_name} (ID: ${effect.id})`).join('\n');

  return { content: [effectList || `No status effects found for ${target_type} with ID ${target_id}.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/get_trait_improvement_cost.handler.ts
```typescript
// game-state-server/src/tool-handlers/get_trait_improvement_cost.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

// Re-use the same logic from the improve_trait handler for consistency.
function calculateXpCost(trait_type: string, current_rating: number): number {
    const new_rating = current_rating + 1;
    switch (trait_type) {
        case 'attribute': return new_rating * 4;
        case 'ability': return new_rating * 2;
        case 'discipline': return new_rating * 5;
        case 'art': return new_rating * 4;
        case 'willpower': return current_rating; // Cost is current rating
        default: return 999; // Default for unknown
    }
}

export async function get_trait_improvement_cost_handler(db: GameDatabase, args: any) {
  const { character_id, trait_type, trait_name } = args;
  
  const character = await db.characters.getCharacterById(character_id);
  if (!character) return { content: [`❌ Character not found.`].map(makeTextContent), isError: true };

  // This logic is simplified; a full implementation would check relational tables too.
  const current_rating = (character as any)[trait_name.toLowerCase()] ?? 0;
  
  const cost = calculateXpCost(trait_type, current_rating);

  return { content: [`Cost to improve ${trait_name} from ${current_rating} to ${current_rating + 1} is ${cost} XP.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/get_world_state.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_world_state_handler(db: GameDatabase, args: any) {
  const worldState = db.worldState.getWorldState();
  return { content: [JSON.stringify(worldState, null, 2)].map(makeTextContent) };
}
```

## File: src/tool-handlers/improve_trait.handler.ts
```typescript
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
```

## File: src/tool-handlers/index.ts
```typescript
import type { GameDatabase } from '../types/db.types.js';

import { toolDefinitions } from '../tool-definitions.js';

// Import all your handlers here
import { add_item_handler } from './add_item.handler.js';
import { advance_turn_handler } from './advance_turn.handler.js';
import { apply_damage_handler } from './apply_damage.handler.js';
import { apply_status_effect_handler } from './apply_status_effect.handler.js';
import { award_xp_handler } from './award_xp.handler.js';
import { batch_improve_traits_handler } from './batch_improve_traits.handler.js';
import { create_antagonist_handler } from './create_antagonist.handler.js';
import { create_character_handler } from './create_character.handler.js';
import { gain_resource_handler } from './gain_resource.handler.js';
import { get_antagonist_handler } from './get_antagonist.handler.js';
import { get_character_by_name_handler } from './get_character_by_name.handler.js';
import { get_character_handler } from './get_character.handler.js';
import { get_current_turn_handler } from './get_current_turn.handler.js';
import { get_initiative_order_handler } from './get_initiative_order.handler.js';
import { get_inventory_handler } from './get_inventory.handler.js';
import { get_status_effects_handler } from './get_status_effects.handler.js';
import { get_trait_improvement_cost_handler } from './get_trait_improvement_cost.handler.js';
import { get_world_state_handler } from './get_world_state.handler.js';
import { improve_trait_handler } from './improve_trait.handler.js';
import { list_antagonists_handler } from './list_antagonists.handler.js';
import { list_characters_handler } from './list_characters.handler.js';
import { remove_character_handler } from './remove_character.handler.js';
import { remove_antagonist_handler } from './remove_antagonist.handler.js';
import { remove_item_handler } from './remove_item.handler.js';
import { remove_status_effect_handler } from './remove_status_effect.handler.js';
import { restore_resource_handler } from './restore_resource.handler.js';
import { save_story_progress_handler } from './save_story_progress.handler.js';
import { save_world_state_handler } from './save_world_state.handler.js';
import { set_initiative_handler } from './set_initiative.handler.js';
import { spend_resource_handler } from './spend_resource.handler.js';
import { spend_xp_handler } from './spend_xp.handler.js';
import { update_antagonist_handler } from './update_antagonist.handler.js';
import { update_character_handler } from './update_character.handler.js';
import { update_item_handler } from './update_item.handler.js';
import { create_custom_antagonist_handler } from './create_custom_antagonist.handler.js';
import { batch_improve_antagonist_traits_handler } from './batch_improve_antagonist_traits.handler.js';

// Create a single map of all tool handlers
export const toolDispatcher: Record<string, (db: GameDatabase, args: any) => Promise<any>> = {
  'add_item': add_item_handler,
  'advance_turn': advance_turn_handler,
  'apply_damage': apply_damage_handler,
  'apply_status_effect': apply_status_effect_handler,
  'award_xp': award_xp_handler,
  'create_antagonist': create_antagonist_handler,
  'create_character': create_character_handler,
  'create_custom_antagonist': create_custom_antagonist_handler,
  'gain_resource': gain_resource_handler,
  'get_antagonist': get_antagonist_handler,
  'get_character_by_name': get_character_by_name_handler,
  'get_character': get_character_handler,
  'get_current_turn': get_current_turn_handler,
  'get_initiative_order': get_initiative_order_handler,
  'get_inventory': get_inventory_handler,
  'get_status_effects': get_status_effects_handler,
  'get_trait_improvement_cost': get_trait_improvement_cost_handler,
  'get_world_state': get_world_state_handler,
  'improve_trait': improve_trait_handler,
  'batch_improve_traits': batch_improve_traits_handler,
  'batch_improve_antagonist_traits': batch_improve_antagonist_traits_handler,
  'list_antagonists': list_antagonists_handler,
  'list_characters': list_characters_handler,
   
  'remove_character': remove_character_handler,
  
  'list_tools': async (db, args) => {
    return {
      content: [{ type: 'text', text: JSON.stringify(Object.values(toolDefinitions), null, 2) }]
    };
  },
  'remove_antagonist': remove_antagonist_handler,
  'remove_item': remove_item_handler,
  'remove_status_effect': remove_status_effect_handler,
  'restore_resource': restore_resource_handler,
  'save_story_progress': save_story_progress_handler,
  'save_world_state': save_world_state_handler,
  'set_initiative': set_initiative_handler,
  'spend_resource': spend_resource_handler,
  'spend_xp': spend_xp_handler,
  'update_antagonist': update_antagonist_handler,
  'update_character': update_character_handler,
  'update_item': update_item_handler,
};
```

## File: src/tool-handlers/list_antagonists.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function list_antagonists_handler(
  db: GameDatabase,
  args: any
) {
  const antagonists = db.antagonists.listAntagonists();

  const antagonistList = antagonists.map(antagonist => `${antagonist.name} (ID: ${antagonist.id})`).join('\n');

  return { content: [antagonistList || "No antagonists found."].map(makeTextContent) };
}
```

## File: src/tool-handlers/list_characters.handler.ts
```typescript
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
```

## File: src/tool-handlers/remove_antagonist.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function remove_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.antagonist_id !== 'number' ||
    Number.isNaN(args.antagonist_id)
  ) {
    return { content: [
      "❌ Invalid or missing 'antagonist_id': must be a valid number."
    ].map(makeTextContent), isError: true };
  }
  const { antagonist_id } = args;
  console.log('[REMOVE_ANTAGONIST] Attempting delete:', antagonist_id);
  try {
    const success = await db.antagonists.removeAntagonist(antagonist_id);

    if (!success) {
      console.warn('[REMOVE_ANTAGONIST] Deletion failed; antagonist may not exist or is referenced by others:', antagonist_id);
      return { content: [`❌ Could not remove antagonist with ID ${antagonist_id}. It may be referenced by other records (e.g., inventory, encounters, or status effects). Ensure it is not in use elsewhere.`].map(makeTextContent), isError: true };
    }

    console.log('[REMOVE_ANTAGONIST] Delete succeeded for antagonist ID:', antagonist_id);
    return { content: [`✅ Antagonist with ID ${antagonist_id} removed successfully.`].map(makeTextContent) };
  } catch (error: any) {
    const errMsg = error?.message ?? String(error);
    if (errMsg.includes('FOREIGN KEY constraint failed')) {
      console.error('[REMOVE_ANTAGONIST] FOREIGN KEY constraint failed:', antagonist_id, errMsg);
      return { content: [`❌ Cannot remove antagonist with ID ${antagonist_id} — there are still dependent records (inventory, encounters, etc.) referencing it. Remove or reassign these dependencies first.`].map(makeTextContent), isError: true };
    }
    console.error('[REMOVE_ANTAGONIST] Handler exception:', antagonist_id, errMsg);
    return { content: [`❌ Error removing antagonist: ${errMsg}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/remove_character.handler.ts
```typescript
// File: game-state-server/src/tool-handlers/remove_character.handler.ts

import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function remove_character_handler(db: GameDatabase, args: any) {
  const { character_id } = args;

  if (typeof character_id !== 'number') {
    return { 
      content: ["❌ Invalid input: 'character_id' must be a number."].map(makeTextContent),
      isError: true 
    };
  }
  
  try {
    const character = await db.characters.getCharacterById(character_id);
    if (!character) {
        return { 
            content: [`❌ Character with ID ${character_id} not found.`].map(makeTextContent),
            isError: true 
        };
    }
    
    const success = db.characters.removeCharacter(character_id);

    if (success) {
      return { 
        content: [`✅ Character '${character.name}' (ID: ${character_id}) and all associated data have been permanently removed.`].map(makeTextContent)
      };
    } else {
      // This case should be rare if the getCharacterById check passed, but it's good practice.
      return { 
        content: [`❌ Failed to remove character with ID ${character_id}. They may have already been deleted.`].map(makeTextContent),
        isError: true 
      };
    }
  } catch (error: any) {
    console.error(`[remove_character_handler] Error:`, error);
    return { 
      content: [`❌ An unexpected error occurred while removing character: ${error.message}`].map(makeTextContent),
      isError: true 
    };
  }
}
```

## File: src/tool-handlers/remove_item.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function remove_item_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== 'string' ||
    args.target_type !== 'character' ||
    typeof args.target_id !== 'number' ||
    Number.isNaN(args.target_id) ||
    typeof args.item_id !== 'number' ||
    Number.isNaN(args.item_id)
  ) {
    return { content: [
      "❌ Invalid or missing arguments: 'target_type' must be 'character', 'target_id' and 'item_id' must be valid numbers."
    ].map(makeTextContent), isError: true };
  }
  const { target_type, target_id, item_id } = args;

  const success = db.inventory.removeItem(item_id);
  return { content: [`✅ Removed item with ID ${item_id} from ${target_type} with ID ${target_id}.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/remove_status_effect.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function remove_status_effect_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.effect_id !== 'number' ||
    Number.isNaN(args.effect_id)
  ) {
    return { content: [
      "❌ Invalid or missing 'effect_id': must be a valid number."
    ].map(makeTextContent), isError: true };
  }
  const { effect_id } = args;
  const success = db.statusEffects.removeStatusEffect(effect_id);

  if (!success) {
    return { content: [`❌ Could not remove status effect with ID ${effect_id}.`].map(makeTextContent), isError: true };
  }

  return { content: [`✅ Removed status effect with ID ${effect_id}.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/restore_resource.handler.ts
```typescript
// game-state-server/src/tool-handlers/restore_resource.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function restore_resource_handler(db: GameDatabase, args: any) {
  const { character_id, resource_name, amount = 1 } = args;
  
  const character = await db.characters.getCharacterById(character_id);
  if (!character) return { content: [`❌ Character not found.`].map(makeTextContent), isError: true };

  const resourceMap: Record<string, { current: string, max: string }> = {
    willpower: { current: 'willpower_current', max: 'willpower_permanent' },
    blood: { current: 'blood_pool_current', max: 'blood_pool_max' },
    gnosis: { current: 'gnosis_current', max: 'gnosis_permanent' },
    rage: { current: 'rage_current', max: 'rage_permanent' },
    glamour: { current: 'glamour_current', max: 'glamour_permanent' }
  };
  
  const res = resourceMap[resource_name];
  if (!res) return { content: [`❌ Invalid resource '${resource_name}'.`].map(makeTextContent), isError: true };
  
  const currentValue = (character as any)[res.current] ?? 0;
  const maxValue = (character as any)[res.max] ?? currentValue;
  
  const newValue = Math.min(maxValue, currentValue + amount);
  
  await db.characters.updateCharacter(character_id, { [res.current]: newValue });
  const updatedChar = await db.characters.getCharacterById(character_id);

  const newTotal = updatedChar ? (updatedChar as any)[res.current] : 'N/A';
  return { content: [`✅ ${character.name} restored ${amount} ${resource_name}. New total: ${newTotal}/${maxValue}`].map(makeTextContent) };
}
```

## File: src/tool-handlers/save_story_progress.handler.ts
```typescript
// game-state-server/src/tool-handlers/save_story_progress.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_story_progress_handler(db: GameDatabase, args: any) {
  if (
    !args ||
    args.chapter == null ||
    args.scene == null ||
    args.summary == null
  ) {
    return {
      content: [
        "❌ Invalid input. 'chapter', 'scene', and 'summary' are required."
      ].map(makeTextContent),
      isError: true
    };
  }
  
  const { chapter, scene, summary } = args;

  try {
    db.worldState.saveStoryProgress({ chapter, scene, summary });
    return { content: [`📖 Story progress for Chapter ${chapter}, Scene ${scene} saved.`].map(makeTextContent) };
  } catch (error: any) {
    return { content: [`❌ Could not save story progress: ${error.message}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/save_world_state.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_world_state_handler(db: GameDatabase, args: any) {
  // Add robust input validation
  if (!args || (args.location == null && args.notes == null && args.data == null)) {
    return { 
      content: ["❌ Invalid input. At least one of 'location', 'notes', or 'data' must be provided."].map(makeTextContent),
      isError: true 
    };
  }

  const { location, notes, data } = args;
  
  try {
    // The repository method is correct, the handler just needed to pass the args.
    db.worldState.saveWorldState({ location, notes, data });
    return { content: [`🌍 World state saved successfully.`].map(makeTextContent) };
  } catch (err: any) {
    return { content: [`❌ Could not save world state: ${err.message}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/set_initiative.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function set_initiative_handler(db: GameDatabase, args: any) {
  const { scene_id, entries } = args;
  try {
    db.worldState.setInitiative(scene_id, entries);
  } catch (err) {
    const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
    return { content: [`❌ Could not set initiative for scene ${scene_id}: ${errorMsg}`].map(makeTextContent), isError: true };
  }

  return { content: [`✅ Set initiative for scene ${scene_id}.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/spend_resource.handler.ts
```typescript
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
```

## File: src/tool-handlers/spend_xp.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import { CharacterRepository } from '../repositories/character.repository.js';
import type { GameDatabase } from '../types/db.types.js';

// -- XP cost logic: oWoD standard: (current rating + 1) × multiplier (usually 5-7)
function getTraitXPCost(traitName: string, currentVal: number): number {
  // These values are often set by rules, but we'll use 5 as a sane default XP multiplier.
  const attrNames = [
    "Strength", "Dexterity", "Stamina", "Charisma", "Manipulation", "Appearance", "Perception", "Intelligence", "Wits"
  ];
  const abilNames = [
    "Alertness", "Athletics", "Brawl", "Empathy", "Expression", "Intimidation", "Leadership", "Subterfuge",
    "Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Melee", "Performance", "Stealth", "Survival"
  ];
  let multiplier = 5;
  if (abilNames.includes(traitName)) multiplier = 2;
  if (attrNames.includes(traitName)) multiplier = 5;
  return (currentVal + 1) * multiplier;
}

import type { CharacterData } from '../types/character.types.js';

export interface SpendXPArgs {
  character_id: number;
  amount: number;
  reason?: string;
  trait_name: string;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function spend_xp_handler(
  db: GameDatabase,
  args: SpendXPArgs
): Promise<HandlerResponse> {
  const { character_id, amount, reason, trait_name } = args;

  // --- Input Validation: Numeric & Enum ---
  let errorMsgs: string[] = [];
  const allowedTraitNames = [
    "Strength", "Dexterity", "Stamina", "Charisma", "Manipulation", "Appearance", "Perception", "Intelligence", "Wits",
    "Alertness", "Athletics", "Brawl", "Empathy", "Expression", "Intimidation", "Leadership", "Subterfuge",
    "Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Melee", "Performance", "Stealth", "Survival"
  ];
  if (typeof character_id !== "number" || !Number.isInteger(character_id) || character_id <= 0) {
    errorMsgs.push("Error: 'character_id' must be a positive integer.");
  }
  if (typeof amount !== "number" || !Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0 || amount > 500) {
    errorMsgs.push("Error: 'amount' must be a positive integer not exceeding 500.");
  }
  if (typeof trait_name !== "string" || !allowedTraitNames.includes(trait_name)) {
    errorMsgs.push(`Error: 'trait_name' must be one of: ${allowedTraitNames.join(", ")}`);
  }
  if (errorMsgs.length > 0) {
    return {
      content: errorMsgs.map(makeTextContent),
      isError: true
    };
  }

  // -- Fetch character & compute cost atomically --
  // Use raw db for transactions and repo (from GameDatabase class)
  const repo = db.characters;
  let result;
  try {
    const character = repo.getCharacterById(character_id);
    if (!character) {
      throw new Error("Error: Character not found.");
    }
    if (typeof character.experience !== 'number') {
      throw new Error("Error: Character has invalid or missing XP/experience.");
    }
    // Defensive: trait must exist (should be present by type)
    const currVal = character[trait_name] ?? undefined;
    if (typeof currVal !== 'number') {
      throw new Error(`Error: Character does not have the trait '${trait_name}'.`);
    }
    const xpCost = getTraitXPCost(trait_name, currVal);
    if (amount !== xpCost) {
      throw new Error(`Error: Amount must equal the XP cost (${xpCost}) to raise '${trait_name}' from ${currVal} to ${currVal + 1}.`);
    }
    if (character.experience < xpCost) {
      throw new Error(`Error: Not enough XP. ${xpCost} required to improve '${trait_name}'.`);
    }
    // Mutate and save
    const updates: any = {
      [trait_name]: currVal + 1,
      experience: character.experience - xpCost
    };
    repo.updateCharacter(character_id, updates);

    // Fetch updated
    const updated = repo.getCharacterById(character_id);
    result = {
      content: [`Trait '${trait_name}' improved from ${currVal} to ${currVal + 1}. XP spent: ${xpCost}. XP remaining: ${updated?.experience ?? 0}`].map(makeTextContent)
    };
  } catch (err: any) {
    return {
      content: [err?.message || "Unknown error."].map(makeTextContent),
      isError: true
    };
  }
  return result;
}
```

## File: src/tool-handlers/update_antagonist.handler.ts
```typescript
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_antagonist_handler(db: GameDatabase, args: any) {
  const { antagonist_id, updates } = args;
  const antagonist = await db.antagonists.updateAntagonist(antagonist_id, updates);

  if (!antagonist) {
    return { content: [`❌ Antagonist with ID ${antagonist_id} not found.`].map(makeTextContent), isError: true };
  }

  return { content: [`✅ Antagonist "${antagonist.name}" (ID: ${antagonist.id}) updated.`].map(makeTextContent) };
}
```

## File: src/tool-handlers/update_character.handler.ts
```typescript
// game-state-server/src/tool-handlers/update_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';
import type { CharacterData } from '../types/character.types.js';

export interface UpdateCharacterHandlerArgs {
  character_id: number;
  updates: Partial<CharacterData>;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function update_character_handler(
  db: GameDatabase,
  args: UpdateCharacterHandlerArgs
): Promise<HandlerResponse> {
  try {
    console.log('[UPDATE_CHARACTER] Request:', args.character_id, args.updates);
    const character = await db.characters.updateCharacter(args.character_id, args.updates);
    if (!character) {
      console.warn('[UPDATE_CHARACTER] No character found for ID:', args.character_id);
      return { content: [`❌ Character with ID ${args.character_id} not found.`].map(makeTextContent), isError: true };
    }
    console.log('[UPDATE_CHARACTER] Update succeeded:', character.id, args.updates);
    return { content: [`Character "${character.name}" (ID ${character.id}) updated.`].map(makeTextContent) };
  } catch (error: unknown) {
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    if (errMsg && errMsg.includes('no such column')) {
      console.error('[UPDATE_CHARACTER] Attempted to update invalid field:', errMsg, args.updates);
      return {
        content: [
          `❌ Error: Tried to update a field that does not exist (${errMsg}). Check that the attribute is valid for this character type.`
        ].map(makeTextContent),
        isError: true
      };
    }
    console.error('[UPDATE_CHARACTER] Handler error:', error);
    return { content: [`❌ Error updating character: ${errMsg}`].map(makeTextContent), isError: true };
  }
}
```

## File: src/tool-handlers/update_item.handler.ts
```typescript
// In game-state-server/src/tool-handlers/update_item.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_item_handler(db: GameDatabase, args: any) {
  const { item_id, updates } = args;

  // --- VALIDATION FIX ---
  // The only parameters needed are the item's unique ID and the update payload.
  if (typeof item_id !== 'number' || !updates || typeof updates !== 'object') {
    return {
        content: ["❌ Invalid input: 'item_id' (number) and 'updates' (object) are required."].map(makeTextContent),
        isError: true
    };
  }
  // --- END FIX ---

  try {
    const result = await db.inventory.updateItem(item_id, updates);
    if (!result) {
      throw new Error(`Item with ID ${item_id} not found.`); // The repo now throws this, but we catch it.
    }
    return { content: [`✅ Updated item with ID ${item_id}.`].map(makeTextContent) };
  } catch (err: any) {
    return {
      content: [`❌ Failed to update item: ${err.message}`].map(makeTextContent),
      isError: true
    };
  }
}
```

## File: src/types/antagonist.types.ts
```typescript
export interface AntagonistRow {
  id: number;
  name: string;
  template: string;
  concept: string;
  game_line: string;
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  blood_pool_current: number;
  notes: string;
  experience: number;
}

export interface NpcRow {
  id: number;
  name: string;
  template: string;
  concept: string;
  game_line: string;
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  blood_pool_current: number;
  notes: string;
}

export interface AntagonistSheet {
  name: string;
  game_line: string;
  type: string; // 'enemy', 'ally', 'neutral'
  /** A brief archetypal summary, e.g. "Ruthless footsoldier," "Master manipulator" */
  concept: string;
  attributes: {
    strength: number;
    dexterity: number;
    stamina: number;
    charisma: number;
    manipulation: number;
    appearance: number;
    perception: number;
    intelligence: number;
    wits: number;
  };
  abilities: Partial<{
    talents: Record<string, number>;
    skills: Record<string, number>;
    knowledges: Record<string, number>;
  }>;
  willpower: number;
  health_levels: Record<string, number>;
  supernatural?: Record<string, number>;
  description?: string;
}

export type AntagonistTemplates = Record<string, AntagonistSheet>;
```

## File: src/types/character.types.ts
```typescript
import type { InventoryItem } from "./inventory.types.js";
import type { StatusEffect } from "./status-effect.types.js";

export type GameLine = 'vampire' | 'werewolf' | 'mage' | 'changeling';

export interface CharacterAttributes {
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
}

export interface CharacterData extends CharacterAttributes {
  id: number;
  name: string;
  concept?: string | null;
  game_line: GameLine;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  experience: number;
  power_stat_rating?: number;
  power_stat_name?: string;
  abilities: Ability[];
  disciplines: SupernaturalPower[];
  arts?: SupernaturalPower[];
  realms?: SupernaturalPower[];
  spheres?: SupernaturalPower[];
  gifts?: SupernaturalPower[];
  inventory: InventoryItem[];
  status_effects: StatusEffect[];
  [key: string]: any;

  // --- NEW OPTIONAL FIELDS (ALL SPLATS) ---
  title?: string | null;      // Changeling, Vampire (Prince, etc.)
  notes?: string | null;      // Generic notes for any character

  // Vampire
  coterie_name?: string | null;
  sect_status?: string | null;

  // Werewolf
  pack_name?: string | null;
  pack_totem?: string | null;

  // Mage
  cabal_name?: string | null;
  paradigm_notes?: string | null;

  // Changeling
  court?: string | null;
  house?: string | null;
  seeming?: string | null; // Already present but good to confirm
}

interface Ability {
  name: string;
  type: string;
  rating: number;
  specialty?: string;
}

interface SupernaturalPower {
  name: string;
  rating: number;
}

interface Derangement {
  name: string;
  description: string;
}

// The following types will be imported from their own files after all types are moved:
// - InventoryItem (from inventory.types.ts)
// - StatusEffect (from status-effect.types.ts)

export type CharacterSheetOptions = {
  character: CharacterData,                   // Core character object (db shape)
  extra?: Record<string, number>,      // Game-line-specific joined data (e.g., disciplines)
  derangements?: Derangement[],             // Array of derangement objects
};
```

## File: src/types/db.types.ts
```typescript
export interface DatabaseResult {
  lastInsertRowid: number | bigint;
  changes: number;
}

export interface QueryResult<T> {
  [key: string]: T | undefined;
}

export interface Lock {
  timestamp: number;
  operation: string;
}

export interface DbResult<T> {
  success: boolean;
}

import type { CharacterRepository } from '../repositories/character.repository.js';
import type { AntagonistRepository } from '../repositories/antagonist.repository.js';
import type { InventoryRepository } from '../repositories/inventory.repository.js';
import type { StatusEffectRepository } from '../repositories/status-effect.repository.js';
import type { WorldStateRepository } from '../repositories/world-state.repository.js';

/**
 * Aggregates all primary repository access under typical domain property names.
 * Properties match the names most widely used in tool handlers: `characters`, `antagonists`, `inventory`, `statusEffects`, `worldState`.
 * This interface is intended for use as the main in-memory database/domain gateway object.
 */
export interface GameDatabase {
  characters: CharacterRepository;
  antagonists: AntagonistRepository;
  inventory: InventoryRepository;
  statusEffects: StatusEffectRepository;
  worldState: WorldStateRepository;
}
```

## File: src/types/health.types.ts
```typescript
export type DamageType = 'bashing' | 'lethal' | 'aggravated';

export type HealthLevel =
  | 'bruised'
  | 'hurt'
  | 'injured'
  | 'wounded'
  | 'mauled'
  | 'crippled'
  | 'incapacitated';

export interface DamageObject {
  aggravated?: number;
  lethal?: number;
  bashing?: number;
}
```

## File: src/types/index.ts
```typescript
export * from './antagonist.types.js';
export * from './character.types.js';
export * from './db.types.js';
export * from './health.types.js';
export * from './inventory.types.js';
export * from './status-effect.types.js';
```

## File: src/types/inventory.types.ts
```typescript
export interface InventoryItem {
  id: number;
  character_id: number;
  item_name: string;
  item_type: string;
  quantity: number;
  description?: string;
  properties?: Record<string, any>;
  equipped: boolean;
  condition: string;
  last_modified: string;
}
```

## File: src/types/status-effect.types.ts
```typescript
export interface StatusEffect {
  id: number;
  character_id?: number;
  npc_id?: number;
  effect_name: string;
  description?: string;
  mechanical_effect?: Record<string, any>;
  duration_type: string;
  duration_value?: number;
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```
