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
.gitattributes
.gitignore
.kilocode/mcp.json
.kilocodemodes
.roo/mcp.json
character-sheet-template.md
combat-engine-server/package.json
combat-engine-server/src/index.ts
combat-engine-server/src/narrative-engine.ts
combat-engine-server/tsconfig.json
dice-rolling-guide.md
dungeon-master-mode.json
ENHANCEMENTS.md
game-state-server/package.json
game-state-server/src/antagonists.ts
game-state-server/src/characterSheets.ts
game-state-server/src/db.d.ts
game-state-server/src/db.d.ts.map
game-state-server/src/db.js
game-state-server/src/db.js.map
game-state-server/src/db.ts
game-state-server/src/enhanced-db-schema.sql
game-state-server/src/index.ts
game-state-server/src/monsters.d.ts.map
game-state-server/src/monsters.js.map
game-state-server/tsconfig.json
quick-start-guide.md
README.md
rebuild.bat
roll-examples.md
setup.bat
test-checklist.txt
update-summary.md
```

# Files

## File: .kilocode/mcp.json
````json
{
  "mcpServers": {
    "rpg-game-state": {
      "name": "rpg-game-state-server",
      "command": "node",
      "args": [
        "dist/index.js"
      ],
      "cwd": "e:/Tinker/rpg-mcp-servers/game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "create_character",
        "get_character",
        "get_character_by_name",
        "list_characters",
        "update_character",
        "add_item",
        "get_inventory",
        "remove_item",
        "update_item",
        "save_world_state",
        "get_world_state",
        "update_world_state",
        "create_npc",
        "create_npc_group",
        "get_npc",
        "list_npcs",
        "update_npc",
        "remove_npc",
        "create_encounter",
        "add_to_encounter",
        "consume_action",
        "end_encounter",
        "apply_damage",
        "save_story_progress",
        "add_quest",
        "get_active_quests",
        "update_quest_state",
        "assign_quest_to_character",
        "get_encounter_state",
        "start_turn",
        "end_turn"
      ]
    },
    "rpg-combat-engine": {
      "name": "rpg-combat-engine-server",
      "command": "node",
      "args": [
        "dist/index.js"
      ],
      "cwd": "e:/Tinker/rpg-mcp-servers/combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "roll_dice",
        "roll_check",
        "attack_roll",
        "initiative_roll",
        "damage_roll",
        "saving_throw",
        "use_reaction",
        "use_legendary_action",
        "trigger_lair_action",
        "execute_multiattack",
        "initialize_battlefield",
        "place_creature",
        "move_creature",
        "check_line_of_sight",
        "get_area_effect_targets",
        "get_tactical_summary",
        "check_flanking",
        "check_height_advantage",
        "describe_battlefield",
        "describe_detailed_tactical_situation",
        "generate_battlefield_map",
        "get_combat_log",
        "clear_combat_log",
        "roll_wod_pool"
      ]
    }
  }
}
````

## File: .kilocodemodes
````
customModes:
  - slug: team-orchestrator
    name: Team Orchestrator
    roleDefinition: "roleDefinition: A strategic workflow orchestrator who coordinates complex tasks by delegating them to appropriate specialized team members. This orchestrator understands the full capabilities of the development team including MCP server building, Open-WebUI integration, research, UI/UX design, testing, and planning. Always consults with relevant experts before making decisions and ensures proper coordination between team members."
    customInstructions: "When receiving a task, first analyze what experts are needed from the team. Delegate specific subtasks to: mcp-server-builder for MCP server development, open-webui-expert for Open-WebUI integration, researcher for information gathering, ui-ux-expert for design decisions, tester for quality assurance, planner for project planning, and any other relevant experts. Coordinate their work and synthesize their outputs into cohesive solutions."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: mcp-server-expert-builder
    name: MCP Server Expert Builder
    roleDefinition: "An expert in building Model Context Protocol (MCP) servers. Specialized in creating, configuring, and maintaining MCP servers with deep knowledge of the MCP specification, server architecture, tool development, and integration patterns."
    customInstructions: "Focus on MCP server development including: server configuration, tool implementation, resource management, transport protocols (stdio, sse, streamable-http), schema validation, and integration with various AI systems. Always consider security, performance, and maintainability when building MCP servers."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: open-webui-expert
    name: Open-WebUI Expert
    roleDefinition: "An expert in Open-WebUI with specialized skills in MCP integration and prompt building. Understands the Open-WebUI architecture, configuration, customization, and how to integrate MCP servers and build effective prompts for optimal user experience."
    customInstructions: "Specialize in Open-WebUI setup, configuration, UI customization, MCP server integration, prompt engineering, user experience optimization, and troubleshooting. Always consider user workflow efficiency and interface usability when making recommendations."
    groups:
      - read
      - edit
      - browser
      - command
    source: project
  - slug: expert-researcher
    name: Expert Researcher
    roleDefinition: "A skilled researcher who excels at gathering, analyzing, and synthesizing information from various sources. Specializes in technical documentation analysis, market research, competitor analysis, best practices investigation, and trend identification."
    customInstructions: "Conduct thorough research on requested topics including: technical documentation analysis, market research, competitor analysis, best practices investigation, and trend identification. Provide well-structured, evidence-based reports with clear recommendations and actionable insights."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: ui-ux-expert
    name: UI/UX Expert
    roleDefinition: "A user interface and user experience expert specializing in design systems, usability, accessibility, and creating intuitive user experiences. Skilled in modern design principles, prototyping, and user-centered design methodologies."
    customInstructions: "Focus on creating excellent user experiences through: interface design, usability analysis, accessibility compliance, user journey mapping, wireframing, prototyping, and design system development. Always prioritize user needs and ensure designs are accessible, intuitive, and aligned with modern design standards."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: expert-tester
    name: Expert Tester
    roleDefinition: "A comprehensive testing expert specializing in testing new servers, applications, and systems. Skilled in various testing methodologies including unit testing, integration testing, performance testing, security testing, and user acceptance testing."
    customInstructions: "Develop and execute comprehensive testing strategies including: test plan creation, automated testing setup, manual testing procedures, performance benchmarking, security testing, and bug reporting. Focus on ensuring reliability, performance, and security of new servers and applications."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: expert-planner
    name: Expert Planner
    roleDefinition: "A strategic planning expert who designs comprehensive project plans after consulting with other experts. Specializes in project management, resource allocation, timeline planning, risk assessment, and coordinating complex multi-disciplinary projects."
    customInstructions: "Create detailed project plans by: consulting with relevant experts, analyzing requirements, identifying dependencies, estimating timelines, allocating resources, assessing risks, and creating actionable roadmaps. Always ensure plans are realistic, well-documented, and include contingency planning."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: devops-expert
    name: DevOps Expert
    roleDefinition: "A DevOps specialist focused on deployment, infrastructure, CI/CD pipelines, containerization, and system reliability. Expert in cloud platforms, automation, monitoring, and ensuring smooth deployment and operation of applications and servers."
    customInstructions: "Handle infrastructure and deployment concerns including: CI/CD pipeline setup, containerization with Docker, cloud deployment, monitoring and logging, automated testing integration, and infrastructure as code. Focus on reliability, scalability, and automation."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: security-expert
    name: Security Expert
    roleDefinition: "A cybersecurity expert specializing in application security, server hardening, vulnerability assessment, and security best practices. Ensures all systems and applications meet security standards and are protected against common threats."
    customInstructions: "Focus on security aspects including: security audits, vulnerability assessments, secure coding practices, server hardening, authentication and authorization, data protection, and compliance with security standards. Always prioritize security in all recommendations and implementations."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: documentation-expert
    name: Documentation Expert
    roleDefinition: "A technical writing expert specializing in creating comprehensive, clear, and user-friendly documentation. Skilled in API documentation, user guides, technical specifications, and ensuring documentation is accessible and maintainable."
    customInstructions: "Create high-quality documentation including: API documentation, user guides, installation instructions, troubleshooting guides, and technical specifications. Focus on clarity, completeness, and user-friendliness. Ensure documentation is well-structured and easy to maintain."
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
    source: project
  - slug: dungeon-master
    name: 🦇 AI Storyteller
    roleDefinition: "You are an expert Storyteller running immersive chronicles in the World of Darkness (Storyteller System, oWoD/Chronicles of Darkness). You weave evocative narrative, manage dramatic tension, and ensure darkly atmospheric stories where mortal and supernatural fates intertwine. You excel at adaptive narration and dynamic gameplay while upholding consistent system mechanics."
    customInstructions: "IMPORTANT: You have access to two MCP servers for World of Darkness (oWoD) game management: 1. **rpg-game-state** — For persistent character/world data: - create_character: Create new WoD characters with all core attributes (Strength, Manipulation, etc.), willpower, power stats (e.g., Blood, Gnosis, Glamour), health levels, and abilities; supports optional arrays for Disciplines, Gifts, Arts, Realms, Spheres. - get_character: Retrieve a full, human-readable character sheet including oWoD health and all secondary features - get_character_by_name: Find characters by name - list_characters: Roster all characters - update_character: Modify character stats, traits, resources - spend_willpower, spend_blood, spend_gnosis, spend_glamour, spend_arete: Spend key supernatural/mental resources - add_item / get_inventory: Manage equipment/story items - save_world_state / get_world_state: Track locations, NPCs, events - apply_damage: Damage is tracked by health level (Bruised, Hurt, etc., not hit points!) 2. **rpg-combat-engine** — For dice mechanics: - roll_wod_pool: Roll a World of Darkness dice pool (d10s): successes, botches, specialties. STORYTELLER SYSTEM FLOW: 1. Always consult current character sheets BEFORE describing actions or outcomes. 2. Use tools to manage all character resources and health (never ad-lib results or adjust stats manually; always use the appropriate tool). 3. For any dice pool action (attribute + ability, etc.), use roll_wod_pool — specify pool size, difficulty, and specialty if relevant. 4. Apply damage and wound penalties using the health levels system (never use hit points). 5. For spending limited character resources, ALWAYS use resource-spending tools (spend_willpower, spend_blood, etc.) to modify the player state. 6. Maintain persistent story, world state, and equipment using the relevant tool. NARRATIVE STYLE: - Use evocative, genre-appropriate descriptions with a focus on mood, motif, and supernatural atmosphere. - Develop distinct, memorable NPCs and factions with oWoD-appropriate motivations. - Balance story flow, horror/drama, and system mechanics. - Present player choices that matter; react to player actions using up-to-date character and world state. COMBAT AND CHALLENGES: - Use roll_wod_pool for dice pools (success-based, not d20 or HP). - Track health ONLY with health levels (e.g. Bruised, Injured, etc.). - Use apply_damage and status effect mechanics as per Storyteller System. - All supernatural or limited resource use (Willpower, Blood, etc.) requires a spend_* tool. - Describe events cinematically, but always resolve results mechanics first for fairness and outcome transparency."
    groups:
      - read
      - edit
      - mcp
    source: project
````

## File: .roo/mcp.json
````json
{
  "mcpServers": {}
}
````

## File: combat-engine-server/src/narrative-engine.ts
````typescript
// Narrative Engine - Tier 2, Phase 1 (Staged Integration)
// Isolated in-memory tactical/scene store & MCP tool handlers (set_scene_conditions, get_tactical_advantage)
//
// Safe for initial rollout: no mutation of existing core logic, well-documented API shape

// Range between two entities/positions
type RangeKey = string; // e.g. "A-B" or "char123-room7"
type RangeValue = number; // Units are abstract, e.g. meters/grids/feet

interface SceneConditions {
  environment: string; // e.g. "open field", "dense forest"
  cover: "none" | "partial" | "full";
  lighting: "bright" | "dim" | "dark";
  elevation?: "flat" | "high_ground" | "low_ground";
  weather?: string;
  custom?: Record<string, any>;
}

interface SituationalModifierResult {
  modifiers: number;
  reasons: string[];
}

/**
 * NarrativeEngine: Handles ranges, scenes, conditions, and situational modifiers.
 * All state is in-memory and transient until the persistent layer is available.
 */
export class NarrativeEngine {
  private static instance: NarrativeEngine;
  private rangeMap: Map<RangeKey, RangeValue>;
  private sceneConditions: SceneConditions;

  private constructor() {
    this.rangeMap = new Map();
    this.sceneConditions = {
      environment: "default",
      cover: "none",
      lighting: "bright",
    };
  }

  public static getInstance(): NarrativeEngine {
    if (!NarrativeEngine.instance) {
      NarrativeEngine.instance = new NarrativeEngine();
    }
    return NarrativeEngine.instance;
  }

  /**
   * Sets the tactical range between two entities/positions.
   * Key must be deterministic (caller handles entity ID ordering if symmetric).
   */
  setRange(key: RangeKey, value: RangeValue): void {
    if (typeof value !== "number" || value < 0) return;
    this.rangeMap.set(key, value);
  }

  /**
   * Gets the tactical range between two entities/positions.
   * Returns undefined if range is not set.
   */
  getRange(key: RangeKey): RangeValue | undefined {
    return this.rangeMap.get(key);
  }

  /**
   * Sets the current scene conditions.
   * Overwrites previous values, but is always safe (initial tier: in-memory only).
   */
  setSceneConditions(conditions: Partial<SceneConditions>): void {
    this.sceneConditions = { ...this.sceneConditions, ...conditions };
  }

  /**
   * Returns a snapshot of current scene conditions.
   */
  getSceneConditions(): SceneConditions {
    return { ...this.sceneConditions };
  }

  /**
   * Computes situational modifiers for an entity or group, based on scene/cover.
   */
  getSituationalModifiers(actor: { cover: string; isElevated?: boolean; [key: string]: any }): SituationalModifierResult {
    const reasons: string[] = [];
    let modifiers = 0;

    // Cover-based modifier
    if (actor.cover === "full") {
      modifiers += 2;
      reasons.push("Full cover (+2)");
    } else if (actor.cover === "partial") {
      modifiers += 1;
      reasons.push("Partial cover (+1)");
    }

    // Elevation (if supported in current scene)
    if (actor.isElevated && this.sceneConditions.elevation === "high_ground") {
      modifiers += 1;
      reasons.push("High ground (+1)");
    }

    // Lighting penalty
    if (this.sceneConditions.lighting === "dim") {
      modifiers -= 1;
      reasons.push("Dim lighting (-1)");
    } else if (this.sceneConditions.lighting === "dark") {
      modifiers -= 2;
      reasons.push("Darkness (-2)");
    }

    // Additional: customize here as new conditions/actors arise

    return { modifiers, reasons };
  }
}

// MCP Tool Handler Integration (for src/index.ts)
// Exposes two public MCP tools: set_scene_conditions, get_tactical_advantage
// Handlers should be registered in the MCP server bootstrap in src/index.ts

// MCP Tool: set_scene_conditions
// Params: { environment?: string; cover?: "none"|"partial"|"full"; lighting?: ...; ... }
// Returns: { ok: true }
export function handleSetSceneConditions(params: Partial<SceneConditions>): { ok: boolean } {
  const engine = NarrativeEngine.getInstance();
  engine.setSceneConditions(params);
  return { ok: true };
}

// MCP Tool: get_tactical_advantage
// Params: { actor: { cover: string; isElevated?: boolean; ... } }
// Returns: { modifiers: number, reasons: string[] }
export function handleGetTacticalAdvantage(params: { actor: { cover: string; isElevated?: boolean; [key: string]: any } }): SituationalModifierResult {
  const engine = NarrativeEngine.getInstance();
  return engine.getSituationalModifiers(params.actor);
}


/**
 * MCP Tool Exposure Plan for Safe Rollout:
 * - Register set_scene_conditions and get_tactical_advantage in the MCP tool registry
 * - Validate input via schema (in index.ts or dispatcher)
 * - No core combat state is mutated outside NarrativeEngine in this phase
 * - If any error: silently fallback to "no change" behavior and log (add logging in later phases)
 * - Engine state is in-memory/transient, can be reset without risk
 * - Future phases: upgrade to persistence, transactionality, and tight combat integration
 */

// API signatures (TypeScript):
// setRange(key: string, value: number): void
// getRange(key: string): number | undefined
// getSituationalModifiers(actor: { cover: string; isElevated?: boolean; ... }): { modifiers: number; reasons: string[]; }
````

## File: game-state-server/src/antagonists.ts
````typescript
// oWoD antagonist templates for Storyteller System NPC creation

export interface AntagonistSheet {
  name: string;
  type: string; // 'enemy', 'ally', 'neutral'
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
    knowledge: Record<string, number>;
  }>;
  willpower: number;
  health_levels: Record<string, number>;
  supernatural?: Record<string, any>;
  description?: string;
}

type AntagonistTemplates = Record<string, AntagonistSheet>;

/**
 * oWoD antagonist archetypes
 */
export const ANTAGONIST_TEMPLATES: AntagonistTemplates = {
  'First-Gen Vampire': {
    name: 'First-Gen Vampire',
    type: 'enemy',
    attributes: {
      strength: 10, dexterity: 7, stamina: 10,
      charisma: 8, manipulation: 8, appearance: 7,
      perception: 9, intelligence: 10, wits: 9
    },
    abilities: {
      talents: { Brawl: 5, Alertness: 5, Intimidation: 5, Subterfuge: 5 },
      skills: { Melee: 5, Stealth: 5, Firearms: 4 },
      knowledge: { Occult: 5, Medicine: 4, Investigation: 5, Law: 5 }
    },
    willpower: 10,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 10, Dominate: 9, Fortitude: 10 } },
    description: 'An impossibly ancient Kindred; a god among vampires.'
  },
  'Street Thug': {
    name: 'Street Thug',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 3,
      charisma: 2, manipulation: 1, appearance: 1,
      perception: 2, intelligence: 2, wits: 2
    },
    abilities: {
      talents: { Brawl: 3, Alertness: 2, Intimidation: 2 },
      skills: { Melee: 1, Stealth: 1 },
      knowledge: {}
    },
    willpower: 3,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A typical street-level tough engaged in criminal activity.'
  },
  'Bane Spirit': {
    name: 'Bane Spirit',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 4, stamina: 3,
      charisma: 1, manipulation: 4, appearance: 0,
      perception: 5, intelligence: 4, wits: 3
    },
    abilities: {
      talents: { Alertness: 4 },
      skills: {},
      knowledge: { Occult: 4 }
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: ['Obfuscate', 'Bane Touch'] },
    description: 'A malicious spiritual entity, twisted in the Umbra.'
  },
  'Technocracy Agent': {
    name: 'Technocracy Agent',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 3, stamina: 3,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 4, intelligence: 4, wits: 4
    },
    abilities: {
      talents: { Alertness: 3, Subterfuge: 4, Intimidation: 2 },
      skills: { Firearms: 4, Melee: 2, Stealth: 3, Drive: 3 },
      knowledge: { Science: 4, Technology: 5, Investigation: 3 }
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A field operative of the Technocratic Union, trained in advanced weaponry and counter-magic.'
  }
};
````

## File: game-state-server/src/characterSheets.ts
````typescript
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
  return [
    `👤 Name: ${character.name}`,
    character.concept ? `🧠 Concept: ${character.concept}` : '',
    `🗂️  Game Line: ${character.game_line?.[0]?.toUpperCase() + character.game_line?.slice(1)}`,
    '',
    `💪 Strength: ${character.strength}\n🏃 Dexterity: ${character.dexterity}\n❤️ Stamina: ${character.stamina}`,
    `🎭 Charisma: ${character.charisma}\n🗣️ Manipulation: ${character.manipulation}\n🌟 Appearance: ${character.appearance}`,
    `👁️ Perception: ${character.perception}\n🧠 Intelligence: ${character.intelligence}\n⚡ Wits: ${character.wits}`,
    '',
    '────────────── ABILITIES ──────────────',
    character.abilities?.length
      ? character.abilities.map(
          (ab: any) => `  - ${ab.ability_type}: ${ab.ability_name} (${ab.rating}${ab.specialty ? `, ${ab.specialty}` : ''})`
        ).join('\n')
      : '  (none recorded)',
    '',
    '────────────── CORE TRAITS ──────────────',
    `🔵 Willpower: ${character.willpower_current}/${character.willpower_permanent}`,
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
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  out += '\n❤️ Health Levels:\n';
  const healthOrder = ["bruised","hurt","injured","wounded","mauled","crippled","incapacitated"];
  const levels = character.health_levels || {};
  healthOrder.forEach(lvl => {
    out += `  ${lvl.charAt(0).toUpperCase() + lvl.slice(1)}: ${(levels[lvl] || 0) > 0 ? 'X' : '_'}\n`;
  });

  // Disciplines, Blood Pool, Humanity
  if (extra.disciplines?.length) {
    out += "\n🩸 Disciplines:\n";
    extra.disciplines.forEach((d: any) => {
      out += `  - ${d.discipline_name}: ${d.rating}\n`;
    });
  }
  out += `Blood Pool: ${character.blood_pool_current || 0}/${character.blood_pool_max || 0}, Humanity: ${character.humanity ?? ''}\n`;
  return { type: 'text', text: out };
}
/**
 * Werewolf: Adds Gifts, Rage, Gnosis, Renown
 */
export function formatWerewolfSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: WEREWOLF Sheet\n\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  out += '\n❤️ Health Levels:\n';
  const healthOrder = ["bruised","hurt","injured","wounded","mauled","crippled","incapacitated"];
  const levels = character.health_levels || {};
  healthOrder.forEach(lvl => {
    out += `  ${lvl.charAt(0).toUpperCase() + lvl.slice(1)}: ${(levels[lvl] || 0) > 0 ? 'X' : '_'}\n`;
  });

  // Gifts, Rage, Gnosis, Renown
  if (extra.gifts?.length) {
    out += "\n🐺 Gifts:\n";
    extra.gifts.forEach((g: any) => {
      out += `  - ${g.gift_name} (Rank ${g.rank})\n`;
    });
  }
  out += `Rage: ${character.rage_current || 0}, Gnosis: ${character.gnosis_current || 0}, Renown: Glory ${character.renown_glory || 0}, Honor ${character.renown_honor || 0}, Wisdom ${character.renown_wisdom || 0}\n`;
  return { type: 'text', text: out };
}
/**
 * Mage: Adds Spheres, Arete, Quintessence, Paradox
 */
export function formatMageSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: MAGE Sheet\n\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  out += '\n❤️ Health Levels:\n';
  const healthOrder = ["bruised","hurt","injured","wounded","mauled","crippled","incapacitated"];
  const levels = character.health_levels || {};
  healthOrder.forEach(lvl => {
    out += `  ${lvl.charAt(0).toUpperCase() + lvl.slice(1)}: ${(levels[lvl] || 0) > 0 ? 'X' : '_'}\n`;
  });

  // Spheres, Arete, Quintessence, Paradox
  if (extra.spheres?.length) {
    out += "\n🕯️ Spheres:\n";
    extra.spheres.forEach((s: any) => {
      out += `  - ${s.sphere_name}: ${s.rating}\n`;
    });
  }
  out += `Arete: ${character.arete || 0}, Quintessence: ${character.quintessence || 0}, Paradox: ${character.paradox || 0}\n`;
  return { type: 'text', text: out };
}
/**
 * Changeling: Adds Arts, Realms, Glamour, Banality
 */
export function formatChangelingSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: CHANGELING Sheet\n\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  out += '\n❤️ Health Levels:\n';
  const healthOrder = ["bruised","hurt","injured","wounded","mauled","crippled","incapacitated"];
  const levels = character.health_levels || {};
  healthOrder.forEach(lvl => {
    out += `  ${lvl.charAt(0).toUpperCase() + lvl.slice(1)}: ${(levels[lvl] || 0) > 0 ? 'X' : '_'}\n`;
  });

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
  out += '\n❤️ Health Levels:\n';
  const healthOrder = ["bruised","hurt","injured","wounded","mauled","crippled","incapacitated"];
  const levels = character.health_levels || {};
  healthOrder.forEach(lvl => {
    out += `  ${lvl.charAt(0).toUpperCase() + lvl.slice(1)}: ${(levels[lvl] || 0) > 0 ? 'X' : '_'}\n`;
  });

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
````

## File: .gitattributes
````
# Auto detect text files and perform LF normalization
* text=auto
````

## File: .gitignore
````
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Database files
*.db
*.sqlite

# Logs
*.log
npm-debug.log*

# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# TypeScript cache
*.tsbuildinfo

# Coverage
coverage/
.nyc_output/
````

## File: character-sheet-template.md
````markdown
# Character Sheet Template

## Character Information
- **Name**: [Character Name]
- **Class**: [Character Class]
- **Level**: [Level]
- **Experience**: [XP] / [Next Level XP]

## Ability Scores
| Ability | Score | Modifier |
|---------|-------|----------|
| STR     | [##]  | [+/-#]   |
| DEX     | [##]  | [+/-#]   |
| CON     | [##]  | [+/-#]   |
| INT     | [##]  | [+/-#]   |
| WIS     | [##]  | [+/-#]   |
| CHA     | [##]  | [+/-#]   |

## Combat Stats
- **Hit Points**: [Current HP] / [Max HP]
- **Armor Class**: [AC]
- **Initiative**: [+/-#]
- **Speed**: 30 ft

## Proficiencies
- **Proficiency Bonus**: +[#]
- **Saving Throws**: [List]
- **Skills**: [List]

## Inventory
### Equipped
- [Item Name] ([Item Type])

### Backpack
- [Item Name] x[Quantity]

## Notes
- [Story notes and important information]

---
*Last Updated: [Timestamp]*
````

## File: combat-engine-server/package.json
````json
{
  "name": "rpg-combat-engine-server",
  "version": "1.0.0",
  "description": "MCP server for D&D-style combat mechanics",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
````

## File: dice-rolling-guide.md
````markdown
# Dice Rolling Guide for RPG MCP Servers

## Basic Dice Notation

### Standard Rolls
- `1d20` - Roll one 20-sided die
- `3d6` - Roll three 6-sided dice and sum them
- `1d20+5` - Roll 1d20 and add 5
- `2d8-2` - Roll 2d8 and subtract 2

### Advantage/Disadvantage Notation
- `2d20kh1` - Roll 2d20, keep highest 1 (advantage)
- `2d20kl1` - Roll 2d20, keep lowest 1 (disadvantage)
- `2d20kh1+5` - Roll with advantage, add 5
- `2d20kl1+3` - Roll with disadvantage, add 3

## Available Tools

### 1. `roll_dice` - Generic dice rolling
Use for any dice roll with full notation support:
```json
{
  "notation": "2d20kh1+5",
  "reason": "Perception check with advantage"
}
```

### 2. `roll_check` - Ability/Skill checks
Simplified tool for ability checks:
```json
{
  "character": "Thorin",
  "ability": "Perception",
  "modifier": 5,
  "advantage": true,
  "dc": 15  // optional
}
```

### 3. `attack_roll` - Combat attacks
Specifically for attack rolls:
```json
{
  "attacker": "Thorin",
  "target": "Goblin",
  "modifier": 7,
  "advantage": false,
  "disadvantage": false
}
```

### 4. `saving_throw` - Saving throws
For saves against effects:
```json
{
  "character": "Thorin",
  "ability": "Constitution",
  "dc": 13,
  "modifier": 5
}
```

## Examples

### Rolling with Advantage (Two Ways)

**Method 1: Using dice notation**
```
roll_dice with notation "2d20kh1+5" for "Stealth check with advantage"
```
Output shows all rolls: `rolled [15, 8], kept [15]+5 = 20`

**Method 2: Using roll_check**
```
roll_check for character "Elara", ability "Stealth", modifier 5, advantage true
```
Output clearly shows the advantage was applied

### Complex Rolls

**Fireball damage (many dice)**
```
roll_dice with notation "8d6" for "Fireball damage"
```

**Great Weapon Fighting (keep specific dice)**
```
roll_dice with notation "2d6kh1" for "Greatsword damage, rerolling low die"
```

## Tips

1. **For ability checks**: Use `roll_check` - it's cleaner and tracks success/failure
2. **For damage**: Use `roll_dice` with appropriate notation
3. **For attacks**: Use `attack_roll` - it handles crits/fumbles properly
4. **For complex rolls**: The notation system supports any combination

## Common D&D 5e Rolls

- **Ability Check**: `1d20 + ability modifier`
- **Attack Roll**: `1d20 + proficiency + ability modifier`
- **Damage Roll**: Varies by weapon (e.g., `1d8+3` for longsword)
- **Saving Throw**: `1d20 + ability modifier (+ proficiency if proficient)`
- **Initiative**: `1d20 + Dexterity modifier`
- **Death Save**: `1d20` (10+ succeeds)

## Advantage/Disadvantage Rules

- **Advantage**: Roll 2d20, use the higher
- **Disadvantage**: Roll 2d20, use the lower
- **Multiple sources**: Having multiple sources of advantage/disadvantage doesn't stack
- **Cancellation**: One source of advantage and one of disadvantage cancel out

The system now properly handles all these cases!
````

## File: ENHANCEMENTS.md
````markdown
# 🎉 RPG MCP Servers - Human-Friendly VS Code Enhancements

## 🚀 What's New

This enhancement update focuses on making the RPG MCP servers **dramatically more human-friendly** in the VS Code editor environment. Every tool output has been redesigned for better readability, context, and user experience.

## ✨ Combat Engine Server Enhancements

### 🎲 Dice & Checks
- **Enhanced Roll Outputs**: Beautiful formatted results with emojis, context, and difficulty assessments
- **Contextual Feedback**: Automatic evaluation of roll quality (Exceptional, Great, Decent, etc.)
- **Margin Analysis**: Clear indication of success/failure margins
- **Natural 20/1 Indicators**: Special highlighting for critical successes and failures

### ⚔️ Combat Analysis
- **Line of Sight**: Rich tactical analysis with cover information and combat advice
- **Area Effects**: Detailed creature targeting with distances and saving throw reminders
- **Flanking Checks**: Comprehensive positioning analysis with tactical suggestions
- **Height Advantage**: Detailed elevation analysis with combat bonuses explanation

### 📋 Combat Management
- **Enhanced Combat Log**: Structured, numbered entries with summary information
- **Tactical Summaries**: Rich creature analysis with positioning tips and warnings
- **Error Handling**: Clear, helpful error messages with available options listed

### 🗺️ Spatial Intelligence
- **Battlefield Descriptions**: Human-readable overviews with creature positioning
- **ASCII Maps**: Visual battlefield representation with legend
- **Tactical Advice**: Context-aware suggestions for optimal play

## 🏰 Game State Server Enhancements

### 👤 Character Management
- **Rich Character Sheets**: Beautiful formatted ability scores and information
- **Character Roster**: Clean, organized character lists with IDs and classes
- **Update Feedback**: Clear confirmation of character modifications

### 🎒 Inventory System
- **Visual Inventory**: Organized item displays with equipped status and quantities
- **Add/Remove Feedback**: Clear confirmation of inventory changes
- **Item Categories**: Better organization and display of gear

### 🌍 World State Management
- **Detailed Save Confirmation**: Comprehensive feedback on what was saved
- **Rich State Retrieval**: Formatted world state with timestamps and summaries
- **Update Tracking**: Clear indication of what changed during updates

### 👹 NPC Management
- **Visual NPC Roster**: Health status indicators and type icons
- **Group Creation**: Batch NPC creation with detailed feedback
- **Combat Status**: Health indicators (Healthy, Wounded, Dead) with icons

### ⚔️ Encounter Management
- **Initiative Tracking**: Clear turn order with current turn highlighting
- **Encounter Status**: Rich encounter overviews with participant details
- **Turn Management**: Enhanced feedback for combat flow

### 🎯 Quest System
- **Quest Display**: Beautiful quest formatting with objectives and rewards
- **Progress Tracking**: Clear status indicators and completion feedback
- **Assignment Confirmation**: Detailed quest assignment information

## 🛠️ Technical Improvements

### 🔧 Error Handling
- **Helpful Error Messages**: Clear explanations with suggested solutions
- **Available Options**: When entities not found, show what's available
- **Context-Aware Guidance**: Specific advice based on the error situation

### 🎨 Visual Design
- **Consistent Emoji Usage**: Visual icons for different types of information
- **Structured Formatting**: Clear headers, sections, and hierarchical information
- **Status Indicators**: Color-coded (via emojis) status representations

### 💡 User Experience
- **Contextual Tips**: Tactical advice and gameplay suggestions
- **Progress Feedback**: Clear indication of what was accomplished
- **Next Steps**: Guidance on what to do next in many situations

## 📊 Before vs After Examples

### Before (Raw JSON):
```json
{
  "total": 15,
  "dc": 12,
  "success": true,
  "rolls": [13],
  "modifier": 2
}
```

### After (Human-Friendly):
```
🛡️ **CONSTITUTION SAVING THROW**

👤 **Character:** Lyra Swiftarrow
🎲 **Rolled:** 13
➕ **Modifier:** +2
🏆 **TOTAL:** 15
🎯 **DC:** 12
📊 **RESULT:** ✅ SUCCESS! 🎉 **Solid Save!** (beat DC by 3)
```

## 🎮 Impact on Gameplay

These enhancements make the MCP servers:
- **Easier to Use**: Clear, readable outputs reduce cognitive load
- **More Informative**: Rich context helps players make better decisions
- **Tactically Helpful**: Built-in advice improves gameplay experience
- **Error-Resilient**: Better error handling reduces frustration
- **Visually Appealing**: Beautiful formatting enhances the VS Code experience

## 🔄 Migration

No breaking changes! All existing functionality is preserved while adding these enhancements. Simply rebuild and restart your servers to enjoy the improved experience.

---

**Ready to experience D&D like never before in VS Code!** 🎲⚔️✨
````

## File: game-state-server/package.json
````json
{
  "name": "rpg-game-state-server",
  "version": "1.0.0",
  "description": "MCP server for RPG game state management using SQLite",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "sqlite3": "^5.1.6",
    "better-sqlite3": "^9.2.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/better-sqlite3": "^7.6.8",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
````

## File: game-state-server/src/db.d.ts
````typescript
interface EncounterParticipant {
    id: number;
    encounter_id: number;
    participant_type: 'character' | 'npc';
    participant_id: number;
    initiative: number;
    initiative_order?: number | null;
    has_acted: boolean;
    conditions?: string | null;
    is_active: boolean;
    name: string;
    current_hp: number;
    max_hp: number;
}
interface Quest {
    id: number;
    title: string;
    description: string;
    objectives: string;
    rewards: string;
    created_at: string;
}
interface CharacterQuest {
    id: number;
    character_id: number;
    quest_id: number;
    status: 'active' | 'completed' | 'failed';
    progress?: string | null;
    assigned_at: string;
    updated_at: string;
    title?: string;
    description?: string;
    objectives?: string;
    rewards?: string;
}
export declare class GameDatabase {
    private db;
    constructor();
    private initializeSchema;
    createCharacter(data: {
        name: string;
        class: string;
        strength?: number;
        dexterity?: number;
        constitution?: number;
        intelligence?: number;
        wisdom?: number;
        charisma?: number;
    }): unknown;
    getCharacter(id: number): unknown;
    getCharacterByName(name: string): unknown;
    listCharacters(): unknown[];
    updateCharacter(id: number, updates: Record<string, any>): unknown;
    addItem(characterId: number, item: {
        name: string;
        type: string;
        quantity?: number;
        properties?: Record<string, any>;
    }): {
        name: string;
        type: string;
        quantity?: number;
        properties?: Record<string, any>;
        id: number | bigint;
    };
    getInventory(characterId: number): any[];
    updateItem(id: number, updates: {
        quantity?: number;
        equipped?: boolean;
    }): void;
    removeItem(id: number): void;
    saveStoryProgress(characterId: number, data: {
        chapter: string;
        scene: string;
        description?: string;
        flags?: Record<string, any>;
    }): void;
    getLatestStoryProgress(characterId: number): any;
    saveWorldState(characterId: number, data: {
        location: string;
        npcs?: Record<string, any>;
        events?: Record<string, any>;
        environment?: Record<string, any>;
    }): void;
    getWorldState(characterId: number): any;
    logCombat(characterId: number, sessionId: string, action: string, result?: string): void;
    getCombatLog(characterId: number, sessionId?: string): unknown[];
    createNPC(data: {
        name: string;
        template?: string;
        type?: string;
        customStats?: Record<string, any>;
    }): any;
    createNPCGroup(template: string, count: number, namePrefix?: string): any[];
    getNPC(id: number): any;
    listNPCs(type?: string, aliveOnly?: boolean): any[];
    updateNPC(id: number, updates: Record<string, any>): any;
    removeNPC(id: number): void;
    createEncounter(data: {
        character_id: number;
        name: string;
        description?: string;
        environment?: string;
    }): unknown;
    getEncounter(id: number): unknown;
    getActiveEncounter(characterId: number): unknown;
    addEncounterParticipant(encounterId: number, type: string, participantId: number, initiative: number): void;
    updateInitiativeOrder(encounterId: number): void;
    getEncounterParticipants(encounterId: number): EncounterParticipant[];
    nextTurn(encounterId: number): EncounterParticipant | null | undefined;
    endEncounter(id: number, outcome?: string): void;
    applyDamage(targetType: string, targetId: number, damage: number): any;
    addQuest(data: {
        title: string;
        description: string;
        objectives: Record<string, any>[] | string[];
        rewards: Record<string, any>;
    }): Quest | null;
    getQuestById(id: number): Quest | null;
    assignQuestToCharacter(characterId: number, questId: number, status?: 'active' | 'completed' | 'failed'): CharacterQuest | null;
    getCharacterQuestById(characterQuestId: number): CharacterQuest | null;
    getCharacterActiveQuests(characterId: number): CharacterQuest[];
    updateCharacterQuestStatus(characterQuestId: number, status: 'active' | 'completed' | 'failed', progress?: Record<string, any> | null): CharacterQuest | null;
    close(): void;
}
export {};
//# sourceMappingURL=db.d.ts.map
````

## File: game-state-server/src/db.d.ts.map
````
{"version":3,"file":"db.d.ts","sourceRoot":"","sources":["db.ts"],"names":[],"mappings":"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"}
````

## File: game-state-server/src/db.js.map
````
{"version":3,"file":"db.js","sourceRoot":"","sources":["db.ts"],"names":[],"mappings":"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"}
````

## File: game-state-server/src/enhanced-db-schema.sql
````sql
-- Enhanced Database Schema for Complete D&D 5e Combat
-- Adds spatial positioning and advanced action economy

-- Enhanced NPCs table with complete action economy
ALTER TABLE npcs ADD COLUMN legendary_actions TEXT; -- JSON array of legendary actions
ALTER TABLE npcs ADD COLUMN legendary_actions_per_round INTEGER DEFAULT 0;
ALTER TABLE npcs ADD COLUMN legendary_resistance_uses INTEGER DEFAULT 0;
ALTER TABLE npcs ADD COLUMN lair_actions TEXT; -- JSON array of lair actions
ALTER TABLE npcs ADD COLUMN multiattack_actions TEXT; -- Enhanced multiattack definition
ALTER TABLE npcs ADD COLUMN reaction_abilities TEXT; -- JSON array of reactions
ALTER TABLE npcs ADD COLUMN has_lair BOOLEAN DEFAULT FALSE;

-- Enhanced encounters table with spatial and advanced timing
ALTER TABLE encounters ADD COLUMN lair_actions_data TEXT; -- JSON array
ALTER TABLE encounters ADD COLUMN lair_action_used BOOLEAN DEFAULT FALSE;
ALTER TABLE encounters ADD COLUMN current_reactions TEXT; -- JSON tracking reactions this round

-- Enhanced participants table with complete action economy
ALTER TABLE encounter_participants ADD COLUMN legendary_actions_remaining INTEGER DEFAULT 0;
ALTER TABLE encounter_participants ADD COLUMN legendary_resistance_remaining INTEGER DEFAULT 0;
ALTER TABLE encounter_participants ADD COLUMN reaction_used BOOLEAN DEFAULT FALSE;
ALTER TABLE encounter_participants ADD COLUMN reaction_available TEXT; -- JSON
ALTER TABLE encounter_participants ADD COLUMN turn_actions TEXT; -- JSON: current turn action economy

-- Spatial positioning tables
CREATE TABLE IF NOT EXISTS battlefield_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  width INTEGER NOT NULL,      -- Grid width
  height INTEGER NOT NULL,     -- Grid height
  terrain_data TEXT,           -- JSON: terrain features
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

CREATE TABLE IF NOT EXISTS creature_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  participant_type TEXT NOT NULL,
  x INTEGER NOT NULL,          -- Grid X coordinate
  y INTEGER NOT NULL,          -- Grid Y coordinate  
  z INTEGER DEFAULT 0,         -- Elevation in feet
  facing INTEGER,              -- Direction facing (0-7, cardinal + diagonal)
  size_category TEXT,          -- 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

CREATE TABLE IF NOT EXISTS terrain_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  feature_type TEXT NOT NULL,  -- 'wall', 'pillar', 'pit', 'stairs', etc.
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  elevation INTEGER DEFAULT 0,
  blocks_movement BOOLEAN DEFAULT FALSE,
  blocks_los BOOLEAN DEFAULT FALSE,
  cover_type TEXT DEFAULT 'none', -- 'none', 'half', 'three_quarters', 'total'
  properties TEXT,             -- JSON: additional properties
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

CREATE TABLE IF NOT EXISTS area_effects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  effect_name TEXT NOT NULL,
  shape TEXT NOT NULL,         -- 'sphere', 'cube', 'cone', 'line', 'cylinder'
  center_x INTEGER NOT NULL,
  center_y INTEGER NOT NULL,
  center_z INTEGER DEFAULT 0,
  size_parameter INTEGER,      -- Radius for sphere, side for cube, etc.
  direction INTEGER,           -- For cones and lines
  duration_rounds INTEGER,
  effect_data TEXT,            -- JSON: effect details
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

-- Action history tracking
CREATE TABLE IF NOT EXISTS action_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'action', 'reaction', 'legendary_action', etc.
  action_details TEXT, -- JSON
  timing TEXT, -- 'on_turn', 'end_of_turn', 'initiative_20', 'triggered'
  trigger_event TEXT, -- What triggered this action
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Special initiative entries (for lair actions)
CREATE TABLE IF NOT EXISTS initiative_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  initiative_value INTEGER NOT NULL,
  entry_type TEXT NOT NULL, -- 'participant', 'lair_action'
  participant_id INTEGER, -- NULL for lair actions
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Spatial relationship caching for performance
CREATE TABLE IF NOT EXISTS spatial_relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  creature1_id INTEGER NOT NULL,
  creature2_id INTEGER NOT NULL,
  distance_feet INTEGER NOT NULL,
  has_line_of_sight BOOLEAN NOT NULL,
  cover_type TEXT NOT NULL,
  range_category TEXT NOT NULL, -- 'melee', 'close', 'medium', 'long', 'extreme'
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

-- Reaction triggers and timing
CREATE TABLE IF NOT EXISTS reaction_triggers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  trigger_type TEXT NOT NULL,
  triggering_participant_id INTEGER,
  triggering_action TEXT,
  available_reactions TEXT, -- JSON: list of available reactions
  resolved BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Enhanced indexes for performance
CREATE INDEX IF NOT EXISTS idx_battlefield_encounter ON battlefield_states(encounter_id);
CREATE INDEX IF NOT EXISTS idx_positions_battlefield ON creature_positions(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_positions_participant ON creature_positions(participant_id, participant_type);
CREATE INDEX IF NOT EXISTS idx_terrain_battlefield ON terrain_features(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_effects_battlefield ON area_effects(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_action_history_encounter ON action_history(encounter_id, round_number);
CREATE INDEX IF NOT EXISTS idx_initiative_entries_encounter ON initiative_entries(encounter_id);
CREATE INDEX IF NOT EXISTS idx_spatial_relationships_battlefield ON spatial_relationships(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_reaction_triggers_encounter ON reaction_triggers(encounter_id, resolved);
````

## File: game-state-server/src/monsters.d.ts.map
````
{"version":3,"file":"monsters.d.ts","sourceRoot":"","sources":["monsters.ts"],"names":[],"mappings":"AACA,eAAO,MAAM,iBAAiB;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CAyO7B,CAAC;AAGF,wBAAgB,WAAW,CAAC,QAAQ,EAAE,MAAM,GAAG,MAAM,CAcpD;AAGD,wBAAgB,kBAAkB,CAAC,KAAK,EAAE,MAAM,GAAG,MAAM,CAExD"}
````

## File: game-state-server/src/monsters.js.map
````
{"version":3,"file":"monsters.js","sourceRoot":"","sources":["monsters.ts"],"names":[],"mappings":"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"}
````

## File: game-state-server/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
````

## File: quick-start-guide.md
````markdown
# AI Dungeon Master - Quick Start Guide

## Creating Your First Character

Ask the AI Dungeon Master:
> "I want to create a human fighter named Marcus"

The DM will use the `create_character` tool to set up your character with appropriate stats.

## Starting an Adventure

> "I'm ready to start my adventure. Where am I?"

The DM will set the scene and begin your story.

## Combat Example

When you encounter enemies:
> "I attack the goblin with my sword!"

The DM will:
1. Use `attack_roll` to determine if you hit
2. Use `damage_roll` to calculate damage
3. Track HP using `update_character`
4. Describe the action cinematically

## Inventory Management

> "I search the goblin's body"

The DM will use `add_item` to add any loot to your inventory.

## Checking Status

> "Show me my character sheet"

The DM will use `get_character` and `get_inventory` to display your current status.

## Tips for Best Experience

1. Be descriptive in your actions
2. Ask questions about your surroundings
3. Interact with NPCs
4. Make creative use of your abilities
5. The DM will handle all the mechanics - just focus on roleplaying!

## Example Commands the DM Uses

- **Creating a character**: `create_character({ name: "Marcus", class: "Fighter", stats: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 8 }})`
- **Rolling initiative**: `roll_dice({ notation: "1d20+2", reason: "Marcus initiative" })`
- **Making an attack**: `attack_roll({ attacker: "Marcus", target: "Goblin", modifier: 5 })`
- **Dealing damage**: `damage_roll({ notation: "1d8+3", damage_type: "slashing" })`
- **Adding loot**: `add_item({ character_id: 1, item_name: "Health Potion", item_type: "consumable", quantity: 2 })`

Have fun adventuring!
````

## File: rebuild.bat
````
@echo off
echo Rebuilding RPG MCP Servers after fixes...
echo.

echo Building Game State Server...
cd game-state-server
call npm run build
echo.

echo Building Combat Engine Server...
cd ../combat-engine-server
call npm run build
echo.

cd ..
echo Build complete!
pause
````

## File: roll-examples.md
````markdown
# Roll Examples - Old vs New

## Ability Check with Advantage

### ❌ Old Way (Confusing)
```
User: "I want to make a Perception check with advantage"
DM: "Roll 2d20kh1+5"
Result: Unclear what happened, notation is cryptic
```

### ✅ New Way (Clear)
```
User: "I want to make a Perception check with advantage"
DM uses: roll_check(character="Thorin", ability="Perception", modifier=5, advantage=true)
Result: 
{
  "character": "Thorin",
  "ability": "Perception",
  "total": 23,
  "rolls": [18, 11],
  "kept": [18],
  "advantage": true
}
```

## Attack Roll Comparison

### ❌ Old Attack with Advantage
```
attack_roll(modifier=5, advantage=true)
Result: Rolled 1d20+5 twice, then added modifiers to both (wrong!)
Total could be inflated by double modifier
```

### ✅ New Attack with Advantage  
```
attack_roll(modifier=5, advantage=true)
Result: 
{
  "total": 18,        // Only one modifier added
  "d20": 13,          // The d20 that was kept
  "allRolls": [13, 7], // Both d20s shown
  "advantage": true
}
```

## Direct Dice Notation

### Now Supports Standard D&D Notation
- `1d20` - Simple roll
- `3d6+2` - Multiple dice with modifier
- `2d20kh1` - Keep highest (advantage)
- `2d20kl1` - Keep lowest (disadvantage)
- `4d6kh3` - Roll 4d6, keep highest 3 (ability scores)

### Example: Rolling for Stats
```
roll_dice("4d6kh3")
Result: rolled [6, 4, 4, 2], kept [6, 4, 4] = 14
```

## Why This Matters

1. **Follows D&D 5e Rules**: Advantage/disadvantage work correctly
2. **Clear Output**: See all rolls and understand what happened
3. **Flexible Options**: Use simple tools or advanced notation
4. **Better for Storytelling**: DM can focus on narrative, not math

## Quick Reference

**For Ability Checks**: Use `roll_check`
**For Attacks**: Use `attack_roll` 
**For Damage**: Use `damage_roll`
**For Anything Else**: Use `roll_dice` with notation
````

## File: setup.bat
````
@echo off
echo Setting up RPG MCP Servers...
echo.

echo Installing Game State Server dependencies...
cd game-state-server
call npm install
call npm run build
echo Game State Server ready!
echo.

echo Installing Combat Engine Server dependencies...
cd ../combat-engine-server
call npm install
call npm run build
echo Combat Engine Server ready!
echo.

cd ..
echo.
echo Setup complete! The servers are ready to use.
echo.
echo To use the AI Dungeon Master mode:
echo 1. Open Roo Code
echo 2. Go to Prompts tab (icon in top menu)
echo 3. Click "Create New Mode" 
echo 4. Import the settings from dungeon-master-mode.json
echo.
echo Or ask Roo to create the custom mode for you!
echo.
pause
````

## File: test-checklist.txt
````
#!/bin/bash
# Test script for RPG MCP servers
# Run this after building to verify everything works

echo "Testing RPG MCP Servers..."
echo "=========================="
echo ""

echo "1. Testing Game State Server"
echo "   - Create character"
echo "   - Add items"
echo "   - Update item"
echo "   - Remove item"
echo ""

echo "2. Testing Combat Engine"
echo "   - Basic roll: 1d20+5"
echo "   - Advantage: 2d20kh1+5"
echo "   - Disadvantage: 2d20kl1+5"
echo "   - New roll_check tool"
echo ""

echo "3. Testing in Roo Code:"
echo "   Ask: 'Create a dwarf fighter named Thorin with 16 strength'"
echo "   Ask: 'Thorin makes a Perception check with advantage'"
echo "   Ask: 'Add a longsword to Thorin's inventory'"
echo "   Ask: 'Thorin attacks a goblin'"
echo ""

echo "4. Expected Results:"
echo "   - Character created with proper stats"
echo "   - Advantage shows both d20 rolls"
echo "   - Items can be added/removed/updated"
echo "   - Combat mechanics work correctly"
echo ""

echo "If any tests fail, check:"
echo "   - Servers are built (dist folders exist)"
echo "   - Roo Code was restarted"
echo "   - MCP servers show as connected"
echo "   - No TypeScript errors in build"
````

## File: update-summary.md
````markdown
# RPG MCP Servers - Update Summary

## 🔧 Fixed Issues

### 1. **Inventory Management**
Added missing tools to game-state server:
- `remove_item` - Remove items from inventory by ID
- `update_item` - Update item quantity or equipped status

Now you can fully manage inventory:
```
# Add a sword
add_item: { character_id: 1, item_name: "Longsword", quantity: 1 }

# Equip the sword (using the item's ID from inventory)
update_item: { item_id: 1, equipped: true }

# Use a potion (reduce quantity)
update_item: { item_id: 2, quantity: 1 }  // from 2 to 1

# Remove an item completely
remove_item: { item_id: 3 }
```

### 2. **Fixed Advantage/Disadvantage Mechanics**
Corrected D&D 5e rules implementation:
- **Before**: Roll 1d20+mod twice, compare totals (wrong)
- **After**: Roll 2d20, take highest/lowest, THEN add modifier (correct)

Example output now shows all rolls:
```json
{
  "total": 17,          // Final result (d20 + modifier)
  "d20": 15,           // The d20 that was used
  "modifier": 2,       // Modifier added once
  "allRolls": [15, 8], // Both d20s rolled
  "advantage": true,
  "critical": false,
  "fumble": false
}
```

### 3. **Added Initiative Roll**
New tool for combat management:
- `initiative_roll` - Roll initiative with character name and modifier
- Returns structured data for easy sorting

## 📝 Updated Tool Lists

### Game State Server Tools:
- create_character
- get_character
- get_character_by_name
- list_characters
- update_character
- add_item
- get_inventory
- **remove_item** (NEW)
- **update_item** (NEW)
- save_world_state
- get_world_state

### Combat Engine Tools:
- roll_dice
- attack_roll (FIXED)
- **initiative_roll** (NEW)
- damage_roll
- saving_throw
- get_combat_log
- clear_combat_log

## 🚀 To Apply Updates

1. Rebuild the servers:
   ```bash
   cd C:\Users\mnehm\AppData\Roaming\Roo-Code\MCP\rpg-mcp-servers
   rebuild.bat
   ```

2. Restart Roo Code and Claude Desktop

3. The updated tools will be immediately available!

## ✅ Testing the Fixes

### Test Inventory Management:
```
1. Add a healing potion (quantity: 3)
2. Use one potion (update quantity to 2)
3. Remove empty vial from inventory
```

### Test Combat Mechanics:
```
1. Roll attack with advantage
2. Check that it shows both d20 rolls
3. Verify only one modifier is added to the final total
```

The servers now properly support full D&D 5e mechanics!
````

## File: combat-engine-server/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext", 
    "moduleResolution": "NodeNext", 
    "outDir": "./dist",
    "rootDirs": [
      "./src"
    ],
    "noEmitOnError": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
````

## File: dungeon-master-mode.json
````json
{
  "customModes": [
    {
      "slug": "dungeon-master",
      "name": "🐉 AI Dungeon Master",
      "roleDefinition": "You are an expert Storyteller running immersive chronicles in the World of Darkness (Storyteller System, oWoD/Chronicles of Darkness). You weave evocative narrative, manage dramatic tension, and ensure darkly atmospheric stories where mortal and supernatural fates intertwine. You excel at adaptive narration and dynamic gameplay while upholding consistent system mechanics.",
      "groups": ["read", "edit", "mcp"],
      "customInstructions": "IMPORTANT: You have access to two MCP servers for World of Darkness (oWoD) game management:\n\n1. **rpg-game-state** — For persistent character/world data:\n   - create_character: Create new WoD characters with all core attributes (Strength, Manipulation, etc.), willpower, power stats (e.g., Blood, Gnosis, Glamour), health levels, and abilities; supports optional arrays for Disciplines, Gifts, Arts, Realms, Spheres.\n   - get_character: Retrieve a full, human-readable character sheet including oWoD health and all secondary features\n   - get_character_by_name: Find characters by name\n   - list_characters: Roster all characters\n   - update_character: Modify character stats, traits, resources\n   - spend_willpower, spend_blood, spend_gnosis, spend_glamour, spend_arete: Spend key supernatural/mental resources\n   - add_item / get_inventory: Manage equipment/story items\n   - save_world_state / get_world_state: Track locations, NPCs, events\n   - apply_damage: Damage is tracked by health level (Bruised, Hurt, etc., not hit points!)\n\n2. **rpg-combat-engine** — For dice mechanics:\n   - roll_wod_pool: Roll a World of Darkness dice pool (d10s): successes, botches, specialties.\n\nSTORYTELLER SYSTEM FLOW:\n1. Always consult current character sheets BEFORE describing actions or outcomes.\n2. Use tools to manage all character resources and health (never ad-lib results or adjust stats manually; always use the appropriate tool).\n3. For any dice pool action (attribute + ability, etc.), use roll_wod_pool — specify pool size, difficulty, and specialty if relevant.\n4. Apply damage and wound penalties using the health levels system (never use hit points).\n5. For spending limited character resources, ALWAYS use resource-spending tools (spend_willpower, spend_blood, etc.) to modify the player state.\n6. Maintain persistent story, world state, and equipment using the relevant tool.\n\nNARRATIVE STYLE:\n- Use evocative, genre-appropriate descriptions with a focus on mood, motif, and supernatural atmosphere.\n- Develop distinct, memorable NPCs and factions with oWoD-appropriate motivations.\n- Balance story flow, horror/drama, and system mechanics.\n- Present player choices that matter; react to player actions using up-to-date character and world state.\n\nCOMBAT AND CHALLENGES:\n- Use roll_wod_pool for dice pools (success-based, not d20 or HP).\n- Track health ONLY with health levels (e.g. Bruised, Injured, etc.).\n- Use apply_damage and status effect mechanics as per Storyteller System.\n- All supernatural or limited resource use (Willpower, Blood, etc.) requires a spend_* tool.\n- Describe events cinematically, but always resolve results mechanics first for fairness and outcome transparency."
    }
  ]
}
````

## File: game-state-server/src/db.js
````javascript
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { MONSTER_TEMPLATES, getAbilityModifier } from './monsters.js';
// Create data directory in user's home folder
const DATA_DIR = join(homedir(), '.rpg-dungeon-data');
if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}
const DB_PATH = join(DATA_DIR, 'game-state.db');
export class GameDatabase {
    db;
    constructor() {
        this.db = new Database(DB_PATH);
        this.db.pragma('journal_mode = WAL');
        this.initializeSchema();
    }
    initializeSchema() {
        // Characters table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        class TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        current_hp INTEGER,
        max_hp INTEGER,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        gold INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_played DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // NPCs table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS npcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'enemy',
        creature_type TEXT,
        size TEXT DEFAULT 'medium',
        current_hp INTEGER NOT NULL,
        max_hp INTEGER NOT NULL,
        armor_class INTEGER NOT NULL,
        speed INTEGER DEFAULT 30,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        proficiency_bonus INTEGER DEFAULT 2,
        initiative_modifier INTEGER DEFAULT 0,
        attacks TEXT,
        abilities TEXT,
        conditions TEXT,
        is_alive BOOLEAN DEFAULT TRUE,
        challenge_rating REAL DEFAULT 0,
        experience_value INTEGER DEFAULT 0,
        template_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Encounters table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        current_round INTEGER DEFAULT 0,
        current_turn INTEGER DEFAULT 0,
        environment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
        // Encounter participants table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounter_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encounter_id INTEGER NOT NULL,
        participant_type TEXT NOT NULL,
        participant_id INTEGER NOT NULL,
        initiative INTEGER NOT NULL,
        initiative_order INTEGER,
        has_acted BOOLEAN DEFAULT FALSE,
        conditions TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (encounter_id) REFERENCES encounters(id)
      )
    `);
        // Inventory table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_type TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        equipped BOOLEAN DEFAULT FALSE,
        properties TEXT, -- JSON string
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);
        // Story progress table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS story_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        chapter TEXT NOT NULL,
        scene TEXT NOT NULL,
        description TEXT,
        flags TEXT, -- JSON string
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);
        // World state table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        location TEXT NOT NULL,
        npcs TEXT, -- JSON string
        events TEXT, -- JSON string
        environment TEXT, -- JSON string
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);
        // Combat log table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS combat_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        action TEXT NOT NULL,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
            )
          `);
        // Quests table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              objectives TEXT, -- JSON string, e.g., [{id: "obj1", text: "Do X", completed: false}]
              rewards TEXT,    -- JSON string, e.g., {gold: 100, exp: 50, items: ["item_id_1"]}
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
        // Character Quests table (join table)
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS character_quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              character_id INTEGER NOT NULL,
              quest_id INTEGER NOT NULL,
              status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'
              progress TEXT, -- JSON string for detailed objective tracking
              assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
              FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
              UNIQUE (character_id, quest_id)
            )
          `);
        // Create indexes
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_inventory_character ON inventory(character_id);
      CREATE INDEX IF NOT EXISTS idx_story_character ON story_progress(character_id);
      CREATE INDEX IF NOT EXISTS idx_world_character ON world_state(character_id);
      CREATE INDEX IF NOT EXISTS idx_combat_character ON combat_log(character_id);
      CREATE INDEX IF NOT EXISTS idx_npc_type ON npcs(type);
      CREATE INDEX IF NOT EXISTS idx_npc_alive ON npcs(is_alive);
      CREATE INDEX IF NOT EXISTS idx_encounter_character ON encounters(character_id);
      CREATE INDEX IF NOT EXISTS idx_encounter_status ON encounters(status);
      CREATE INDEX IF NOT EXISTS idx_participants_encounter ON encounter_participants(encounter_id);
      CREATE INDEX IF NOT EXISTS idx_participants_order ON encounter_participants(encounter_id, initiative_order);
      CREATE INDEX IF NOT EXISTS idx_quests_title ON quests(title);
      CREATE INDEX IF NOT EXISTS idx_character_quests_character_id ON character_quests(character_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_quest_id ON character_quests(quest_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_status ON character_quests(status);
    `);
    }
    // Character operations
    createCharacter(data) {
        const maxHp = 10 + (data.constitution || 10);
        const stmt = this.db.prepare(`
      INSERT INTO characters (
        name, class, max_hp, current_hp,
        strength, dexterity, constitution,
        intelligence, wisdom, charisma
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(data.name, data.class, maxHp, maxHp, data.strength || 10, data.dexterity || 10, data.constitution || 10, data.intelligence || 10, data.wisdom || 10, data.charisma || 10);
        return this.getCharacter(result.lastInsertRowid);
    }
    getCharacter(id) {
        const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?');
        return stmt.get(id);
    }
    getCharacterByName(name) {
        const stmt = this.db.prepare('SELECT * FROM characters WHERE name = ?');
        return stmt.get(name);
    }
    listCharacters() {
        const stmt = this.db.prepare('SELECT * FROM characters ORDER BY last_played DESC');
        return stmt.all();
    }
    updateCharacter(id, updates) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const stmt = this.db.prepare(`
      UPDATE characters 
      SET ${setClause}, last_played = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
        stmt.run(...values, id);
        return this.getCharacter(id);
    }
    // Inventory operations
    addItem(characterId, item) {
        const stmt = this.db.prepare(`
      INSERT INTO inventory (character_id, item_name, item_type, quantity, properties, equipped)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(
            characterId,
            item.name,
            item.type || 'misc',
            item.quantity || 1,
            item.properties ? JSON.stringify(item.properties) : null,
            item.equipped ? 1 : 0  // Convert boolean to integer for SQLite
        );
        return { id: result.lastInsertRowid, ...item };
    }
    getInventory(characterId) {
        const stmt = this.db.prepare(`
      SELECT * FROM inventory WHERE character_id = ? ORDER BY item_type, item_name
    `);
        const items = stmt.all(characterId);
        return items.map((item) => ({
            ...item,
            properties: item.properties ? JSON.parse(item.properties) : null
        }));
    }
    updateItem(id, updates) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
        stmt.run(...values, id);
    }
    removeItem(id) {
        const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
        stmt.run(id);
    }
    // Story operations
    saveStoryProgress(characterId, data) {
        const stmt = this.db.prepare(`
      INSERT INTO story_progress (character_id, chapter, scene, description, flags)
      VALUES (?, ?, ?, ?, ?)
    `);
        stmt.run(characterId, data.chapter, data.scene, data.description || null, data.flags ? JSON.stringify(data.flags) : null);
    }
    getLatestStoryProgress(characterId) {
        const stmt = this.db.prepare(`
      SELECT * FROM story_progress 
      WHERE character_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);
        const result = stmt.get(characterId);
        if (result && result.flags) {
            result.flags = JSON.parse(result.flags);
        }
        return result;
    }
    // World state operations
    saveWorldState(characterId, data) {
        // Check if world state exists
        const existing = this.db.prepare('SELECT id FROM world_state WHERE character_id = ?').get(characterId);
        if (existing) {
            // Update existing
            const stmt = this.db.prepare(`
        UPDATE world_state 
        SET location = ?, npcs = ?, events = ?, environment = ?, last_updated = CURRENT_TIMESTAMP
        WHERE character_id = ?
      `);
            stmt.run(data.location, data.npcs ? JSON.stringify(data.npcs) : null, data.events ? JSON.stringify(data.events) : null, data.environment ? JSON.stringify(data.environment) : null, characterId);
        }
        else {
            // Insert new
            const stmt = this.db.prepare(`
        INSERT INTO world_state (character_id, location, npcs, events, environment)
        VALUES (?, ?, ?, ?, ?)
      `);
            stmt.run(characterId, data.location, data.npcs ? JSON.stringify(data.npcs) : null, data.events ? JSON.stringify(data.events) : null, data.environment ? JSON.stringify(data.environment) : null);
        }
    }
    getWorldState(characterId) {
        const stmt = this.db.prepare('SELECT * FROM world_state WHERE character_id = ?');
        const result = stmt.get(characterId);
        if (result) {
            if (result.npcs)
                result.npcs = JSON.parse(result.npcs);
            if (result.events)
                result.events = JSON.parse(result.events);
            if (result.environment)
                result.environment = JSON.parse(result.environment);
        }
        return result;
    }
    // Combat log operations
    logCombat(characterId, sessionId, action, result) {
        const stmt = this.db.prepare(`
      INSERT INTO combat_log (character_id, session_id, action, result)
      VALUES (?, ?, ?, ?)
    `);
        stmt.run(characterId, sessionId, action, result || null);
    }
    getCombatLog(characterId, sessionId) {
        if (sessionId) {
            const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ? AND session_id = ?
        ORDER BY timestamp
      `);
            return stmt.all(characterId, sessionId);
        }
        else {
            const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ?
        ORDER BY timestamp DESC
        LIMIT 50
      `);
            return stmt.all(characterId);
        }
    }
    // NPC operations
    createNPC(data) {
        let npcData = {
            name: data.name,
            type: data.type || 'enemy'
        };
        // Apply template if specified
        if (data.template && MONSTER_TEMPLATES[data.template]) {
            const template = MONSTER_TEMPLATES[data.template];
            npcData = { ...template, ...npcData };
        }
        // Apply custom stats
        if (data.customStats) {
            npcData = { ...npcData, ...data.customStats };
        }
        // Ensure required fields
        if (!npcData.max_hp)
            npcData.max_hp = 10;
        if (!npcData.current_hp)
            npcData.current_hp = npcData.max_hp;
        if (!npcData.armor_class)
            npcData.armor_class = 10;
        // Calculate initiative modifier if not set
        if (npcData.initiative_modifier === undefined) {
            npcData.initiative_modifier = getAbilityModifier(npcData.dexterity || 10);
        }
        const stmt = this.db.prepare(`
      INSERT INTO npcs (
        name, type, creature_type, size, current_hp, max_hp, armor_class, speed,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        proficiency_bonus, initiative_modifier, attacks, abilities, conditions,
        challenge_rating, experience_value, template_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
        // Serialize complex objects to JSON if they are not already strings
        const attacksValue = typeof npcData.attacks === 'object' && npcData.attacks !== null
            ? JSON.stringify(npcData.attacks)
            : npcData.attacks || null;
        const abilitiesValue = typeof npcData.abilities === 'object' && npcData.abilities !== null
            ? JSON.stringify(npcData.abilities)
            : npcData.abilities || null;
        const conditionsValue = typeof npcData.conditions === 'object' && npcData.conditions !== null
            ? JSON.stringify(npcData.conditions)
            : npcData.conditions || null;
        const result = stmt.run(npcData.name, npcData.type, npcData.creature_type || null, npcData.size || 'medium', npcData.current_hp, npcData.max_hp, npcData.armor_class, npcData.speed || 30, npcData.strength || 10, npcData.dexterity || 10, npcData.constitution || 10, npcData.intelligence || 10, npcData.wisdom || 10, npcData.charisma || 10, npcData.proficiency_bonus || 2, npcData.initiative_modifier, attacksValue, abilitiesValue, conditionsValue, npcData.challenge_rating || 0, npcData.experience_value || 0, data.template || null);
        return this.getNPC(result.lastInsertRowid);
    }
    createNPCGroup(template, count, namePrefix) {
        const npcs = [];
        const prefix = namePrefix || MONSTER_TEMPLATES[template]?.name || 'NPC';
        for (let i = 1; i <= count; i++) {
            const npc = this.createNPC({
                name: `${prefix} ${i}`,
                template: template
            });
            npcs.push(npc);
        }
        return npcs;
    }
    getNPC(id) {
        const stmt = this.db.prepare('SELECT * FROM npcs WHERE id = ?');
        const npc = stmt.get(id);
        if (npc) {
            // Parse JSON fields
            if (npc.attacks)
                npc.attacks = JSON.parse(npc.attacks);
            if (npc.abilities)
                npc.abilities = JSON.parse(npc.abilities);
            if (npc.conditions)
                npc.conditions = JSON.parse(npc.conditions);
        }
        return npc;
    }
    listNPCs(type, aliveOnly = true) {
        let query = 'SELECT * FROM npcs WHERE 1=1';
        const params = [];
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        if (aliveOnly) {
            query += ' AND is_alive = TRUE';
        }
        query += ' ORDER BY name';
        const stmt = this.db.prepare(query);
        const npcs = stmt.all(...params);
        return npcs.map((npc) => {
            if (npc.attacks)
                npc.attacks = JSON.parse(npc.attacks);
            if (npc.abilities)
                npc.abilities = JSON.parse(npc.abilities);
            if (npc.conditions)
                npc.conditions = JSON.parse(npc.conditions);
            return npc;
        });
    }
    updateNPC(id, updates) {
        // Handle JSON fields
        if (updates.attacks && typeof updates.attacks === 'object') {
            updates.attacks = JSON.stringify(updates.attacks);
        }
        if (updates.abilities && typeof updates.abilities === 'object') {
            updates.abilities = JSON.stringify(updates.abilities);
        }
        if (updates.conditions && typeof updates.conditions === 'object') {
            updates.conditions = JSON.stringify(updates.conditions);
        }
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
        stmt.run(...values, id);
        return this.getNPC(id);
    }
    removeNPC(id) {
        const stmt = this.db.prepare('DELETE FROM npcs WHERE id = ?');
        stmt.run(id);
    }
    // Encounter operations
    createEncounter(data) {
        const stmt = this.db.prepare(`
      INSERT INTO encounters (character_id, name, description, environment)
      VALUES (?, ?, ?, ?)
    `);
        const result = stmt.run(data.character_id, data.name, data.description || null, data.environment || null);
        return this.getEncounter(result.lastInsertRowid);
    }
    getEncounter(id) {
        const stmt = this.db.prepare('SELECT * FROM encounters WHERE id = ?');
        return stmt.get(id);
    }
    getActiveEncounter(characterId) {
        const stmt = this.db.prepare(`
      SELECT * FROM encounters 
      WHERE character_id = ? AND status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
        return stmt.get(characterId);
    }
    addEncounterParticipant(encounterId, type, participantId, initiative) {
        const stmt = this.db.prepare(`
      INSERT INTO encounter_participants (encounter_id, participant_type, participant_id, initiative)
      VALUES (?, ?, ?, ?)
    `);
        stmt.run(encounterId, type, participantId, initiative);
        // Recalculate initiative order
        this.updateInitiativeOrder(encounterId);
    }
    updateInitiativeOrder(encounterId) {
        // Get all participants sorted by initiative (descending)
        const participants = this.db.prepare(`
      SELECT id, initiative FROM encounter_participants 
      WHERE encounter_id = ? AND is_active = TRUE
      ORDER BY initiative DESC
    `).all(encounterId);
        // Update initiative order
        const updateStmt = this.db.prepare(`
      UPDATE encounter_participants SET initiative_order = ? WHERE id = ?
    `);
        participants.forEach((p, index) => {
            updateStmt.run(index + 1, p.id);
        });
    }
    getEncounterParticipants(encounterId) {
        const stmt = this.db.prepare(`
      SELECT ep.*, 
        CASE 
          WHEN ep.participant_type = 'character' THEN c.name
          WHEN ep.participant_type = 'npc' THEN n.name
        END as name,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.current_hp
          WHEN ep.participant_type = 'npc' THEN n.current_hp
        END as current_hp,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.max_hp
          WHEN ep.participant_type = 'npc' THEN n.max_hp
        END as max_hp
      FROM encounter_participants ep
      LEFT JOIN characters c ON ep.participant_type = 'character' AND ep.participant_id = c.id
      LEFT JOIN npcs n ON ep.participant_type = 'npc' AND ep.participant_id = n.id
      WHERE ep.encounter_id = ? AND ep.is_active = TRUE
      ORDER BY ep.initiative_order
    `);
        return stmt.all(encounterId);
    }
    nextTurn(encounterId) {
        const encounter = this.getEncounter(encounterId);
        if (!encounter || encounter.status !== 'active')
            return null;
        // Get active participants
        const participants = this.getEncounterParticipants(encounterId);
        if (participants.length === 0)
            return null;
        // Mark current participant as having acted
        if (encounter.current_turn > 0) {
            const currentParticipant = participants.find((p) => p.initiative_order === encounter.current_turn);
            if (currentParticipant) {
                this.db.prepare(`
          UPDATE encounter_participants SET has_acted = TRUE WHERE id = ?
        `).run(currentParticipant.id);
            }
        }
        // Find next participant
        let nextTurn = encounter.current_turn + 1;
        // If we've gone through all participants, start new round
        if (nextTurn > participants.length) {
            nextTurn = 1;
            encounter.current_round += 1;
            // Reset has_acted for all participants
            this.db.prepare(`
        UPDATE encounter_participants 
        SET has_acted = FALSE 
        WHERE encounter_id = ?
      `).run(encounterId);
        }
        // Update encounter
        this.db.prepare(`
      UPDATE encounters 
      SET current_turn = ?, current_round = ? 
      WHERE id = ?
    `).run(nextTurn, encounter.current_round, encounterId);
        // Return the participant whose turn it is
        return participants.find((p) => p.initiative_order === nextTurn);
    }
    endEncounter(id, outcome = 'completed') {
        const stmt = this.db.prepare(`
      UPDATE encounters 
      SET status = ?, ended_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
        stmt.run(outcome, id);
    }
    applyDamage(targetType, targetId, damage) {
        let stmt;
        if (targetType === 'character') {
            stmt = this.db.prepare(`
        UPDATE characters 
        SET current_hp = MAX(0, current_hp - ?) 
        WHERE id = ?
      `);
        }
        else if (targetType === 'npc') {
            stmt = this.db.prepare(`
        UPDATE npcs 
        SET current_hp = MAX(0, current_hp - ?),
            is_alive = CASE WHEN current_hp - ? <= 0 THEN FALSE ELSE TRUE END
        WHERE id = ?
      `);
            stmt.run(damage, damage, targetId);
            // Check if NPC died and remove from active encounters
            const npc = this.getNPC(targetId);
            if (npc && !npc.is_alive) {
                this.db.prepare(`
          UPDATE encounter_participants 
          SET is_active = FALSE 
          WHERE participant_type = 'npc' AND participant_id = ?
        `).run(targetId);
            }
            return npc;
        }
        if (stmt && targetType === 'character') {
            stmt.run(damage, targetId);
            return this.getCharacter(targetId);
        }
    }
    // Quest Operations
    addQuest(data) {
        const stmt = this.db.prepare(`
      INSERT INTO quests (title, description, objectives, rewards)
      VALUES (?, ?, ?, ?)
    `);
        const result = stmt.run(data.title, data.description, JSON.stringify(data.objectives), JSON.stringify(data.rewards));
        return this.getQuestById(result.lastInsertRowid);
    }
    getQuestById(id) {
        const stmt = this.db.prepare('SELECT * FROM quests WHERE id = ?');
        const quest = stmt.get(id);
        if (quest) {
            // objectives and rewards are stored as JSON, parse them if needed by caller
            // For now, return as stored. Parsing can be done in handler or by caller.
        }
        return quest || null;
    }
    assignQuestToCharacter(characterId, questId, status = 'active') {
        // Check if character and quest exist
        const character = this.getCharacter(characterId);
        if (!character)
            throw new Error(`Character with ID ${characterId} not found.`);
        const quest = this.getQuestById(questId);
        if (!quest)
            throw new Error(`Quest with ID ${questId} not found.`);
        const stmt = this.db.prepare(`
      INSERT INTO character_quests (character_id, quest_id, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(character_id, quest_id) DO UPDATE SET
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
      WHERE character_quests.status != 'completed' AND character_quests.status != 'failed'
            OR excluded.status = 'active' -- Allow re-activating if previously completed/failed for some reason
    `);
        const result = stmt.run(characterId, questId, status);
        if (result.changes > 0) {
            // Need to get the ID of the inserted/updated row.
            // If it was an insert, result.lastInsertRowid works.
            // If it was an update due to conflict, we need to query it.
            const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
            const cq = cqStmt.get(characterId, questId);
            return cq ? this.getCharacterQuestById(cq.id) : null;
        }
        // If no changes, it means the quest was already completed/failed and we tried to assign it as active again without override.
        // Or some other edge case. Return existing record.
        const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
        const cq = cqStmt.get(characterId, questId);
        return cq ? this.getCharacterQuestById(cq.id) : null;
    }
    getCharacterQuestById(characterQuestId) {
        const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.id = ?
    `);
        const cq = stmt.get(characterQuestId);
        if (cq) {
            // Parse JSON fields
            if (cq.objectives)
                cq.objectives = JSON.parse(cq.objectives);
            if (cq.rewards)
                cq.rewards = JSON.parse(cq.rewards);
            if (cq.progress)
                cq.progress = JSON.parse(cq.progress);
        }
        return cq || null;
    }
    getCharacterActiveQuests(characterId) {
        const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.character_id = ? AND cq.status = 'active'
      ORDER BY cq.assigned_at DESC
    `);
        const quests = stmt.all(characterId);
        return quests.map(q => {
            if (q.objectives)
                q.objectives = JSON.parse(q.objectives);
            if (q.rewards)
                q.rewards = JSON.parse(q.rewards);
            if (q.progress)
                q.progress = JSON.parse(q.progress);
            return q;
        });
    }
    updateCharacterQuestStatus(characterQuestId, status, progress) {
        const fieldsToUpdate = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
        const values = [status];
        if (progress !== undefined) {
            fieldsToUpdate.push('progress = ?');
            values.push(progress ? JSON.stringify(progress) : null);
        }
        values.push(characterQuestId);
        const stmt = this.db.prepare(`
      UPDATE character_quests
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = ?
    `);
        const result = stmt.run(...values);
        if (result.changes > 0) {
            return this.getCharacterQuestById(characterQuestId);
        }
        return null; // Or throw error if not found/not updated
    }
    close() {
        this.db.close();
    }
}
//# sourceMappingURL=db.js.map
````

## File: combat-engine-server/src/index.ts
````typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

/** oWoD Combat State object, tracking active phase (declaration/action) for phased combat logic. */
type CombatPhase = "declaration" | "action";

interface CombatState {
  current_phase: CombatPhase;
  log: string[]; // for expansion: combat log history
}

let combatState: CombatState = {
  current_phase: "declaration",
  log: []
};

/**
 * oWoD dice pool roller.
 * @param {number} pool_size Number of d10 dice to roll (integer >0)
 * @param {number} difficulty Target number for success (2..10)
 * @param {boolean} has_specialty Whether 10s count double for successes
 * @returns {{ successes: number, rolls: number[], isBotch: boolean, isSpectacular: boolean, resultText: string }}
 */
function rollWodPool(pool_size: number, difficulty: number, has_specialty: boolean): {
  successes: number,
  rolls: number[],
  isBotch: boolean,
  isSpectacular: boolean,
  resultText: string
} {
  if (pool_size < 1 || !Number.isInteger(pool_size)) throw new Error("Pool size must be an integer > 0");
  if (difficulty < 2 || difficulty > 10) throw new Error("Difficulty must be between 2 and 10");

  // Roll dice
  const rolls = Array.from({ length: pool_size }, () => Math.floor(Math.random() * 10) + 1);

  // Tally: count successes, count 1s as botch
  let successes = 0;
  let botches = 0;
  let countTens = 0;
  for (const r of rolls) {
    if (r >= difficulty && r < 10) {
      successes += 1;
    } else if (r === 10) {
      countTens += 1;
      successes += has_specialty ? 2 : 1;
    } else if (r === 1) {
      botches += 1;
    }
  }
  successes -= botches;

  const isBotch = successes < 0 || (successes === 0 && botches > 0);
  const isSpectacular = !isBotch && successes >= 5;
  let resultText = '';

  if (isBotch) {
    resultText = `BOTCH! Catastrophic failure (${botches}x 1's rolled).`;
  } else if (successes === 0) {
    resultText = "Failure – no successes.";
  } else {
    resultText = `Successes: ${successes}`;
    if (isSpectacular) resultText += " (Spectacular Success!)";
    if (countTens && has_specialty) resultText += ` [${countTens}x 10s (specialty Double Success)]`;
  }

  return {
    successes: Math.max(successes, 0), // Never negative
    rolls,
    isBotch,
    isSpectacular,
    resultText
  };
}

const server = new Server({
  name: 'rpg-combat-engine-server',
  version: '2.0.0',
}, {
  capabilities: { 
    tools: {},
  },
});

const toolDefinitions = [
  {
    name: 'roll_wod_pool',
    description: 'Roll an oWoD (old World of Darkness) dice pool: d10s, count successes, botches, specialties.',
    inputSchema: {
      type: 'object',
      properties: {
        pool_size: {
          type: 'integer',
          description: 'Number of d10s to roll (dice pool, >0)'
        },
        difficulty: {
          type: 'integer',
          description: 'Difficulty threshold (2-10; count rolls ≥ this as successes)'
        },
        has_specialty: {
          type: 'boolean',
          description: 'Do 10s count as double successes?'
        },
        spend_willpower_for_success: {
          type: 'boolean',
          description: 'If true, character spends Willpower for +1 automatic success.'
        },
        character_id: {
          type: 'integer',
          description: 'Character ID to debit Willpower from (optional, but required if spending willpower).'
        },
        actor_context: {
          type: 'object',
          description: 'Narrative context for tactical modifiers (cover, elevation, etc).',
          properties: {
            cover: { type: 'string' },
            isElevated: { type: 'boolean' }
          }
        }
      },
      required: ['pool_size', 'difficulty', 'has_specialty']
    }
  },
  {
    name: 'get_combat_state',
    description: 'Get the current oWoD combat encounter state (current phase, history)',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  // Tier 3: Contested/Resisted Roll
  {
    name: 'roll_contested_action',
    description: 'Resolve a contested action (PvP net successes): attacker and defender both roll pools at specified difficulties; result is attacker.successes - defender.successes',
    inputSchema: {
      type: 'object',
      properties: {
        attacker_pool: { type: 'integer', description: 'Attackers dice pool size' },
        attacker_difficulty: { type: 'integer', description: 'Attackers difficulty' },
        attacker_specialty: { type: 'boolean', description: 'Attackers has specialty (10s count double)' },
        defender_pool: { type: 'integer', description: 'Defenders dice pool size' },
        defender_difficulty: { type: 'integer', description: 'Defenders difficulty' },
        defender_specialty: { type: 'boolean', description: 'Defender has specialty (10s count double)' }
      },
      required: ['attacker_pool', 'attacker_difficulty', 'defender_pool', 'defender_difficulty']
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

// Tool request handler for oWoD dice only
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'roll_wod_pool': {
        // Unpack all args
        const { pool_size, difficulty, has_specialty, spend_willpower_for_success, character_id, actor_context } = args as any;
        let willpowerSpent = false;
        let willpowerError = "";
        let narrativeApplied = false;
        let narrativeDetail: string[] = [];
        let narrativePool = pool_size;
        let narrativeDiff = difficulty;

        // Integrate narrative/tactical modifiers
        if (actor_context) {
          try {
            // Import narrative tool if co-located; can switch to proper MCP tool bridging if split
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { handleGetTacticalAdvantage } = require("./narrative-engine.js");
            const result = handleGetTacticalAdvantage({ actor: actor_context });
            if (result && typeof result.modifiers === "number") {
              // By default, we apply narrative modifiers to difficulty (as cover/lighting usually makes things harder)
              narrativeDiff = Math.max(2, narrativeDiff + result.modifiers);
              narrativeApplied = result.modifiers !== 0;
              if (result.reasons?.length) narrativeDetail = result.reasons;
            }
          } catch {}
        }

        const result = rollWodPool(
          narrativePool,
          narrativeDiff,
          has_specialty
        );

        let successes = result.successes;
        // Handle Willpower: automatic success and MCP cross-call
        if (spend_willpower_for_success) {
          successes += 1;
          willpowerSpent = true;
          if (typeof character_id === "number") {
            try {
              const { execSync } = require("child_process");
              const spendCmd = JSON.stringify({
                method: "callTool",
                params: {
                  name: "spend_willpower",
                  arguments: { character_id, amount: 1 }
                }
              });
              execSync(`echo '${spendCmd}' | node ../game-state-server/src/index.ts`, { stdio: "ignore" });
            } catch (e: any) {
              willpowerError = " (❌ Could not debit Willpower from character sheet)";
            }
          } else {
            willpowerError = " (⚠️ Willpower not debited: no character_id provided)";
          }
        }

        // Compose response with details for LMs and users
        let output = `🎲 oWoD Dice Pool Roll\n\n`;
        output += `Pool Size: ${narrativePool}, Difficulty: ${narrativeDiff}, Specialty: ${has_specialty ? '✅' : 'No'}\n`;
        if (narrativeApplied && narrativeDetail.length > 0)
          output += `Narrative Modifiers Applied: ${narrativeDetail.map(r=>`• ${r}`).join(" | ")}\n`;
        if (willpowerSpent)
          output += `Willpower Spent: ✅ (+1 automatic success)${willpowerError}\n`;
        output += `Rolled: [${result.rolls.join(', ')}]\n`;
        output += `➡  Result: ${successes} success${successes !== 1 ? 'es' : ''}${willpowerSpent ? ' (incl. Willpower Bonus)' : ''}\n`;
        output += `${result.resultText}\n`;
        if (result.isBotch) output += `💥 BOTCH!`;
        if (result.isSpectacular) output += `🌟 Spectacular Success!`;

        combatState.log.push(
          `oWoD roll [${result.rolls.join(', ')}] at ${narrativeDiff} ⇒ ${successes} success${successes !== 1 ? 'es' : ''}${result.isBotch ? ' (BOTCH)' : (result.isSpectacular ? ' (Spectacular)' : '')}${willpowerSpent ? ' [Willpower +1]' : ''}${willpowerError ? ' ' + willpowerError : ''}${narrativeApplied && narrativeDetail.length > 0 ? ' [Narrative: ' + narrativeDetail.join('; ') + ']' : ''}`
        );

        return {
          content: [{ type: 'text', text: output }]
        };
      }
      case 'roll_contested_action': {
        const { attacker_pool, attacker_difficulty, attacker_specialty, defender_pool, defender_difficulty, defender_specialty } = args as any;
        const atk = rollWodPool(attacker_pool, attacker_difficulty, Boolean(attacker_specialty));
        const def = rollWodPool(defender_pool, defender_difficulty, Boolean(defender_specialty));
        const net = atk.successes - def.successes;
        let logtxt = `🎯 CONTESTED/RESISTED ACTION\n\n`;
        logtxt += `Attacker: Pool ${attacker_pool} vs Diff ${attacker_difficulty} → Rolls: [${atk.rolls.join(', ')}] (${atk.successes} successes)${atk.isBotch ? ' [BOTCH]' : ''}\n`;
        logtxt += `Defender: Pool ${defender_pool} vs Diff ${defender_difficulty} → Rolls: [${def.rolls.join(', ')}] (${def.successes} successes)${def.isBotch ? ' [BOTCH]' : ''}\n\n`;

        logtxt += `RESULT: `;
        if (atk.isBotch && def.isBotch) {
          logtxt += `DOUBLE BOTCH! Chaotic failure.`;
        } else if (atk.isBotch) {
          logtxt += `Attacker BOTCHES—automatic failure.`;
        } else if (def.isBotch) {
          logtxt += `Defender BOTCHES! Attacker wins automatically.`;
        } else if (net > 0) {
          logtxt += `Attacker wins by ${net} net success${net > 1 ? 'es' : ''}.`;
        } else if (net < 0) {
          logtxt += `Defender resists by ${-net} net success${net < -1 ? 'es' : ''}.`;
        } else {
          logtxt += `STANDOFF—tie, no clear winner.`;
        }
        combatState.log.push(
          `Contested roll: Atk [${atk.successes}] vs Def [${def.successes}] → Net: ${net} (${atk.isBotch ? 'Attacker BOTCH' : def.isBotch ? 'Def BOTCH' : net === 0 ? 'Tie' : net > 0 ? 'Attacker wins' : 'Defender wins'})`
        );
        return {
          content: [{ type: 'text', text: logtxt }]
        };
      }
      // New (Tier 2): Return or mutate encounter state here in the future as needed

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error('oWoD RPG Combat Engine MCP Server v2.0 running on stdio');
````

## File: game-state-server/src/db.ts
````typescript
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { homedir } from 'os';
import { ANTAGONIST_TEMPLATES, AntagonistSheet } from './antagonists.js';

// Define interfaces for Monster Templates
interface MonsterAttack {
  name: string;
  bonus: number;
  damage: string;
  type: string;
  range?: number;
  special?: string;
  versatile?: string;
}

interface MonsterTemplate {
  name: string;
  creature_type: string;
  size: string;
  max_hp: number;
  armor_class: number;
  speed: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiency_bonus: number;
  initiative_modifier: number;
  attacks: string; // JSON string of MonsterAttack[]
  abilities?: string; // JSON string of Record<string, string>
  challenge_rating: number;
  experience_value: number;
  'Damage Vulnerabilities'?: string;
  'Damage Immunities'?: string;
  'Condition Immunities'?: string;
}

type MonsterTemplatesCollection = Record<string, MonsterTemplate>;

// --- Moved interfaces from below to here to avoid syntax errors ---
export interface ConditionRow {
  id: number;
  character_id: number;
  condition_name: string;
  duration: number | null; // null = indefinite
  effect_json: any | null; // parsed object, not string
}

export interface DerangementRow {
  id: number;
  character_id: number;
  derangement: string;
  description: string;
}
// Define EncounterParticipant locally to avoid import issues for now
// Ideally, this would be in a shared types.ts file
interface EncounterParticipant {
  id: number;
  encounter_id: number;
  participant_type: 'character' | 'npc';
  participant_id: number;
  initiative: number;
  initiative_order?: number | null;
  has_acted: boolean;
  conditions?: string | null;
  is_active: boolean;
  // Properties from JOIN
  name: string;
  current_hp: number;
  max_hp: number;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  objectives: string; // JSON string
  rewards: string; // JSON string
  created_at: string;
}

// Schema for rows in characters table (oWoD + Changeling support as of Phase 2.1)
// Extend as needed if/when new columns get added.
interface CharacterRow {
  id: number;
  name: string;
  concept?: string | null;
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
  power_stat_name?: string | null;
  power_stat_rating?: number | null;
  kith?: string | null;
  seeming?: string | null;
  glamour_current?: number | null;
  glamour_permanent?: number | null;
  banality_permanent?: number | null;
  experience: number; // Added for XP Management
}

interface CharacterQuest {
  id: number;
  character_id: number;
  quest_id: number;
  status: 'active' | 'completed' | 'failed';
  progress?: string | null; // JSON string for detailed objective tracking
  assigned_at: string;
  updated_at: string;
  // Properties from JOIN with quests table
  title?: string;
  description?: string;
  objectives?: string; // JSON string
  rewards?: string; // JSON string
}

// Create data directory in user's home folder
const DATA_DIR = join(homedir(), '.rpg-dungeon-data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = join(DATA_DIR, 'game-state.db');

export class GameDatabase {
  protected db: Database.Database;

  // --- Forwarders for Modern Features (so base orchestration works everywhere) ---
  tickDownConditions(): { updated: number, removed: number } {
    if (typeof (this as any).tickDownConditionsModern === "function") {
      return (this as any).tickDownConditionsModern();
    }
    // fallback: call the method directly if defined (will not run in old versions)
    try {
      // Modern method location
      // @ts-ignore
      if (typeof this['__proto__'].tickDownConditions === "function") {
        // @ts-ignore
        return this['__proto__'].tickDownConditions.call(this);
      }
    } catch {}
    return { updated: 0, removed: 0 };
  }

  getActiveConditions(characterId: number): any[] {
    if (typeof (this as any).getActiveConditionsModern === "function") {
      return (this as any).getActiveConditionsModern(characterId);
    }
    try {
      // @ts-ignore
      if (typeof this['__proto__'].getActiveConditions === "function") {
        // @ts-ignore
        return this['__proto__'].getActiveConditions.call(this, characterId);
      }
    } catch {}
    return [];
  }

  constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  /**
   * Adds a column to a table if it does not already exist.
   */
  private addColumnIfNotExists(tableName: string, columnName: string, columnDef: string) {
    // Ensure valid SQLite identifiers before using in SQL
    const info = this.db.prepare(
      `PRAGMA table_info('${tableName}')`
    ).all() as { name: string }[];
    const exists = Array.isArray(info) && info.some((col: any) => typeof col === 'object' && 'name' in col && col.name === columnName);
    if (!exists) {
      this.db.exec(`ALTER TABLE '${tableName}' ADD COLUMN '${columnName}' ${columnDef}`);
    }
  }

/**
 * Schema initialization and migration for oWoD game data.
 * - Additive schema changes for all tables to preserve existing game saves.
 * - Characters table is now migrated using CREATE IF NOT EXISTS and additive ALTERs only.
 * - Changeling: The Dreaming support with extra columns and relation tables (arts/realms).
 */
  private initializeSchema() {
    // Tier 3: Scenes/Session support (add schema/table if missing)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        location TEXT,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        is_active BOOLEAN DEFAULT 1
      );
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scene_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scene_id INTEGER NOT NULL,
        participant_type TEXT NOT NULL, -- 'character' or 'npc'
        participant_id INTEGER NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        left_at DATETIME,
        FOREIGN KEY(scene_id) REFERENCES scenes(id)
      );
    `);
  // --------------------------------------------
    // Derangements/Mental State - Phase 2
    // --------------------------------------------
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_derangements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        derangement TEXT NOT NULL,
        description TEXT,
        UNIQUE(character_id, derangement),
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);

    // --------------------------------------------
    // 1. Ensure characters table exists (additive-safe)
    // --------------------------------------------
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        concept TEXT,
        game_line TEXT NOT NULL, -- 'vampire', 'werewolf', 'changeling', 'mage'
        -- Core Attributes
        strength INTEGER DEFAULT 1,
        dexterity INTEGER DEFAULT 1,
        stamina INTEGER DEFAULT 1,
        charisma INTEGER DEFAULT 1,
        manipulation INTEGER DEFAULT 1,
        appearance INTEGER DEFAULT 1,
        perception INTEGER DEFAULT 1,
        intelligence INTEGER DEFAULT 1,
        wits INTEGER DEFAULT 1,
        -- Core Traits
        willpower_current INTEGER DEFAULT 1,
        willpower_permanent INTEGER DEFAULT 1,
        health_levels TEXT NOT NULL,
        -- Game-Specific Power Stat (e.g., Blood, Gnosis, Glamour, Arete)
        power_stat_name TEXT,
        power_stat_rating INTEGER
      );
    `);

    // --------------------------------------------
    // 7. XP (Experience Points) for Characters - Tier 3
    // --------------------------------------------
    // (A) Add character XP/experience column if missing
    this.addColumnIfNotExists('characters', 'experience', 'INTEGER DEFAULT 0');

    // (B) Full XP Ledger: logs XP award/spend per character with transaction details
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS xp_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('award','spend')),
        amount INTEGER NOT NULL,
        reason TEXT,
        trait TEXT,
        before_xp INTEGER NOT NULL,
        after_xp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);
    // --------------------------------------------
    // 2. Add Changeling columns (additive, checked)
    // --------------------------------------------
    // kith, seeming, glamour_current, glamour_permanent, banality_permanent
    this.addColumnIfNotExists('characters', 'kith', 'TEXT');
    this.addColumnIfNotExists('characters', 'seeming', 'TEXT');
    this.addColumnIfNotExists('characters', 'glamour_current', 'INTEGER');
    this.addColumnIfNotExists('characters', 'glamour_permanent', 'INTEGER');
    this.addColumnIfNotExists('characters', 'banality_permanent', 'INTEGER');

    // --------------------------------------------
    // 3. Changeling character_arts and character_realms
    // --------------------------------------------
    // These tables link character_id to named art/realm, with 1-N ratings; PK composite key.
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_arts (
        character_id INTEGER NOT NULL,
        art_name TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (character_id, art_name),
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_realms (
        character_id INTEGER NOT NULL,
        realm_name TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (character_id, realm_name),
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);

    // --------------------------------------------------------------------
    // 4. Vampire: The Masquerade support (Phase 2.2, additive-safe, prod-ready)
    // --------------------------------------------------------------------
    // - clan (TEXT), generation (INTEGER), blood_pool_current (INTEGER),
    //   blood_pool_max (INTEGER), humanity (INTEGER) columns for 'characters'
    // - character_disciplines table (character_id/discipline_name PK, FK to characters(id))
    // NOTE: All schema changes are strictly additive and idempotent (safe for live games).
    this.addColumnIfNotExists('characters', 'clan', 'TEXT');
    this.addColumnIfNotExists('characters', 'generation', 'INTEGER');
    this.addColumnIfNotExists('characters', 'blood_pool_current', 'INTEGER');
    this.addColumnIfNotExists('characters', 'blood_pool_max', 'INTEGER');
    this.addColumnIfNotExists('characters', 'humanity', 'INTEGER');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_disciplines (
        character_id INTEGER NOT NULL,
        discipline_name TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (character_id, discipline_name),
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);

    // --------------------------------------------------------------------
    // 5. Werewolf: The Apocalypse support (Phase 2.3, additive, prod-safe)
    // --------------------------------------------------------------------
    // - Add columns for breed, auspice, tribe, gnosis, rage, renown to 'characters'.
    //   These use TEXT or INTEGER, no value assumptions. All schema ops are safe/idempotent.
    // - Create character_gifts (character_id, gift_name, rank) table for Werewolf gifts.
    // Review docs below for column/table meaning; do not destructively update prod schema.
    this.addColumnIfNotExists('characters', 'breed', 'TEXT');            // Garou breed (Homid, Metis, Lupus)
    this.addColumnIfNotExists('characters', 'auspice', 'TEXT');         // Garou auspice (Ragabash, Theurge, etc)
    this.addColumnIfNotExists('characters', 'tribe', 'TEXT');           // Garou tribe (Get of Fenris, Fianna, etc)
    this.addColumnIfNotExists('characters', 'gnosis_current', 'INTEGER');    // Gnosis (current)
    this.addColumnIfNotExists('characters', 'gnosis_permanent', 'INTEGER');  // Gnosis (permanent)
    this.addColumnIfNotExists('characters', 'rage_current', 'INTEGER');      // Rage (current)
    this.addColumnIfNotExists('characters', 'rage_permanent', 'INTEGER');    // Rage (permanent)
    this.addColumnIfNotExists('characters', 'renown_glory', 'INTEGER');      // Renown (Glory)
    this.addColumnIfNotExists('characters', 'renown_honor', 'INTEGER');      // Renown (Honor)
    this.addColumnIfNotExists('characters', 'renown_wisdom', 'INTEGER');     // Renown (Wisdom)
    // Gift table for Garou: character_gifts (PK: character_id+gift_name), gifts are named, ranked, CASCADE on character delete.
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_gifts (
        character_id INTEGER NOT NULL,
        gift_name TEXT NOT NULL,
        rank INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (character_id, gift_name),
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);

    // --------------------------------------------------------------------
    // 6. Mage: The Ascension support (Phase 2.4, additive, prod-safe)
    // --------------------------------------------------------------------
    // - Add columns for tradition_convention (TEXT), arete (INTEGER), quintessence (INTEGER), paradox (INTEGER) to 'characters'.
    // - Create character_spheres (character_id, sphere_name, rating) table.
    //   PK: character_id+sphere_name, FK to characters(id) ON DELETE CASCADE.
    // - All schema changes here are strictly additive & idempotent (prod and savegame safe, can run repeatedly).
    this.addColumnIfNotExists('characters', 'tradition_convention', 'TEXT');    // Mage Tradition or Technocratic Convention
    this.addColumnIfNotExists('characters', 'arete', 'INTEGER');                // Mage Arete (power stat)
    this.addColumnIfNotExists('characters', 'quintessence', 'INTEGER');         // Mage Quintessence pool
    this.addColumnIfNotExists('characters', 'paradox', 'INTEGER');              // Mage Paradox points

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_spheres (
        character_id INTEGER NOT NULL,
        sphere_name TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (character_id, sphere_name),
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);

    // Core Abilities by character (shared by all games)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_abilities (
        character_id INTEGER NOT NULL,
        ability_name TEXT NOT NULL,
        ability_type TEXT NOT NULL, -- 'Talent', 'Skill', 'Knowledge'
        rating INTEGER NOT NULL DEFAULT 0,
        specialty TEXT,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
        PRIMARY KEY (character_id, ability_name)
      );
    `);

    // NPCs table with oWoD health_levels as JSON
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'enemy',
        creature_type TEXT,
        size TEXT DEFAULT 'medium',
        current_hp INTEGER NOT NULL,
        max_hp INTEGER NOT NULL,
        armor_class INTEGER NOT NULL,
        speed INTEGER DEFAULT 30,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        proficiency_bonus INTEGER DEFAULT 2,
        initiative_modifier INTEGER DEFAULT 0,
        attacks TEXT,
        abilities TEXT,
        conditions TEXT,
        health_levels TEXT, -- oWoD health system
        is_alive BOOLEAN DEFAULT TRUE,
        challenge_rating REAL DEFAULT 0,
        experience_value INTEGER DEFAULT 0,
        template_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Add column if it's missing (migration)
    this.addColumnIfNotExists('npcs', 'health_levels', 'TEXT');

    // Encounters table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        current_round INTEGER DEFAULT 0,
        current_turn INTEGER DEFAULT 0,
        currentState TEXT DEFAULT 'TURN_ENDED',
        currentActorActions TEXT,
        environment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    // Safe additive migration in case db exists and missing columns
    this.addColumnIfNotExists('encounters', 'currentState', "TEXT DEFAULT 'TURN_ENDED'");
    this.addColumnIfNotExists('encounters', 'currentActorActions', "TEXT");

    // Encounter participants table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounter_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encounter_id INTEGER NOT NULL,
        participant_type TEXT NOT NULL,
        participant_id INTEGER NOT NULL,
        initiative INTEGER NOT NULL,
        initiative_order INTEGER,
        has_acted BOOLEAN DEFAULT FALSE,
        conditions TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (encounter_id) REFERENCES encounters(id)
      )
    `);

    // Inventory table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_type TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        equipped BOOLEAN DEFAULT FALSE,
        properties TEXT, -- JSON string
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // Story progress table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS story_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        chapter TEXT NOT NULL,
        scene TEXT NOT NULL,
        description TEXT,
        flags TEXT, -- JSON string
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // World state table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        location TEXT NOT NULL,
        npcs TEXT, -- JSON string
        events TEXT, -- JSON string
        environment TEXT, -- JSON string
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // Combat log table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS combat_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        action TEXT NOT NULL,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
            )
          `);
      
          // Quests table
          this.db.exec(`
            CREATE TABLE IF NOT EXISTS quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              objectives TEXT, -- JSON string, e.g., [{id: "obj1", text: "Do X", completed: false}]
              rewards TEXT,    -- JSON string, e.g., {gold: 100, exp: 50, items: ["item_id_1"]}
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
      
          // Character Quests table (join table)
          this.db.exec(`
            CREATE TABLE IF NOT EXISTS character_quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              character_id INTEGER NOT NULL,
              quest_id INTEGER NOT NULL,
              status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'
              progress TEXT, -- JSON string for detailed objective tracking
              assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
              FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
              UNIQUE (character_id, quest_id)
            )
          `);
      
          // Create indexes
          this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_inventory_character ON inventory(character_id);
      CREATE INDEX IF NOT EXISTS idx_story_character ON story_progress(character_id);
      CREATE INDEX IF NOT EXISTS idx_world_character ON world_state(character_id);
      CREATE INDEX IF NOT EXISTS idx_combat_character ON combat_log(character_id);
      CREATE INDEX IF NOT EXISTS idx_npc_type ON npcs(type);
      CREATE INDEX IF NOT EXISTS idx_npc_alive ON npcs(is_alive);
      CREATE INDEX IF NOT EXISTS idx_encounter_character ON encounters(character_id);
      CREATE INDEX IF NOT EXISTS idx_encounter_status ON encounters(status);
      CREATE INDEX IF NOT EXISTS idx_participants_encounter ON encounter_participants(encounter_id);
      CREATE INDEX IF NOT EXISTS idx_participants_order ON encounter_participants(encounter_id, initiative_order);
      CREATE INDEX IF NOT EXISTS idx_quests_title ON quests(title);
      CREATE INDEX IF NOT EXISTS idx_character_quests_character_id ON character_quests(character_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_quest_id ON character_quests(quest_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_status ON character_quests(status);
    `);

    // D&D character field migrations removed for oWoD schema. All character logic should migrate to new field set.
    // --------------------------------------------------------------------
    // 7. Character Conditions System (Tier 3) - Additive, Safe Migration
    // --------------------------------------------------------------------
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_conditions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        condition_name TEXT NOT NULL,
        duration INTEGER,
        effect_json TEXT,
        UNIQUE(character_id, condition_name),
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      );
    `);
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_character_conditions_character_id ON character_conditions(character_id);
    `);
`);
  // Helper: Add column to a table if it doesn't exist
  private addColumnIfNotExists(tableName: string, columnName: string, columnDefinition: string) {
    const stmt = this.db.prepare(`PRAGMA table_info(\`${tableName}\`)`);
    const columns = stmt.all() as { name: string }[];
    if (!columns.some(col => col.name === columnName)) {
      try {
        this.db.exec(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`);
        console.log(`Added column ${columnName} to ${tableName}`);
      } catch (error) {
        console.error(`Failed to add column ${columnName} to ${tableName}:`, error);
      }
    }
  }
}



  // Character operations
  // New: Create oWoD character (core + abilities)
  createCharacter(data: {
    name: string;
    concept?: string;
    game_line: string; // 'vampire', 'werewolf', 'changeling', 'mage'
    strength?: number;
    dexterity?: number;
    stamina?: number;
    charisma?: number;
    manipulation?: number;
    appearance?: number;
    perception?: number;
    intelligence?: number;
    wits?: number;
    willpower_current?: number;
    willpower_permanent?: number;
    power_stat_name?: string;
    power_stat_rating?: number;
    health_levels?: Record<string, number>;
    abilities?: Array<{
      ability_name: string;
      ability_type: string; // 'Talent', 'Skill', 'Knowledge'
      rating?: number;
      specialty?: string;
    }>;
  }) {
    // Default health_levels by line, fallback is basic
    let defaultHealth: any = {
      bruised: 0, hurt: 0, injured: 0, wounded: 0, mauled: 0, crippled: 0, incapacitated: 0,
    };
    // Allow override per game if needed later

    const stmt = this.db.prepare(`
      INSERT INTO characters (
        name, concept, game_line,
        strength, dexterity, stamina, charisma, manipulation, appearance,
        perception, intelligence, wits,
        willpower_current, willpower_permanent,
        health_levels,
        power_stat_name, power_stat_rating
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.concept || null,
      data.game_line,
      data.strength ?? 1,
      data.dexterity ?? 1,
      data.stamina ?? 1,
      data.charisma ?? 1,
      data.manipulation ?? 1,
      data.appearance ?? 1,
      data.perception ?? 1,
      data.intelligence ?? 1,
      data.wits ?? 1,
      data.willpower_current ?? 1,
      data.willpower_permanent ?? 1,
      JSON.stringify(data.health_levels ?? defaultHealth),
      data.power_stat_name || null,
      data.power_stat_rating ?? null
    );
    const charId = result.lastInsertRowid as number;

    // Insert abilities
    if (data.abilities && Array.isArray(data.abilities)) {
      const ab_stmt = this.db.prepare(`
        INSERT INTO character_abilities
        (character_id, ability_name, ability_type, rating, specialty)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const ab of data.abilities) {
        ab_stmt.run(
          charId,
          ab.ability_name,
          ab.ability_type,
          ab.rating ?? 0,
          ab.specialty || null
        );
      }
    }

    return this.getCharacter(charId);
  }

  // New: Retrieve character with joined abilities
  getCharacter(id: number) {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?');
    const char = stmt.get(id) as CharacterRow | undefined;
    if (!char) return null;
    const ab_stmt = this.db.prepare('SELECT ability_name, ability_type, rating, specialty FROM character_abilities WHERE character_id = ?');
    const abilities = ab_stmt.all(char.id);
    return {
      ...char,
      health_levels: char.health_levels ? JSON.parse(char.health_levels) : {},
      abilities,
    };
  }

  // By name with joined abilities
  getCharacterByName(name: string) {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE name = ?');
    const char = stmt.get(name) as CharacterRow | undefined;
    if (!char) return null;
    const ab_stmt = this.db.prepare('SELECT ability_name, ability_type, rating, specialty FROM character_abilities WHERE character_id = ?');
    const abilities = ab_stmt.all(char.id);
    return {
      ...char,
      health_levels: char.health_levels ? JSON.parse(char.health_levels) : {},
      abilities,
    };
  }

  // List characters basic info
  listCharacters() {
    const stmt = this.db.prepare('SELECT id, name, concept, game_line FROM characters ORDER BY id DESC');
    return stmt.all();
  }

  // --- XP Management System (Tier 3) ---

  /**
   * Award XP to a character (increments XP, logs in ledger). Throws on error.
   * Returns ledger record.
   */
  awardXp(characterId: number, amount: number, reason: string) {
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("XP award amount must be > 0");
    // Fetch before XP
    const char = this.getCharacter(characterId);
    if (!char) throw new Error("Character not found");
    const before = char.experience ?? 0;
    const after = before + amount;

    // Transaction: Update XP and log
    const txn = this.db.transaction(() => {
      // Add to character XP
      this.db.prepare("UPDATE characters SET experience = ? WHERE id = ?").run(after, characterId);
      // Ledger entry
      const res = this.db.prepare(
        "INSERT INTO xp_ledger (character_id, type, amount, reason, before_xp, after_xp) VALUES (?, 'award', ?, ?, ?, ?)"
      ).run(characterId, amount, reason, before, after);
      // Return new ledger entry
      return this.db.prepare("SELECT * FROM xp_ledger WHERE id = ?").get(res.lastInsertRowid);
    });

    return txn();
  }

  /**
   * Spend XP to improve a trait (validates cost, updates XP, logs, and may update trait).
   * You must implement trait/cost validation outside or inside as needed.
   * Returns ledger record and new trait level if updated.
   */
  spendXp(characterId: number, trait: string, cost: number, traitCallback?: (db: GameDatabase, char: any) => void) {
    if (!Number.isFinite(cost) || cost <= 0) throw new Error("XP spend amount must be > 0");
    // Fetch before XP
    const char = this.getCharacter(characterId);
    if (!char) throw new Error("Character not found");
    const before = char.experience ?? 0;
    if (before < cost) throw new Error("Not enough XP");

    const after = before - cost;

    // Transaction: Subtract XP, update trait (if function given), log
    const txn = this.db.transaction(() => {
      // Subtract from character XP
      this.db.prepare("UPDATE characters SET experience = ? WHERE id = ?").run(after, characterId);

      // Optional trait upgrade/update handled by callback
      let updatedTraitValue = undefined;
      if (traitCallback) {
        updatedTraitValue = traitCallback(this, char);
      }

      const res = this.db.prepare(
        "INSERT INTO xp_ledger (character_id, type, amount, reason, trait, before_xp, after_xp) VALUES (?, 'spend', ?, ?, ?, ?, ?)"
      ).run(characterId, cost, "Improved: " + trait, trait, before, after);
      // Return new ledger entry and trait update (if any)
      return {
        ledger: this.db.prepare("SELECT * FROM xp_ledger WHERE id = ?").get(res.lastInsertRowid),
        updatedTraitValue
      };
    });

    return txn();
  }

  /**
   * Get XP transaction history for a character (awards/spends).
   */
  getXpHistory(characterId: number, limit: number = 20) {
    const stmt = this.db.prepare("SELECT * FROM xp_ledger WHERE character_id = ? ORDER BY created_at DESC, id DESC LIMIT ?");
    return stmt.all(characterId, limit);
  }

/**
   * Patch: Update oWoD fields (not D&D keys). Only allows core attributes/traits.
   * Now also allows 'experience' for XP system!
   */
  updateCharacter(id: number, updates: Record<string, any>) {
    const validKeys = [
      'name', 'concept', 'game_line', 'strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance',
      'perception', 'intelligence', 'wits', 'willpower_current', 'willpower_permanent', 'health_levels', 'power_stat_name', 'power_stat_rating', 'experience'
    ];
    const fields = Object.keys(updates).filter(k => validKeys.includes(k));
    if (fields.length === 0) return this.getCharacter(id);

    const values = fields.map(f => {
      if (f === 'health_levels' && typeof updates[f] !== 'string') {
        return JSON.stringify(updates[f]);
      }
      return updates[f];
    });

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`
      UPDATE characters
      SET ${setClause}
      WHERE id = ?
    `);

    stmt.run(...values, id);
    return this.getCharacter(id);
  }

  // --- DERANGEMENTS ---

  /**
   * Add or update a derangement for a character.
   * If a derangement with this name exists for that character, updates description.
   * Returns the resulting record.
   */
  addOrUpdateDerangement(characterId: number, derangement: string, description: string): DerangementRow {
    const upsert = this.db.prepare(`
      INSERT INTO character_derangements (character_id, derangement, description)
      VALUES (?, ?, ?)
      ON CONFLICT(character_id, derangement) DO UPDATE SET description=excluded.description
    `);
    upsert.run(characterId, derangement, description);

    const sel = this.db.prepare(
      `SELECT * FROM character_derangements WHERE character_id = ? AND derangement = ?`
    );
    return sel.get(characterId, derangement) as DerangementRow;
  }

  /**
   * Get all derangements for a character.
   */
  getDerangements(characterId: number): DerangementRow[] {
    const sel = this.db.prepare(
      `SELECT * FROM character_derangements WHERE character_id = ?`
    );
    return sel.all(characterId) as DerangementRow[];
  }

  addItem(
    characterId: number,
    item: {
      name: string;
      type: string;
      quantity?: number;
      properties?: Record<string, any>;
      equipped?: boolean;
    }
  ): { id: number; name: string; type: string; quantity?: number; properties?: Record<string, any>; equipped?: boolean } {
    const stmt = this.db.prepare(`
      INSERT INTO inventory (character_id, item_name, item_type, quantity, properties, equipped)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      characterId,
      item.name,
      item.type,
      item.quantity || 1,
      item.properties ? JSON.stringify(item.properties) : null,
      item.equipped ? 1 : 0
    );

    return { id: Number(result.lastInsertRowid), ...item };
  }
  
  getInventory(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM inventory WHERE character_id = ? ORDER BY item_type, item_name
    `);
    
    const items = stmt.all(characterId);
    return items.map((item: any) => ({
      ...item,
      properties: item.properties ? JSON.parse(item.properties as string) : null
    }));
  }

  updateItem(id: number, updates: { quantity?: number; equipped?: boolean }) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
    
    stmt.run(...values, id);
  }

  getItem(id: number) {
    const stmt = this.db.prepare('SELECT * FROM inventory WHERE id = ?');
    const item = stmt.get(id) as any;
    
    if (item && item.properties) {
      item.properties = JSON.parse(item.properties);
    }
    
    return item;
  }

  removeItem(id: number) {
    const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
    stmt.run(id);
  }

  // Story operations
  saveStoryProgress(characterId: number, data: {
    chapter: string;
    scene: string;
    description?: string;
    flags?: Record<string, any>;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO story_progress (character_id, chapter, scene, description, flags)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      characterId,
      data.chapter,
      data.scene,
      data.description || null,
      data.flags ? JSON.stringify(data.flags) : null
    );
  }

  getLatestStoryProgress(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM story_progress 
      WHERE character_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);
    
    const result = stmt.get(characterId) as any;
    if (result && result.flags) {
      result.flags = JSON.parse(result.flags as string);
      }
    return result;
  }

  // World state operations
  saveWorldState(characterId: number, data: {
    location: string;
    npcs?: Record<string, any>;
    events?: Record<string, any>;
    environment?: Record<string, any>;
  }) {
    // Check if world state exists
    const existing = this.db.prepare(
      'SELECT id FROM world_state WHERE character_id = ?'
    ).get(characterId);

    if (existing) {
      // Update existing
      const stmt = this.db.prepare(`
        UPDATE world_state 
        SET location = ?, npcs = ?, events = ?, environment = ?, last_updated = CURRENT_TIMESTAMP
        WHERE character_id = ?
      `);
      
      stmt.run(
        data.location,
        data.npcs ? JSON.stringify(data.npcs) : null,
        data.events ? JSON.stringify(data.events) : null,
        data.environment ? JSON.stringify(data.environment) : null,
        characterId
      );
    } else {
      // Insert new
      const stmt = this.db.prepare(`
        INSERT INTO world_state (character_id, location, npcs, events, environment)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        characterId,
        data.location,
        data.npcs ? JSON.stringify(data.npcs) : null,
        data.events ? JSON.stringify(data.events) : null,
        data.environment ? JSON.stringify(data.environment) : null
      );
    }
  }

  getWorldState(characterId: number) {
    const stmt = this.db.prepare('SELECT * FROM world_state WHERE character_id = ?');
    const result = stmt.get(characterId) as any;
    
    if (result) {
      if (result.npcs) result.npcs = JSON.parse(result.npcs as string);
      if (result.events) result.events = JSON.parse(result.events as string);
      if (result.environment) result.environment = JSON.parse(result.environment as string);
    }
    
    return result;
  }

  // Combat log operations
  logCombat(characterId: number, sessionId: string, action: string, result?: string) {
    const stmt = this.db.prepare(`
      INSERT INTO combat_log (character_id, session_id, action, result)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(characterId, sessionId, action, result || null);
  }

  getCombatLog(characterId: number, sessionId?: string) {
    if (sessionId) {
      const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ? AND session_id = ?
        ORDER BY timestamp
      `);
      return stmt.all(characterId, sessionId);
    } else {
      const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ?
        ORDER BY timestamp DESC
        LIMIT 50
      `);
      return stmt.all(characterId);
    }
  }

  // NPC operations
  createNPC(data: {
    name: string;
    template?: string;
    type?: string;
    customStats?: Record<string, any>;
  }) {
    let npcData: any = {
      name: data.name,
      type: data.type || 'enemy'
    };

    // Apply template if specified (oWoD antagonist templates)
    if (data.template && ANTAGONIST_TEMPLATES[data.template]) {
      const template: AntagonistSheet = ANTAGONIST_TEMPLATES[data.template];
      // Flatten and merge oWoD template structure into npcData
      npcData = {
        ...npcData,
        name: data.name, // Always use caller-provided name
        type: data.type || template.type || 'enemy',
        attributes: { ...template.attributes }, // Deep copy
        abilities: template.abilities ? JSON.parse(JSON.stringify(template.abilities)) : {},
        willpower: template.willpower,
        health_levels: { ...(template.health_levels || {}) },
        supernatural: template.supernatural ? JSON.parse(JSON.stringify(template.supernatural)) : undefined,
        description: template.description
      };
    }

    // Apply custom stats
    // Allow customStats to override any oWoD fields
    if (data.customStats) {
      // Shallow merge for high-level fields, deep merge for attribute/abilities
      if (npcData.attributes && data.customStats.attributes) {
        npcData.attributes = { ...npcData.attributes, ...data.customStats.attributes };
      }
      if (npcData.abilities && data.customStats.abilities) {
        npcData.abilities = { ...npcData.abilities, ...data.customStats.abilities };
      }
      if (data.customStats.willpower !== undefined) npcData.willpower = data.customStats.willpower;
      if (data.customStats.health_levels) {
        npcData.health_levels = { ...npcData.health_levels, ...data.customStats.health_levels };
      }
      if (data.customStats.supernatural) {
        npcData.supernatural = { ...((npcData.supernatural || {})), ...data.customStats.supernatural };
      }
      // Any other oWoD keys
      for (const k of Object.keys(data.customStats)) {
        if (!['attributes', 'abilities', 'willpower', 'health_levels', 'supernatural'].includes(k)) {
          npcData[k] = data.customStats[k];
        }
      }
    }

    // Ensure required fields
    // No D&D stat logic needed

    // oWoD default health levels system for Storyteller NPCs
    if (!npcData.health_levels || typeof npcData.health_levels !== 'object') {
      npcData.health_levels = {
        bruised: 0, hurt: 0, injured: 0, wounded: 0, mauled: 0, crippled: 0, incapacitated: 0
      };
    }

    // Calculate initiative modifier if not set
    // Initiative modifier can be set as needed (not using D&D getAbilityModifier)
    if (npcData.initiative_modifier === undefined && npcData.attributes?.dexterity != null) {
      npcData.initiative_modifier = Math.floor((npcData.attributes.dexterity - 1) / 2); // oWoD logic (scale 1–10)
    }

    // SQL insert: all columns in schema order; unused legacy (D&D) columns are set to 0/null for compatibility
    const stmt = this.db.prepare(`
      INSERT INTO npcs (
        name, type, creature_type, size,
        current_hp, max_hp, armor_class, speed,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        proficiency_bonus, initiative_modifier, attacks, abilities, conditions,
        health_levels, is_alive, challenge_rating, experience_value, template_id
      ) VALUES (
        ?, ?, ?, ?, -- name, type, creature_type, size
        0, 0, 0, 0, -- current_hp, max_hp, armor_class, speed (legacy, unused)
        ?, ?, ?, ?, ?, ?, -- strength, dexterity, constitution, intelligence, wisdom, charisma
        0, -- proficiency_bonus (legacy, unused)
        ?, -- initiative_modifier
        null, -- attacks (legacy, unused)
        ?, -- abilities (oWoD core, JSON)
        null, -- conditions (legacy, unused)
        ?, -- health_levels (oWoD core, JSON)
        1, -- is_alive (default true)
        1, -- challenge_rating (legacy, unused, dummy)
        0, -- experience_value (legacy, unused)
        ?  -- template_id
      )
    `);

    // Only relevant oWoD fields are dynamically set
    const abilitiesValue = typeof npcData.abilities === 'object' ? JSON.stringify(npcData.abilities) : npcData.abilities || null;
    const result = stmt.run(
      npcData.name,                 // name
      npcData.type,                 // type
      npcData.creature_type || null,// creature_type
      npcData.size || 'medium',     // size
      npcData.attributes?.strength ?? 1,      // strength
      npcData.attributes?.dexterity ?? 1,     // dexterity
      npcData.attributes?.stamina ?? 1,       // constitution
      npcData.attributes?.intelligence ?? 1,  // intelligence
      npcData.attributes?.wisdom ?? 1,        // wisdom
      npcData.attributes?.charisma ?? 1,      // charisma
      npcData.initiative_modifier ?? 0,       // initiative_modifier
      abilitiesValue,                         // abilities (JSON)
      JSON.stringify(npcData.health_levels),  // health_levels
      data.template || null                   // template_id
    );

    return this.getNPC(result.lastInsertRowid as number);
  }

  createNPCGroup(template: string, count: number, namePrefix?: string) {
    const npcs = [];
    const prefix = namePrefix || ANTAGONIST_TEMPLATES[template]?.name || 'NPC';
    
    for (let i = 1; i <= count; i++) {
      const npc = this.createNPC({
        name: `${prefix} ${i}`,
        template: template
      });
      npcs.push(npc);
    }
    
    return npcs;
  }

  getNPC(id: number) {
    const stmt = this.db.prepare('SELECT * FROM npcs WHERE id = ?');
    const npc = stmt.get(id) as any;
    
    if (npc) {
      // Parse JSON fields
      if (npc.attacks) npc.attacks = JSON.parse(npc.attacks);
      if (npc.abilities) npc.abilities = JSON.parse(npc.abilities);
      if (npc.conditions) npc.conditions = JSON.parse(npc.conditions);
    }
    
    if (npc && npc.health_levels) npc.health_levels = JSON.parse(npc.health_levels);

    return npc;
  }

  listNPCs(type?: string, aliveOnly: boolean = true) {
    let query = 'SELECT * FROM npcs WHERE 1=1';
    const params: any[] = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (aliveOnly) {
      query += ' AND is_alive = TRUE';
    }
    
    query += ' ORDER BY name';
    
    const stmt = this.db.prepare(query);
    const npcs = stmt.all(...params);
    
    return npcs.map((npc: any) => {
      if (npc.attacks) npc.attacks = JSON.parse(npc.attacks);
      if (npc.abilities) npc.abilities = JSON.parse(npc.abilities);
      if (npc.conditions) npc.conditions = JSON.parse(npc.conditions);
      return npc;
    });
  }

  updateNPC(id: number, updates: Record<string, any>) {
    // Map common field names to database column names
    const fieldMapping: Record<string, string> = {
      'hit_points': 'current_hp',
      'max_hit_points': 'max_hp',
      'level': 'challenge_rating', // NPCs don't have levels, use CR instead
      'special_abilities': 'abilities',
      'damage_resistances': 'abilities', // Store in abilities JSON
      'damage_immunities': 'abilities',
      'condition_immunities': 'abilities'
    };

    // Apply field mapping
    const mappedUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMapping[key] || key;
      
      // Special handling for abilities-related fields
      if (['special_abilities', 'damage_resistances', 'damage_immunities', 'condition_immunities'].includes(key)) {
        // Get existing abilities or create new object
        const existingNPC = this.getNPC(id);
        let abilities = existingNPC?.abilities || {};
        
        // If it's an array, store it properly
        if (Array.isArray(value)) {
          abilities[key] = value;
        } else if (typeof value === 'string') {
          abilities[key] = value;
        }
        
        mappedUpdates['abilities'] = abilities;
      } else {
        mappedUpdates[dbField] = value;
      }
    }

    // Handle JSON fields
    if (mappedUpdates.attacks && typeof mappedUpdates.attacks === 'object') {
      mappedUpdates.attacks = JSON.stringify(mappedUpdates.attacks);
    }
    if (mappedUpdates.abilities && typeof mappedUpdates.abilities === 'object') {
      mappedUpdates.abilities = JSON.stringify(mappedUpdates.abilities);
    }
    if (mappedUpdates.conditions && typeof mappedUpdates.conditions === 'object') {
      mappedUpdates.conditions = JSON.stringify(mappedUpdates.conditions);
    }
    
    // Filter out any invalid fields that don't exist in the database
    const validFields = [
      'name', 'type', 'creature_type', 'size', 'armor_class', 'speed',
      'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
      'proficiency_bonus', 'initiative_modifier', 'attacks', 'abilities', 'conditions',
      'is_alive', 'challenge_rating', 'experience_value', 'template_id'
    ];
    
    const filteredUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(mappedUpdates)) {
      if (validFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }
    
    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid fields provided for NPC update');
    }
    
    const fields = Object.keys(filteredUpdates);
    const values = Object.values(filteredUpdates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
    
    stmt.run(...values, id);
    return this.getNPC(id);
  }

  removeNPC(id: number) {
    const stmt = this.db.prepare('DELETE FROM npcs WHERE id = ?');
    stmt.run(id);
  }

  // Encounter operations
  createEncounter(data: {
    character_id: number;
    name: string;
    description?: string;
    environment?: string;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO encounters (character_id, name, description, environment)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.character_id,
      data.name,
      data.description || null,
      data.environment || null
    );

    return this.getEncounter(result.lastInsertRowid as number);
  }

  getEncounter(id: number) {
    // console.log(`[GameDatabase.getEncounter] Querying for encounter ID: ${id}`);
    const stmt = this.db.prepare('SELECT * FROM encounters WHERE id = ?');
    const row = stmt.get(id);
    // console.log(`[GameDatabase.getEncounter] Raw row data for ID ${id}: ${JSON.stringify(row)}`);
    return row;
  }

  getActiveEncounter(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM encounters 
      WHERE character_id = ? AND status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    return stmt.get(characterId);
  }

  addEncounterParticipant(encounterId: number, type: string, participantId: number, initiative: number) {
    const stmt = this.db.prepare(`
      INSERT INTO encounter_participants (encounter_id, participant_type, participant_id, initiative)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(encounterId, type, participantId, initiative);
    
    // Recalculate initiative order
    this.updateInitiativeOrder(encounterId);
  }

  updateInitiativeOrder(encounterId: number) {
    // Get all participants sorted by initiative (descending)
    const participants = this.db.prepare(`
      SELECT id, initiative FROM encounter_participants 
      WHERE encounter_id = ? AND is_active = TRUE
      ORDER BY initiative DESC
    `).all(encounterId) as EncounterParticipant[];
    
    // Update initiative order
    const updateStmt = this.db.prepare(`
      UPDATE encounter_participants SET initiative_order = ? WHERE id = ?
    `);
    
    participants.forEach((p: EncounterParticipant, index) => {
      updateStmt.run(index + 1, p.id);
    });
  }

  getEncounterParticipants(encounterId: number) {
    const stmt = this.db.prepare(`
      SELECT ep.*, 
        CASE 
          WHEN ep.participant_type = 'character' THEN c.name
          WHEN ep.participant_type = 'npc' THEN n.name
        END as name,
        CASE
          WHEN ep.participant_type = 'character' THEN NULL
          WHEN ep.participant_type = 'npc' THEN n.current_hp
        END as current_hp,
        CASE
          WHEN ep.participant_type = 'character' THEN NULL
          WHEN ep.participant_type = 'npc' THEN n.max_hp
        END as max_hp
      FROM encounter_participants ep
      LEFT JOIN characters c ON ep.participant_type = 'character' AND ep.participant_id = c.id
      LEFT JOIN npcs n ON ep.participant_type = 'npc' AND ep.participant_id = n.id
      WHERE ep.encounter_id = ? AND ep.is_active = TRUE
      ORDER BY ep.initiative_order
    `);
    
    return stmt.all(encounterId) as EncounterParticipant[];
  }

  nextTurn(encounterId: number): EncounterParticipant | null {
    // ----------- Tier 2: Per-turn effects and automation -----------
    // 1. Always tick down all active condition durations at start of turn
    this.tickDownConditions();

    const encounter = this.getEncounter(encounterId) as any;
    if (!encounter || encounter.status !== 'active') {
      console.log(`Encounter ${encounterId} not active or not found.`);
      return null;
    }

    let participants: EncounterParticipant[] = this.getEncounterParticipants(encounterId);
    if (participants.length === 0) {
      console.log(`No active participants in encounter ${encounterId}.`);
      return null;
    }

    // Mark current participant as having acted, if there was a current turn
    const currentTurnOrder = encounter.current_turn;
    if (currentTurnOrder > 0 && currentTurnOrder <= participants.length) {
        // Find the participant by their *current* initiative_order, which might have shifted if others became inactive
        const currentParticipantInOriginalOrder = participants.find(p => p.initiative_order === currentTurnOrder);
        if (currentParticipantInOriginalOrder && currentParticipantInOriginalOrder.is_active) {
             this.db.prepare(
                `UPDATE encounter_participants SET has_acted = TRUE WHERE id = ?`
            ).run(currentParticipantInOriginalOrder.id);
        }
    }
    
    // Determine the next turn order
    let nextTurnOrder = currentTurnOrder + 1;
    let nextParticipant: EncounterParticipant | undefined = undefined;

    // Loop to find the next *active* participant
    let attempts = 0; // Safety break for infinite loops
    while (attempts < participants.length * 2) { // Allow to loop through participants twice (for round change)
        if (nextTurnOrder > participants.length) { // End of round, start new round
            nextTurnOrder = 1;
            encounter.current_round += 1;
            
            // Reset has_acted for all *active* participants for the new round
            this.db.prepare(
                `UPDATE encounter_participants SET has_acted = FALSE WHERE encounter_id = ? AND is_active = TRUE`
            ).run(encounterId);
            // Re-fetch participants as their has_acted status changed
            participants = this.getEncounterParticipants(encounterId);
        }

        nextParticipant = participants.find(p => p.initiative_order === nextTurnOrder && p.is_active);

        if (nextParticipant) {
            break; // Found next active participant
        }
        
        nextTurnOrder++; // Try next in order
        attempts++;
    }

    if (!nextParticipant) {
      // This could happen if all participants become inactive
      console.log(`No active participant found for next turn in encounter ${encounterId}. Ending encounter.`);
      this.endEncounter(encounterId, 'stalemate'); // Or some other appropriate status
      return null;
    }

    // ---- Tier 2: Per-turn conditions, effects, and Vampire blood flow ----
    try {
      // Get current participant's type and ID
      const participantType = nextParticipant.participant_type;
      const participantId = nextParticipant.participant_id;
      // Only apply effects for living participants
      if (participantType === 'character') {
        const char = this.getCharacter(participantId) as any;
        if (char) {
          // 2. Apply turn-based condition damage/effects
          const conditions = this.getActiveConditions(participantId);
          for (const cond of conditions) {
            if (cond.effect_json && typeof cond.effect_json === 'object') {
              if (cond.effect_json.deal_damage_per_turn && Number.isFinite(cond.effect_json.deal_damage_per_turn)) {
                const amount = cond.effect_json.deal_damage_per_turn;
                this.applyHealthLevelDamage('character', participantId, amount);
                this.logCombat?.(
                  participantId,
                  'SYSTEM',
                  `Condition: ${cond.condition_name} (per-turn)`,
                  `Auto-applied ${amount} damage due to '${cond.condition_name}'`
                );
              }
              // Extend: add other per-turn triggers here (e.g. auto-healing, stat drain, etc)
            }
          }
          // 3. For Vampire: add blood point at start of turn if not incapacitated/torpor
          if (char.game_line === 'vampire' && (!char.health_levels?.incapacitated || char.health_levels?.incapacitated === 0)) {
            if (char.blood_pool_current !== undefined && char.blood_pool_max !== undefined) {
              if (char.blood_pool_current < char.blood_pool_max) {
                const newBlood = Math.min(char.blood_pool_current + 1, char.blood_pool_max);
                this.updateCharacter(participantId, { blood_pool_current: newBlood });
                this.logCombat?.(
                  participantId,
                  'SYSTEM',
                  `Vampire Regeneration`,
                  `Auto-gained 1 Blood Point at turn start`
                );
              }
            }
          }
        }
      }
      if (participantType === 'npc') {
        // If supporting per-turn status for NPCs, mirror as needed
        // e.g. tick/trigger status effects, or similar
      }
    } catch (err) {
      // Defensive: continue turn logic even if effects error out
      console.error(`[nextTurn Tier 2 logic] Error in per-turn effect logic:`, err);
    }

    // Initialize turn state and actor actions
    const initialActions = {
      actionAvailable: true,
      bonusActionAvailable: true,
      movementRemaining: 30
    };

    // Update encounter with new turn, round, and proper state management
    this.db.prepare(
        `UPDATE encounters
         SET current_turn = ?, current_round = ?, currentState = ?, currentActorActions = ?
         WHERE id = ?`
    ).run(nextTurnOrder, encounter.current_round, 'TURN_STARTED', JSON.stringify(initialActions), encounterId);
    
    // The nextParticipant object already contains all necessary details from getEncounterParticipants
    return nextParticipant;
  }

  endEncounter(id: number, outcome: string = 'completed') {
    const stmt = this.db.prepare(`
      UPDATE encounters 
      SET status = ?, ended_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(outcome, id);
  }

  /**
   * Apply Storyteller System (oWoD) Health Levels-based Damage to a Character.
   * - Advances through health_levels (bruised, hurt, injured, ..., incapacitated) as damage is applied.
   * - Each point increments the next unfilled level (order: bruised→hurt→injured→wounded→mauled→crippled→incapacitated).
   * - Stops at incapacitated.
   * Returns the updated character with computed wound penalties.
   */
  /**
   * Unified oWoD Health Levels-based Damage application for characters and NPCs.
   * targetType: 'character' | 'npc'
   * targetId: characterId or npcId
   * Returns updated target data, wound penalty, and incapacitation state.
   */
  applyHealthLevelDamage(
    targetType: 'character' | 'npc',
    targetId: number,
    damage: number
  ) {
    const healthOrder = [
      "bruised", "hurt", "injured", "wounded", "mauled", "crippled", "incapacitated"
    ] as const;
    type HealthLevel = typeof healthOrder[number];
    const maxPerLevel: Record<HealthLevel, number> = {
      bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1
    };
    let target: any = null;
    let health: Record<string, number> = {};

    if (targetType === "character") {
      target = this.getCharacter(targetId);
      if (!target) return null;
      health = { ...target.health_levels };
      if (typeof health !== 'object') {
        try { health = JSON.parse(target.health_levels); } catch { health = {}; }
      }
    } else if (targetType === "npc") {
      target = this.getNPC(targetId);
      if (!target) return null;
      health = { ...target.health_levels };
      if (typeof health !== 'object') {
        try { health = JSON.parse(target.health_levels); } catch { health = {}; }
      }
    } else {
      throw new Error("Invalid targetType for health level damage.");
    }

    // Apply damage logic (shared)
    for (let i = 0; i < damage; i++) {
      for (const level of healthOrder) {
        if ((health[level] ?? 0) < maxPerLevel[level]) {
          health[level] = (health[level] ?? 0) + 1;
          break;
        }
      }
    }
    for (const level of healthOrder) {
      if ((health[level] ?? 0) > maxPerLevel[level]) {
        health[level] = maxPerLevel[level];
      }
    }

    // Save health_levels back and handle post-damage effects
    if (targetType === "character") {
      const stmt = this.db.prepare(`
        UPDATE characters
        SET health_levels = ?
        WHERE id = ?
      `);
      stmt.run(JSON.stringify(health), targetId);

      // If incapacitated, mark as inactive in encounters
      if ((health["incapacitated"] ?? 0) >= maxPerLevel["incapacitated"]) {
        const activeEncounters = this.db.prepare(`
          SELECT encounter_id FROM encounter_participants
          WHERE participant_type = 'character' AND participant_id = ? AND is_active = TRUE
        `).all(targetId) as { encounter_id: number }[];
        for (const enc of activeEncounters) {
          this.db.prepare(`
            UPDATE encounter_participants
            SET is_active = FALSE
            WHERE participant_type = 'character' AND participant_id = ? AND encounter_id = ?
          `).run(targetId, enc.encounter_id);
          this.updateInitiativeOrder(enc.encounter_id);
        }
      }
      // Compute wound penalty for character
      const penaltyMap: Record<HealthLevel, number> = {
        bruised: 0,
        hurt: -1,
        injured: -1,
        wounded: -2,
        mauled: -2,
        crippled: -5,
        incapacitated: -99
      };
      let penalty = 0;
      for (const level of healthOrder.slice().reverse()) {
        if ((health[level] ?? 0) > 0) {
          penalty = penaltyMap[level];
          break;
        }
      }
      return {
        ...this.getCharacter(targetId),
        health_levels: health,
        wound_penalty: penalty,
        is_incapacitated: (health["incapacitated"] ?? 0) >= maxPerLevel["incapacitated"],
      };
    } else { // npc
      const stmt = this.db.prepare(`
        UPDATE npcs SET health_levels = ? WHERE id = ?
      `);
      stmt.run(JSON.stringify(health), targetId);

      // Mark is_alive = false if incapacitated for an NPC
      if ((health["incapacitated"] ?? 0) >= maxPerLevel["incapacitated"]) {
        const aliveStmt = this.db.prepare(`
          UPDATE npcs SET is_alive = FALSE WHERE id = ?
        `);
        aliveStmt.run(targetId);
      }
      return {
        ...this.getNPC(targetId),
        health_levels: health,
        is_incapacitated: (health["incapacitated"] ?? 0) >= maxPerLevel["incapacitated"],
      };
    }
  }

  // DEPRECATED: use applyHealthLevelDamage with targetType = 'character'
  // applyHealthLevelDamage(characterId: number, damage: number) { ... }
  // DEPRECATED: use applyHealthLevelDamage with targetType = 'npc'
  // applyNpcHealthLevelDamage(npcId: number, damage: number) { ... }


  // Quest Operations
  addQuest(data: {
    title: string;
    description: string;
    objectives: Record<string, any>[] | string[]; // Array of objective strings or objects
    rewards: Record<string, any>; // e.g., { gold: 100, experience: 50, items: ["item_id_1"] }
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO quests (title, description, objectives, rewards)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.title,
      data.description,
      JSON.stringify(data.objectives),
      JSON.stringify(data.rewards)
    );
    return this.getQuestById(result.lastInsertRowid as number);
  }

  getQuestById(id: number): Quest | null {
    const stmt = this.db.prepare('SELECT * FROM quests WHERE id = ?');
    const quest = stmt.get(id) as Quest | undefined;
    if (quest) {
      // objectives and rewards are stored as JSON, parse them if needed by caller
      // For now, return as stored. Parsing can be done in handler or by caller.
    }
    return quest || null;
  }

  assignQuestToCharacter(characterId: number, questId: number, status: 'active' | 'completed' | 'failed' = 'active') {
    // Check if character and quest exist
    const character = this.getCharacter(characterId);
    if (!character) throw new Error(`Character with ID ${characterId} not found.`);
    const quest = this.getQuestById(questId);
    if (!quest) throw new Error(`Quest with ID ${questId} not found.`);

    const stmt = this.db.prepare(`
      INSERT INTO character_quests (character_id, quest_id, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(character_id, quest_id) DO UPDATE SET
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
      WHERE character_quests.status != 'completed' AND character_quests.status != 'failed'
            OR excluded.status = 'active' -- Allow re-activating if previously completed/failed for some reason
    `);
    const result = stmt.run(characterId, questId, status);
    if (result.changes > 0) {
        // Need to get the ID of the inserted/updated row.
        // If it was an insert, result.lastInsertRowid works.
        // If it was an update due to conflict, we need to query it.
        const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
        const cq = cqStmt.get(characterId, questId) as { id: number } | undefined;
        return cq ? this.getCharacterQuestById(cq.id) : null;
    }
    // If no changes, it means the quest was already completed/failed and we tried to assign it as active again without override.
    // Or some other edge case. Return existing record.
    const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
    const cq = cqStmt.get(characterId, questId) as { id: number } | undefined;
    return cq ? this.getCharacterQuestById(cq.id) : null;
  }

  getCharacterQuestById(characterQuestId: number): CharacterQuest | null {
    const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.id = ?
    `);
    const cq = stmt.get(characterQuestId) as CharacterQuest | undefined;
    if (cq) {
      // Parse JSON fields
      if (cq.objectives) cq.objectives = JSON.parse(cq.objectives as string);
      if (cq.rewards) cq.rewards = JSON.parse(cq.rewards as string);
      if (cq.progress) cq.progress = JSON.parse(cq.progress as string);
    }
    return cq || null;
  }

  getCharacterActiveQuests(characterId: number): CharacterQuest[] {
    const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.character_id = ? AND cq.status = 'active'
      ORDER BY cq.assigned_at DESC
    `);
    const quests = stmt.all(characterId) as CharacterQuest[];
    return quests.map(q => {
      if (q.objectives) q.objectives = JSON.parse(q.objectives as string);
      if (q.rewards) q.rewards = JSON.parse(q.rewards as string);
      if (q.progress) q.progress = JSON.parse(q.progress as string);
      return q;
    });
  }

  updateCharacterQuestStatus(characterQuestId: number, status: 'active' | 'completed' | 'failed', progress?: Record<string, any> | null) {
    const fieldsToUpdate: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [status];

    if (progress !== undefined) {
      fieldsToUpdate.push('progress = ?');
      values.push(progress ? JSON.stringify(progress) : null);
    // REMOVE Phase 2 - Derangement Records for Characters, and prototype extensions here!
    }
    values.push(characterQuestId);

    const stmt = this.db.prepare(`
      UPDATE character_quests
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = ?
    `);
    const result = stmt.run(...values);
}

  // Conditions
  addOrUpdateCondition(
    characterId: number,
    conditionName: string,
    duration: number | null,
    effect: any
  ): ConditionRow {
    const upsert = this.db.prepare(`
      INSERT INTO character_conditions (character_id, condition_name, duration, effect_json)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(character_id, condition_name)
      DO UPDATE SET duration = excluded.duration, effect_json = excluded.effect_json
    `);
    upsert.run(characterId, conditionName, duration, effect ? JSON.stringify(effect) : null);

    const sel = this.db.prepare(
      `SELECT * FROM character_conditions WHERE character_id = ? AND condition_name = ?`
    );
    const row = sel.get(characterId, conditionName) as any;
    if (row && typeof row.effect_json === 'string') row.effect_json = JSON.parse(row.effect_json);
    return row as ConditionRow;
  }


  // Derangements
}
````

## File: README.md
````markdown
# 🎯 RPG MCP Servers - Advanced D&D 5e Combat & Game State Management

**The most advanced MCP server suite for AI-powered D&D experiences!** Features 3D spatial combat, ASCII battlefield visualization, and complete character management.

## 🚀 **Latest Major Updates**

### 🗺️ **NEW: ASCII Battlefield Visualization**
```
📍 **BATTLEFIELD MAP** (X→, Y↓):

 0│· · · · · · · · · · · · · · · 
 1│· · · · · · · · · · · · · · · 
 2│· · · · · · · · █ · · · · · · 
 3│· · · · · · · · █ · · · · · · 
 4│· · · · · ≡ ≡ · █ · · · · · · 
 5│· · · · · ≡ L · █ · · · · · · 
 6│· · · K · · · · · · · · · · · 
 7│· · · · · · · · · · · · · · · 
 8│· · · · · · · · · · · · S · · 
 9│· · · · · · · · · · · · · · · 
  └0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 

**LEGEND**: █=wall, ■=pillar, ≡=stairs, Letters=creatures
```

### ⚔️ **NEW: 3D Spatial Combat Engine**
- **Elevation System**: Stairs, pillars, flying creatures
- **Line of Sight**: Ray-casting with cover calculation  
- **Opportunity Attacks**: Movement validation
- **Flanking Detection**: Tactical positioning bonuses
- **Area Effect Targeting**: Spell geometry and targeting

### 🧠 **NEW: Human-Readable Tactical Intelligence**
```
🎯 **Lyra Swiftarrow** is standing on stairs at coordinates (6,5,5).

⚔️ **ENEMIES IN SIGHT**: 
  Kael Ironshield (25ft close) - clear shot, 
  Stone Gargoyle (38ft medium) - clear shot

🏃 **MOVEMENT OPTIONS**: pillar (32ft away), wall (12ft away)
```

### 🔧 **Enhanced Features**
- **Fixed dice notation**: `2d20kh1` (advantage) and `2d20kl1` (disadvantage)
- **Complete turn management**: Actions, bonus actions, movement, reactions
- **Enhanced inventory**: Full item management with equipped status
- **Monster/NPC system**: Template-based creature creation
- **Story & Quest management**: Progress tracking and objectives
- **Bug fixes**: Battlefield initialization now preserves creatures

## 🏗️ **Project Architecture**

- **game-state-server/**: SQLite-based persistent character sheets, inventory, encounters
- **combat-engine-server/**: Advanced 3D spatial combat with D&D 5e mechanics

## 🎮 **Key Features**

### 📊 **Complete Character Management**
- **Character Sheets**: Full D&D 5e stats (STR, DEX, CON, INT, WIS, CHA)
- **Inventory System**: Items, equipment, quantities, equipped status
- **World State**: Location tracking, NPC relationships, environmental data
- **Story Progress**: Chapter/checkpoint tracking with narrative summaries

### ⚔️ **Advanced Combat System**
- **3D Battlefield**: X, Y, Z positioning with terrain features
- **Turn Management**: Initiative order, action economy tracking
- **Spatial Intelligence**: Distance calculation, movement validation
- **Tactical Analysis**: Flanking, cover, height advantage detection
- **Visual Combat Maps**: ASCII battlefield visualization

### 🎲 **D&D 5e Mechanics**
- **Complete Dice System**: All standard dice with advantage/disadvantage
- **Combat Actions**: Attack rolls, damage, saving throws, spell effects
- **Movement Rules**: Speed limits, opportunity attacks, difficult terrain
- **Area Effects**: Spells with proper geometry (spheres, cones, lines)

## 🛠️ **Prerequisites**

**Roo Code Installation Required:**
- Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)
- Or via CLI: `code --install-extension RooVeterinaryInc.roo-cline`
- Configure AI provider (OpenAI, Anthropic, etc.)
- Visit [Roo Code docs](https://docs.roocode.com) for setup details

## 🚀 **Quick Setup**

### 1. **Install & Build Servers**
```bash
# Game State Server
cd game-state-server
npm install && npm run build

# Combat Engine Server  
cd ../combat-engine-server
npm install && npm run build
```

### 2. **Configure Environment** (Optional)
Create `.env` files in each server directory:

**game-state-server/.env:**
```
DATABASE_PATH=./data/my_rpg.db
PORT=3001
```

**combat-engine-server/.env:**
```
PORT=3002
```

### 3. **Start Servers**
```bash
# Terminal 1
cd game-state-server && npm start

# Terminal 2  
cd combat-engine-server && npm start
```

### 4. **Configure Roo Code MCP Settings**

Add to your `mcp_settings.json` (typically at `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`):

```json
{
  "mcpServers": {
    "rpg-game-state": {
      "name": "rpg-game-state-server",
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "create_character", "get_character", "get_character_by_name", "list_characters", "update_character",
        "add_item", "get_inventory", "remove_item", "update_item",
        "save_world_state", "get_world_state", "update_world_state",
        "create_npc", "create_npc_group", "get_npc", "list_npcs", "update_npc", "remove_npc",
        "create_encounter", "add_to_encounter", "get_encounter_state", "get_active_encounter",
        "start_turn", "end_turn", "next_turn", "consume_action", "end_encounter", "apply_damage",
        "save_story_progress", "add_quest", "get_active_quests", "update_quest_state", "assign_quest_to_character"
      ]
    },
    "rpg-combat-engine": {
      "name": "rpg-combat-engine-server", 
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "roll_dice", "roll_check", "attack_roll", "initiative_roll", "damage_roll", "saving_throw",
        "use_reaction", "use_legendary_action", "trigger_lair_action", "execute_multiattack",
        "initialize_battlefield", "place_creature", "move_creature", "check_line_of_sight",
        "get_area_effect_targets", "get_tactical_summary", "check_flanking", "check_height_advantage",
        "describe_battlefield", "describe_detailed_tactical_situation", "generate_battlefield_map",
        "get_combat_log", "clear_combat_log"
      ]
    }
  }
}
```

**📝 Note**: Replace `PATH_TO_YOUR_PROJECT` with your actual path (e.g., `C:/projects/rpg-mcp-servers`).

## 🎯 **Usage Examples**

### **Create a Character**
```javascript
// Creates a new D&D character with full stats
create_character({
  name: "Lyra Swiftarrow",
  class: "Ranger", 
  stats: { strength: 14, dexterity: 18, constitution: 16, intelligence: 12, wisdom: 15, charisma: 10 }
})
```

### **Setup 3D Combat**
```javascript
// Initialize battlefield with terrain
initialize_battlefield({
  width: 15, height: 12,
  terrain: [
    { type: "wall", position: {x: 8, y: 2, z: 0}, dimensions: {width: 1, height: 4, depth: 5} },
    { type: "stairs", position: {x: 5, y: 4, z: 0}, dimensions: {width: 2, height: 2, depth: 5} }
  ]
})

// Place creatures in 3D space
place_creature({
  creature_id: "ranger_lyra", name: "Lyra Swiftarrow",
  x: 6, y: 5, z: 5, size: "medium", speed: 30, reach: 5
})

// Get tactical situation
describe_detailed_tactical_situation({ creature_id: "ranger_lyra" })
```

### **Generate Visual Map**
```javascript
// Creates ASCII battlefield visualization
generate_battlefield_map()
```

### **Advanced Combat Mechanics**
```javascript
// Roll with advantage
roll_dice({ notation: "2d20kh1+5", reason: "Attack with advantage" })

// Check line of sight with cover
check_line_of_sight({ from_creature: "ranger_lyra", to_creature: "goblin_1" })

// Validate movement with opportunity attacks
move_creature({ creature_id: "fighter_kael", target_x: 10, target_y: 8, speed: 25 })
```

## 🔧 **Advanced Features**

### **🎲 Dice System**
- Standard D&D notation: `1d20+5`, `3d6`, `1d8+3`
- Advantage/Disadvantage: `2d20kh1+5`, `2d20kl1+5`
- Critical hits: Automatic damage doubling
- Custom modifiers: Situational bonuses

### **⚔️ Combat Mechanics**
- **Initiative**: Automatic turn order management
- **Action Economy**: Actions, bonus actions, movement, reactions
- **Opportunity Attacks**: Movement validation and triggering
- **Area Effects**: Spell targeting with geometric calculations
- **Cover & Concealment**: Line of sight with partial cover

### **🗺️ Spatial Intelligence**
- **3D Positioning**: Full X, Y, Z coordinate system
- **Terrain Features**: Walls, pillars, stairs, pits, doors
- **Movement Validation**: Pathfinding with obstacle avoidance
- **Tactical Analysis**: Flanking, height advantage, reach calculations

## 🎮 **Integration with AI Dungeon**

Perfect for integration with the [AI Dungeon Experiment](https://github.com/Mnehmos/AI-Dungeon-Experiment):

1. **Create custom Roo Code modes** for Dungeon Master AI
2. **Leverage MCP tools** for consistent mechanics
3. **Maintain persistent state** across gaming sessions  
4. **Generate tactical descriptions** for AI narrative integration

## 🎯 **What Makes This Special**

- ✅ **Visual Combat Maps**: ASCII battlefield with terrain and creatures
- ✅ **True 3D Combat**: Elevation, flying, multilevel encounters  
- ✅ **Human-Readable**: Tactical descriptions perfect for AI integration
- ✅ **Complete D&D 5e**: Full rules implementation with persistent state
- ✅ **AI-Optimized**: Designed specifically for LLM-powered gameplay
- ✅ **Production Ready**: Robust error handling and state management

## 🚀 **Get Started**

Ready to create the ultimate AI-powered D&D experience? Clone this repository and follow the setup instructions above. Within minutes, you'll have a complete RPG system with visual combat maps and advanced tactical intelligence!

---

**🎲 Happy adventuring with AI-powered D&D!** 🐉
````

## File: game-state-server/src/index.ts
````typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GameDatabase } from './db.js';
import { formatSheetByGameLine } from './characterSheets.js';

// Initialize database
const db = new GameDatabase();

// Create server
const server = new Server({
  name: 'rpg-game-state-server',
  version: '2.0.0',
}, {
  capabilities: { 
    tools: {},
  },
});

// Enhanced tool definitions with complete action economy and spatial features
const toolDefinitions = [
  // Character Management
  {
    name: 'add_derangement',
    description: 'Add or update a derangement/mental state for a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character' },
        derangement: { type: 'string', description: 'The name of the derangement or condition (e.g., "Paranoia")' },
        description: { type: 'string', description: 'Description of the derangement effect or manifestation' }
      },
      required: ['character_id', 'derangement', 'description']
    }
  },
  {
    name: 'create_character',
    description: 'Create a new World of Darkness (Storyteller System) character',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Character name' },
        concept: { type: 'string', description: 'Archetype, e.g. Outcast, Visionary' },
        game_line: { type: 'string', enum: ['vampire','werewolf','changeling','mage'], description: 'WoD game line' },
        strength: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        dexterity: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        stamina: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        charisma: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        manipulation: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        appearance: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        perception: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        intelligence: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        wits: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        willpower_current: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        willpower_permanent: { type: 'number', minimum: 1, maximum: 10, default: 1 },
        power_stat_name: { type: 'string', description: 'e.g. Blood, Gnosis, Glamour, Arete' },
        power_stat_rating: { type: 'number', minimum: 1, maximum: 10 },
        health_levels: { type: 'object', description: 'Custom health level map (bruised, hurt, etc.)' },
        abilities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ability_name: { type: 'string' },
              ability_type: { type: 'string', enum: ['Talent', 'Skill', 'Knowledge'] },
              rating: { type: 'number', minimum: 0, maximum: 5 },
              specialty: { type: 'string' }
            },
            required: ['ability_name', 'ability_type']
          }
        },
        disciplines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              discipline_name: { type: 'string' },
              rating: { type: 'number', minimum: 0, maximum: 5 }
            },
            required: ['discipline_name']
          }
        },
        arts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              art_name: { type: 'string' },
              rating: { type: 'number', minimum: 0, maximum: 5 }
            },
            required: ['art_name']
          }
        },
        realms: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              realm_name: { type: 'string' },
              rating: { type: 'number', minimum: 0, maximum: 5 }
            },
            required: ['realm_name']
          }
        },
        gifts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              gift_name: { type: 'string' },
              rank: { type: 'number', minimum: 1, maximum: 5 }
            },
            required: ['gift_name']
          }
        },
        spheres: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sphere_name: { type: 'string' },
              rating: { type: 'number', minimum: 0, maximum: 5 }
            },
            required: ['sphere_name']
          }
        }
      },
      required: ['name', 'game_line']
    }
  },
  {
    name: 'get_character',
    description: 'Get character information',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'update_character',
    description: 'Update character stats',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        updates: { type: 'object' }
      },
      required: ['character_id', 'updates']
    }
  },
  {
    name: 'list_characters',
    description: 'List all characters',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_character_by_name',
    description: 'Get character by name',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    }
  },
  
  // Inventory Management
  {
    name: 'add_item',
    description: 'Add one or more items to a character\'s inventory',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              item_name: { type: 'string' },
              item_type: { type: 'string' },
              quantity: { type: 'number', default: 1 },
              properties: { type: 'object', default: {} }
            },
            required: ['item_name']
          }
        }
      },
      required: ['character_id', 'items']
    }
  },
  {
    name: 'get_inventory',
    description: 'Get character inventory',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'remove_item',
    description: 'Remove one or more items from inventory by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        item_ids: {
          type: 'array',
          items: { type: 'number' }
        }
      },
      required: ['item_ids']
    }
  },
  {
    name: 'update_item',
    description: 'Update item quantity or equipped status',
    inputSchema: {
      type: 'object',
      properties: {
        item_id: { type: 'number' },
        quantity: { type: 'number' },
        equipped: { type: 'boolean' }
      },
      required: ['item_id']
    }
  },

  // World State Management
  {
    name: 'save_world_state',
    description: 'Save the current world state',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        location: { type: 'string' },
        npcs: { type: 'object' },
        events: { type: 'object' },
        environment: { type: 'object' }
      },
      required: ['character_id', 'location']
    }
  },
  {
    name: 'get_world_state',
    description: 'Get the current world state',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'update_world_state',
    description: 'Update the current world state for a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        location: { type: 'string' },
        npcs: { type: 'object' },
        events: { type: 'object' },
        environment: { type: 'object' }
      },
      required: ['character_id', 'location']
    }
  },

  // Enhanced NPC Management
  {
    name: 'create_npc',
    description: 'Create a new NPC or enemy',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        template: { type: 'string', description: 'Use an oWoD antagonist preset: e.g., First-Gen Vampire, Street Thug, Bane Spirit, Technocracy Agent.' },
        type: {
          type: 'string',
          enum: ['enemy', 'ally', 'neutral']
        },
        customStats: { type: 'object', description: 'Override oWoD template stats (attributes, abilities, willpower, etc)' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_npc_group',
    description: 'Create multiple identical NPCs',
    inputSchema: {
      type: 'object',
      properties: {
        template: { type: 'string' },
        count: { type: 'number' },
        namePrefix: { type: 'string' }
      },
      required: ['template', 'count']
    }
  },
  {
    name: 'get_npc',
    description: 'Get NPC information',
    inputSchema: {
      type: 'object',
      properties: {
        npc_id: { type: 'number' }
      },
      required: ['npc_id']
    }
  },
  {
    name: 'list_npcs',
    description: 'List all NPCs',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['enemy', 'ally', 'neutral']
        },
        aliveOnly: { type: 'boolean' }
      }
    }
  },
  {
    name: 'update_npc',
    description: 'Update NPC stats. Valid fields: name, type, creature_type, size, current_hp, max_hp, armor_class, speed, strength, dexterity, constitution, intelligence, wisdom, charisma, proficiency_bonus, initiative_modifier, attacks, abilities, conditions, challenge_rating, experience_value. Also accepts: hit_points->current_hp, max_hit_points->max_hp, level->challenge_rating, special_abilities->abilities',
    inputSchema: {
      type: 'object',
      properties: {
        npc_id: { type: 'number' },
        updates: {
          type: 'object',
          description: 'Object containing field updates. Use current_hp/max_hp instead of hit_points/max_hit_points, challenge_rating instead of level'
        }
      },
      required: ['npc_id', 'updates']
    }
  },
  {
    name: 'remove_npc',
    description: 'Remove NPC from game',
    inputSchema: {
      type: 'object',
      properties: {
        npc_id: { type: 'number' }
      },
      required: ['npc_id']
    }
  },

  // Enhanced Encounter Management
  {
    name: 'create_encounter',
    description: 'Start a new combat encounter',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        environment: { type: 'string' }
      },
      required: ['character_id', 'name']
    }
  },
  {
    name: 'add_to_encounter',
    description: 'Add participants to encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' },
        participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['character', 'npc']
              },
              id: { type: 'number' },
              initiative: { type: 'number' }
            }
          }
        }
      },
      required: ['encounter_id', 'participants']
    }
  },
  {
    name: 'get_encounter_state',
    description: 'Get current encounter status',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'next_turn',
    description: 'Advance to next turn in initiative',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'end_encounter',
    description: 'End the current encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' },
        outcome: {
          type: 'string',
          enum: ['victory', 'fled', 'defeat']
        }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'apply_damage',
    description: 'Apply damage to character or NPC',
    inputSchema: {
      type: 'object',
      properties: {
        target_type: {
          type: 'string',
          enum: ['character', 'npc']
        },
        target_id: { type: 'number' },
        damage: { type: 'number' }
      },
      required: ['target_type', 'target_id', 'damage']
    }
  },
  {
    name: 'get_active_encounter',
    description: 'Get the active encounter for a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },

  // Enhanced Turn Management
  {
    name: 'start_turn',
    description: 'Start a turn for the current actor in an encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'end_turn',
    description: 'End the current turn in an encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'consume_action',
    description: 'Consume an action for the current actor',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' },
        action_type: {
          type: 'string',
          enum: ['action', 'bonus_action', 'movement']
        }
      },
      required: ['encounter_id', 'action_type']
    }
  },

  // Story Progress Management
  {
    name: 'save_story_progress',
    description: 'Save story progress checkpoint for a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character whose progress is being saved.' },
        chapter: { type: 'string', description: 'Current chapter of the story.' },
        checkpoint: { type: 'string', description: 'Specific checkpoint within the chapter.' },
        summary: { type: 'string', description: 'A brief summary of the events at this checkpoint.' }
      },
      required: ['character_id', 'chapter', 'checkpoint', 'summary']
    }
  },

  // Quest Management
  {
    name: 'add_quest',
    description: 'Add a new quest to the game master list',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the quest' },
        description: { type: 'string', description: 'Detailed description of the quest' },
        objectives: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of objectives for the quest (e.g., ["Defeat the dragon", "Retrieve the artifact"])'
        },
        rewards: {
          type: 'object',
          properties: {
            gold: { type: 'number' },
            experience: { type: 'number' },
            items: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of item names or IDs'
            }
          },
          description: 'Rewards for completing the quest'
        }
      },
      required: ['title', 'description', 'objectives', 'rewards']
    }
  },
  {
    name: 'get_active_quests',
    description: 'Get all active quests for a specific character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'update_quest_state',
    description: 'Update the status or progress of a character\'s quest',
    inputSchema: {
      type: 'object',
      properties: {
        character_quest_id: { type: 'number', description: 'ID of the character-quest link (from character_quests table)' },
        status: {
          type: 'string',
          enum: ['active', 'completed', 'failed'],
          description: 'New status of the quest'
        },
        progress: {
          type: 'object',
          additionalProperties: true,
          description: 'JSON object detailing progress on specific objectives (optional)'
        }
      },
      required: ['character_quest_id', 'status']
    }
  },
  {
    name: 'assign_quest_to_character',
    description: 'Assign an existing quest to a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character' },
        quest_id: { type: 'number', description: 'ID of the quest to assign' },
        status: {
          type: 'string',
          enum: ['active', 'completed', 'failed'],
          default: 'active',
          description: 'Initial status of the quest for the character'
        }
      },
      required: ['character_id', 'quest_id']
    }
  },
  // Batch Operations for Efficiency
  {
    name: 'batch_create_npcs',
    description: 'Create multiple NPCs at once',
    inputSchema: {
      type: 'object',
      properties: {
        npcs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              template: { type: 'string', description: 'Use a preset: goblin, orc, skeleton, etc.' },
              type: {
                type: 'string',
                enum: ['enemy', 'ally', 'neutral']
              },
              customStats: { type: 'object', description: 'Override template stats' }
            },
            required: ['name']
          }
        }
      },
      required: ['npcs']
    }
  },
  {
    name: 'batch_update_npcs',
    description: 'Update multiple NPCs at once',
    inputSchema: {
      type: 'object',
      properties: {
        updates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              npc_id: { type: 'number' },
              updates: { type: 'object' }
            },
            required: ['npc_id', 'updates']
          }
        }
      },
      required: ['updates']
    }
  },
  {
    name: 'batch_apply_damage',
    description: 'Apply damage to multiple targets at once',
    inputSchema: {
      type: 'object',
      properties: {
        targets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              target_type: {
                type: 'string',
                enum: ['character', 'npc']
              },
              target_id: { type: 'number' },
              damage: { type: 'number' }
            },
            required: ['target_type', 'target_id', 'damage']
          }
        }
      },
      required: ['targets']
    }
  },
  {
    name: 'batch_remove_npcs',
    description: 'Remove multiple NPCs at once',
    inputSchema: {
      type: 'object',
      properties: {
        npc_ids: {
          type: 'array',
          items: { type: 'number' }
        }
      },
      required: ['npc_ids']
    }
  }, // end of batch_remove_npcs
  {
    name: 'spend_willpower',
    description: 'Spend temporary willpower point from a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        amount: { type: 'number', default: 1 }
      },
      required: ['character_id']
    }
  },
  {
    name: 'spend_blood',
    description: 'Spend blood points (Vampire)',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        amount: { type: 'number', default: 1 }
      },
      required: ['character_id']
    }
  },
  {
    name: 'spend_gnosis',
    description: 'Spend gnosis points (Werewolf)',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        amount: { type: 'number', default: 1 }
      },
      required: ['character_id']
    }
  },
  {
    name: 'spend_glamour',
    description: 'Spend glamour points (Changeling)',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        amount: { type: 'number', default: 1 }
      },
      required: ['character_id']
    }
  },
  {
    name: 'spend_arete',
    description: 'Spend Arete points (Mage)',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        amount: { type: 'number', default: 1 }
      },
      required: ['character_id']
    }
  }
,
// -------------- Tier 3: Conditions & Status Effects Tools -----------------
{
  name: 'add_condition',
  description: 'Add or update a condition or status effect for a character',
  inputSchema: {
    type: 'object',
    properties: {
      character_id: { type: 'number', description: 'ID of the character' },
      name: { type: 'string', description: 'Condition or status effect name (e.g. "Blinded", "Paralyzed")' },
      duration: { type: 'number', description: 'Duration in rounds or turns, or null for indefinite', nullable: true },
      effect: { type: 'object', description: 'JSON details of the effect, e.g., modifier, source, etc.', additionalProperties: true }
    },
    required: ['character_id', 'name']
  }
},
{
  name: 'get_active_conditions',
  description: "Get all active conditions for a character",
  inputSchema: {
    type: 'object',
    properties: {
      character_id: { type: 'number', description: 'ID of the character' }
    },
    required: ['character_id']
  }
},
{
  name: 'tick_down_conditions',
  description: 'Reduce durations of all conditions by 1 and remove expired',
  inputSchema: {
    type: 'object',
    properties: {},
    additionalProperties: false
  }
},
  ,
  // ----- Tier 3 XP: Ledger/Award/Spend Tools -----
  {
    name: 'award_xp',
    description: 'Award experience points to a character, recorded in the XP ledger',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character' },
        amount: { type: 'number', description: 'How much XP to give (must be positive int)' },
        reason: { type: 'string', description: 'Narrative or system reason for XP' }
      },
      required: ['character_id', 'amount', 'reason']
    }
  },
  {
    name: 'spend_xp',
    description: 'Spend XP to upgrade a trait (uses oWoD cost rules, e.g., attr: new_rating x5, abl: new_rating x2)',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character' },
        trait: { type: 'string', description: 'Trait key (e.g., "dexterity", "brawl")' },
        new_rating: { type: 'number', description: 'The new (desired) rating' }
      },
      required: ['character_id', 'trait', 'new_rating']
    }
  }
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      // --- Tier 3: XP Ledger ---
      case 'award_xp': {
        // Validate input
        const { character_id, amount, reason } = args as any;
        try {
          const ledger = db.awardXp(character_id, amount, reason);
          return {
            content: [{ type: 'text', text: `⭐ XP awarded to character #${character_id}: +${amount} XP (${reason})\n\nLedger entry: ${JSON.stringify(ledger)}` }]
          };
        } catch (e: any) {
          return {
            content: [{ type: 'text', text: `❌ Award XP failed: ${e.message}` }],
            isError: true
          };
        }
      }
      case 'spend_xp': {
        const { character_id, trait, new_rating } = args as any;
        // Fetch character and verify trait
        const char = db.getCharacter(character_id) as any;
        if (!char) return { content: [{ type: 'text', text: `❌ Character not found` }], isError: true };
        let current = char[trait];
        if (typeof current !== 'number') current = 0;
        if (!Number.isFinite(new_rating) || new_rating <= current) {
          return { content: [{ type: 'text', text: `❌ Invalid new rating (must be higher than current: ${current})` }], isError: true };
        }
        // Determine cost by oWoD rules
        let cost = 0;
        // Sample rule: attributes: new_rating x5, abilities: new_rating x2; Default: new_rating x4;
        const attributeTraits = [
          'strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception', 'intelligence', 'wits'
        ];
        const abilityTraits = (char.abilities || []).map((ab: any) => ab.ability_name) ?? [];
        if (attributeTraits.includes(trait.toLowerCase())) {
          cost = new_rating * 5;
        } else if (abilityTraits.includes(trait)) {
          cost = new_rating * 2;
        } else {
          // Fallback: Disciplines, other traits, etc
          cost = new_rating * 4;
        }
        let ledgerRes;
        try {
          ledgerRes = db.spendXp(character_id, trait, cost, (dbi: any, _char: any) => {
            // Actually update the trait to new_rating
            dbi.updateCharacter(character_id, { [trait]: new_rating });
            return new_rating;
          });
        } catch (e: any) {
          return { content: [{ type: 'text', text: `❌ Spend XP failed: ${e.message}` }], isError: true };
        }
        return {
          content: [{ type: 'text', text: `⭐ XP spent to raise ${trait} from ${current} → ${new_rating} at cost ${cost} XP\n\nLedger: ${JSON.stringify(ledgerRes.ledger)}` }]
        };
      }
      // Character management
      case 'create_character': {
        // Flexible: spread all top-level properties, merge abilities/secondaries from args
        const core = { ...args };
        if (args.stats) Object.assign(core, args.stats);
        // Remove D&D-only keys for data layer, accept all oWoD keys (safe to ignore extras)
        delete core.class; delete core.race; delete core.background; delete core.alignment; delete core.level;
        // Optional game feature arrays
        if (args.disciplines && Array.isArray(args.disciplines) && core.game_line === 'vampire') {
          // will insert after main row below
        }
        if (args.arts && Array.isArray(args.arts) && core.game_line === 'changeling') {
          // will insert after main row below
        }
        if (args.realms && Array.isArray(args.realms) && core.game_line === 'changeling') {
          // will insert after main row below
        }
        if (args.gifts && Array.isArray(args.gifts) && core.game_line === 'werewolf') {
          // will insert after main row below
        }
        if (args.spheres && Array.isArray(args.spheres) && core.game_line === 'mage') {
          // will insert after main row below
        }
        // Create the character core/abilities (feature secondaries are handled below)
        const character = db.createCharacter(core) as any;
        // Insert feature secondaries
        if (args.disciplines && Array.isArray(args.disciplines) && core.game_line === 'vampire') {
          const stmt = db['db'].prepare('INSERT INTO character_disciplines (character_id, discipline_name, rating) VALUES (?, ?, ?)');
          for (const d of args.disciplines) {
            stmt.run(character.id, d.discipline_name, d.rating ?? 0);
          }
        }
        if (args.arts && Array.isArray(args.arts) && core.game_line === 'changeling') {
          const stmt = db['db'].prepare('INSERT INTO character_arts (character_id, art_name, rating) VALUES (?, ?, ?)');
          for (const a of args.arts) {
            stmt.run(character.id, a.art_name, a.rating ?? 0);
          }
        }
        if (args.realms && Array.isArray(args.realms) && core.game_line === 'changeling') {
          const stmt = db['db'].prepare('INSERT INTO character_realms (character_id, realm_name, rating) VALUES (?, ?, ?)');
          for (const r of args.realms) {
            stmt.run(character.id, r.realm_name, r.rating ?? 0);
          }
        }
        if (args.gifts && Array.isArray(args.gifts) && core.game_line === 'werewolf') {
          const stmt = db['db'].prepare('INSERT INTO character_gifts (character_id, gift_name, rank) VALUES (?, ?, ?)');
          for (const g of args.gifts) {
            stmt.run(character.id, g.gift_name, g.rank ?? 0);
          }
        }
        if (args.spheres && Array.isArray(args.spheres) && core.game_line === 'mage') {
          const stmt = db['db'].prepare('INSERT INTO character_spheres (character_id, sphere_name, rating) VALUES (?, ?, ?)');
          for (const s of args.spheres) {
            stmt.run(character.id, s.sphere_name, s.rating ?? 0);
          }
        }
        // After creation and feature rows, return with game-aware joins as current get_character does
        const outChar = db.getCharacter(character.id);
        let extra: Record<string, any> = {};
        if (outChar) {
          if (outChar.game_line === 'vampire') {
            const stmt = db['db'].prepare('SELECT discipline_name, rating FROM character_disciplines WHERE character_id = ?');
            extra = { disciplines: stmt.all(outChar.id) };
          }
          if (outChar.game_line === 'changeling') {
            const arts = db['db'].prepare('SELECT art_name, rating FROM character_arts WHERE character_id = ?').all(outChar.id);
            const realms = db['db'].prepare('SELECT realm_name, rating FROM character_realms WHERE character_id = ?').all(outChar.id);
            extra = { arts, realms };
          }
          if (outChar.game_line === 'werewolf') {
            const stmt = db['db'].prepare('SELECT gift_name, rank FROM character_gifts WHERE character_id = ?');
            extra = { gifts: stmt.all(outChar.id) };
          }
          if (outChar.game_line === 'mage') {
            const stmt = db['db'].prepare('SELECT sphere_name, rating FROM character_spheres WHERE character_id = ?');
            extra = { spheres: stmt.all(outChar.id) };
          }
        }
        const output = {
          ...outChar,
          ...extra,
        };

        return {
          content: [
            { type: 'text', text: `📝 CHARACTER CREATED (JSON):\n\`\`\`json\n${JSON.stringify(output, null, 2)}\n\`\`\`` }
          ]
        };
      }

      case 'get_character': {
        const character = db.getCharacter((args as any).character_id) as any;
        if (!character) {
          return {
            content: [{ type: 'text', text: '❌ Character not found!' }]
          };
        }

        // Gather game-line-specific joins
        let extra: Record<string, any> = {};
        if (character.game_line === 'vampire') {
          const stmt = db['db'].prepare('SELECT discipline_name, rating FROM character_disciplines WHERE character_id = ?');
          extra = { disciplines: stmt.all(character.id) };
        }
        if (character.game_line === 'changeling') {
          const arts = db['db'].prepare('SELECT art_name, rating FROM character_arts WHERE character_id = ?').all(character.id);
          const realms = db['db'].prepare('SELECT realm_name, rating FROM character_realms WHERE character_id = ?').all(character.id);
          extra = { arts, realms };
        }
        if (character.game_line === 'werewolf') {
          const stmt = db['db'].prepare('SELECT gift_name, rank FROM character_gifts WHERE character_id = ?');
          extra = { gifts: stmt.all(character.id) };
        }
        if (character.game_line === 'mage') {
          const stmt = db['db'].prepare('SELECT sphere_name, rating FROM character_spheres WHERE character_id = ?');
          extra = { spheres: stmt.all(character.id) };
        }

        // ------- DERANGEMENTS -------
        const derangements = db.getDerangements(character.id);

        // --- Formatted Character Sheet (oWoD format) ---
        // Name/Concept/Line
        let sheet = `🎲 World of Darkness Character Sheet\n\n`;
        sheet += `👤 Name: ${character.name}\n`;
        sheet += character.concept ? `🧠 Concept: ${character.concept}\n` : '';
        sheet += `🗂️  Game Line: ${character.game_line.charAt(0).toUpperCase() + character.game_line.slice(1)}\n`;

        // Mental State
        if (derangements?.length) {
          sheet += `🧠 Mental State / Derangements:\n`;
          derangements.forEach((d, idx) => {
            sheet += `  - ${d.derangement}${d.description ? `: ${d.description}` : ""}\n`;
          });
        }

        // Tier 3: Conditions / Status Effects
        const conditions = db.getActiveConditions(character.id);
        if (conditions?.length) {
          sheet += `🦠 Conditions / Status Effects:\n`;
          conditions.forEach((c: any, idx: number) => {
            sheet += `  - ${c.condition_name}`;
            if (c.duration !== null && c.duration !== undefined) sheet += ` [${c.duration} rounds left]`;
            if (c.effect_json) sheet += `: ${typeof c.effect_json === 'object' ? JSON.stringify(c.effect_json) : c.effect_json}`;
            sheet += `\n`;
          });
        }

        sheet += `\n────────────── ATTRIBUTES ──────────────\n`;
        sheet += `💪 Strength: ${character.strength}\n🏃 Dexterity: ${character.dexterity}\n❤️ Stamina: ${character.stamina}\n`;
        sheet += `🎭 Charisma: ${character.charisma}\n🗣️ Manipulation: ${character.manipulation}\n🌟 Appearance: ${character.appearance}\n`;
        sheet += `👁️ Perception: ${character.perception}\n🧠 Intelligence: ${character.intelligence}\n⚡ Wits: ${character.wits}\n`;
        sheet += `\n────────────── ABILITIES ──────────────\n`;
        if (character.abilities?.length) {
          sheet += character.abilities.map((ab: any) =>
            `  - ${ab.ability_type}: ${ab.ability_name} (${ab.rating}${ab.specialty ? `, ${ab.specialty}` : ''})`
          ).join('\n') + '\n';
        } else {
          sheet += '  (none recorded)\n';
        }
        sheet += '\n────────────── CORE TRAITS ──────────────\n';
        sheet += `🔵 Willpower: ${character.willpower_current}/${character.willpower_permanent}\n`;

        if (character.power_stat_name && character.power_stat_rating !== undefined) {
          sheet += `🪄 ${character.power_stat_name}: ${character.power_stat_rating}\n`;
        }
        // Health Levels
        sheet += '❤️ Health Levels:\n';
        let healthLevels = character.health_levels || {};
        let healthOrder = ["bruised","hurt","injured","wounded","mauled","crippled","incapacitated"];
        for (const level of healthOrder) {
          let filled = (healthLevels[level] || 0) > 0 ? 'X' : '_';
          sheet += `  ${level.charAt(0).toUpperCase() + level.slice(1)}: ${filled}\n`;
        }
        // Game-specific secondaries
        if (character.game_line === 'vampire' && extra['disciplines']) {
          sheet += "\n🩸 Disciplines:\n";
          for (const d of extra['disciplines']) {
            sheet += `  - ${d.discipline_name}: ${d.rating}\n`;
          }
          sheet += `Blood Pool: ${character.blood_pool_current || 0}/${character.blood_pool_max || 0}, Humanity: ${character.humanity || ''}\n`;
        }
        if (character.game_line === 'changeling' && (extra['arts'] || extra['realms'])) {
          sheet += "\n✨ Arts:\n";
          for (const a of extra['arts'] || []) {
            sheet += `  - ${a.art_name}: ${a.rating}\n`;
          }
          sheet += "🌐 Realms:\n";
          for (const r of extra['realms'] || []) {
            sheet += `  - ${r.realm_name}: ${r.rating}\n`;
          }
          sheet += `Glamour: ${character.glamour_current || 0}/${character.glamour_permanent || 0}, Banality: ${character.banality_permanent || 0}\n`;
        }
        if (character.game_line === 'werewolf' && extra['gifts']) {
          sheet += "\n🐺 Gifts:\n";
          for (const g of extra['gifts']) {
            sheet += `  - ${g.gift_name} (Rank ${g.rank})\n`;
          }
          sheet += `Rage: ${character.rage_current || 0}, Gnosis: ${character.gnosis_current || 0}, Renown: Glory ${character.renown_glory || 0}, Honor ${character.renown_honor || 0}, Wisdom ${character.renown_wisdom || 0}\n`;
        }
        if (character.game_line === 'mage' && extra['spheres']) {
          sheet += "\n🕯️ Spheres:\n";
          for (const s of extra['spheres']) {
            sheet += `  - ${s.sphere_name}: ${s.rating}\n`;
          }
          sheet += `Arete: ${character.arete || 0}, Quintessence: ${character.quintessence || 0}, Paradox: ${character.paradox || 0}\n`;
        }

        return {
          content: [
            { type: 'text', text: sheet }
          ]
        };
      }

      case 'update_character': {
        const character = db.updateCharacter((args as any).character_id, (args as any).updates) as any;
        const output = `✅ CHARACTER UPDATED!

👤 ${character.name} - ${character.class}

📊 CURRENT STATS:
💪 Strength: ${character.strength || 10}     🧠 Intelligence: ${character.intelligence || 10}
🏃 Dexterity: ${character.dexterity || 10}    🧙 Wisdom: ${character.wisdom || 10}
❤️ Constitution: ${character.constitution || 10}  ✨ Charisma: ${character.charisma || 10}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'list_characters': {
        const characters = db.listCharacters() as any[];
        if (characters.length === 0) {
          return {
            content: [{ type: 'text', text: '📋 NO CHARACTERS FOUND\n\nCreate your first character to begin your adventure! 🎭✨' }]
          };
        }
        
        let output = '📋 CHARACTER ROSTER\n\n';
        characters.forEach((char: any, index: number) => {
          output += `${index + 1}. 👤 ${char.name} (${char.class}) - ID: ${char.id}\n`;
        });
        output += `\n📊 Total Characters: ${characters.length}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_character_by_name': {
        const character = db.getCharacterByName((args as any).name) as any;
        if (!character) {
          return {
            content: [{ type: 'text', text: `❌ No character found with name "${(args as any).name}"` }]
          };
        }

        // Calculate ability modifiers
        const getModifier = (score: number) => Math.floor((score - 10) / 2);
        const formatModifier = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;
        
        // Calculate proficiency bonus based on level
        const level = character.level || 1;
        const profBonus = Math.ceil(level / 4) + 1;
        
        // Calculate derived stats
        const strMod = getModifier(character.strength || 10);
        const dexMod = getModifier(character.dexterity || 10);
        const conMod = getModifier(character.constitution || 10);
        const intMod = getModifier(character.intelligence || 10);
        const wisMod = getModifier(character.wisdom || 10);
        const chaMod = getModifier(character.charisma || 10);
        
        const initiative = dexMod;
        const speed = 30; // Default human speed
        
        const output = `🎭 D&D 5E CHARACTER SHEET

═══════════════════════════════════════════════════════════════
👤 ${character.name}                                    🆔 ID: ${character.id}
🏛️ Class: ${character.class}                           📊 Level: ${level}
🧬 Race: ${character.race || 'Human'}                  ⚖️ Alignment: ${character.alignment || 'Neutral'}
📚 Background: ${character.background || 'Folk Hero'}
═══════════════════════════════════════════════════════════════

💪 ABILITY SCORES & MODIFIERS:
┌──────────────┬──────────────┬──────────────┐
│ 💪 STR: ${String(character.strength || 10).padStart(2)} (${formatModifier(strMod).padStart(3)}) │ 🧠 INT: ${String(character.intelligence || 10).padStart(2)} (${formatModifier(intMod).padStart(3)}) │ 🎯 Prof Bonus: ${formatModifier(profBonus).padStart(3)} │
│ 🏃 DEX: ${String(character.dexterity || 10).padStart(2)} (${formatModifier(dexMod).padStart(3)}) │ 🧙 WIS: ${String(character.wisdom || 10).padStart(2)} (${formatModifier(wisMod).padStart(3)}) │ 🏃 Initiative: ${formatModifier(initiative).padStart(3)} │
│ ❤️ CON: ${String(character.constitution || 10).padStart(2)} (${formatModifier(conMod).padStart(3)}) │ ✨ CHA: ${String(character.charisma || 10).padStart(2)} (${formatModifier(chaMod).padStart(3)}) │ 🦶 Speed: ${speed} ft      │
└──────────────┴──────────────┴──────────────┘

⚔️ COMBAT STATS:
┌────────────────────────────────────────────────────────────┐
│ 🛡️ Armor Class: ${String(character.armor_class || 10).padStart(2)}                              │
│ ❤️ Hit Points: ${String(character.current_hp || character.max_hp || 10).padStart(3)}/${String(character.max_hp || 10).padStart(3)}                            │
│ 🎲 Hit Dice: ${level}d${character.class === 'Wizard' ? '6' : character.class === 'Rogue' ? '8' : character.class === 'Fighter' ? '10' : character.class === 'Barbarian' ? '12' : '8'} (${level} remaining)                     │
│ ⭐ Experience: ${String(character.experience || 0).padStart(6)} XP                         │
│ 💰 Gold: ${String(character.gold || 0).padStart(8)} gp                              │
└────────────────────────────────────────────────────────────┘

🛡️ SAVING THROWS:
┌─────────────────────────────────────────────────────────────┐
│ 💪 Strength:     ${formatModifier(strMod).padStart(3)}  │ 🧠 Intelligence: ${formatModifier(intMod).padStart(3)}  │
│ 🏃 Dexterity:    ${formatModifier(dexMod).padStart(3)}  │ 🧙 Wisdom:       ${formatModifier(wisMod).padStart(3)}  │
│ ❤️ Constitution: ${formatModifier(conMod).padStart(3)}  │ ✨ Charisma:     ${formatModifier(chaMod).padStart(3)}  │
└─────────────────────────────────────────────────────────────┘

🎯 SKILLS:
┌─────────────────────────────────────────────────────────────┐
│ 🤸 Acrobatics (Dex):    ${formatModifier(dexMod).padStart(3)}  │ 🌿 Nature (Int):        ${formatModifier(intMod).padStart(3)}  │
│ 🐾 Animal Handling (Wis): ${formatModifier(wisMod).padStart(3)}  │ 👁️ Perception (Wis):    ${formatModifier(wisMod).padStart(3)}  │
│ 🏛️ Arcana (Int):        ${formatModifier(intMod).padStart(3)}  │ 🎭 Performance (Cha):   ${formatModifier(chaMod).padStart(3)}  │
│ 💪 Athletics (Str):     ${formatModifier(strMod).padStart(3)}  │ 🗣️ Persuasion (Cha):    ${formatModifier(chaMod).padStart(3)}  │
│ 😈 Deception (Cha):     ${formatModifier(chaMod).padStart(3)}  │ 🙏 Religion (Int):      ${formatModifier(intMod).padStart(3)}  │
│ 📚 History (Int):       ${formatModifier(intMod).padStart(3)}  │ 🤫 Sleight of Hand (Dex): ${formatModifier(dexMod).padStart(3)}  │
│ 🔍 Insight (Wis):       ${formatModifier(wisMod).padStart(3)}  │ 👤 Stealth (Dex):       ${formatModifier(dexMod).padStart(3)}  │
│ 😠 Intimidation (Cha):  ${formatModifier(chaMod).padStart(3)}  │ 🏕️ Survival (Wis):      ${formatModifier(wisMod).padStart(3)}  │
│ 🔬 Investigation (Int): ${formatModifier(intMod).padStart(3)}  │ 🩺 Medicine (Wis):      ${formatModifier(wisMod).padStart(3)}  │
└─────────────────────────────────────────────────────────────┘

📅 CHARACTER INFO:
┌─────────────────────────────────────────────────────────────┐
│ 🎂 Created: ${new Date(character.created_at).toLocaleDateString().padEnd(12)} │ 🎮 Last Played: ${new Date(character.last_played).toLocaleDateString().padEnd(12)} │
└─────────────────────────────────────────────────────────────┘

🎒 Use 'get_inventory' to view equipment and items`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Inventory management
      case 'add_item': {
        const { character_id, items } = args as any;
        const numCharacterId = Number(character_id);
        
        // Get character name
        const character = db.getCharacter(numCharacterId) as any;
        const characterName = character ? character.name : 'Unknown Character';
        
        const addedItems = [];
        
        for (const item of items) {
          // Transform MCP schema to database schema with proper defaults
          const dbItem = {
            name: item.item_name,
            type: item.item_type || 'misc',
            quantity: item.quantity || 1,
            properties: item.properties || null,
            equipped: item.equipped || false
          };
          const itemId = db.addItem(numCharacterId, dbItem);
          addedItems.push({ id: itemId, ...item });
        }
        
        let output = `🎒 ${(characterName || 'UNKNOWN').toUpperCase()}'S INVENTORY UPDATED!\n\n`;
        addedItems.forEach((item: any) => {
          const equippedText = item.equipped ? ' 🔥(EQUIPPED)' : '';
          const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
          output += `📦 ${item.item_name}${quantityText}${equippedText}\n`;
          if (item.item_type) output += `   📋 Type: ${item.item_type}\n`;
        });
        
        if (addedItems.length === 1) {
          output += `\n✅ ${characterName} acquired the ${addedItems[0].item_name}!`;
        } else {
          output += `\n✅ ${characterName} acquired ${addedItems.length} new items!`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_inventory': {
        const inventory = db.getInventory((args as any).character_id) as any[];
        if (!inventory || inventory.length === 0) {
          return {
            content: [{ type: 'text', text: '🎒 INVENTORY EMPTY\n\nThis character has no items yet. Time to go adventuring! 🗡️✨' }]
          };
        }
        
        let output = '🎒 INVENTORY\n\n';
        let totalItems = 0;
        let equippedCount = 0;
        
        inventory.forEach((item: any, index: number) => {
          const equippedText = item.equipped ? ' 🔥(EQUIPPED)' : '';
          const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
          output += `${index + 1}. 📦 ${item.item_name}${quantityText}${equippedText}\n`;
          if (item.item_type) output += `    📋 Type: ${item.item_type}\n`;
          totalItems += item.quantity || 1;
          if (item.equipped) equippedCount++;
        });
        
        output += `\n📊 SUMMARY:\n`;
        output += `📦 Total Items: ${totalItems}\n`;
        output += `🔥 Equipped: ${equippedCount}\n`;
        output += `🎒 Unique Items: ${inventory.length}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'remove_item': {
        const { item_ids } = args as any;
        
        // Get item details before removing them
        const itemsToRemove = [];
        let characterName = 'Unknown Character';
        
        for (const itemId of item_ids) {
          const item = db.getItem(itemId);
          if (item) {
            itemsToRemove.push(item);
            // Get character name from the first item
            if (characterName === 'Unknown Character' && item.character_id) {
              const character = db.getCharacter(item.character_id) as any;
              if (character) characterName = character.name;
            }
          }
          db.removeItem(itemId);
        }
        
        let output = `🗑️ ${(characterName || 'UNKNOWN').toUpperCase()}'S INVENTORY UPDATED!\n\n`;
        
        if (itemsToRemove.length === 1) {
          output += `✅ ${characterName} discarded the ${itemsToRemove[0].item_name}`;
        } else if (itemsToRemove.length > 1) {
          output += `✅ ${characterName} discarded ${itemsToRemove.length} items:\n`;
          itemsToRemove.forEach((item: any) => {
            const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
            output += `   📦 ${item.item_name}${quantityText}\n`;
          });
        } else {
          output += `✅ Items removed from inventory`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'update_item': {
        const { item_id, ...updates } = args as any;
        
        // Get the item and character details
        const item = db.getItem(item_id);
        const itemName = item ? item.item_name : `Item ${item_id}`;
        
        // Get character name if we have the item
        let characterName = 'Unknown Character';
        if (item && item.character_id) {
          const character = db.getCharacter(item.character_id) as any;
          if (character) characterName = character.name;
        }
        
        // Handle boolean conversion for equipped field
        if ('equipped' in updates && typeof updates.equipped === 'boolean') {
          updates.equipped = updates.equipped ? 1 : 0;
        }
        db.updateItem(item_id, updates);
        
        let output = `✅ ${(itemName || 'UNKNOWN').toUpperCase()} UPDATED!\n\n`;
        
        if (updates.quantity !== undefined) {
          output += `📊 Quantity updated to: ${updates.quantity}\n`;
        }
        if ('equipped' in updates) {
          const isEquipped = updates.equipped === 1 || updates.equipped === true;
          if (isEquipped) {
            output += `🔥 ${characterName} equipped the ${itemName}\n`;
          } else {
            output += `🔥 ${characterName} unequipped the ${itemName}\n`;
          }
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // World state management
      case 'save_world_state': {
        const { character_id, location, npcs, events, environment } = args as any;
        
        try {
          db.saveWorldState(character_id, args as any);
          
          let output = `🌍 WORLD STATE SAVED!\n\n`;
          output += `👤 Character ID: ${character_id}\n`;
          output += `📍 Location: ${location}\n`;
          
          if (npcs && Object.keys(npcs).length > 0) {
            output += `👥 NPCs: ${Object.keys(npcs).length} tracked\n`;
          }
          
          if (events && Object.keys(events).length > 0) {
            output += `📚 Events: ${Object.keys(events).length} recorded\n`;
          }
          
          if (environment && Object.keys(environment).length > 0) {
            output += `🌿 Environment: ${Object.keys(environment).length} details saved\n`;
          }
          
          output += `\n💾 Saved: ${new Date().toLocaleString()}\n`;
          output += `✅ World state successfully preserved!`;
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } catch (error: any) {
          return {
            content: [{ type: 'text', text: `❌ SAVE FAILED\n\nError saving world state: ${error.message}\n\n💡 Make sure the character ID exists and try again.` }],
            isError: true
          };
        }
      }

      case 'get_world_state': {
        const character_id = (args as any).character_id;
        
        try {
          const state = db.getWorldState(character_id);
          
          if (!state) {
            return {
              content: [{ type: 'text', text: `🌍 NO WORLD STATE FOUND\n\nNo saved world state for character ID ${character_id}.\n\n💡 Use 'save_world_state' to create the first save!` }]
            };
          }
          
          let output = `🌍 WORLD STATE\n\n`;
          output += `👤 Character ID: ${character_id}\n`;
          output += `📍 Current Location: ${state.location || 'Unknown'}\n`;
          output += `📅 Last Updated: ${state.updated_at ? new Date(state.updated_at).toLocaleString() : 'Unknown'}\n\n`;
          
          if (state.npcs) {
            const npcData = typeof state.npcs === 'string' ? JSON.parse(state.npcs) : state.npcs;
            const npcCount = Object.keys(npcData).length;
            output += `👥 NPCs TRACKED: ${npcCount}\n`;
            if (npcCount > 0) {
              const npcNames = Object.keys(npcData).slice(0, 5);
              output += `   📋 Recent: ${npcNames.join(', ')}${npcCount > 5 ? '...' : ''}\n`;
            }
          }
          
          if (state.events) {
            const eventData = typeof state.events === 'string' ? JSON.parse(state.events) : state.events;
            const eventCount = Object.keys(eventData).length;
            output += `📚 EVENTS RECORDED: ${eventCount}\n`;
          }
          
          if (state.environment) {
            const envData = typeof state.environment === 'string' ? JSON.parse(state.environment) : state.environment;
            const envCount = Object.keys(envData).length;
            output += `🌿 ENVIRONMENT DETAILS: ${envCount} tracked elements\n`;
          }
          
          output += `\n📊 RAW DATA:\n\`\`\`json\n${JSON.stringify(state, null, 2)}\n\`\`\``;
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } catch (error: any) {
          return {
            content: [{ type: 'text', text: `❌ ERROR RETRIEVING WORLD STATE\n\nError: ${error.message}\n\n💡 Check that the character ID is valid.` }],
            isError: true
          };
        }
      }

      case 'update_world_state': {
        const { character_id, location, npcs, events, environment } = args as any;
        
        try {
          db.saveWorldState(character_id, args as any);
          
          let output = `🔄 WORLD STATE UPDATED!\n\n`;
          output += `👤 Character ID: ${character_id}\n`;
          output += `📍 New Location: ${location}\n`;
          
          const changes = [];
          if (npcs) changes.push('NPCs');
          if (events) changes.push('Events');
          if (environment) changes.push('Environment');
          
          if (changes.length > 0) {
            output += `📝 Updated: ${changes.join(', ')}\n`;
          }
          
          output += `\n💾 Updated: ${new Date().toLocaleString()}\n`;
          output += `✅ World state successfully updated!`;
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } catch (error: any) {
          return {
            content: [{ type: 'text', text: `❌ UPDATE FAILED\n\nError updating world state: ${error.message}\n\n💡 Make sure the character ID exists and try again.` }],
            isError: true
          };
        }
      }

      // Enhanced NPC management
      case 'create_npc': {
        const npc = db.createNPC(args as any) as any;
        const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
        const output = `${typeIcon} NEW NPC CREATED!

🏷️ ${npc.name} (${npc.template || 'Custom'})
📋 Type: ${npc.type || 'neutral'}
🆔 NPC ID: ${npc.id}

⚔️ COMBAT STATS:
❤️ HP: ${npc.current_hp || 'N/A'}    🛡️ AC: ${npc.armor_class || 'N/A'}
💪 STR: ${npc.strength || 10}  🧠 INT: ${npc.intelligence || 10}
🏃 DEX: ${npc.dexterity || 10}  🧙 WIS: ${npc.wisdom || 10}
❤️ CON: ${npc.constitution || 10}  ✨ CHA: ${npc.charisma || 10}

✅ Ready for encounters!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'create_npc_group': {
        const { template, count, namePrefix = '' } = args as any;
        const npcs = db.createNPCGroup(template, count, namePrefix) as any[];
        
        let output = `👥 NPC GROUP CREATED!\n\n`;
        output += `📋 Template: ${template}\n`;
        output += `🔢 Count: ${count}\n\n`;
        output += `CREATED NPCs:\n`;
        
        npcs.forEach((npc: any, index: number) => {
          const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
          output += `${index + 1}. ${typeIcon} ${npc.name} (ID: ${npc.id})\n`;
        });
        
        output += `\n✅ Successfully created ${count} ${template}s!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_npc': {
        const npc = db.getNPC((args as any).npc_id) as any;
        if (!npc) {
          return {
            content: [{ type: 'text', text: '❌ NPC not found!' }]
          };
        }
        
        const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
        const aliveStatus = npc.current_hp <= 0 ? '💀 DEAD' : npc.current_hp < (npc.max_hp || npc.current_hp) / 2 ? '🩸 WOUNDED' : '💚 HEALTHY';
        
        const output = `${typeIcon} NPC DETAILS

🏷️ ${npc.name} (${npc.template || 'Custom'})
📋 Type: ${npc.type || 'neutral'}
🩺 Status: ${aliveStatus}
🆔 NPC ID: ${npc.id}

⚔️ COMBAT STATS:
❤️ HP: ${npc.current_hp}${npc.max_hp ? `/${npc.max_hp}` : ''}    🛡️ AC: ${npc.armor_class || 'N/A'}
💪 STR: ${npc.strength || 10}  🧠 INT: ${npc.intelligence || 10}
🏃 DEX: ${npc.dexterity || 10}  🧙 WIS: ${npc.wisdom || 10}
❤️ CON: ${npc.constitution || 10}  ✨ CHA: ${npc.charisma || 10}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'list_npcs': {
        const npcs = db.listNPCs((args as any).type, (args as any).aliveOnly) as any[];
        if (!npcs || npcs.length === 0) {
          return {
            content: [{ type: 'text', text: '👥 NO NPCs FOUND\n\nCreate some NPCs to populate your world! 🌍✨' }]
          };
        }
        
        let output = '👥 NPC ROSTER\n\n';
        let enemyCount = 0, allyCount = 0, neutralCount = 0;
        
        npcs.forEach((npc: any, index: number) => {
          const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
          const aliveStatus = npc.current_hp <= 0 ? '💀' : npc.current_hp < (npc.max_hp || npc.current_hp) / 2 ? '🩸' : '💚';
          
          output += `${index + 1}. ${typeIcon} ${npc.name} ${aliveStatus} (ID: ${npc.id})\n`;
          output += `    📋 ${npc.template || 'Custom'} | ❤️ ${npc.current_hp}HP\n`;
          
          if (npc.type === 'enemy') enemyCount++;
          else if (npc.type === 'ally') allyCount++;
          else neutralCount++;
        });
        
        output += `\n📊 SUMMARY:\n`;
        output += `👹 Enemies: ${enemyCount}  🤝 Allies: ${allyCount}  🧑 Neutral: ${neutralCount}\n`;
        output += `📋 Total NPCs: ${npcs.length}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'update_npc': {
        const npc = db.updateNPC((args as any).npc_id, (args as any).updates) as any;
        const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
        
        const output = `✅ NPC UPDATED!

${typeIcon} ${npc.name} (${npc.template || 'Custom'})

⚔️ CURRENT STATS:
❤️ HP: ${npc.current_hp}${npc.max_hp ? `/${npc.max_hp}` : ''}    🛡️ AC: ${npc.armor_class || 'N/A'}
💪 STR: ${npc.strength || 10}  🧠 INT: ${npc.intelligence || 10}
🏃 DEX: ${npc.dexterity || 10}  🧙 WIS: ${npc.wisdom || 10}
❤️ CON: ${npc.constitution || 10}  ✨ CHA: ${npc.charisma || 10}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'remove_npc': {
        db.removeNPC((args as any).npc_id);
        return {
          content: [{ type: 'text', text: '🗑️ NPC REMOVED!\n\n✅ NPC has been successfully removed from the world.' }]
        };
      }

      // Enhanced encounter management
      case 'create_encounter': {
        const encounter = db.createEncounter(args as any) as any;
        const output = `⚔️ NEW ENCOUNTER CREATED!

🏷️ ${encounter.name}
📜 Description: ${encounter.description || 'No description provided'}
🌍 Environment: ${encounter.environment || 'Unknown location'}
🆔 Encounter ID: ${encounter.id}
📅 Started: ${new Date().toLocaleString()}

⏳ STATUS: Waiting for participants...
🎲 Use 'add_to_encounter' to add characters and NPCs!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'add_to_encounter': {
        const { encounter_id, participants } = args as any;
        const addedParticipants = [];
        
        for (const participant of participants) {
          const participantId = db.addEncounterParticipant(
            encounter_id,
            participant.type,
            participant.id,
            participant.initiative
          );
          addedParticipants.push({ participantId, ...participant });
        }
        
        let output = `🎲 PARTICIPANTS ADDED TO ENCOUNTER!\n\n`;
        addedParticipants.forEach((p: any, index: number) => {
          const typeIcon = p.type === 'character' ? '🎭' : p.type === 'npc' ? '👹' : '🧑';
          output += `${index + 1}. ${typeIcon} ${(p.type ? p.type.toUpperCase() : 'CHARACTER')} (ID: ${p.id}) - Initiative: ${p.initiative}\n`;
        });
        
        // Sort by initiative to show turn order
        const sorted = [...addedParticipants].sort((a, b) => b.initiative - a.initiative);
        output += `\n🎯 INITIATIVE ORDER:\n`;
        sorted.forEach((p: any, index: number) => {
          const typeIcon = p.type === 'character' ? '🎭' : '👹';
          output += `${index + 1}. ${typeIcon} Initiative ${p.initiative} - ${(p.type ? p.type.toUpperCase() : 'CHARACTER')} ${p.id}\n`;
        });
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_encounter_state': {
        const encounter = db.getEncounter((args as any).encounter_id) as any;
        const participants = db.getEncounterParticipants((args as any).encounter_id) as any[];
        
        if (!encounter) {
          return {
            content: [{ type: 'text', text: '❌ Encounter not found!' }]
          };
        }
        
        let output = `⚔️ ENCOUNTER STATUS\n\n`;
        output += `🏷️ ${encounter.name}\n`;
        output += `📜 ${encounter.description || 'No description'}\n`;
        output += `🌍 Location: ${encounter.environment || 'Unknown'}\n`;
        output += `📊 Status: ${encounter.status || 'Active'}\n`;
        output += `🕒 Round: ${encounter.current_round || 1}\n`;
        output += `👤 Current Turn: ${encounter.current_turn || 'Not started'}\n\n`;
        
        if (participants && participants.length > 0) {
          output += `🎯 PARTICIPANTS:\n`;
          const sorted = participants.sort((a: any, b: any) => b.initiative - a.initiative);
          sorted.forEach((p: any, index: number) => {
            const typeIcon = p.participant_type === 'character' ? '🎭' : '👹';
            const current = p.initiative_order === encounter.current_turn ? ' 👈 CURRENT TURN' : '';
            const participantType = (p.participant_type || 'unknown').toUpperCase();
            output += `${index + 1}. ${typeIcon} Initiative ${p.initiative} - ${(participantType ? participantType.toUpperCase() : 'CHARACTER')} ${p.participant_id}${current}\n`;
          });
        } else {
          output += `❓ No participants yet - add some with 'add_to_encounter'!`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'next_turn': {
        const currentParticipant = db.nextTurn((args as any).encounter_id) as any;
        const typeIcon = currentParticipant?.type === 'character' ? '🎭' : '👹';
        
        const output = `🎯 TURN ADVANCED!

${typeIcon} CURRENT TURN: ${(currentParticipant?.type ? currentParticipant.type.toUpperCase() : 'CHARACTER')} ${currentParticipant?.id || 'Unknown'}
🎲 Initiative: ${currentParticipant?.initiative || 'N/A'}

⚡ Ready for action! What will they do?`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'end_encounter': {
        db.endEncounter((args as any).encounter_id, (args as any).outcome);
        const outcomeIcon = (args as any).outcome === 'victory' ? '🏆' : (args as any).outcome === 'fled' ? '🏃‍♂️' : '💀';
        
        const output = `${outcomeIcon} ENCOUNTER ENDED!

📊 OUTCOME: ${((args as any).outcome || 'UNKNOWN').toUpperCase()}
🕒 DURATION: ${new Date().toLocaleString()}

${(args as any).outcome === 'victory' ? '🎉 Victory! Well fought!' :
  (args as any).outcome === 'fled' ? '💨 Tactical retreat - live to fight another day!' :
  '💀 Defeat... but heroes never truly die!'}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'apply_damage': {
        const { target_type, target_id, damage } = args as any;
        let output = '';
        let targetName = `${(target_type || 'UNKNOWN').toUpperCase()} ${target_id}`;
        let typeIcon = target_type === 'character' ? '🎭' : '👹';
        // Unified: always use applyHealthLevelDamage
        let result: any = null;
        try {
          result = db.applyHealthLevelDamage(target_type, target_id, damage);
        } catch (e: any) {
          output = `❌ ${e.message || 'Error applying damage.'}`;
          return { content: [{ type: 'text', text: output }] };
        }

        if (target_type === 'character') {
          const char = db.getCharacter(target_id) as any;
          if (char) targetName = char.name || targetName;
          // Summarize wound state
          let woundStates = result?.health_levels
            ? Object.entries(result.health_levels)
                .filter(([k, v]) => Number(v) > 0)
                .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}${' '.repeat(12 - k.length)}: ${'X'.repeat(Number(v))}`)
                .join('\n')
            : '';
          output = `💥 DAMAGE APPLIED!
        
${typeIcon} TARGET: ${targetName}
⚔️ DAMAGE: ${damage} health levels
🩸 WOUNDS:
${woundStates || 'Unhurt'}
${result?.is_incapacitated ? '\n💀 INCAPACITATED!' : result?.wound_penalty < 0 ? `\n🩹 PENALTY: ${result?.wound_penalty}` : '\n💪 No wound penalties yet.'}`;
        } else if (target_type === 'npc') {
          const npc = db.getNPC(target_id) as any;
          if (!npc) {
            output = `❌ NPC with ID ${target_id} not found.`;
          } else {
            let woundStates = result?.health_levels
              ? Object.entries(result.health_levels)
                  .filter(([k, v]) => Number(v) > 0)
                  .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}${' '.repeat(12 - k.length)}: ${'X'.repeat(Number(v))}`)
                  .join('\n')
              : '';
            const hpStatus = result?.is_incapacitated ? '💀 DEAD' : woundStates ? '🩸 WOUNDED' : '💚 HEALTHY';
            targetName = npc.name;
            output = `💥 DAMAGE APPLIED!
${typeIcon} TARGET: ${targetName}
⚔️ DAMAGE: ${damage} health levels
🩸 WOUNDS:
${woundStates || 'Unhurt'}
${result?.is_incapacitated ? '\n💀 INCAPACITATED!' : '\n' + hpStatus}`;
          }
        } else {
          output = `❌ Invalid target_type: must be "character" or "npc".`;
        }
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_active_encounter': {
        const encounter = db.getActiveEncounter((args as any).character_id) as any;
        if (encounter) {
          const participants = db.getEncounterParticipants(encounter.id) as any[];
          
          let output = `⚔️ ACTIVE ENCOUNTER\n\n`;
          output += `🏷️ ${encounter.name}\n`;
          output += `📜 ${encounter.description || 'No description'}\n`;
          output += `🌍 Location: ${encounter.environment || 'Unknown'}\n`;
          output += `🕒 Round: ${encounter.current_round || 1}\n\n`;
          
          if (participants && participants.length > 0) {
            output += `🎯 INITIATIVE ORDER:\n`;
            const sorted = participants.sort((a: any, b: any) => b.initiative - a.initiative);
            sorted.forEach((p: any, index: number) => {
              const typeIcon = p.type === 'character' ? '🎭' : '👹';
              const current = p.id === encounter.current_turn ? ' 👈 CURRENT TURN' : '';
              output += `${index + 1}. ${typeIcon} Initiative ${p.initiative} - ${(p.type ? p.type.toUpperCase() : 'CHARACTER')} ${p.id}${current}\n`;
            });
          }
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } else {
          return {
            content: [{ type: 'text', text: '🕊️ NO ACTIVE ENCOUNTER\n\nCharacter is currently out of combat. Use "create_encounter" to start a new battle!' }]
          };
        }
      }

      // Enhanced turn management
      case 'start_turn': {
        return {
          content: [{ type: 'text', text: '▶️ TURN STARTED!\n\n⚡ Ready for action! Choose your moves wisely.' }]
        };
      }

      case 'end_turn': {
        return {
          content: [{ type: 'text', text: '⏹️ TURN ENDED!\n\n🔄 Turn complete. Initiative moves to the next participant.' }]
        };
      }

      case 'consume_action': {
        const actionType = (args as any).action_type;
        const actionIcons: any = {
          action: '⚔️',
          bonus_action: '✨',
          movement: '🏃'
        };
        
        const output = `${actionIcons[actionType] || '⚡'} ${(actionType || 'UNKNOWN').toUpperCase().replace('_', ' ')} CONSUMED!\n\n🎯 Action used this turn.`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Story progress management
      case 'save_story_progress': {
        const { character_id, chapter, checkpoint, summary } = args as any;
        db.saveStoryProgress(character_id, {
          chapter,
          scene: checkpoint,
          description: summary
        });
        
        const output = `📖 STORY PROGRESS SAVED!

📚 Chapter: ${chapter}
🔖 Checkpoint: ${checkpoint}
📝 Summary: ${summary}
💾 Saved: ${new Date().toLocaleString()}

✅ Your adventure continues!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Quest management
      case 'add_quest': {
        const quest = db.addQuest(args as any) as any;
        
        let output = `🎯 NEW QUEST ADDED!\n\n`;
        output += `📜 ${quest.title}\n`;
        output += `📋 ${quest.description}\n\n`;
        
        output += `🎯 OBJECTIVES:\n`;
        if (quest.objectives && Array.isArray(quest.objectives)) {
          quest.objectives.forEach((obj: string, index: number) => {
            output += `${index + 1}. ☐ ${obj}\n`;
          });
        }
        
        output += `\n🏆 REWARDS:\n`;
        if (quest.rewards) {
          if (quest.rewards.gold) output += `💰 Gold: ${quest.rewards.gold}\n`;
          if (quest.rewards.experience) output += `⭐ Experience: ${quest.rewards.experience}\n`;
          if (quest.rewards.items && quest.rewards.items.length > 0) {
            output += `🎁 Items: ${quest.rewards.items.join(', ')}\n`;
          }
        }
        
        output += `\n🆔 Quest ID: ${quest.id}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_active_quests': {
        const quests = db.getCharacterActiveQuests((args as any).character_id) as any[];
        
        if (!quests || quests.length === 0) {
          return {
            content: [{ type: 'text', text: '📜 NO ACTIVE QUESTS\n\nThis character has no active quests. Time to find some adventure! 🗺️✨' }]
          };
        }
        
        let output = '📜 ACTIVE QUESTS\n\n';
        
        quests.forEach((quest: any, index: number) => {
          const statusIcon = quest.status === 'completed' ? '✅' : quest.status === 'failed' ? '❌' : '🔄';
          output += `${index + 1}. ${statusIcon} ${quest.title}\n`;
          output += `    📋 ${quest.description}\n`;
          output += `    📊 Status: ${quest.status}\n`;
          if (quest.progress) {
            output += `    📈 Progress: ${JSON.stringify(quest.progress)}\n`;
          }
          output += `\n`;
        });
        
        output += `📊 SUMMARY: ${quests.length} active quest${quests.length > 1 ? 's' : ''}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'update_quest_state': {
        const quest = db.updateCharacterQuestStatus(
          (args as any).character_quest_id,
          (args as any).status,
          (args as any).progress
        ) as any;
        
        const statusIcon = (args as any).status === 'completed' ? '🎉' : (args as any).status === 'failed' ? '💔' : '🔄';
        const statusText = (args as any).status === 'completed' ? 'COMPLETED!' :
                          (args as any).status === 'failed' ? 'FAILED!' : 'UPDATED!';
        
        let output = `${statusIcon} QUEST ${statusText}\n\n`;
        output += `📜 Quest Status Changed\n`;
        output += `📊 New Status: ${(args as any).status ? (args as any).status.toUpperCase() : 'UNKNOWN'}\n`;
        
        if ((args as any).progress) {
          output += `📈 Progress Updated: ${JSON.stringify((args as any).progress)}\n`;
        }
        
        if ((args as any).status === 'completed') {
          output += `\n🎉 Congratulations! Quest completed successfully!`;
        } else if ((args as any).status === 'failed') {
          output += `\n💔 Quest failed... but every failure is a learning experience!`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'assign_quest_to_character': {
        const assignment = db.assignQuestToCharacter(
          (args as any).character_id,
          (args as any).quest_id,
          (args as any).status || 'active'
        ) as any;
        
        const output = `🎯 QUEST ASSIGNED!

📜 Quest has been assigned to character
👤 Character ID: ${(args as any).character_id}
🎯 Quest ID: ${(args as any).quest_id}
📊 Initial Status: ${(args as any).status || 'active'}
🆔 Assignment ID: ${assignment.id}

✅ Ready to begin the quest!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Batch operations
      case 'batch_create_npcs': {
        const { npcs } = args as any;
        const createdNpcs = [];
        
        for (const npcData of npcs) {
          const npc = db.createNPC(npcData) as any;
          createdNpcs.push(npc);
        }
        
        let output = `👥 BATCH NPC CREATION COMPLETE!\n\n`;
        output += `📊 Created ${createdNpcs.length} NPCs:\n\n`;
        
        createdNpcs.forEach((npc: any, index: number) => {
          const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
          output += `${index + 1}. ${typeIcon} ${npc.name} (${npc.template || 'Custom'}) - ID: ${npc.id}\n`;
        });
        
        output += `\n✅ All NPCs successfully created and ready for encounters!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_update_npcs': {
        const { updates } = args as any;
        const updatedNpcs = [];
        
        for (const update of updates) {
          try {
            const npc = db.updateNPC(update.npc_id, update.updates) as any;
            updatedNpcs.push({ success: true, npc, npc_id: update.npc_id });
          } catch (error: any) {
            updatedNpcs.push({ success: false, error: error.message, npc_id: update.npc_id });
          }
        }
        
        let output = `🔄 BATCH NPC UPDATE COMPLETE!\n\n`;
        const successful = updatedNpcs.filter(u => u.success);
        const failed = updatedNpcs.filter(u => !u.success);
        
        output += `📊 Results: ${successful.length} successful, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ SUCCESSFUL UPDATES:\n`;
          successful.forEach((update: any, index: number) => {
            const typeIcon = update.npc.type === 'enemy' ? '👹' : update.npc.type === 'ally' ? '🤝' : '🧑';
            output += `${index + 1}. ${typeIcon} ${update.npc.name} (ID: ${update.npc_id})\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED UPDATES:\n`;
          failed.forEach((update: any, index: number) => {
            output += `${index + 1}. NPC ID: ${update.npc_id} - Error: ${update.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_apply_damage': {
        const { targets } = args as any;
        const results = [];
        
        for (const target of targets) {
          try {
            let success = true;
            let error = undefined;
            let r = {};
            // Call unified damage logic
            let result = null;
            try {
              result = db.applyHealthLevelDamage(target.target_type, target.target_id, target.damage);
            } catch (e: any) {
              success = false;
              error = e.message || "Unknown error applying damage";
            }
            let targetName = `${(target.target_type || 'UNKNOWN').toUpperCase()} ${target.target_id}`;
            if (target.target_type === 'character') {
              const char = db.getCharacter(target.target_id) as any;
              if (char) targetName = char.name;
              r = {
                targetName,
                damage: target.damage,
                wound_levels: result?.health_levels,
                penalty: result?.wound_penalty,
                is_incapacitated: result?.is_incapacitated,
                target_type: target.target_type,
                target_id: target.target_id
              };
            } else if (target.target_type === 'npc') {
              const npc = db.getNPC(target.target_id) as any;
              if (!npc) {
                success = false;
                error = `NPC with ID ${target.target_id} not found.`;
              } else {
                targetName = npc.name;
                r = {
                  targetName,
                  damage: target.damage,
                  wound_levels: result?.health_levels,
                  is_incapacitated: result?.is_incapacitated,
                  target_type: target.target_type,
                  target_id: target.target_id
                };
              }
            } else {
              success = false;
              error = `Invalid target_type: must be 'character' or 'npc'.`;
            }
            results.push({
              success,
              ...r,
              error
            });
          } catch (error: any) {
            results.push({
              success: false,
              error: error.message,
              target_type: target.target_type,
              target_id: target.target_id,
              damage: target.damage
            });
          }
        }
        
        let output = `💥 BATCH DAMAGE APPLICATION COMPLETE!\n\n`;
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        output += `📊 Results: ${successful.length} successful, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ DAMAGE APPLIED:\n`;
          successful.forEach((result: any, index: number) => {
            const typeIcon = result.target_type === 'character' ? '🎭' : '👹';
            if (result.target_type === 'character') {
              output += `${index + 1}. ${typeIcon} ${result.targetName}: -${result.damage} health levels →${result.is_incapacitated ? ' 💀 INCAPACITATED' : ''}\n`;
            } else if (result.target_type === 'npc') {
              // Show health_levels wound summary for NPC
              let woundStates = result.wound_levels ? Object.entries(result.wound_levels).filter(([k,v]) => Number(v) > 0).map(([k,v]) => `${k[0].toUpperCase() + k.slice(1)}: ${'X'.repeat(Number(v))}`).join(', ') : '';
              const statusIcon = result.is_incapacitated ? '💀 DEAD' : woundStates ? '🩸 WOUNDED' : '💚 HEALTHY';
              output += `${index + 1}. ${typeIcon} ${result.targetName}: -${result.damage} health levels → ${woundStates || 'Unhurt'} ${statusIcon}\n`;
            }
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. ${(result.target_type || 'UNKNOWN').toUpperCase()} ${result.target_id}: ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_remove_npcs': {
        const { npc_ids } = args as any;
        const results = [];
        
        for (const npc_id of npc_ids) {
          try {
            // Get NPC name before removing
            const npc = db.getNPC(npc_id) as any;
            const npcName = npc ? npc.name : `NPC ${npc_id}`;
            
            db.removeNPC(npc_id);
            results.push({ success: true, npc_id, name: npcName });
          } catch (error: any) {
            results.push({ success: false, npc_id, error: error.message });
          }
        }
        
        let output = `🗑️ BATCH NPC REMOVAL COMPLETE!\n\n`;
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        output += `📊 Results: ${successful.length} removed, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ REMOVED:\n`;
          successful.forEach((result: any, index: number) => {
            output += `${index + 1}. 👹 ${result.name} (ID: ${result.npc_id})\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. NPC ID: ${result.npc_id} - Error: ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // --- Resource Spending ---
      case 'spend_willpower': {
        const { character_id, amount = 1 } = args as any;
        const char = db.getCharacter(character_id) as any;
        if (!char) return { content: [{ type: 'text', text: '❌ Character not found!' }], isError: true };
        const curr = Math.max(0, (char.willpower_current || 0) - amount);
        db.updateCharacter(character_id, { willpower_current: curr });
        return {
          content: [{ type: 'text', text: `🔵 ${char.name} spent ${amount} Willpower (${curr} left)` }]
        };
      }
      case 'spend_blood': {
        const { character_id, amount = 1 } = args as any;
        const char = db.getCharacter(character_id) as any;
        if (!char) return { content: [{ type: 'text', text: '❌ Character not found!' }], isError: true };
        let curr = char.blood_pool_current || 0;
        curr = Math.max(0, curr - amount);
        db.updateCharacter(character_id, { blood_pool_current: curr });
        return {
          content: [{ type: 'text', text: ` ${char.name} spent ${amount} Blood (${curr} left)` }]
        };
      }
      case 'spend_gnosis': {
        const { character_id, amount = 1 } = args as any;
        const char = db.getCharacter(character_id) as any;
        if (!char) return { content: [{ type: 'text', text: '❌ Character not found!' }], isError: true };
        let curr = char.gnosis_current || 0;
        curr = Math.max(0, curr - amount);
        db.updateCharacter(character_id, { gnosis_current: curr });
        return {
          content: [{ type: 'text', text: `🐺 ${char.name} spent ${amount} Gnosis (${curr} left)` }]
        };
      }
      case 'spend_glamour': {
        const { character_id, amount = 1 } = args as any;
        const char = db.getCharacter(character_id) as any;
        if (!char) return { content: [{ type: 'text', text: '❌ Character not found!' }], isError: true };
        let curr = char.glamour_current || 0;
        curr = Math.max(0, curr - amount);
        db.updateCharacter(character_id, { glamour_current: curr });
        return {
          content: [{ type: 'text', text: `✨ ${char.name} spent ${amount} Glamour (${curr} left)` }]
        };
      }
      case 'spend_arete': {
        const { character_id, amount = 1 } = args as any;
        const char = db.getCharacter(character_id) as any;
        if (!char) return { content: [{ type: 'text', text: '❌ Character not found!' }], isError: true };
        let curr = char.arete || 0;
        curr = Math.max(0, curr - amount);
        db.updateCharacter(character_id, { arete: curr });
        return {
          content: [{ type: 'text', text: `🕯️ ${char.name} spent ${amount} Arete (${curr} left)` }]
        };
      }
      default:
        // --- Derangement: Add or update ---
        case 'add_derangement': {
          const { character_id, derangement, description } = args as any;
          try {
            const added = db.addOrUpdateDerangement(Number(character_id), derangement, description);
            const derangements = db.getDerangements(Number(character_id));
            let output = `🧠 Derangement updated for character ${character_id}:\n`;
            derangements.forEach((d, idx) => {
              output += `  - ${d.derangement}${d.description ? `: ${d.description}` : ""}\n`;
            });
            return {
              content: [
                { type: 'text', text: output }
              ]
            };
          } catch (error: any) {
            return {
              content: [{ type: 'text', text: `❌ Failed to add derangement: ${error.message}` }],
              isError: true
            };
          }
        }
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport);
console.error('Enhanced RPG Game State MCP Server v2.0 running on stdio');
````
