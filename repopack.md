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
combat-engine-server/package.json
combat-engine-server/src/index.ts
combat-engine-server/tsconfig.json
game-state-server/config.json
game-state-server/package.json
game-state-server/src/antagonists.ts
game-state-server/src/characterSheets.ts
game-state-server/src/db.ts
game-state-server/src/health-tracker.ts
game-state-server/src/index.ts
game-state-server/src/repositories/antagonist.repository.ts
game-state-server/src/repositories/character.repository.ts
game-state-server/src/repositories/game-database.ts
game-state-server/src/repositories/index.ts
game-state-server/src/repositories/inventory.repository.ts
game-state-server/src/repositories/status-effect.repository.ts
game-state-server/src/repositories/world-state.repository.ts
game-state-server/src/tool-definitions.ts
game-state-server/src/tool-handlers/add_item.handler.ts
game-state-server/src/tool-handlers/advance_turn.handler.ts
game-state-server/src/tool-handlers/apply_damage.handler.ts
game-state-server/src/tool-handlers/apply_status_effect.handler.ts
game-state-server/src/tool-handlers/award_xp.handler.ts
game-state-server/src/tool-handlers/create_antagonist.handler.ts
game-state-server/src/tool-handlers/create_character.handler.ts
game-state-server/src/tool-handlers/gain_resource.handler.ts
game-state-server/src/tool-handlers/get_antagonist.handler.ts
game-state-server/src/tool-handlers/get_character_by_name.handler.ts
game-state-server/src/tool-handlers/get_character.handler.ts
game-state-server/src/tool-handlers/get_current_turn.handler.ts
game-state-server/src/tool-handlers/get_initiative_order.handler.ts
game-state-server/src/tool-handlers/get_inventory.handler.ts
game-state-server/src/tool-handlers/get_status_effects.handler.ts
game-state-server/src/tool-handlers/get_trait_improvement_cost.handler.ts
game-state-server/src/tool-handlers/get_world_state.handler.ts
game-state-server/src/tool-handlers/improve_trait.handler.ts
game-state-server/src/tool-handlers/index.ts
game-state-server/src/tool-handlers/list_antagonists.handler.ts
game-state-server/src/tool-handlers/list_characters.handler.ts
game-state-server/src/tool-handlers/remove_antagonist.handler.ts
game-state-server/src/tool-handlers/remove_item.handler.ts
game-state-server/src/tool-handlers/remove_status_effect.handler.ts
game-state-server/src/tool-handlers/restore_resource.handler.ts
game-state-server/src/tool-handlers/save_story_progress.handler.ts
game-state-server/src/tool-handlers/save_world_state.handler.ts
game-state-server/src/tool-handlers/set_initiative.handler.ts
game-state-server/src/tool-handlers/spend_resource.handler.ts
game-state-server/src/tool-handlers/spend_xp.handler.ts
game-state-server/src/tool-handlers/update_antagonist.handler.ts
game-state-server/src/tool-handlers/update_character.handler.ts
game-state-server/src/tool-handlers/update_item.handler.ts
game-state-server/src/types/antagonist.types.ts
game-state-server/src/types/character.types.ts
game-state-server/src/types/db.types.ts
game-state-server/src/types/health.types.ts
game-state-server/src/types/index.ts
game-state-server/src/types/inventory.types.ts
game-state-server/src/types/status-effect.types.ts
game-state-server/tsconfig.json
quick-start-guide.md
rebuild.bat
setup.bat
SYSTEM_ARCHITECTURE.md
TOOLS.md
tsconfig.json
```

# Files

## File: .gitattributes
````
# Auto detect text files and perform LF normalization
* text=auto
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

## File: game-state-server/config.json
````json
{
  "mcp_servers": [
    {
      "name": "combat-engine-server",
      "address": "http://localhost:3001"
    }
  ]
}
````

## File: game-state-server/src/repositories/game-database.ts
````typescript
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

import type Database from 'better-sqlite3';

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
export function createGameDatabase(db: Database.Database): GameDatabase {
  return {
    characters: new CharacterRepository(db),
    antagonists: new AntagonistRepository(db),
    inventory: new InventoryRepository(db),
    statusEffects: new StatusEffectRepository(db),
    worldState: new WorldStateRepository(db),
  };
}
````

## File: game-state-server/src/repositories/index.ts
````typescript
export * from './antagonist.repository.js';
export * from './character.repository.js';
export * from './inventory.repository.js';
export * from './status-effect.repository.js';
````

## File: game-state-server/src/types/health.types.ts
````typescript
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
````

## File: game-state-server/src/types/index.ts
````typescript
export * from './antagonist.types.js';
export * from './character.types.js';
export * from './db.types.js';
export * from './health.types.js';
export * from './inventory.types.js';
export * from './status-effect.types.js';
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

## File: SYSTEM_ARCHITECTURE.md
````markdown
# SYSTEM ARCHITECTURE

## Overview

This project implements an extensible, modular World of Darkness Model Context Protocol (MCP) engine using a **two-server model**:

- **game-state-server**: Handles persistent data, database operations, character/NPC state management, antagonist creation, resource tracking, and more.
- **combat-engine-server**: Implements game mechanic and combat tools, dice pool rolling, contest adjudication, and splat-specific special mechanics (e.g., Vampire Frenzy, Mage magick).

The servers coordinate via API tool calls and protocol messages, enabling robust multi-splat support and future extensibility.

---

## Database Schema

### Core Player Character Table
- `characters`: ID, name, concept, game_line, **attributes** (strength, dex, etc.), health, willpower, experience, etc.

### Modular Trait Tables (per splat)
- `character_vampire_traits`: clan, generation, blood_pool, humanity, etc.
- `character_werewolf_traits`: breed, auspice, tribe, gnosis, rage, renown, etc.
- `character_mage_traits`: tradition_convention, arete, quintessence, paradox
- `character_changeling_traits`: kith, seeming, glamour, banality

### Antagonists/NPCs
- `npcs`: matches core schema of `characters` (game_line, traits, stats).
- Modular splat tables mirror the ones above for NPCs: e.g., `npc_vampire_traits`, etc.

### Relational / Supporting Tables
- `character_abilities`, `character_disciplines`, `character_arts`, `character_realms`, `character_gifts`, `character_spheres`, `xp_ledger`, `derangements`, `inventory`, etc.

---

## MCP Tools

### Shared (All Game Lines)
- `create_character`
- `get_character`
- `update_character`
- `apply_damage`
- `spend_resource`
- `gain_resource`
- `restore_resource`
- `create_antagonist`
- `get_antagonist`
- ... and more

### Vampire (VTM)
- `roll_virtue_check` (virtue checks, Humanity, Frenzy, Rötschreck)
- Resources: `blood`, `willpower`, `humanity`

### Werewolf (WtA)
- `change_form`
- `spend_rage_for_extra_actions`
- Resources: `rage`, `gnosis`, `willpower`

### Mage (MtA)
- `roll_magick_effect`
- Resources: `quintessence`, `paradox`, `willpower`
- `spheres`, `arete`

### Changeling (CtD)
- `invoke_cantrip`
- Resources: `glamour`, `banality`, `willpower`
- `arts`, `realms`

### Initiative Management
- `roll_initiative_for_scene`
- `set_initiative`
- `get_initiative_order`
- `advance_turn`
- `get_current_turn`

### Social Combat
- `roll_social_combat`

### Damage
- `roll_damage_pool`
- `apply_damage`
- `roll_soak`

---

## Example Combat Turn Sequence

1. **Storyteller** calls `get_current_turn` (to see whose turn it is)
2. **AI/NPC/Player** acts; action is narrated
3. **AI** calls `roll_wod_pool` for action (attack, power, etc.)
4. **AI** calls `roll_damage_pool` if attack is successful
5. **AI** calls `apply_damage` with damage results
6. **AI** calls `advance_turn` to move to next participant

At each step, MCP tools ensure the correct rules, initiative order, and health tracking are applied, automatically adapting to the current splat and game context.

---

## Expansion

The MCP system is designed for future extensibility: add new splats, modular trait tables, antagonist templates, and tools as desired.
````

## File: TOOLS.md
````markdown
# MCP Server Tools & API Reference

This document provides a complete reference for all Model Context Protocol (MCP) tools available in the World of Darkness server suite. These tools are the building blocks for all game mechanics, character management, and chronicle progression.

## 📁 Server Architecture

The system uses a two-server model:

*   **`game-state-server`**: Manages persistent data, including character sheets, NPC records, inventory, experience, and world state. It is the "source of truth" for the chronicle.
*   **`combat-engine-server`**: A stateless server that handles the game's dice mechanics and rule adjudications, such as rolling dice pools, resolving contested actions, and applying game-line-specific rules (e.g., Frenzy, Magick, Cantrips).

---

## 🗄️ `game-state-server` Tools

This server handles the "state" of your characters and the world.

### Character Management

#### `create_character`
Creates a new character with core attributes and splat-specific traits.

**Input Schema:**
```json
{
  "name": "Character Name",
  "game_line": "vampire" | "werewolf" | "mage" | "changeling",
  "concept": "Character Concept (optional)",
  // --- Core Attributes (defaults to 1 if not provided) ---
  "strength": 2, "dexterity": 3, "stamina": 2,
  "charisma": 3, "manipulation": 4, "appearance": 2,
  "perception": 3, "intelligence": 2, "wits": 3,
  // --- Core Traits ---
  "willpower_current": 5, "willpower_permanent": 5,
  // --- Splat-Specific Fields (provide based on game_line) ---
  "clan": "Malkavian", "generation": 12, "humanity": 7, // (Vampire)
  "tribe": "Glass Walkers", "auspice": "Ragabash", // (Werewolf)
  "tradition_convention": "Verbena", "arete": 3, // (Mage)
  "kith": "Pooka", "seeming": "Wilder", // (Changeling)
  // --- Relational Traits (optional) ---
  "abilities": [ { "name": "Firearms", "type": "skills", "rating": 2 } ],
  "disciplines": [ { "name": "Auspex", "rating": 1 } ]
}
```
**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "🎲 World of Darkness: VAMPIRE Sheet\n\n👤 Name: Marcus\n🧠 Concept: Rebel with a cause\n...\n(Full formatted character sheet)"
    }
  ]
}
```

---
#### `get_character` / `get_character_by_name`
Retrieves a full, formatted character sheet by ID or name.

**Input Schema:**
```json
{ "character_id": 1 }
// or
{ "name": "Marcus" }
```
**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "🎲 World of Darkness: VAMPIRE Sheet\n\n👤 Name: Marcus\n...(Full formatted character sheet)"
    }
  ]
}
```

---
#### `update_character`
Modifies a character's core or splat-specific traits.

**Input Schema:**
```json
{
  "character_id": 1,
  "updates": {
    "willpower_current": 4,
    "concept": "Hardened Survivor"
  }
}
```
**Example Response:**
```json
{
  "content": [ { "type": "text", "text": "✅ Character #1 updated." } ]
}
```

---
#### `list_characters`
Lists all player characters in the database.

**Input Schema:** `{}`
**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "🎭 Character Roster:\n- Marcus (vampire) [ID: 1]\n- Cries-at-the-Moon (werewolf) [ID: 2]"
    }
  ]
}
```

### Resource & Health Management

#### `spend_resource` / `restore_resource`
Spends or restores a character's resource pool (e.g., Willpower, Blood).

**Input Schema:**
```json
{
  "character_id": 1,
  "resource_name": "willpower" | "blood" | "gnosis" | "rage" | "glamour" | "quintessence",
  "amount": 1
}
```
**Example Response (`spend_resource`):**
```json
{
  "content": [
    { "type": "text", "text": "Marcus spent 1 willpower. Remaining: 4" },
    { "type": "object", "tool_outputs": { "success": true, "resource_spent": "willpower", "amount_spent": 1, "remaining": 4 } }
  ]
}
```

---
#### `gain_resource`
Gains a resource from an in-game action (e.g., feeding, meditation).

**Input Schema:**
```json
{
  "character_id": 1,
  "resource_name": "blood",
  "roll_successes": 3
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "🩸 Marcus fed and gained 3 Blood.\nBlood Pool: 8/10" },
    { "type": "object", "resource": "blood", "gained": 3, "new_total": 8, "character_id": 1 }
  ]
}
```

---
#### `apply_damage`
Applies damage to a target's health levels.

**Input Schema:**
```json
{
  "target_type": "character" | "npc",
  "target_id": 1,
  "damage_successes": 3,
  "damage_type": "lethal" | "bashing" | "aggravated"
}
```
**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "💥 Damage applied. Health: /|X|X|X| | |  | Penalty: -1"
    }
  ]
}
```

### XP & Progression

#### `award_xp` / `spend_xp`
Awards or spends character experience points.

**Input Schema:**
```json
{
  "character_id": 1,
  "amount": 5,
  "reason": "Completed the 'Missing Ghoul' story arc."
}
```
**Example Response (`award_xp`):**
```json
{
  "content": [
    { "type": "text", "text": "✅ Awarded 5 XP to 'Marcus'. Reason: Completed the 'Missing Ghoul' story arc.\n\nTotal XP: 12" }
  ]
}
```
---
#### `improve_trait`
Spends XP to increase a character's trait. Automatically calculates cost and validates XP.

**Input Schema:**
```json
{
  "character_id": 1,
  "trait_type": "attribute" | "ability" | "discipline" | "sphere" | "art" | "realm" | "willpower",
  "trait_name": "strength"
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "🌟 TRAIT IMPROVED! 🌟\n\n👤 Character: Marcus\n- Trait: ATTRIBUTE - strength\n- Old Rating: 2\n+ New Rating: 3\n- XP Cost: 12 (Rule: New rating × 4)\n+ Remaining XP: 0" },
    { "type": "object", "char_name": "Marcus", "spent": 12, "trait_type": "attribute", "trait_name": "strength", "previous_rating": 2, "new_rating": 3, "xp_formula": "New rating × 4", "remaining_xp": 0 }
  ]
}
```
---
### Status Effects
#### `apply_status_effect` / `remove_status_effect` / `get_status_effects`
Manages temporary or long-term conditions affecting a character or NPC.

**Input Schema (`apply_status_effect`):**
```json
{
  "target_type": "character" | "npc",
  "target_id": 1,
  "effect_name": "Stunned",
  "description": "Cannot act this round.",
  "mechanical_effect": { "can_act": false },
  "duration_type": "rounds",
  "duration_value": 1
}
```
**Example Response (`apply_status_effect`):**
```json
{
  "content": [
    { "type": "text", "text": "🌀 Status effect 'Stunned' applied to character #1 (ID: 101)" },
    { "type": "object", "effect_id": 101, "target_type": "character", "target_id": 1, "effect_name": "Stunned", "duration_type": "rounds", "duration_value": 1 }
  ]
}
```

**Input Schema (`remove_status_effect`):**
```json
{
  "effect_id": 101
}
```

**Input Schema (`get_status_effects`):**
```json
{
  "target_type": "character" | "npc",
  "target_id": 1
}
```

### Inventory Management

#### `add_item`
Adds an item to a character's inventory.

**Input Schema:**
```json
{
  "character_id": 1,
  "item": {
    "name": "Healing Potion",
    "description": "Restores 3 health levels",
    "quantity": 2,
    "type": "consumable"
  }
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "✅ Added 'Healing Potion' to character #1's inventory." }
  ]
}
```

---
#### `get_inventory`
Retrieves all items in a character's inventory.

**Input Schema:**
```json
{
  "character_id": 1
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "📦 Inventory for Character #1:\n- Healing Potion (x2)\n- Silver Dagger (x1)" }
  ]
}
```

---
#### `update_item`
Updates an item's properties (quantity, description, etc.).

**Input Schema:**
```json
{
  "item_id": 5,
  "updates": {
    "quantity": 1,
    "description": "Updated description"
  }
}
```

---
#### `remove_item`
Removes an item from inventory by its ID.

**Input Schema:**
```json
{
  "item_id": 5
}
```

### World State & Story Management

#### `save_world_state`
Saves the current state of the game world for persistence between sessions.

**Input Schema:**
```json
{
  "location": "The Elysium",
  "notes": "Prince Hardestadt has called a gathering",
  "data": {
    "time": "midnight",
    "weather": "stormy",
    "npcs_present": ["Prince Hardestadt", "Sheriff Marcus"]
  }
}
```

---
#### `get_world_state`
Retrieves the last saved world state.

**Input Schema:** `{}`
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "🌍 Current World State:\nLocation: The Elysium\nNotes: Prince Hardestadt has called a gathering" }
  ]
}
```

---
#### `save_story_progress`
Logs narrative checkpoints and story progression.

**Input Schema:**
```json
{
  "chapter": "Chapter 1",
  "scene": "The Missing Ghoul",
  "summary": "The coterie discovered the ghoul was taken by Sabbat infiltrators."
}
```

### Antagonist Management

#### `create_antagonist`
Creates an NPC antagonist from predefined templates.

**Input Schema:**
```json
{
  "name": "Sheriff Marcus",
  "template": "vampire_sheriff",
  "game_line": "vampire"
}
```

---
#### `get_antagonist`
Retrieves antagonist data by ID.

**Input Schema:**
```json
{
  "npc_id": 1
}
```

---
#### `update_antagonist`
Updates an antagonist's stats or details.

**Input Schema:**
```json
{
  "npc_id": 1,
  "updates": {
    "willpower_current": 6,
    "notes": "Recently fed, more aggressive"
  }
}
```

---
#### `list_antagonists`
Lists all created antagonists.

**Input Schema:** `{}`
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "👹 Antagonists (2):\n- Sheriff Marcus (vampire) [ID: 1]\n- Pack Alpha (werewolf) [ID: 2]" }
  ]
}
```

---
#### `remove_antagonist`
Permanently removes an antagonist from the game.

**Input Schema:**
```json
{
  "npc_id": 1
}
```

### Combat & Initiative Management

#### `set_initiative`
Sets the initiative order for a combat scene.

**Input Schema:**
```json
{
  "scene_id": "combat_1",
  "entries": [
    {
      "character_id": 1,
      "actor_name": "Marcus",
      "initiative_score": 15,
      "turn_order": 1
    },
    {
      "npc_id": 2,
      "actor_name": "Sheriff",
      "initiative_score": 12,
      "turn_order": 2
    }
  ]
}
```

---
#### `get_initiative_order`
Retrieves the current initiative order for a scene.

**Input Schema:**
```json
{
  "scene_id": "combat_1"
}
```

---
#### `advance_turn`
Advances to the next actor in the initiative order.

**Input Schema:**
```json
{
  "scene_id": "combat_1"
}
```

---
#### `get_current_turn`
Gets the current actor and round information.

**Input Schema:**
```json
{
  "scene_id": "combat_1"
}
```

#### `get_trait_improvement_cost`
Calculates the XP cost to improve a character trait to the next level.

**Input Schema:**
```json
{
  "character_id": 1,
  "trait_type": "attribute" | "ability" | "discipline" | "sphere" | "art" | "realm" | "willpower" | "power_stat",
  "trait_name": "strength"
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "💰 XP Cost Analysis:\n\nTrait: ATTRIBUTE - strength\nCurrent Rating: 2\nNext Rating: 3\nXP Cost: 12 (Formula: New rating × 4)" }
  ]
}
```

---

## ⚔️ `combat-engine-server` Tools

This server handles stateless dice rolls and rule adjudications.

### Core Dice Mechanics

#### `roll_wod_pool`
The primary tool for all actions. Rolls a pool of d10s and calculates successes.

**Input Schema:**
```json
{
  "pool_size": 5,
  "difficulty": 6,
  "has_specialty": false
}
```
**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "🎲 oWoD Dice Pool Roll\n\nPool Size: 5, Difficulty: 6, Specialty: No\nRolled: [7, 3, 1, 9, 10]\n➡  Result: 2 successes\n[SUCCESS] Moderate Success."
    }
  ]
}
```

---
#### `roll_contested_action`
Rolls for two actors and determines the winner based on net successes.

**Input Schema:**
```json
{
  "attacker_pool": 6, "attacker_difficulty": 6, "attacker_specialty": true,
  "defender_pool": 5, "defender_difficulty": 7, "defender_specialty": false
}
```
**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "🎯 CONTESTED/RESISTED ACTION\n\nAttacker: Pool 6 vs Diff 6 → Rolls: [10,10,8,4,2,1] (4 successes)\nDefender: Pool 5 vs Diff 7 → Rolls: [9,3,1,5,8] (2 successes)\n\nRESULT: Attacker wins by 2 net successes."
    }
  ]
}
```

---
#### `roll_soak`
Rolls a soak pool to reduce incoming damage.

**Input Schema:**
```json
{
  "soak_pool": 4,
  "damage_type": "lethal",
  "has_fortitude": false
}
```
**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Soak Dice: [8, 2, 9, 6] vs diff 6\n➡  Soaked 3 points of damage.\nSolid soak effort."
    }
  ]
}
```

---
#### `roll_damage_pool`
Rolls a damage pool after a successful attack to determine health levels dealt.

**Input Schema:**
```json
{
  "pool_size": 5,
  "damage_type": "lethal"
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "💥 Damage Pool Roll\n\nPool Size: 5, Difficulty: 6\nDamage Type: Lethal\nRolled: [7, 4, 8, 1, 9]\n➡  Result: 2 levels of lethal damage." },
    { "type": "object", "data": { "successes": 2, "damage_type": "lethal" } }
  ]
}
```

### Game-Line Specific Mechanics

#### `roll_virtue_check` (Vampire)
Rolls for virtues like Courage, Self-Control, or Conscience.

**Input Schema:**
```json
{
  "character_id": 1,
  "virtue_name": "Courage",
  "difficulty": 7
}
```

---
#### `change_form` (Werewolf)
Returns the attribute modifiers for a Werewolf changing forms.

**Input Schema:**
```json
{
  "character_id": 2,
  "target_form": "Crinos"
}
```

---
#### `roll_magick_effect` (Mage)
Rolls an Arete pool for a magickal effect and calculates any Paradox.

**Input Schema:**
```json
{
  "character_id": 3,
  "spheres": ["Forces", "Life"],
  "arete_roll_pool": 4,
  "difficulty": 8,
  "is_coincidental": false
}
```

---
#### `invoke_cantrip` (Changeling)
Rolls a pool of Art + Realm for a cantrip.

**Input Schema:**
```json
{
  "character_id": 4,
  "art_pool": 3,
  "realm_pool": 2,
  "difficulty": 7
}
```

---
#### `spend_rage_for_extra_actions` (Werewolf)
Allows a Werewolf to spend Rage for extra actions in a turn.

**Input Schema:**
```json
{
  "character_id": 2,
  "rage_spent": 2
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "🐺 Rage Spent: 2 points\n➡ Extra Actions: 2\nRemaining Rage: 6/8" }
  ]
}
```

---
#### `roll_social_combat`
Performs contested social actions like intimidation, persuasion, or seduction.

**Input Schema:**
```json
{
  "attacker_name": "Marcus",
  "attacker_pool": 6,
  "target_name": "Sheriff",
  "target_pool": 4,
  "attack_type": "intimidation"
}
```
**Example Response:**
```json
{
  "content": [
    { "type": "text", "text": "🎭 SOCIAL COMBAT\n\nAttacker: Marcus (Intimidation)\nTarget: Sheriff (Willpower)\n\nMarcus: 3 successes\nSheriff: 1 success\n\nRESULT: Marcus wins by 2 net successes.\nRecommendation: Apply 'Shaken' status effect to Sheriff." }
  ]
}
```

### Combat Management Tools

#### `set_initiative` / `get_initiative_order` / `advance_turn` / `get_current_turn`
These tools are available in both servers for combat management. The combat-engine-server delegates these calls to the game-state-server for persistence.

**Note:** When called from combat-engine-server, these tools automatically delegate to game-state-server to maintain state consistency.
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "outDir": "./dist"
  },
  "include": [
    "**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
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
data/

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

## File: game-state-server/package.json
````json
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
````

## File: game-state-server/src/antagonists.ts
````typescript
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
 * oWoD antagonist archetypes
 */
export const ANTAGONIST_TEMPLATES: AntagonistTemplates = {
  // VAMPIRE
  'First-Gen Vampire': {
    name: 'First-Gen Vampire',
    concept: 'Founder of a vampiric lineage—absolute apex predator.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 10, dexterity: 7, stamina: 10,
      charisma: 8, manipulation: 8, appearance: 7,
      perception: 9, intelligence: 10, wits: 9,
    },
    abilities: {
      talents: { Brawl: 5, Alertness: 5, Intimidation: 5, Subterfuge: 5 },
      skills: { Melee: 5, Stealth: 5, Firearms: 4 },
      knowledges: { Occult: 5, Medicine: 4, Investigation: 5, Law: 5 },
    },
    willpower: 10,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 10, Dominate: 9, Fortitude: 10 } },
    description: 'An impossibly ancient Kindred; a god among vampires.',
  },
  'Sabbat Shovelhead': {
    name: 'Sabbat Shovelhead',
    concept: 'Expendable vampire soldier—fodder for the Sword of Caine.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 2,
      charisma: 2, manipulation: 1, appearance: 1,
      perception: 2, intelligence: 1, wits: 2,
    },
    abilities: {
      talents: { Brawl: 3, Intimidation: 2 },
      skills: { Melee: 2, Drive: 1 },
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 2, Celerity: 1 } },
    description: 'A freshly Embraced recruit thrown into battle by the Sabbat.',
  },
  'Anarch Bruiser': {
    name: 'Anarch Bruiser',
    concept: 'Anarch gang muscle; discontented Kindred brawler.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 2, stamina: 3,
      charisma: 2, manipulation: 2, appearance: 2,
      perception: 2, intelligence: 2, wits: 2,
    },
    abilities: {
      talents: { Brawl: 4, Alertness: 2 },
      skills: { Melee: 2, Firearms: 1 },
      knowledges: {},
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 2, Fortitude: 1 } },
    description: 'A tough unlife enforcer for the Anarch Movement.',
  },
  'Camarilla Sheriff': {
    name: 'Camarilla Sheriff',
    concept: 'Enforcer of Kindred law—pragmatic, ruthless, loyal.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 3, stamina: 4,
      charisma: 3, manipulation: 3, appearance: 2,
      perception: 3, intelligence: 3, wits: 4,
    },
    abilities: {
      talents: { Brawl: 4, Alertness: 4, Intimidation: 3 },
      skills: { Melee: 3, Firearms: 3, Stealth: 2 },
      knowledges: { Investigation: 3 },
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Celerity: 2, Potence: 3, Fortitude: 2 } },
    description: 'An elite law enforcer of the Camarilla, skilled in Kindred justice.',
  },

  // WEREWOLF
  'Bane Spirit': {
    name: 'Bane Spirit',
    concept: 'Malevolent Umbra spirit—corruptor and tormentor.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 4, stamina: 3,
      charisma: 1, manipulation: 4, appearance: 0,
      perception: 5, intelligence: 4, wits: 3,
    },
    abilities: {
      talents: { Alertness: 4 },
      skills: {},
      knowledges: { Occult: 4 },
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: ['Obfuscate', 'Bane Touch'] },
    description: 'A malicious spiritual entity, twisted in the Umbra.',
  },
  'Black Spiral Dancer': {
    name: 'Black Spiral Dancer',
    concept: 'Wyrm-corrupted Garou—chaotic, insane, predatory.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 3, stamina: 3,
      charisma: 2, manipulation: 2, appearance: 1,
      perception: 3, intelligence: 2, wits: 3,
    },
    abilities: {
      talents: { Brawl: 4, Intimidation: 4 },
      skills: { Stealth: 3, Survival: 3 },
      knowledges: { Occult: 3 },
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: { 'Balefire': 2 } },
    description: 'A corrupted Garou, malicious and insane.',
  },
  'Pentex First-Team': {
    name: 'Pentex First-Team',
    concept: 'Corporate paramilitary anti-werewolf commando.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 4, stamina: 4,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 3, intelligence: 3, wits: 3,
    },
    abilities: {
      talents: { Brawl: 4, Alertness: 3 },
      skills: { Firearms: 5, Drive: 3, Melee: 3 },
      knowledges: { Science: 2, Investigation: 2 },
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: "Pentex's elite paramilitary anti-Garou squad.",
  },
  'Fomori': {
    name: 'Fomori',
    concept: 'Possessed mutant—human vessel for a Bane.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 3,
      charisma: 1, manipulation: 1, appearance: 0,
      perception: 2, intelligence: 1, wits: 2,
    },
    abilities: {
      talents: { Brawl: 2 },
      skills: { Melee: 2 },
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A human possessed and mutated by Banes.',
  },

  // MAGE
  'Technocracy Agent': {
    name: 'Technocracy Agent',
    concept: 'Fanatical enforcer of Consensus reality.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 3, stamina: 3,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 4, intelligence: 4, wits: 4,
    },
    abilities: {
      talents: { Alertness: 3, Subterfuge: 4, Intimidation: 2 },
      skills: { Firearms: 4, Melee: 2, Stealth: 3, Drive: 3 },
      knowledges: { Science: 4, Technology: 5, Investigation: 3 },
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A field operative of the Technocratic Union, trained in advanced weaponry and counter-magic.',
  },
  'Technocracy Hit Squad': {
    name: 'Technocracy Hit Squad',
    concept: 'Team of paramilitary Convention operatives.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 4, stamina: 3,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 4, intelligence: 3, wits: 4,
    },
    abilities: {
      talents: { Alertness: 4, Subterfuge: 3 },
      skills: { Firearms: 5, Drive: 2, Melee: 2 },
      knowledges: { Technology: 4, Science: 4 },
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Forces: 3, Correspondence: 2 } },
    description: 'A team of trained Operatives with access to Technomantic devices.',
  },
  'Marauder': {
    name: 'Marauder',
    concept: 'Reality-warping chaos mage—embracing madness.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 3, stamina: 4,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 2, intelligence: 4, wits: 3,
    },
    abilities: {
      talents: { Subterfuge: 3, Intimidation: 2 },
      skills: { Firearms: 2 },
      knowledges: { Occult: 3 },
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Entropy: 3, Mind: 3 } },
    description: 'A reality-warping, Madness-tainted mage.',
  },
  'Nephandus': {
    name: 'Nephandus',
    concept: 'Sorcerer corrupted by dark cosmic powers.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 2, stamina: 2,
      charisma: 2, manipulation: 3, appearance: 1,
      perception: 4, intelligence: 4, wits: 3,
    },
    abilities: {
      talents: { Subterfuge: 3, Intimidation: 2 },
      skills: { Melee: 2, Occult: 4 },
      knowledges: {},
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Forces: 2, Prime: 3 } },
    description: 'A diabolist practicing the arts of destruction and corruption.',
  },

  // CHANGELING
  'Autumn Person': {
    name: 'Autumn Person',
    concept: 'Mundane human with extreme Banality; fae danger.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 2, stamina: 2,
      charisma: 1, manipulation: 2, appearance: 1,
      perception: 3, intelligence: 3, wits: 2,
    },
    abilities: {
      talents: { Alertness: 2 },
      skills: {},
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A mundane human, steeped in Banality and a danger to fae.',
  },
  'Dauntain': {
    name: 'Dauntain',
    concept: 'Banality-corrupted changeling—enemy of the Dreaming.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 2,
      charisma: 2, manipulation: 2, appearance: 1,
      perception: 3, intelligence: 2, wits: 3,
    },
    abilities: {
      talents: { Subterfuge: 2 },
      skills: { Survival: 2 },
      knowledges: {},
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { arts: { Unleashing: 2 } },
    description: 'A fae who has turned against Dreaming, corrupted by Banality.',
  },
  'Hostile Chimera': {
    name: 'Hostile Chimera',
    concept: 'Aggressive dream-construct—manifested nightmare.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 4, stamina: 2,
      charisma: 1, manipulation: 1, appearance: 0,
      perception: 3, intelligence: 2, wits: 3,
    },
    abilities: {
      talents: { Alertness: 3, Brawl: 3 },
      skills: { Stealth: 2 },
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'An aggressive dream-being or nightmare given form.',
  },

  // Mortal (generic, not game-line, but still a usable template)
  'Street Thug': {
    name: 'Street Thug',
    concept: 'Violent, street-level criminal opportunist.',
    game_line: 'mortal',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 3,
      charisma: 2, manipulation: 1, appearance: 1,
      perception: 2, intelligence: 2, wits: 2,
    },
    abilities: {
      talents: { Brawl: 3, Alertness: 2, Intimidation: 2 },
      skills: { Melee: 1, Stealth: 1 },
      knowledges: {},
    },
    willpower: 3,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A typical street-level tough engaged in criminal activity.',
  }
};
````

## File: game-state-server/src/tool-handlers/index.ts
````typescript
import type { GameDatabase } from '../types/db.types.js';

// Import all your handlers here
import { add_item_handler } from './add_item.handler.js';
import { advance_turn_handler } from './advance_turn.handler.js';
import { apply_damage_handler } from './apply_damage.handler.js';
import { apply_status_effect_handler } from './apply_status_effect.handler.js';
import { award_xp_handler } from './award_xp.handler.js';
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

// Create a single map of all tool handlers
export const toolDispatcher: Record<string, (db: GameDatabase, args: any) => Promise<any>> = {
  'add_item': add_item_handler,
  'advance_turn': advance_turn_handler,
  'apply_damage': apply_damage_handler,
  'apply_status_effect': apply_status_effect_handler,
  'award_xp': award_xp_handler,
  'create_antagonist': create_antagonist_handler,
  'create_character': create_character_handler,
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
  'list_antagonists': list_antagonists_handler,
  'list_characters': list_characters_handler,
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
````

## File: game-state-server/src/types/antagonist.types.ts
````typescript
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
````

## File: game-state-server/src/types/character.types.ts
````typescript
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
````

## File: game-state-server/src/types/db.types.ts
````typescript
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
````

## File: game-state-server/src/types/inventory.types.ts
````typescript
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
````

## File: game-state-server/src/types/status-effect.types.ts
````typescript
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
````

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
      "cwd": "E:\\Tinker\\rpg-mcp-servers\\game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "add_item",
        "advance_turn",
        "apply_damage",
        "apply_status_effect",
        "award_xp",
        "create_antagonist",
        "create_character",
        "gain_resource",
        "get_antagonist",
        "get_character",
        "get_character_by_name",
        "get_current_turn",
        "get_initiative_order",
        "get_inventory",
        "get_status_effects",
        "get_trait_improvement_cost",
        "get_world_state",
        "improve_trait",
        "list_antagonists",
        "list_characters",
        "remove_antagonist",
        "remove_item",
        "remove_status_effect",
        "restore_resource",
        "save_story_progress",
        "save_world_state",
        "set_initiative",
        "spend_resource",
        "spend_xp",
        "update_antagonist",
        "update_character",
        "update_item"
      ]
    },
    "rpg-combat-engine": {
      "name": "rpg-combat-engine-server",
      "command": "node",
      "args": [
        "dist/index.js"
      ],
      "cwd": "E:\\Tinker\\rpg-mcp-servers\\combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "advance_turn",
        "change_form",
        "get_current_turn",
        "get_initiative_order",
        "invoke_cantrip",
        "roll_contested_action",
        "roll_damage_pool",
        "roll_magick_effect",
        "roll_soak",
        "roll_social_combat",
        "roll_virtue_check",
        "roll_wod_pool",
        "set_initiative",
        "spend_rage_for_extra_actions"
      ]
    },
    "simple-game-state": {
      "name": "simple-game-state-server",
      "command": "node",
      "args": [
        "dist/simple_index.js"
      ],
      "cwd": "E:\\Tinker\\rpg-mcp-servers\\game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "hello_world"
      ]
    }
  }
}
````

## File: .roo/mcp.json
````json
{
  "mcpServers": {
    "rpg-game-state": {
      "name": "rpg-game-state-server",
      "command": "node",
      "args": [
        "dist/index.js"
      ],
      "cwd": "E:\\Tinker\\rpg-mcp-servers\\game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "add_item",
        "advance_turn",
        "apply_damage",
        "apply_status_effect",
        "award_xp",
        "create_antagonist",
        "gain_resource",
        "get_antagonist",
        "get_character",
        "get_character_by_name",
        "get_current_turn",
        "get_initiative_order",
        "get_inventory",
        "get_status_effects",
        "get_trait_improvement_cost",
        "get_world_state",
        "improve_trait",
        "list_antagonists",
        "list_characters",
        "remove_antagonist",
        "remove_item",
        "remove_status_effect",
        "restore_resource",
        "save_story_progress",
        "save_world_state",
        "set_initiative",
        "spend_resource",
        "spend_xp",
        "update_antagonist",
        "update_character",
        "update_item"
      ],
      "disabledTools": [
        "advance_turn"
      ]
    },
    "rpg-combat-engine": {
      "name": "rpg-combat-engine-server",
      "command": "node",
      "args": [
        "dist/index.js"
      ],
      "cwd": "E:\\Tinker\\rpg-mcp-servers\\combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "advance_turn",
        "change_form",
        "get_current_turn",
        "get_initiative_order",
        "invoke_cantrip",
        "roll_contested_action",
        "roll_damage_pool",
        "roll_magick_effect",
        "roll_soak",
        "roll_social_combat",
        "roll_virtue_check",
        "roll_wod_pool",
        "set_initiative",
        "spend_rage_for_extra_actions"
      ],
      "disabledTools": [
        "roll_wod_pool",
        "roll_contested_action",
        "roll_soak",
        "roll_damage_pool",
        "set_initiative",
        "get_initiative_order",
        "advance_turn",
        "get_current_turn",
        "roll_social_combat",
        "roll_virtue_check",
        "change_form",
        "spend_rage_for_extra_actions",
        "roll_magick_effect",
        "invoke_cantrip"
      ]
    }
  }
}
````

## File: game-state-server/src/health-tracker.ts
````typescript
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
````

## File: game-state-server/src/repositories/antagonist.repository.ts
````typescript
import Database from 'better-sqlite3';
import type { AntagonistRow } from '../types/antagonist.types.js';
import { ANTAGONIST_TEMPLATES } from '../antagonists.js';

export class AntagonistRepository {
  private db: Database.Database;
constructor(db: Database.Database) {
    this.db = db;
  }

  getAntagonistByName(name: string): AntagonistRow | null {
    const stmt = this.db.prepare('SELECT * FROM npcs WHERE name = ?');
    const row = stmt.get(name) as AntagonistRow;
    return row ? row : null;
  }

  getAntagonistById(id: number): AntagonistRow | null {
    const stmt = this.db.prepare('SELECT * FROM npcs WHERE id = ?');
    const row = stmt.get(id) as AntagonistRow;
    return row ? row : null;
  }
  
  createAntagonist(template_name: string, custom_name?: string): AntagonistRow | null {
    const template = (ANTAGONIST_TEMPLATES as any)[template_name];
    if (!template) return null;
    // Fill missing health_levels from default if template omits it
    const defaultHealthLevels = { bruised: 0, hurt: 0, injured: 0, wounded: 0, mauled: 0, crippled: 0, incapacitated: 0 };
    const data = {
      ...template,
      name: custom_name || template.name || template_name,
      template: template_name,
      health_levels: template.health_levels ?? defaultHealthLevels
    };
    let npcId: number | undefined = undefined;

    // Validate required fields after filling health_levels
    if (!data.name || !data.game_line || !data.health_levels) {
      console.error("Missing required fields in antagonist template:", template_name, data);
      return null;
    }

    // Transaction to insert core NPC and relational data
    this.db.transaction(() => {
      // 1. Insert into new lean core npcs table (no game-line-specific splat traits here)
      const stmt = this.db.prepare(`
        INSERT INTO npcs (
          name, template, concept, game_line,
          strength, dexterity, stamina, charisma, manipulation, appearance,
          perception, intelligence, wits,
          willpower_current, willpower_permanent, health_levels, notes
        ) VALUES (
          @name, @template, @concept, @game_line,
          @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
          @perception, @intelligence, @wits,
          @willpower_current, @willpower_permanent, @health_levels, @notes
        )
      `);
      const result = stmt.run({
        name: data.name,
        template: data.template,
        concept: data.concept || null,
        game_line: data.game_line,
        strength: data.strength || 1,
        dexterity: data.dexterity || 1,
        stamina: data.stamina || 1,
        charisma: data.charisma || 1,
        manipulation: data.manipulation || 1,
        appearance: data.appearance || 1,
        perception: data.perception || 1,
        intelligence: data.intelligence || 1,
        wits: data.wits || 1,
        willpower_current: data.willpower_current || 1,
        willpower_permanent: data.willpower_permanent || 1,
        health_levels: JSON.stringify(data.health_levels ?? {}),
        notes: data.notes || null
      });
      npcId = result.lastInsertRowid as number;
      // 2. Modular splat trait tables
      switch (data.game_line) {
        case 'vampire':
          this.db.prepare(`
            INSERT INTO npc_vampire_traits
            (npc_id, clan, generation, blood_pool_current, blood_pool_max, humanity)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.clan ?? null,
            data.generation ?? null,
            data.blood_pool_current ?? null,
            data.blood_pool_max ?? null,
            data.humanity ?? null
          );
          break;
        case 'werewolf':
          this.db.prepare(`
            INSERT INTO npc_werewolf_traits
            (npc_id, breed, auspice, tribe, gnosis_current, gnosis_permanent, rage_current, rage_permanent, renown_glory, renown_honor, renown_wisdom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.breed ?? null,
            data.auspice ?? null,
            data.tribe ?? null,
            data.gnosis_current ?? null,
            data.gnosis_permanent ?? null,
            data.rage_current ?? null,
            data.rage_permanent ?? null,
            data.renown_glory ?? null,
            data.renown_honor ?? null,
            data.renown_wisdom ?? null
          );
          break;
        case 'mage':
          this.db.prepare(`
            INSERT INTO npc_mage_traits
            (npc_id, tradition_convention, arete, quintessence, paradox)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.tradition_convention ?? null,
            data.arete ?? null,
            data.quintessence ?? null,
            data.paradox ?? null
          );
          break;
        case 'changeling':
          this.db.prepare(`
            INSERT INTO npc_changeling_traits
            (npc_id, kith, seeming, glamour_current, glamour_permanent, banality_permanent)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            npcId,
            data.kith ?? null,
            data.seeming ?? null,
            data.glamour_current ?? null,
            data.glamour_permanent ?? null,
            data.banality_permanent ?? null
          );
          break;
      }

      // 3. Relational data (abilities, disciplines, gifts, spheres, arts, realms)
      if (data.abilities) {
        const abilities = template.abilities;
        const abilityStmt = this.db.prepare(`INSERT INTO character_abilities (character_id, ability_name, ability_type, rating, specialty) VALUES (?, ?, ?, ?, NULL)`);
        if (abilities.talents) {
          for (const [name, rating] of Object.entries(abilities.talents)) {
            abilityStmt.run(npcId, name, 'Talent', rating);
          }
        }
        if (abilities.skills) {
          for (const [name, rating] of Object.entries(abilities.skills)) {
            abilityStmt.run(npcId, name, 'Skill', rating);
          }
        }
        if (abilities.knowledges) {
          for (const [name, rating] of Object.entries(abilities.knowledges)) {
            abilityStmt.run(npcId, name, 'Knowledge', rating);
          }
        }
      }

      // 4. Supernatural powers (disciplines, gifts, spheres, arts, realms)
      if (template.supernatural?.disciplines) {
        const discStmt = this.db.prepare(`INSERT INTO character_disciplines (character_id, discipline_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.disciplines)) {
          discStmt.run(npcId, name, rating);
        }
      }
      if (template.supernatural?.gifts) {
        const giftStmt = this.db.prepare(`INSERT INTO character_gifts (character_id, gift_name, rank) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.gifts)) {
          giftStmt.run(npcId, name, rating);
        }
      }
      if (template.supernatural?.spheres) {
        const sphStmt = this.db.prepare(`INSERT INTO character_spheres (character_id, sphere_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.spheres)) {
          sphStmt.run(npcId, name, rating);
        }
      }
      if (template.supernatural?.arts) {
        const artStmt = this.db.prepare(`INSERT INTO character_arts (character_id, art_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.arts)) {
          artStmt.run(npcId, name, rating);
        }
      }
      if (template.supernatural?.realms) {
        const realmStmt = this.db.prepare(`INSERT INTO character_realms (character_id, realm_name, rating) VALUES (?, ?, ?)`);
        for (const [name, rating] of Object.entries(template.supernatural.realms)) {
          realmStmt.run(npcId, name, rating);
        }
      }
    })();

    return this.getAntagonistById(npcId!);
  }

  updateAntagonist(id: number, updates: Partial<AntagonistRow>): AntagonistRow | null {
    if (!updates || Object.keys(updates).length === 0) {
      return this.getAntagonistById(id);
    }

    const allowedFields = Object.keys(updates).filter(key => key !== "id");
    if (allowedFields.length === 0) {
      return this.getAntagonistById(id);
    }

    const setClause = allowedFields.map(field => `${field} = ?`).join(', ');
    const values = allowedFields.map(field => (updates as any)[field]);

    const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);

    return this.getAntagonistById(id);
  }

  listAntagonists(): AntagonistRow[] {
    const rows = this.db.prepare('SELECT * FROM npcs').all();
    return rows as AntagonistRow[];
  }

   removeAntagonist(id: number): boolean {
    const stmt = this.db.prepare(`DELETE FROM npcs WHERE id = ?`);
    const res = stmt.run(id);
    return res.changes > 0;
  }
}
````

## File: game-state-server/src/repositories/inventory.repository.ts
````typescript
import Database from 'better-sqlite3';
import type { InventoryItem } from '../types/index.js';

export class InventoryRepository {
  private db: Database.Database;
constructor(db: Database.Database) {
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

  updateItem(item_id: number, updates: any): any {
    const allowedFields = Object.keys(updates).filter(key => key !== "id");
    if (allowedFields.length === 0) {
      return this.getInventoryItemById(item_id);
    }

    const setClause = allowedFields.map(field => `${field} = ?`).join(', ');
    const values = allowedFields.map(field => (updates as any)[field]);

    const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
    stmt.run(...values, item_id);

    return this.getInventoryItemById(item_id);
  }

  removeItem(item_id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
    const res = stmt.run(item_id);
    return res.changes > 0;
  }

  // Inventory-related methods will be moved here if/when implemented
}
````

## File: game-state-server/src/repositories/status-effect.repository.ts
````typescript
import Database from 'better-sqlite3';

export class StatusEffectRepository {
  private db: Database.Database;
constructor(db: Database.Database) {
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
````

## File: game-state-server/src/repositories/world-state.repository.ts
````typescript
import Database from 'better-sqlite3';

export class WorldStateRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  saveWorldState(state: { location?: string; notes?: string; data?: any }): void {
    const dataStr = state.data ? JSON.stringify(state.data) : null;
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

  getWorldState(): { location: string; notes: string; data: any } | undefined {
    const worldState = this.db.prepare('SELECT location, notes, data FROM world_state WHERE id = 1').get() as { location: string; notes: string; data: string } | undefined;
    if (worldState) {
      try {
        worldState.data = typeof worldState.data === 'string' ? JSON.parse(worldState.data) : worldState.data;
      } catch (err) {
        console.error("Error parsing world state data:", err);
        worldState.data = null as any;
      }
    }
    return worldState;
  }

  saveStoryProgress(characterId: number, storyProgress: any): void {
    const progressStr = JSON.stringify(storyProgress);
    this.db.prepare(`
      INSERT INTO story_progress (character_id, progress_data, last_updated)
      VALUES (@character_id, @progress_data, CURRENT_TIMESTAMP)
      ON CONFLICT(character_id) DO UPDATE SET
        progress_data = excluded.progress_data,
        last_updated = excluded.last_updated;
    `).run({ character_id: characterId, progress_data: progressStr });
  }

  getInitiativeOrder(scene_id: string): any[] {
    const stmt = this.db.prepare(`SELECT actor_name, initiative_score, turn_order, character_id, npc_id FROM initiative_order WHERE scene_id = ? ORDER BY turn_order ASC`);
    return stmt.all(scene_id);
  }

  /**
   * Advance the turn order for a scene.
   * Returns an object indicating success, message, next actor, new round, and new turn order.
   */
  advanceTurn(
    scene_id: string
  ): { success: boolean; message?: string; next_actor?: any; new_round?: number; new_turn_order?: number } {
    // Get the current turn and round from current_turn table
    const scene = this.db
      .prepare('SELECT current_turn, current_round FROM current_turn WHERE scene_id = ?')
      .get(scene_id) as { current_turn: number; current_round: number } | undefined;

    if (!scene) {
      return { success: false, message: "Scene not found. Use setInitiative to start." };
    }

    // Get the full initiative order, ordered by turn_order ascending (one-based)
    const order = this.db
      .prepare('SELECT actor_name, initiative_score, turn_order, character_id, npc_id FROM initiative_order WHERE scene_id = ? ORDER BY turn_order ASC')
      .all(scene_id);

    if (order.length === 0) {
      return { success: false, message: "Initiative order is empty for this scene." };
    }

    // Calculate next turn (one-based)
    let nextTurnOrder = scene.current_turn + 1;
    let nextRound = scene.current_round;

    if (nextTurnOrder > order.length) {
      nextTurnOrder = 1;
      nextRound++;
    }

    // Update the current_turn table with new turn/round
    this.db
      .prepare('UPDATE current_turn SET current_turn = ?, current_round = ? WHERE scene_id = ?')
      .run(nextTurnOrder, nextRound, scene_id);

    // Fetch next actor (turn_order is one-based, as is index+1)
    const nextActor = order[nextTurnOrder - 1];

    return {
      success: true,
      next_actor: nextActor,
      new_round: nextRound,
      new_turn_order: nextTurnOrder,
    };
  }

  getCurrentTurn(scene_id: string): any {
    const turnData = this.db.prepare(`SELECT current_turn, current_round FROM current_turn WHERE scene_id = ?`).get(scene_id);
    return turnData || { current_turn: 0, current_round: 0 };
  }

  setInitiative(sceneId: string, entries: any[]): void {
    // Start a transaction
    const transaction = this.db.transaction(() => {
      // Delete existing initiative order for the scene
      this.db.prepare(`DELETE FROM initiative_order WHERE scene_id = ?`).run(sceneId);

      // Insert new initiative order entries
      const insert = this.db.prepare(`INSERT INTO initiative_order (scene_id, actor_name, initiative_score, turn_order, character_id, npc_id) VALUES (@scene_id, @actor_name, @initiative_score, @turn_order, @character_id, @npc_id)`);
      for (const entry of entries) {
        insert.run({ scene_id: sceneId, ...entry });
      }

      // If current_turn doesn't exist, create it
      if (!this.db.prepare(`SELECT 1 FROM current_turn WHERE scene_id = ?`).get(sceneId)) {
        this.db.prepare(`INSERT INTO current_turn (scene_id, current_turn, current_round) VALUES (?, 1, 1)`).run(sceneId);
      }
    });

    // Execute the transaction
    transaction();
  }
}
````

## File: game-state-server/src/tool-definitions.ts
````typescript
/**
 * Centralized tool definitions for every MCP tool supported by the game-state server.
 * Exports ONLY a plain object, with tool name as key and tool data as value.
 */
export const toolDefinitions = {
  create_character: {
    name: "create_character",
    description: "Create a new character in the game state.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Character name" },
        game_line: { type: "string", description: "Game line (e.g., Vampire, Werewolf, Mage, etc.)" },
        player: { type: "string", description: "Player name (optional)" }
      },
      required: ["name", "game_line"]
    },
    result: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        character_id: { type: "number" }
      }
    }
  },
  get_character: {
    name: "get_character",
    description: "Retrieve a character and their full data by character ID.",
    parameters: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" }
      },
      required: ["character_id"]
    },
    result: {
      type: "object",
      properties: {
        found: { type: "boolean" },
        character: { type: "object" }
      }
    }
  },
  get_character_by_name: {
    name: "get_character_by_name",
    description: "Retrieve a character and their full data by character name.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Character name" }
      },
      required: ["name"]
    },
    result: {
      type: "object",
      properties: {
        found: { type: "boolean" },
        character: { type: "object" }
      }
    }
  },
  proxy_tool: {
    name: "proxy_tool",
    description: "Proxy tool to call tools on other MCP servers.",
    parameters: {
      type: "object",
      properties: {
        server_address: { type: "string", description: "Address of the target MCP server" },
        tool_name: { type: "string", description: "Name of the tool to call on the target server" },
        arguments: { type: "object", description: "Arguments to pass to the tool" }
      },
      required: ["server_address", "tool_name", "arguments"]
    },
    result: {
      type: "object",
      properties: {
        content: { type: "array", items: { type: "object" } },
        isError: { type: "boolean" }
      }
    }
  }
};
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
````

## File: quick-start-guide.md
````markdown
# Quick Start Guide – Storyteller System (oWoD/Chronicles of Darkness)

Welcome to the Model Context Protocol Storyteller System server suite! This quick-start will help you make characters, play scenes, roll pools, and use the powerful automation included.

---

## 1. Creating Your First Character

Prompt the AI Storyteller/DM to create a World of Darkness character:

> "I'd like to be a Brujah vampire named Marcus. My Nature is Rebel and Demeanor is Bon Vivant."

The system will use the `create_character` tool and generate a character with Storyteller System stats:
- Attributes (Physical, Social, Mental)
- Abilities (Talents, Skills, Knowledges)
- Backgrounds, Supernatural traits, and powers
- Virtues, Willpower, Blood/Vitae (or Gnosis/Glamour/etc. by splat)

---

## 2. Beginning Play & Scenes

Start your story by asking:

> "Set the scene for my first night in Chicago."

The AI will narrate a vivid oWoD environment, introduce NPCs, and invite you to act and react.

---

## 3. Rolling Dice – The Dice Pool System

Actions are resolved using dice pools:

- Most tasks = Attribute + Ability (e.g., Dexterity + Stealth)
- The AI/DM prompts or rolls d10s for you, counting results of 6+ (successes).
- Example:

> "I try to sneak past the guard."
>
> (The AI rolls Dexterity + Stealth pool and narrates success/failure.)

---

## 4. Tracking Health, Willpower, and Resources

Instead of HP, you have health levels (Bruised, Hurt, Injured, etc.), tracked using the HealthTracker system.
- Damage is applied via `apply_damage`.
- Spend and recover resources (Willpower, Vitae, Quintessence) with `spend_resource` or `restore_resource`.
- XP can be spent to improve traits via `improve_trait`.

---

## 5. Checking Your Status

At any time, ask:

> "Show me my vampire sheet."

The system will output your current:
- Attributes, abilities, backgrounds
- Health levels and penalties
- Powers, disciplines, spendable resources

---

## 6. Example System Commands

- **Create character**: `create_character`
- **Roll dice pool**: `roll_wod_pool`
- **Apply/heal damage**: `apply_damage`, `heal_damage`
- **Resource use**: `spend_resource`, `restore_resource`
- **Increase trait**: `improve_trait`
- **Show initiative**: `get_initiative_order`
- **Roll for damage**: `roll_damage_pool`

---

## 7. Immersive Play Tips

- Describe what your character intends and their emotions.
- Use your backgrounds and powers creatively.
- Rely on the AI Storyteller for system mechanics—focus on ambiance and consequences.
- Engage NPCs, make allies and enemies, and drive the story with your personal goals.

---

Have fun exploring the World of Darkness!
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
    formatCommonDicePools(character),
    healthBlock,
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
  // (health block now included in formatCoreBlocks)

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
  // (health block now included in formatCoreBlocks)

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
  // (health block now included in formatCoreBlocks)

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
````

## File: game-state-server/src/repositories/character.repository.ts
````typescript
import Database from 'better-sqlite3';
import type { CharacterData } from '../types/character.types.js';

export class CharacterRepository {
  private db: Database.Database;
constructor(db: Database.Database) {
    this.db = db;
  }

  getCharacterByName(name: string): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE name = ?').get(name);
    return row ? (row as CharacterData) : null;
  }

  getCharacterById(id: number): CharacterData | null {
    const row = this.db.prepare('SELECT * FROM characters WHERE id = ?').get(id);
    return row ? (row as CharacterData) : null;
  }

  public updateCharacter(id: number, updates: Partial<CharacterData>): CharacterData | null {
    if (!updates || Object.keys(updates).length === 0) {
      return this.getCharacterById(id);
    }
    const allowedFields = Object.keys(updates).filter(key => key !== "id");
    if (allowedFields.length === 0) {
      return this.getCharacterById(id);
    }
    const setClause = allowedFields.map(field => `${field} = ?`).join(', ');
    const values = allowedFields.map(field => (updates as any)[field]);
    const stmt = this.db.prepare(`UPDATE characters SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);
    return this.getCharacterById(id);
  }
  listCharacters(): CharacterData[] {
    const rows = this.db.prepare('SELECT * FROM characters').all();
    return rows as CharacterData[];
  }

  /** Applies damage to a character, considering damage type and overflow. */
  public applyDamage(characterId: number, dmg: { aggravated?: number; lethal?: number; bashing?: number }): CharacterData | null {
    const character = this.getCharacterById(characterId);
    if (!character) {
      return null;
    }

    const prevHealth = character.health_levels ? JSON.parse(character.health_levels) : {};
    let boxes: ('/' | 'X' | '*' | '')[] = Array(7).fill('');

    // Apply damage logic here, considering types and overflow
    const applyType = (count: number, symbol: '/' | 'X' | '*') => {
      for (let i = 0; i < (count || 0); ++i) {
        let idx = -1;
        if (symbol === '*') {
          idx = boxes.findIndex(x => x === '' || x === '/' || x === 'X');
        } else if (symbol === 'X') {
          idx = boxes.findIndex(x => x === '' || x === '/');
        } else if (symbol === '/') {
          idx = boxes.findIndex(x => x === '');
        }
        if (idx !== -1) {
          if (
            boxes[idx] === '' ||
            (symbol === 'X' && boxes[idx] === '/') ||
            (symbol === '*' && (boxes[idx] === '/' || boxes[idx] === 'X'))
          ) {
            boxes[idx] = symbol;
          }
        }
      }
    };

    applyType(dmg.aggravated || 0, '*');
    applyType(dmg.lethal || 0, 'X');
    applyType(dmg.bashing || 0, '/');

    let over = boxes.filter(c => c === '*' || c === 'X' || c === '/').length - 7;
    if (over > 0) {
      for (let i = boxes.length - 1; i >= 0 && over > 0; --i) {
        if (boxes[i] !== '*') {
          boxes[i] = '*';
          over--;
        }
      }
    }

    const updatedHealthLevels = boxes.join('');

    this.db.prepare(`UPDATE characters SET health_levels = ? WHERE id = ?`).run(updatedHealthLevels, characterId);

    return this.getCharacterById(characterId);
  }

  createCharacter(data: any) {
    if (!['vampire', 'werewolf', 'mage', 'changeling'].includes(data.game_line)) {
      throw new Error(`Invalid game_line: ${data.game_line}. Must be one of: vampire, werewolf, mage, changeling`);
    }

    const health_levels = data.health_levels || { bruised: 0, hurt: 0, injured: 0, wounded: 0, mauled: 0, crippled: 0, incapacitated: 0 };
    let charId: number | undefined = undefined;

    // Transactional logic: all sub-table inserts are done atomically
    charId = this.db.transaction(() => {
      let localCharId: number;
      // Insert core character data
      const stmt = this.db.prepare(`
        INSERT INTO characters (
          name, concept, game_line,
          strength, dexterity, stamina, charisma, manipulation, appearance,
          perception, intelligence, wits,
          willpower_current, willpower_permanent, health_levels, experience
        ) VALUES (
          @name, @concept, @game_line,
          @strength, @dexterity, @stamina, @charisma, @manipulation, @appearance,
          @perception, @intelligence, @wits,
          @willpower_current, @willpower_permanent, @health_levels, @experience
        )
      `);

      const result = stmt.run({
        name: data.name,
        concept: data.concept || null,
        game_line: data.game_line,
        strength: data.strength || 1,
        dexterity: data.dexterity || 1,
        stamina: data.stamina || 1,
        charisma: data.charisma || 1,
        manipulation: data.manipulation || 1,
        appearance: data.appearance || 1,
        perception: data.perception || 1,
        intelligence: data.intelligence || 1,
        wits: data.wits || 1,
        willpower_current: data.willpower_current || 1,
        willpower_permanent: data.willpower_permanent || 1,
        health_levels: JSON.stringify(health_levels),
        experience: data.experience || 0
      });
      localCharId = result.lastInsertRowid as number;

      // --- Insert into game-line-specific tables ---
      switch (data.game_line) {
        case 'vampire':
          this.db.prepare(`
            INSERT INTO character_vampire_traits
            (character_id, clan, generation, blood_pool_current, blood_pool_max, humanity)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.clan ?? null,
            data.generation ?? 13,
            data.blood_pool_current ?? 10,
            data.blood_pool_max ?? 10,
            data.humanity ?? 7
          );
          break;
        case 'werewolf':
          this.db.prepare(`
            INSERT INTO character_werewolf_traits
            (character_id, breed, auspice, tribe, gnosis_current, gnosis_permanent, rage_current, rage_permanent, renown_glory, renown_honor, renown_wisdom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.breed ?? null, data.auspice ?? null, data.tribe ?? null,
            data.gnosis_current ?? 3, data.gnosis_permanent ?? 3,
            data.rage_current ?? 1, data.rage_permanent ?? 1,
            data.renown_glory ?? 0, data.renown_honor ?? 0, data.renown_wisdom ?? 0
          );
          break;
        case 'mage':
          this.db.prepare(`
            INSERT INTO character_mage_traits
            (character_id, tradition_convention, arete, quintessence, paradox)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.tradition_convention ?? null,
            data.arete ?? 1,
            data.quintessence ?? 0,
            data.paradox ?? 0
          );
          break;
        case 'changeling':
          this.db.prepare(`
            INSERT INTO character_changeling_traits
            (character_id, kith, seeming, glamour_current, glamour_permanent, banality_permanent)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            localCharId,
            data.kith ?? null, data.seeming ?? null,
            data.glamour_current ?? 4, data.glamour_permanent ?? 4,
            data.banality_permanent ?? 3
          );
          break;
      }

      // Changeling-specific: arts/realms
      if (data.game_line === "changeling") {
        if (data.arts && Array.isArray(data.arts)) {
          const artStmt = this.db.prepare(
            `INSERT INTO character_arts (character_id, art_name, rating) VALUES (?, ?, ?)`
          );
          for (const a of data.arts) {
            artStmt.run(localCharId, a.art_name ?? a.name ?? a.label ?? '', Number(a.rating) || 0);
          }
        }
        if (data.realms && Array.isArray(data.realms)) {
          const realmStmt = this.db.prepare(
            `INSERT INTO character_realms (character_id, realm_name, rating) VALUES (?, ?, ?)`
          );
          for (const r of data.realms) {
            realmStmt.run(localCharId, r.realm_name ?? r.name ?? r.label ?? '', Number(r.rating) || 0);
          }
        }
      }

      // Transactional inserts for all relations as needed
      if (data.abilities && Array.isArray(data.abilities)) {
        const abilityStmt = this.db.prepare(
          `INSERT INTO character_abilities (character_id, ability_name, ability_type, rating, specialty)
           VALUES (?, ?, ?, ?, ?)`
        );
        for (const ability of data.abilities) {
          abilityStmt.run(localCharId, ability.name, ability.type, ability.rating, ability.specialty ?? null);
        }
      }
      if (data.disciplines && Array.isArray(data.disciplines)) {
        const discStmt = this.db.prepare(
          `INSERT INTO character_disciplines (character_id, discipline_name, rating)
           VALUES (?, ?, ?)`
        );
        for (const d of data.disciplines) {
          discStmt.run(localCharId, d.name, d.rating);
        }
      }
      // ... perform additional transactional inserts for arts, realms, gifts, etc., as needed

      return localCharId;
    })();

    return this.getCharacterById(charId!);
  }
}
````

## File: game-state-server/src/tool-handlers/list_characters.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function list_characters_handler(db: GameDatabase, args: any) {
  const characters = db.characters.listCharacters();

  const characterList = characters.map(character => `${character.name} (ID: ${character.id})`).join('\n');

  return { content: makeTextContentArray([characterList || "No characters found."]) };
}
````

## File: game-state-server/src/tool-handlers/update_antagonist.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_antagonist_handler(db: GameDatabase, args: any) {
  const { antagonist_id, updates } = args;
  const antagonist = await db.antagonists.updateAntagonist(antagonist_id, updates);

  if (!antagonist) {
    return { content: makeTextContentArray([`❌ Antagonist with ID ${antagonist_id} not found.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Antagonist "${antagonist.name}" (ID: ${antagonist.id}) updated.`]) };
}
````

## File: game-state-server/src/tool-handlers/create_antagonist.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function create_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.template_name !== 'string' ||
    args.template_name.trim().length === 0 ||
    (args.custom_name && typeof args.custom_name !== 'string')
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'template_name' must be a non-empty string, and 'custom_name' (if provided) must be a string."
    ]), isError: true };
  }
  const { template_name, custom_name } = args;

  const antagonist = db.antagonists.createAntagonist(template_name, custom_name);

  if (!antagonist) {
    return { content: makeTextContentArray([`❌ Error creating antagonist from template: ${template_name}`]), isError: true };
  }

  return { content: makeTextContentArray([`Antagonist \"${antagonist.name}\" created (ID: ${antagonist.id})`]) };
}
````

## File: game-state-server/src/tool-handlers/get_antagonist.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_antagonist_handler(db: GameDatabase, args: any) {
  // Validate input
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "antagonist_id") ||
    (typeof args.antagonist_id !== "string" && typeof args.antagonist_id !== "number")
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing 'antagonist_id'. It must be a string or number."
      ]),
      isError: true
    };
  }

  const { antagonist_id } = args;
  const antagonist = db.antagonists.getAntagonistById(antagonist_id);

  if (!antagonist) {
    return { content: makeTextContentArray([`❌ Antagonist with ID ${antagonist_id} not found.`]), isError: true };
  }

  return { content: makeTextContentArray([JSON.stringify(antagonist, null, 2)]) };
}
````

## File: game-state-server/src/tool-handlers/list_antagonists.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function list_antagonists_handler(
  db: GameDatabase,
  args: any
) {
  const antagonists = db.antagonists.listAntagonists();

  const antagonistList = antagonists.map(antagonist => `${antagonist.name} (ID: ${antagonist.id})`).join('\n');

  return { content: makeTextContentArray([antagonistList || "No antagonists found."]) };
}
````

## File: game-state-server/src/tool-handlers/remove_antagonist.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function remove_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.antagonist_id !== 'number' ||
    Number.isNaN(args.antagonist_id)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing 'antagonist_id': must be a valid number."
    ]), isError: true };
  }
  const { antagonist_id } = args;
  const success = await db.antagonists.removeAntagonist(antagonist_id);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not remove antagonist with ID ${antagonist_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Antagonist with ID ${antagonist_id} removed successfully.`]) };
}
````

## File: game-state-server/src/tool-handlers/spend_resource.handler.ts
````typescript
// game-state-server/src/tool-handlers/spend_resource.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

export interface SpendResourceArgs {
  character_id: number;
  resource_name: string;
  amount?: number;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function spend_resource_handler(
  db: GameDatabase,
  args: SpendResourceArgs
): Promise<HandlerResponse> {
  try {
    // TODO: Implement CharacterRepository.spendResource for resource spending validation.
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    // Example: args.resource_name = 'willpower_current', args.amount = 1
    const { resource_name, amount = 1 } = args;
    const prev = character[resource_name] ?? 0;
    const updates: Partial<CharacterData> = {};
    updates[resource_name] = Math.max(prev - amount, 0);
    await db.characters.updateCharacter(args.character_id, updates);

    return { content: makeTextContentArray([`Resource ${resource_name} (-${amount}) spent for Character id ${args.character_id}`]) };
    // TODO: Dedicated spendResource logic (checks for overspending) should go in repo layer.
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("spend_resource_handler error:", error);
    return { content: makeTextContentArray([`❌ Error spending resource: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/spend_xp.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
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
      content: makeTextContentArray(errorMsgs),
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
      content: makeTextContentArray([`Trait '${trait_name}' improved from ${currVal} to ${currVal + 1}. XP spent: ${xpCost}. XP remaining: ${updated?.experience ?? 0}`])
    };
  } catch (err: any) {
    return {
      content: makeTextContentArray([err?.message || "Unknown error."]),
      isError: true
    };
  }
  return result;
}
````

## File: game-state-server/src/tool-handlers/update_character.handler.ts
````typescript
// game-state-server/src/tool-handlers/update_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';
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
    const character = await db.characters.updateCharacter(args.character_id, args.updates);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    return { content: makeTextContentArray([`Character "${character.name}" (ID ${character.id}) updated.`]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for 'error'
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("update_character_handler error:", error);
    return { content: makeTextContentArray([`❌ Error updating character: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/apply_damage.handler.ts
````typescript
// game-state-server/src/tool-handlers/apply_damage.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

export interface ApplyDamageArgs {
  target_id: number;
  amount?: number;
  level?: string;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function apply_damage_handler(db: GameDatabase, args: ApplyDamageArgs): Promise<HandlerResponse> {
  try {
    const { target_id, amount = 1, level = "bruised" } = args;

    if (typeof target_id !== 'number') {
      return { content: makeTextContentArray(["❌ target_id must be a number."]), isError: true };
    }
    if (typeof amount !== 'number') {
      return { content: makeTextContentArray(["❌ amount must be a number."]), isError: true };
    }
    if (typeof level !== 'string') {
      return { content: makeTextContentArray(["❌ level must be a string."]), isError: true };
    }
    if (!['bruised', 'hurt', 'injured', 'wounded', 'mauled', 'crippled', 'incapacitated'].includes(level)) {
      return { content: makeTextContentArray(["❌ Invalid level value."]), isError: true };
    }

    const dmg = {
      bashing: level === "bruised" ? amount : 0,
      lethal: level === "hurt" || level === "injured" || level === "wounded" ? amount : 0,
      aggravated: level === "mauled" || level === "crippled" || level === "incapacitated" ? amount : 0,
    };
    const character = db.characters.applyDamage(target_id, dmg);

    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${target_id} not found.`]), isError: true };
    }

    return { content: makeTextContentArray([`Damage applied (${amount} ${level}) to Character id ${target_id}`]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("apply_damage_handler error:", error);
    return { content: makeTextContentArray([`❌ Error applying damage: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/award_xp.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function award_xp_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== 'number' ||
    Number.isNaN(args.character_id) ||
    typeof args.amount !== 'number' ||
    Number.isNaN(args.amount)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'character_id' and 'amount' must be valid numbers."
    ]), isError: true };
  }

  const { character_id, amount, reason } = args;

  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  const newExperience = (character.experience || 0) + amount;
  db.characters.updateCharacter(character_id, { experience: newExperience });

  return { content: makeTextContentArray([`✅ Awarded ${amount} XP to ${character.name}. New total: ${newExperience}. Reason: ${typeof reason === "string" && reason.trim().length > 0 ? reason : "No reason provided."}`]) };
}
````

## File: game-state-server/src/tool-handlers/create_character.handler.ts
````typescript
// game-state-server/src/tool-handlers/create_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

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
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'name' must be a non-empty string and 'game_line' must be one of: vampire, werewolf, mage, changeling."
    ]), isError: true };
  }
  try {
    const character = await db.characters.createCharacter(args);
    if (!character) {
      return { content: makeTextContentArray([`❌ Error creating character: Character not found after creation.`]), isError: true };
    }
    return { content: makeTextContentArray([`Character \"${character.name}\" created with ID ${character.id}`]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("create_character_handler error:", error);
    return { content: makeTextContentArray([`❌ Error creating character: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/gain_resource.handler.ts
````typescript
// game-state-server/src/tool-handlers/gain_resource.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

export interface GainResourceArgs {
  character_id: number;
  resource_name: string;
  amount?: number;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function gain_resource_handler(
  db: GameDatabase,
  args: GainResourceArgs
): Promise<HandlerResponse> {
  try {
    if (typeof args.character_id !== 'number') {
      return { content: makeTextContentArray(["❌ character_id must be a number."]), isError: true };
    }
    if (typeof args.resource_name !== 'string') {
      return { content: makeTextContentArray(["❌ resource_name must be a string."]), isError: true };
    }
    if (typeof args.amount !== 'number') {
      return { content: makeTextContentArray(["❌ amount must be a number."]), isError: true };
    }
    // TODO: Implement CharacterRepository.gainResource for resource-specific logic.
    // For now, patch relevant field (e.g., increasing willpower, gnosis, etc.)
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    // Example: args.resource_name = 'willpower_current', args.amount = 1
    const { resource_name, amount = 1 } = args;
    const prev = character[resource_name] ?? 0;
    const updates: Partial<CharacterData> = {};
    updates[resource_name] = prev + amount;
    await db.characters.updateCharacter(args.character_id, updates);

    return { content: makeTextContentArray([`Resource ${resource_name} (+${amount}) gained for Character id ${args.character_id}`]) };
    // TODO: Dedicated gainResource logic (e.g., cap checks) should go in repo layer.
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("gain_resource_handler error:", error);
    return { content: makeTextContentArray([`❌ Error gaining resource: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/get_character_by_name.handler.ts
````typescript
// game-state-server/src/tool-handlers/get_character_by_name.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

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
      content: makeTextContentArray([
        "❌ Invalid or missing 'name'. A non-empty string is required."
      ]),
      isError: true
    };
  }
  try {
    const character = await db.characters.getCharacterByName(args.name);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with name ${args.name} not found.`]), isError: true };
    }
    return { content: makeTextContentArray([JSON.stringify(character, null, 2)]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("get_character_by_name_handler error:", error);
    return { content: makeTextContentArray([`❌ Error getting character: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/get_character.handler.ts
````typescript
// game-state-server/src/tool-handlers/get_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

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
      content: makeTextContentArray([
        "❌ Invalid or missing 'character_id'. Must provide a valid number."
      ]),
      isError: true
    };
  }
  try {
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    return { content: makeTextContentArray([JSON.stringify(character, null, 2)]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("get_character_handler error:", error);
    return { content: makeTextContentArray([`❌ Error getting character: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/get_status_effects.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
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
      content: makeTextContentArray([
        "❌ Invalid or missing arguments. 'target_type' must be a non-empty string, 'target_id' must be a valid number."
      ]),
      isError: true
    };
  }
  const { target_type, target_id } = args;
  const effects = db.statusEffects.listStatusEffects(target_type, target_id);

  const effectList = effects.map(effect => `${effect.effect_name} (ID: ${effect.id})`).join('\n');

  return { content: makeTextContentArray([effectList || `No status effects found for ${target_type} with ID ${target_id}.`]) };
}
````

## File: game-state-server/src/tool-handlers/get_world_state.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_world_state_handler(db: GameDatabase, args: any) {
  const worldState = db.worldState.getWorldState();
  return { content: makeTextContentArray([JSON.stringify(worldState, null, 2)]) };
}
````

## File: game-state-server/src/tool-handlers/remove_item.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
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
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'target_type' must be 'character', 'target_id' and 'item_id' must be valid numbers."
    ]), isError: true };
  }
  const { target_type, target_id, item_id } = args;

  const success = db.inventory.removeItem(item_id);
  return { content: makeTextContentArray([`✅ Removed item with ID ${item_id} from ${target_type} with ID ${target_id}.`]) };
}
````

## File: game-state-server/src/tool-handlers/remove_status_effect.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function remove_status_effect_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.effect_id !== 'number' ||
    Number.isNaN(args.effect_id)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing 'effect_id': must be a valid number."
    ]), isError: true };
  }
  const { effect_id } = args;
  const success = db.statusEffects.removeStatusEffect(effect_id);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not remove status effect with ID ${effect_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Removed status effect with ID ${effect_id}.`]) };
}
````

## File: game-state-server/src/tool-handlers/restore_resource.handler.ts
````typescript
// game-state-server/src/tool-handlers/restore_resource.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

export interface RestoreResourceArgs {
  character_id: number;
  resource_name: string;
  amount?: number;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function restore_resource_handler(
  db: GameDatabase,
  args: RestoreResourceArgs
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id) ||
    typeof args.resource_name !== "string" ||
    args.resource_name.trim().length === 0 ||
    (args.amount !== undefined && (typeof args.amount !== "number" || Number.isNaN(args.amount)))
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'character_id' must be a valid number, 'resource_name' must be a non-empty string, and 'amount' (if provided) must be a valid number."
    ]), isError: true };
  }
  try {
    // TODO: Implement CharacterRepository.restoreResource for resource restoration semantics.
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    // Example: args.resource_name = 'willpower_current', args.amount restores to value or adds amount
    const { resource_name, amount } = args;
    const maxResource = character[`${resource_name}_permanent`] || character[resource_name]; // Fallback
    const updates: Partial<CharacterData> = {};
    if (typeof amount === 'number') {
      // Clamp to max
      updates[resource_name] = Math.min((character[resource_name] ?? 0) + amount, maxResource ?? amount);
    } else {
      // Optional: If direct restore
      // updates[resource_name] = maxResource;
    }
    await db.characters.updateCharacter(args.character_id, updates);

    return { content: makeTextContentArray([`Resource ${resource_name} restored for Character id ${args.character_id}`]) };
    // TODO: Dedicated restoreResource logic (caps, full/partial restore rules) should go in repo layer.
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("restore_resource_handler error:", error);
    return { content: makeTextContentArray([`❌ Error restoring resource: ${errMsg}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/update_item.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_item_handler(db: GameDatabase, args: any) {
  const { target_type, target_id, item_id, updates } = args;

  if (target_type !== 'character') {
    return { content: makeTextContentArray(["❌ Tool update_item only supports target_type 'character' at this time."]), isError: true };
  }
  const item = db.inventory.updateItem(item_id, updates);

  return { content: makeTextContentArray([`✅ Updated item with ID ${item_id}.`]) };
}
````

## File: game-state-server/src/tool-handlers/add_item.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function add_item_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== 'string' ||
    args.target_type !== 'character' ||
    !Object.prototype.hasOwnProperty.call(args, 'target_id') ||
    typeof args.target_id !== 'number' ||
    Number.isNaN(args.target_id) ||
    typeof args.item_name !== 'string' ||
    args.item_name.trim().length === 0
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid input: 'target_type' must be 'character', 'target_id' must be a valid number, and 'item_name' must be a non-empty string."
    ]), isError: true };
  }

  const { target_type, target_id, item_name, description } = args;
  try {
    const newItem = await db.inventory.add(target_id, { name: item_name, description: description });
    return { content: makeTextContentArray([`✅ Added item "${item_name}" (ID: ${newItem.id}) to character (ID: ${target_id}).`]) };
  } catch (error: any) {
    return { content: makeTextContentArray([`❌ Error adding item: ${error.message}`]), isError: true };
  }
}
````

## File: game-state-server/src/tool-handlers/advance_turn.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function advance_turn_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, 'scene_id') ||
    (typeof args.scene_id !== 'string' && typeof args.scene_id !== 'number')
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing 'scene_id'. Must provide a scene_id as a string or number."
    ]), isError: true };
  }

  const { scene_id } = args;
  db.worldState.advanceTurn(scene_id);
  return { content: makeTextContentArray([`✅ Advanced turn for scene ${scene_id}.`]) };
}
````

## File: game-state-server/src/tool-handlers/apply_status_effect.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
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
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments. 'target_type' must be 'character' or 'npc', 'target_id' must be a valid number, 'effect_name' must be a non-empty string."
    ]), isError: true };
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

  return { content: makeTextContentArray([`✅ Applied status effect \"${effect_name}\" (ID: ${effectId}) to ${target_type} with ID ${target_id}.`]) };
}
````

## File: game-state-server/src/tool-handlers/get_current_turn.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_current_turn_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "scene_id") ||
    (typeof args.scene_id !== "string" && typeof args.scene_id !== "number")
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing 'scene_id'. Must provide a string or number."
      ]),
      isError: true
    };
  }
  const { scene_id } = args;
  const currentTurn = db.worldState.getCurrentTurn(scene_id);
  return { content: makeTextContentArray([JSON.stringify(currentTurn, null, 2)]) };
}
````

## File: game-state-server/src/tool-handlers/get_initiative_order.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_initiative_order_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "scene_id") ||
    (typeof args.scene_id !== "string" && typeof args.scene_id !== "number")
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing 'scene_id'. Must provide a string or number."
      ]),
      isError: true
    };
  }
  const { scene_id } = args;
  const initiativeOrder = db.worldState.getInitiativeOrder(scene_id);
  return { content: makeTextContentArray([JSON.stringify(initiativeOrder, null, 2)]) };
}
````

## File: game-state-server/src/tool-handlers/get_inventory.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_inventory_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== "string" ||
    args.target_type !== "character" ||
    !Object.prototype.hasOwnProperty.call(args, "target_id") ||
    typeof args.target_id !== "number" ||
    Number.isNaN(args.target_id)
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments. 'target_type' must be 'character' and 'target_id' must be a valid number."
      ]),
      isError: true
    };
  }
  const { target_type, target_id } = args;

  if (target_type !== 'character') {
    return { content: makeTextContentArray(["❌ Tool get_inventory only supports target_type 'character' at this time."]), isError: true };
  }
  const inventory = db.inventory.getInventory(target_id);

  return { content: makeTextContentArray([JSON.stringify(inventory, null, 2)]) };
}
````

## File: game-state-server/src/tool-handlers/get_trait_improvement_cost.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_trait_improvement_cost_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id) ||
    typeof args.trait_name !== "string" ||
    args.trait_name.trim().length === 0
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments. 'character_id' must be a valid number and 'trait_name' must be a non-empty string."
      ]),
      isError: true
    };
  }
  const { character_id, trait_name } = args;
  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  let cost = 5; // Default cost
  switch (character.game_line) {
    case 'vampire':
      cost = 7;
      break;
    case 'werewolf':
      cost = 8;
      break;
    case 'mage':
      cost = 9;
      break;
    case 'changeling':
      cost = 6;
      break;
  }

  return { content: makeTextContentArray([`The cost to improve ${trait_name} is ${cost} XP.`]) };
}
````

## File: game-state-server/src/tool-handlers/improve_trait.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function improve_trait_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id) ||
    typeof args.trait_name !== "string" ||
    args.trait_name.trim().length === 0 ||
    typeof args.amount !== "number" ||
    Number.isNaN(args.amount)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'character_id' and 'amount' must be valid numbers, 'trait_name' must be a non-empty string."
    ]), isError: true };
  }
  const { character_id, trait_name, amount } = args;
  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  if (!character.hasOwnProperty(trait_name)) {
    return { content: makeTextContentArray([`❌ Character does not have trait ${trait_name}.`]), isError: true };
  }

  const newTraitValue = (character[trait_name] || 0) + amount;
  db.characters.updateCharacter(character_id, { [trait_name]: newTraitValue });

  return { content: makeTextContentArray([`✅ Improved ${trait_name} for ${character.name} by ${amount}. New value: ${newTraitValue}`]) };
}
````

## File: game-state-server/src/tool-handlers/save_story_progress.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_story_progress_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, 'story_progress') ||
    !Object.prototype.hasOwnProperty.call(args, 'character_id')
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments: both 'character_id' and 'story_progress' are required."
      ]),
      isError: true
    };
  }
  const { character_id, story_progress } = args;

  try {
    db.worldState.saveStoryProgress(character_id, story_progress);
    return { content: makeTextContentArray([`✅ Story progress saved successfully.`]) };
  } catch (error: any) {
    return {
      content: makeTextContentArray([`❌ Could not save story progress: ${error.message || error}`]),
      isError: true
    };
  }
}
````

## File: game-state-server/src/tool-handlers/save_world_state.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_world_state_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, 'world_state')
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments: 'world_state' is required."
      ]),
      isError: true
    };
  }
  const { world_state } = args;
  try {
    db.worldState.saveWorldState(world_state);
  } catch (err) {
    const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
    return { content: makeTextContentArray([`❌ Could not save world state: ${errorMsg}`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ World state saved successfully.`]) };
}
````

## File: game-state-server/src/tool-handlers/set_initiative.handler.ts
````typescript
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function set_initiative_handler(db: GameDatabase, args: any) {
  const { scene_id, entries } = args;
  try {
    db.worldState.setInitiative(scene_id, entries);
  } catch (err) {
    const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
    return { content: makeTextContentArray([`❌ Could not set initiative for scene ${scene_id}: ${errorMsg}`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Set initiative for scene ${scene_id}.`]) };
}
````

## File: combat-engine-server/src/index.ts
````typescript
// File: combat-engine-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

interface CombatState {
  log: string[];
}

let combatState: CombatState = {
  log: []
};

// Utility: Serialize any array of strings/objects as { type: 'text', text: string }[] for MCP compliance
function makeTextContentArray(contentArr: any[]): { type: 'text', text: string }[] {
  return contentArr.map(entry => {
    if (typeof entry === "string") {
      return { type: 'text', text: entry };
    }
    if (entry && typeof entry === "object" && entry.type === "text" && typeof entry.text === "string") {
      // Already compliant
      return entry;
    }
    // For any other objects/values, serialize as prettified JSON
    return { type: 'text', text: JSON.stringify(entry, null, 2) };
  });
}

function rollWodPool(pool_size: number, difficulty: number, has_specialty: boolean, force_result?: string): {
  successes: number,
  rolls: number[],
  isBotch: boolean,
  isSpectacular: boolean,
  resultText: string
} {
    if (pool_size < 0) {
      throw new Error("Pool size must be a non-negative integer.");
    }

    // Handle forced results for testing
    if (force_result) {
      switch (force_result) {
        case 'botch':
          return {
            successes: 0,
            rolls: [1, 1],
            isBotch: true,
            isSpectacular: false,
            resultText: "BOTCH! Catastrophic failure (forced for testing)."
          };
        case 'failure':
          return {
            successes: 0,
            rolls: [3, 4],
            isBotch: false,
            isSpectacular: false,
            resultText: "Failure – no successes (forced for testing)."
          };
        case 'success':
          // Force a 10 to test specialty rules
          const forcedRolls = [10, 8];
          let forcedSuccesses = 0;
          for (const r of forcedRolls) {
            if (r >= difficulty) {
              forcedSuccesses += (r === 10 && has_specialty) ? 2 : 1;
            }
          }
          return {
            successes: forcedSuccesses,
            rolls: forcedRolls,
            isBotch: false,
            isSpectacular: false,
            resultText: `Successes: ${forcedSuccesses} (forced for testing${has_specialty ? ', specialty applied to 10s' : ''})`
          };
        case 'specialty_test':
          // Specifically test specialty rules with multiple 10s
          const specialtyRolls = [10, 10, 6];
          let specialtySuccesses = 0;
          for (const r of specialtyRolls) {
            if (r >= difficulty) {
              specialtySuccesses += (r === 10 && has_specialty) ? 2 : 1;
            }
          }
          return {
            successes: specialtySuccesses,
            rolls: specialtyRolls,
            isBotch: false,
            isSpectacular: false,
            resultText: `Successes: ${specialtySuccesses} (specialty test: ${has_specialty ? '2 tens = 4 successes + 1 regular = 5 total' : '2 tens = 2 successes + 1 regular = 3 total'})`
          };
      }
    }

    if (pool_size < 1) { // Handle 0-dice "chance die" rolls
        const roll = Math.floor(Math.random() * 10) + 1;
        if (roll === 1) return { successes: 0, rolls: [1], isBotch: true, isSpectacular: false, resultText: "BOTCH! Catastrophic failure." };
        if (roll === 10) return { successes: 1, rolls: [10], isBotch: false, isSpectacular: false, resultText: "Successes: 1" };
        return { successes: 0, rolls: [roll], isBotch: false, isSpectacular: false, resultText: "Failure – no successes." };
    }
    if (difficulty < 2 || difficulty > 10) throw new Error("Difficulty must be between 2 and 10");

    const rolls = Array.from({ length: pool_size }, () => Math.floor(Math.random() * 10) + 1);

    let successes = 0;
    let botches = 0;
    for (const r of rolls) {
        if (r >= difficulty) {
            successes += (r === 10 && has_specialty) ? 2 : 1;
        } else if (r === 1) {
            botches += 1;
        }
    }

    // Revised V20/VTM Botch logic: botch only if *no* successes AND at least one '1'
    const isBotch = (successes === 0 && botches > 0);
    const totalSuccesses = successes - botches;
    const finalSuccesses = isBotch ? 0 : totalSuccesses;
    const isSpectacular = !isBotch && finalSuccesses >= 5;

    let resultText = '';
    if (isBotch) {
        resultText = `BOTCH! Catastrophic failure (${botches}x 1's rolled).`;
    } else if (finalSuccesses === 0) {
        resultText = "Failure – no successes.";
    } else {
        resultText = `Successes: ${finalSuccesses}`;
        if (isSpectacular) resultText += " (Spectacular Success!)";
    }

    return { successes: finalSuccesses, rolls, isBotch, isSpectacular, resultText };
}

const toolDefinitions = [
    {
        name: 'roll_wod_pool',
        description: 'Roll an oWoD dice pool. For pool_size 0, performs a chance die roll.',
        inputSchema: {
            type: 'object',
            properties: {
                pool_size: { type: 'integer', minimum: 0, description: 'Number of dice to roll. 0 = chance die.' },
                difficulty: { type: 'integer', minimum: 2, maximum: 10, description: 'Target number for success. Not used for chance die (pool_size 0).' },
                has_specialty: { type: 'boolean', default: false, description: 'Whether the character has a specialty (10s count as 2 successes).' },
                character_id: { type: 'integer', description: 'Character ID for context (optional).' },
                actor_context: { type: 'object', description: 'Actor context for narrative modifiers (optional).' },
                force_result: { type: 'string', enum: ['botch', 'failure', 'success', 'specialty_test'], description: 'For testing: force a specific result type', nullable: true }
            },
            required: ['pool_size']
        }
    },
    {
        name: 'roll_contested_action',
        description: 'Resolve a contested action.',
        inputSchema: {
            type: 'object',
            properties: {
                attacker_pool: { type: 'integer' },
                attacker_difficulty: { type: 'integer' },
                attacker_specialty: { type: 'boolean' },
                defender_pool: { type: 'integer' },
                defender_difficulty: { type: 'integer' },
                defender_specialty: { type: 'boolean' }
            },
            required: ['attacker_pool', 'attacker_difficulty', 'defender_pool', 'defender_difficulty']
        }
    },
    {
        name: 'roll_soak',
        description: 'Roll for soaking damage in oWoD. Args: soak_pool (dice count), damage_type ("bashing","lethal","aggravated"), has_fortitude (bool, default false). Returns narrative result and soak count.',
        inputSchema: {
            type: 'object',
            properties: {
                soak_pool: { type: 'integer' },
                damage_type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'] },
                has_fortitude: { type: 'boolean' }
            },
            required: ['soak_pool', 'damage_type']
        }
    },
    {
        name: 'roll_damage_pool',
        description: 'Rolls a damage pool (e.g., Strength + Weapon Damage) to determine how many levels of damage are dealt after a successful attack.',
        inputSchema: {
            type: 'object',
            properties: {
                pool_size: { type: 'integer' },
                damage_type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'], default: 'lethal' }
            },
            required: ['pool_size'],
        }
    },
    // Initiative & Turn Management (moved from game-state, orchestrator/bridge style):
      {
        name: "set_initiative",
        description: 'Set the initiative order for a scene. Central combat tool—calls game-state for persistence.',
        inputSchema: {
          type: 'object',
          properties: {
            scene_id: { type: 'string' },
            entries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  character_id: { type: ["number", "null"] },
                  npc_id: { type: ["number", "null"] },
                  actor_name: { type: "string" },
                  initiative_score: { type: "number" },
                  turn_order: { type: "number" }
                },
                required: ["actor_name", "initiative_score", "turn_order"]
              }
            }
          },
          required: ['scene_id', 'entries']
        }
      },
      {
        name: 'get_initiative_order',
    description: 'Get the current initiative order for a scene.',
    inputSchema: {
      type: 'object',
      properties: { scene_id: { type: 'string' } },
      required: ['scene_id']
    }
  },
  {
    name: 'advance_turn',
    description: 'Advance the turn order in the current scene.',
    inputSchema: {
      type: 'object',
      properties: { scene_id: { type: 'string' } },
      required: ['scene_id']
    }
  },
  {
    name: 'get_current_turn',
    description: 'Get the actor and round for the current turn in a scene.',
    inputSchema: {
      type: 'object',
      properties: { scene_id: { type: 'string' } },
      required: ['scene_id']
    }
  },
  // --- Social Combat Tool ---
  {
    name: 'roll_social_combat',
    description: 'Perform a contested social action (e.g., Intimidation vs. Willpower). Resolves, provides narrative, and recommends status effect/Willpower impact.',
    inputSchema: {
      type: 'object',
      properties: {
        attacker_name: { type: 'string' },
        attacker_pool: { type: 'number' },
        target_name: { type: 'string' },
        target_pool: { type: 'number' },
        attack_type: { type: 'string', enum: ['intimidation', 'persuasion', 'seduction', 'subterfuge'] }
      },
      required: ['attacker_name', 'attacker_pool', 'target_name', 'target_pool', 'attack_type']
    }
  }
  // ---------- PHASE 2: GAME-LINE SPECIFIC TOOL SCHEMA DEFINITIONS ----------
  ,
  // Vampire: Virtue/Frenzy/Humanity Check
  {
    name: "roll_virtue_check",
    description: "Roll a Virtue check in the Vampire line (e.g., Humanity, Frenzy, Rötschreck). Used for Conscience/Conviction, Self-Control/Instinct, Courage, etc.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "Character to roll for" },
        virtue_name: { type: "string", description: "The virtue being rolled, e.g., 'conscience', 'self-control', 'courage'" },
        difficulty: { type: "integer", description: "Standard difficulty, e.g. 6, 8" }
      },
      required: ["character_id", "virtue_name", "difficulty"]
    }
  },
  // Werewolf: Change Form
  {
    name: "change_form",
    description: "Change forms (Homid, Glabro, Crinos, Hispo, Lupus) for a Werewolf. Returns new attribute modifiers.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "The Garou" },
        target_form: { type: "string", enum: ["Homid", "Glabro", "Crinos", "Hispo", "Lupus"], description: "Form to assume" }
      },
      required: ["character_id", "target_form"]
    }
  },
  // Werewolf: Spend Rage for Extra Actions
  {
    name: "spend_rage_for_extra_actions",
    description: "Spend Werewolf Rage for extra actions in a turn.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "The Garou" },
        actions_to_gain: { type: "integer", description: "Number of additional actions to activate" }
      },
      required: ["character_id", "actions_to_gain"]
    }
  },
  // Mage: Magick Effect Roll
  {
    name: "roll_magick_effect",
    description: "Mage Arete roll for magick effect casting. Returns magick successes and potential Paradox gain.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "Mage preset" },
        spheres: { type: "array", items: { type: "string" }, description: "Spheres being used (e.g., ['Forces', 'Entropy'])" },
        arete_roll_pool: { type: "integer", description: "Dice pool (usually Arete)" },
        difficulty: { type: "integer", description: "Difficulty (6 coincidental/7+ vulgar)" },
        is_coincidental: { type: "boolean", description: "True for coincidental, False for vulgar" },
        force_result: { type: "string", enum: ["botch", "failure", "success", "specialty_test"], description: "For testing: force a specific result type", nullable: true }
      },
      required: ["character_id", "spheres", "arete_roll_pool", "difficulty", "is_coincidental"]
    }
  },
  // Changeling: Cantrip
  {
    name: "invoke_cantrip",
    description: "Changeling cantrip roll. Rolls Art + Realm pool against difficulty.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer" },
        art_pool: { type: "integer", description: "Art dots" },
        realm_pool: { type: "integer", description: "Realm dots" },
        difficulty: { type: "integer" },
        force_result: { type: "string", enum: ["botch", "failure", "success", "specialty_test"], description: "For testing: force a specific result type", nullable: true }
      },
      required: ["character_id", "art_pool", "realm_pool", "difficulty"]
    }
  }
];

const server = new Server({
name: 'rpg-combat-engine-server',
version: '2.0.0',
}, {
capabilities: {
  tools: Object.fromEntries(
    toolDefinitions.map(tool => [tool.name, tool])
  )
},
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Stateless tool: Delegates to rpg-game-state for all persistent initiative operations—
      // DOES NOT read or mutate world/scene/character state here. This handler returns only
      // instructions for the caller to invoke the proper stateful mechanism on rpg-game-state.
      case "roll_initiative_for_scene": {
        const { scene_id, actors } = args;
        return {
          content: makeTextContentArray([
            {
              description:
                "Delegating to rpg-game-state. Please call roll_initiative_for_scene there.",
              next_tool_call: {
                server: "rpg-game-state",
                tool_name: "roll_initiative_for_scene",
                arguments: { scene_id, actors },
              },
            },
          ]),
        };
      }
      // === PHASE 2 NEW TOOLS ===

      // Stateless tool: Computes Virtue check results but DOES NOT read or write character/game/world state.
      // Only returns rolls and check summary. The caller must apply any effects/XP/state change externally.
      case 'roll_virtue_check': {
        const { character_id, virtue_name, difficulty } = args;
        const allowedVirtues = ["Conscience", "Self-Control", "Courage", "Conviction", "Instinct"]; // tune as appropriate
        if (typeof virtue_name !== "string" || !allowedVirtues.includes(virtue_name)) {
          return {
            content: makeTextContentArray([{ type: 'text', text: `Error: 'virtue_name' must be one of: ${allowedVirtues.join(", ")}` }]),
            isError: true
          };
        }
        if (typeof difficulty !== "number" || !Number.isInteger(difficulty) || difficulty < 2 || difficulty > 10) {
          return {
            content: makeTextContentArray([{ type: 'text', text: `Error: 'difficulty' must be an integer between 2 and 10.` }]),
            isError: true
          };
        }
        // The pool_size should eventually be loaded from DB, but is now a placeholder.
        const pool_size = 3;
        const result = rollWodPool(pool_size, difficulty, false);
        return {
          content: makeTextContentArray([
            `🎭 Virtue Check (${virtue_name})\nRolled: [${result.rolls.join(', ')}]\nResult: ${result.successes} successes\n${result.resultText}`,
            JSON.stringify({
              virtue: virtue_name,
              successes: result.successes,
              rolls: result.rolls,
              isBotch: result.isBotch
            })
          ])
        };
      }
      // Stateless tool: Only computes attribute modifiers for physical form change.
      // Does NOT mutate or depend on character state—caller must use the returned modifiers/instructions
      // to update persistent character data with the appropriate stateful tool on the game-state server.
      case 'change_form': {
        const { character_id, target_form } = args;
        const allowedForms = ["Homid", "Glabro", "Crinos", "Hispo", "Lupus"];
        if (typeof target_form !== "string" || !allowedForms.includes(target_form)) {
          return {
            content: makeTextContentArray([
              { type: "text", text: `Error: 'target_form' must be one of: ${allowedForms.join(", ")}` }
            ]),
            isError: true
          };
        }
        const form_mods: Record<string, any> = {
          Homid:   { str: 0, dex: 0, sta: 0, app: 0 },
          Glabro:  { str: +2, dex: 0, sta: +2, app: -1 },
          Crinos:  { str: +4, dex: +1, sta: +3, app: -3 },
          Hispo:   { str: +3, dex: +2, sta: +2, app: -3 },
          Lupus:   { str: +1, dex: +2, sta: +1, app: -2 }
        };
        const mods = form_mods[target_form];
        return {
          content: makeTextContentArray([
            `🐺 Change form: ${target_form}\nAttribute modifiers: ${JSON.stringify(mods)}`,
            { character_id, target_form, modifiers: mods }
          ])
        };
      }

      // Stateless tool: Calculates extra actions requested. DOES NOT spend Rage or mutate initiative state.
      // The client/caller MUST invoke a stateful spend_resource and update_initiative tool elsewhere to commit.
      case 'spend_rage_for_extra_actions': {
        const { character_id, actions_to_gain } = args;
        if (typeof actions_to_gain !== "number" || !Number.isInteger(actions_to_gain) || actions_to_gain < 1 || actions_to_gain > 5) {
          return {
            content: makeTextContentArray([{ type: 'text', text: "Error: 'actions_to_gain' must be an integer between 1 and 5." }]),
            isError: true
          };
        }
        return {
          content: makeTextContentArray([
            `🔥 ${actions_to_gain} action(s) activated by spending Rage for character #${character_id}.`,
            { character_id, actions_gained: actions_to_gain, note: "Caller must actually spend Rage and update initiative elsewhere." }
          ])
        };
      }
      // Stateless tool: Mage magick effect roll.
      // Only computes and outputs result (successes, paradox, botch info).
      // Caller is responsible for invoking *any* stateful resource/Paradox update tool.
      case 'roll_magick_effect': {
        const { character_id, spheres, arete_roll_pool, difficulty, is_coincidental, force_result } = args;
        if (typeof arete_roll_pool !== "number" || !Number.isInteger(arete_roll_pool) || arete_roll_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'arete_roll_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        if (typeof difficulty !== "number" || !Number.isInteger(difficulty) || difficulty < 2 || difficulty > 10) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'difficulty' must be an integer between 2 and 10." }]),
            isError: true
          };
        }
        // Simple oWoD Arete roll; if vulgar & fails, paradox accrues
        const result = rollWodPool(arete_roll_pool, difficulty, false, force_result);
        let paradox_gain = 0;
        let backlash_narrative = "";

        if (!is_coincidental) {
          paradox_gain = Math.max(1, 5 - result.successes);
        }

        // Handle Paradox backlash on botch for vulgar magick
        if (result.isBotch && !is_coincidental) {
          paradox_gain += 3; // Additional paradox for botched vulgar magick
          backlash_narrative = "\n🌪️ PARADOX BACKLASH! The vulgar magick botch tears at reality itself. The mage suffers immediate consequences as the universe strikes back against their hubris.";
        }

        let output = `✨ Mage Magick Roll\nRolled: [${result.rolls.join(', ')}]\nSuccesses: ${result.successes}\nParadox Gained: ${paradox_gain}`;
        if (backlash_narrative) {
          output += backlash_narrative;
        }

        return {
          content: makeTextContentArray([
            output,
            JSON.stringify({
              character_id,
              spheres,
              successes: result.successes,
              paradox_gain,
              isBotch: result.isBotch,
              backlash: result.isBotch && !is_coincidental
            })
          ])
        };
      }
      // Stateless tool: Changeling Cantrip roll.
      // Computes result (success, botch, banality). Does NOT mutate glamour, banality, or character state.
      // Caller must use results to update state via other tools.
      case 'invoke_cantrip': {
        const { character_id, art_pool, realm_pool, difficulty, force_result } = args;
        if (typeof art_pool !== "number" || !Number.isInteger(art_pool) || art_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'art_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        if (typeof realm_pool !== "number" || !Number.isInteger(realm_pool) || realm_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'realm_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        if (typeof difficulty !== "number" || !Number.isInteger(difficulty) || difficulty < 2 || difficulty > 10) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'difficulty' must be an integer between 2 and 10." }]),
            isError: true
          };
        }
        const total_pool = (art_pool || 0) + (realm_pool || 0);
        const result = rollWodPool(total_pool, difficulty, false, force_result);

        let banality_narrative = "";
        let banality_gain = 0;

        // Handle Banality trigger on botch
        if (result.isBotch) {
          banality_gain = 1; // Changeling gains 1 point of Banality
          banality_narrative = "\n💀 BANALITY SURGE! The botched cantrip backfires, and the cold touch of mundane reality seeps into the changeling's soul. The magic fails catastrophically, leaving them more disconnected from their fae nature.";
        }

        let output = `🎠 Cantrip: Art + Realm (${art_pool}+${realm_pool}) -> Rolled: [${result.rolls.join(', ')}], Successes: ${result.successes}`;
        if (banality_narrative) {
          output += banality_narrative;
        }

        return {
          content: makeTextContentArray([
            output,
            JSON.stringify({
              character_id,
              successes: result.successes,
              rolls: result.rolls,
              isBotch: result.isBotch,
              banality_gain,
              banality_triggered: result.isBotch
            })
          ])
        };
      }
      // Stateless tool: Generic WoD dice pool. Computes only; NO character/resource/world state mutation.
      // Any spending of Willpower, resource, or logging must be invoked externally by the consumer.
      case 'roll_wod_pool': {
        const { pool_size, difficulty, has_specialty = false, character_id, actor_context, force_result, ...rest } = args;

        // [EXTRA-ADDED: Hardened validation per requirements]
        if (typeof pool_size !== "number" || !Number.isInteger(pool_size) || pool_size < 0) {
          return {
            content: makeTextContentArray(["Error: 'pool_size' must be a non-negative integer."]),
            isError: true
          };
        }
        if (pool_size > 0 && (typeof difficulty !== "number" || !Number.isInteger(difficulty) || difficulty < 2 || difficulty > 10)) {
          return {
            content: makeTextContentArray(["Error: 'difficulty' must be an integer between 2 and 10."]),
            isError: true
          };
        }
       
        // --- Input Validation ---
        if (typeof pool_size !== "number" || pool_size < 0 || !Number.isFinite(pool_size) || !Number.isInteger(pool_size)) {
          return { content: makeTextContentArray(
            ["Error: 'pool_size' must be a non-negative integer."]), isError: true };
        }
      
        // For chance die rolls (pool_size = 0), difficulty is not used, so we can be more lenient
        let validatedDifficulty = difficulty;
        if (pool_size > 0) {
          if (typeof difficulty !== "number" || !Number.isFinite(difficulty) || difficulty < 2 || difficulty > 10 || !Number.isInteger(difficulty)) {
            return { content: makeTextContentArray(
              ["Error: 'difficulty' must be an integer between 2 and 10."]), isError: true };
          }
        } else {
          // For chance die, set a default difficulty (won't be used anyway)
          if (typeof difficulty !== "number" || !Number.isFinite(difficulty)) {
            validatedDifficulty = 6; // Default, but won't affect chance die logic
          }
        }
      
        let willpowerWarning = "";
        let narrativeApplied = false;
        let narrativeDetail: string[] = [];
        let narrativePool = pool_size;
        let narrativeDiff = validatedDifficulty;
      
        // Check for legacy or invalid willpower param
        if ('spend_willpower_for_success' in rest) {
          willpowerWarning = "⚠️ CRITICAL WARNING: 'spend_willpower_for_success' is not supported in this tool. Always call 'spend_resource' to spend Willpower BEFORE rolling. No Willpower bonus will be applied!";
        }
      
        // Narrative engine logic removed: handleGetTacticalAdvantage is unavailable.
        // The following was disabled to fix dependency and compilation errors.
        /*
        if (actor_context) {
          try {
            const result = handleGetTacticalAdvantage({ actor: actor_context });
            if (result && typeof result.modifiers === "number") {
              narrativeDiff = Math.max(2, narrativeDiff + result.modifiers);
              narrativeApplied = result.modifiers !== 0;
              if (result.reasons?.length) narrativeDetail = result.reasons;
            }
          } catch (e) {
            console.error("Narrative engine error:", e);
          }
        }
        */
      
        const result = rollWodPool(narrativePool, narrativeDiff, has_specialty, force_result);
        let successes = result.successes;
      
        let output = `🎲 oWoD Dice Pool Roll\n\n`;
        output += `Pool Size: ${narrativePool}`;
        if (narrativePool > 0) output += `, Difficulty: ${narrativeDiff}`;
        output += `, Specialty: ${has_specialty ? '✅' : 'No'}\n`;
        if (narrativeApplied && narrativeDetail.length > 0) {
          output += `Narrative Modifiers Applied: ${narrativeDetail.join(" | ")}\n`;
        }
        if (willpowerWarning) {
          output += willpowerWarning + "\n";
        }
        output += `Rolled: [${result.rolls.join(', ')}]\n`;
        output += `➡  Result: ${successes} success${successes !== 1 ? 'es' : ''}\n`;
      
        // Quality Feedback
        let feedback = "";
        if (result.isBotch) {
          feedback = "Critical Botch! Catastrophic failure.";
        } else if (successes === 0) {
          feedback = "Failure – No successes.";
        } else if (successes === 1) {
          feedback = "Marginal Success. You barely manage it.";
        } else if (successes === 2) {
          feedback = "Moderate Success.";
        } else if (successes === 3) {
          feedback = "Strong Success!";
        } else if (successes === 4) {
          feedback = "Excellent Success!";
        } else if (successes >= 5) {
          feedback = "Spectacular Success!";
        }
        // Outcome label
        let outcomeLabel = result.isBotch ? "[BOTCH]" : (successes > 0 ? "[SUCCESS]" : "[FAILURE]");
        output += `${outcomeLabel} ${feedback}\n`;
        // Basic result
        output += `${result.resultText}\n`;
      
        // Removed combatState.log (no persistent or global state should be mutated in stateless tools)
        // combatState.log.push(`Roll: [${result.rolls.join(', ')}] vs diff ${narrativeDiff} -> ${successes} successes.`);
        
        return { content: makeTextContentArray([output, JSON.stringify({})]) };
      }
      // Stateless tool: Computes both halves of a contested action, does not mutate attacker/defender
      // records or write world state. Consumer must apply outcome elsewhere.
      case 'roll_contested_action': {
        const { attacker_pool, attacker_difficulty, attacker_specialty, defender_pool, defender_difficulty, defender_specialty } = args;
      
        // --- Input Validation ---
        if (
          typeof attacker_pool !== "number" || attacker_pool < 0 || !Number.isFinite(attacker_pool) ||
          typeof attacker_difficulty !== "number" || !Number.isFinite(attacker_difficulty) || attacker_difficulty < 2 || attacker_difficulty > 10 ||
          typeof defender_pool !== "number" || defender_pool < 0 || !Number.isFinite(defender_pool) ||
          typeof defender_difficulty !== "number" || !Number.isFinite(defender_difficulty) || defender_difficulty < 2 || defender_difficulty > 10
        ) {
          return { content: makeTextContentArray(
            ["Error: All pools must be non-negative integers and all difficulties must be 2–10."]), isError: true };
        }
      
        const atk = rollWodPool(attacker_pool, attacker_difficulty, !!attacker_specialty);
        const def = rollWodPool(defender_pool, defender_difficulty, !!defender_specialty);
        const net = atk.successes - def.successes;
        
        let logtxt = `🎯 CONTESTED/RESISTED ACTION\n\n`;
        logtxt += `Attacker: Pool ${attacker_pool} vs Diff ${attacker_difficulty} → Rolls: [${atk.rolls.join(', ')}] (${atk.successes} successes)${atk.isBotch ? ' [BOTCH]' : ''}\n`;
        logtxt += `Defender: Pool ${defender_pool} vs Diff ${defender_difficulty} → Rolls: [${def.rolls.join(', ')}] (${def.successes} successes)${def.isBotch ? ' [BOTCH]' : ''}\n\n`;
        
        logtxt += `RESULT: `;
        if (atk.isBotch) {
          logtxt += `Attacker BOTCHES—automatic failure.`;
        } else if (def.isBotch) {
          logtxt += `Defender BOTCHES! Attacker wins automatically.`;
        } else if (net > 0) {
          logtxt += `Attacker wins by ${net} net success${net > 1 ? 'es' : ''}.`;
        } else {
          logtxt += `STANDOFF—tie or defender wins.`;
        }
      
        combatState.log.push(`Contested roll: Atk [${atk.successes}] vs Def [${def.successes}]`);
        return { content: makeTextContentArray([logtxt]) };
      }

      // 1. roll_soak
      // Stateless tool: Computes result of soak roll. Never mutates health, damage, or character state.
      // All state adjustment (damage reduction) must be handled by stateful logic in game-state-server.
      case 'roll_soak': {
        const { soak_pool, damage_type, has_fortitude = false } = args;
        const allowedTypes = ['bashing', 'lethal', 'aggravated'];
        if (typeof damage_type !== "string" || !allowedTypes.includes(damage_type)) {
          return {
            content: makeTextContentArray([{ type: "text", text: `Error: 'damage_type' must be one of: ${allowedTypes.join(", ")}` }]),
            isError: true
          };
        }
        if (typeof soak_pool !== "number" || !Number.isInteger(soak_pool) || soak_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'soak_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        // aggravated with no fortitude: cannot soak
        if (damage_type === 'aggravated' && !has_fortitude) {
          return {
            content: makeTextContentArray([
              `💥 Aggravated damage is normally unsoakable by mortals and most supernaturals! Only beings with Fortitude may roll soak aggravated damage (difficulty 8).\n\n0 soaks.`
            ])
          };
        }
        // Roll soak dice
        let diff = 6;
        if (damage_type === 'aggravated') diff = 8;
        const rolls = soak_pool > 0 ? Array.from({ length: soak_pool }, () => Math.floor(Math.random() * 10) + 1) : [];
        const soaks = rolls.filter(r => r >= diff).length;
        let narration = ``;
        if (rolls.length === 0) {
          narration = `No soak dice rolled; 0 soaks.`;
        } else {
          narration += `Soak Dice: [${rolls.join(', ')}] vs diff ${diff}\n`;
          narration += `➡  Soaked ${soaks} ${soaks === 1 ? 'point' : 'points'} of damage.\n`;
          if (soaks === 0) narration += `You fail to soak any damage!`;
          else if (soaks < soak_pool / 2) narration += `Marginal soak – you reduce some, but not all, of the blow.`;
          else if (soaks < soak_pool) narration += `Solid soak effort.`;
          else narration += `Perfect soak! You shrug it off entirely.`;
        }
        return {
          content: makeTextContentArray([narration])
        };
      }

      // --- Initiative & Turn Management Orchestration ---
      // Stateless tool: Delegates initiative persistence to rpg-game-state; never mutates scene/initiative here.
      // All changes must be committed by explicitly calling the tool in rpg-game-state.
    case 'set_initiative': {
      const { scene_id, entries } = args;
      return {
        content: makeTextContentArray([
          `🗂 Delegating set_initiative to rpg-game-state for Scene ${scene_id}.`,
          {
            description: "This API call delegates initiative persistence to rpg-game-state. Please call set_initiative there.",
            next_tool_call: {
              server: 'rpg-game-state',
              tool_name: 'set_initiative',
              arguments: { scene_id, entries }
            }
          }
        ])
      };
    }

    // Stateless tool: Delegates to rpg-game-state for authoritative initiative order.
    // Reads no state; returns next_tool_call contract for orchestration.
    case 'get_initiative_order': {
      const { scene_id } = args;
      return {
        content: makeTextContentArray([
          `🔍 Delegating get_initiative_order to rpg-game-state for Scene ${scene_id}.`,
          {
            description: "Delegating to rpg-game-state. Please call get_initiative_order there.",
            next_tool_call: {
              server: 'rpg-game-state',
              tool_name: 'get_initiative_order',
              arguments: { scene_id }
            }
          }
        ])
      };
    }

    // Stateless tool: Advance turn orchestration. No state change; returns instructions for rpg-game-state.
    case 'advance_turn': {
      const { scene_id } = args;
      return {
        content: makeTextContentArray([
          `➡️ Delegating advance_turn to rpg-game-state for Scene ${scene_id}.`,
          {
            description: "Delegating to rpg-game-state. Please call advance_turn there.",
            next_tool_call: {
              server: 'rpg-game-state',
              tool_name: 'advance_turn',
              arguments: { scene_id }
            }
          }
        ])
      };
    }

    // Stateless tool: Orchestrates current turn lookups by deferring to rpg-game-state.
    // Does not inspect or mutate turn/scene state itself.
    case 'get_current_turn': {
      const { scene_id } = args;
      return {
        content: makeTextContentArray([
          `🕰️ Delegating get_current_turn to rpg-game-state for Scene ${scene_id}.`,
          {
            description: "Delegating to rpg-game-state. Please call get_current_turn there.",
            next_tool_call: {
              server: 'rpg-game-state',
              tool_name: 'get_current_turn',
              arguments: { scene_id }
            }
          }
        ])
      };
    }

      // --- Social Combat System ---
      // Stateless tool: Social Combat. Rolls both sides; returns outcome plus a recommendation instruction.
      // Never applies, mutates, or records effects—caller must dispatch all stateful changes using result.
      case 'roll_social_combat': {
        const { attacker_name, attacker_pool, target_name, target_pool, attack_type } = args;
        const allowedAttackTypes = ["intimidation", "persuasion", "deception", "seduction"];
        let errMsgs: string[] = [];
        if (typeof attacker_pool !== "number" || !Number.isInteger(attacker_pool) || attacker_pool < 0) {
          errMsgs.push("Error: 'attacker_pool' must be a non-negative integer.");
        }
        if (typeof target_pool !== "number" || !Number.isInteger(target_pool) || target_pool < 0) {
          errMsgs.push("Error: 'target_pool' must be a non-negative integer.");
        }
        if (typeof attack_type !== "string" || !allowedAttackTypes.includes(attack_type)) {
          errMsgs.push(`Error: 'attack_type' must be one of: ${allowedAttackTypes.join(", ")}`);
        }
        if (errMsgs.length > 0) {
          return {
            content: makeTextContentArray(errMsgs.map(msg => ({ type: "text", text: msg }))),
            isError: true
          };
        }
        const attackRoll = rollWodPool(attacker_pool, 6, false);
        const defendRoll = rollWodPool(target_pool, 6, false);
        const net = attackRoll.successes - defendRoll.successes;
        let recommendation = null;
        let outcome = "";
    
        if (attackRoll.isBotch) {
          outcome = `❌ ${attacker_name} botches their social gambit—this spectacular failure may have lasting consequences.`;
        } else if (defendRoll.isBotch) {
          outcome = `💥 ${target_name} botches their defense—severe embarrassment or compliance follows!`;
        } else if (net > 0) {
          outcome = `🗣️ ${attacker_name} wins the social exchange by ${net} net success${net > 1 ? "es" : ""}.`;
          if (net >= 3) {
            recommendation = {
              action: "apply_status_effect",
              target: target_name,
              effect_name: (attack_type === "intimidation" ? "Intimidated" : attack_type === "persuasion" ? "Convinced" : attack_type.charAt(0).toUpperCase() + attack_type.slice(1)),
              duration_type: net >= 5 ? "scene" : "rounds",
              duration_value: net >= 5 ? null : net
            };
          } else {
            recommendation = {
              action: "apply_status_effect",
              target: target_name,
              effect_name: "Shaken",
              duration_type: "rounds",
              duration_value: net
            };
          }
        } else if (net < 0) {
          outcome = `🛡️ ${target_name} successfully resists the social gambit by ${-net} net success${net < -1 ? "es" : ""}.`;
          recommendation = null;
        } else {
          outcome = "Draw—both sides hold their ground. No effect.";
          recommendation = null;
        }
        const outputText = `🎭 Social Combat (${attack_type}):\n` +
          `${attacker_name} rolls [${attackRoll.rolls.join(', ')}] (${attackRoll.successes} successes)\n` +
          `${target_name} rolls [${defendRoll.rolls.join(', ')}] (${defendRoll.successes} successes)\n\n` +
          outcome;
    
        const resultObject: any = { net_successes: net, outcome };
        if (recommendation) resultObject.recommendation = recommendation;
    
        return {
          content: makeTextContentArray([
            outputText,
            JSON.stringify(resultObject)
          ])
        };
      }
      default:
        // Stateless tool: Damage pool roll; returns only the rolled damage. Applies no harm or wound to any entity.
        // The caller is responsible for applying result to persistent world/character via stateful tool.
        case 'roll_damage_pool': {
          const { pool_size, damage_type = 'lethal' } = args;
          const allowedTypes = ['bashing', 'lethal', 'aggravated'];
          if (typeof damage_type !== "string" || !allowedTypes.includes(damage_type)) {
            return {
              content: makeTextContentArray([{ type: "text", text: `Error: 'damage_type' must be one of: ${allowedTypes.join(", ")}` }]),
              isError: true
            };
          }
          if (typeof pool_size !== "number" || !Number.isInteger(pool_size) || pool_size < 0) {
            return {
              content: makeTextContentArray([{ type: "text", text: "'pool_size' must be a non-negative integer." }]),
              isError: true
            };
          }
          // Roll pool_size d10s at difficulty 6
          const rolls = pool_size > 0 ? Array.from({ length: pool_size }, () => Math.floor(Math.random() * 10) + 1) : [];
          const successes = rolls.filter((r) => r >= 6).length;
          let desc = `💥 Damage Pool Roll`;
          desc += `\n\nPool Size: ${pool_size}, Difficulty: 6\n`;
          desc += `Damage Type: ${damage_type.charAt(0).toUpperCase() + damage_type.slice(1)}\n`;
          desc += `Rolled: [${rolls.join(', ')}]\n➡  Result: ${successes} ${successes === 1 ? 'level' : 'levels'} of ${damage_type} damage.\n`;
          if (pool_size === 0) {
            desc += "No dice rolled; result is 0 levels of damage.\n";
          } else if (successes === 0) {
            desc += "No damage inflicted!";
          } else if (successes >= 5) {
            desc += "Devastating blow!";
          } else if (successes >= 3) {
            desc += "Solid hit.";
          } else if (successes === 1) {
            desc += "Glancing blow.";
          }
      
          // Return both text broadcast and machine-usable structure
          return {
            content: makeTextContentArray([
              desc,
              JSON.stringify({ successes, damage_type })
            ])
          };
        }

        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: makeTextContentArray([`Error: ${error.message}`]),
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
// File: game-state-server/src/db.ts

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create data directory in workspace
const DATA_DIR = join(process.cwd(), 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}
const DB_PATH = join(DATA_DIR, 'game-state.db');

export class GameDatabase {
  private db: Database.Database;

  constructor() {
    try {
      this.db = new Database(DB_PATH);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('wal_autocheckpoint = 1000');
      this.db.pragma('wal_checkpoint(TRUNCATE)');
      this.db.pragma('foreign_keys = ON');
      this.db.prepare('SELECT 1').get();
      this.initializeSchema();
    } catch (error: any) {
      throw new Error(`Failed to initialize database: ${error.message}`);
    }
  }

  private initializeSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        concept TEXT,
        game_line TEXT NOT NULL,
        strength INTEGER NOT NULL DEFAULT 1,
        dexterity INTEGER NOT NULL DEFAULT 1,
        stamina INTEGER NOT NULL DEFAULT 1,
        charisma INTEGER NOT NULL DEFAULT 1,
        manipulation INTEGER NOT NULL DEFAULT 1,
        appearance INTEGER NOT NULL DEFAULT 1,
        perception INTEGER NOT NULL DEFAULT 1,
        intelligence INTEGER NOT NULL DEFAULT 1,
        wits INTEGER NOT NULL DEFAULT 1,
        willpower_current INTEGER NOT NULL DEFAULT 5,
        willpower_permanent INTEGER NOT NULL DEFAULT 5,
        health_levels TEXT,
        experience INTEGER NOT NULL DEFAULT 0
      )
    `);
    // Game-line specific tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_vampire_traits (
        character_id INTEGER NOT NULL,
        clan TEXT,
        generation INTEGER,
        blood_pool_current INTEGER,
        blood_pool_max INTEGER,
        humanity INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_werewolf_traits (
        character_id INTEGER NOT NULL,
        breed TEXT,
        auspice TEXT,
        tribe TEXT,
        gnosis_current INTEGER,
        gnosis_permanent INTEGER,
        rage_current INTEGER,
        rage_permanent INTEGER,
        renown_glory INTEGER,
        renown_honor INTEGER,
        renown_wisdom INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_mage_traits (
        character_id INTEGER NOT NULL,
        tradition_convention TEXT,
        arete INTEGER,
        quintessence INTEGER,
        paradox INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_changeling_traits (
        character_id INTEGER NOT NULL,
        kith TEXT,
        seeming TEXT,
        glamour_current INTEGER,
        glamour_permanent INTEGER,
        banality_permanent INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS status_effects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER,
        npc_id INTEGER,
        effect_name TEXT NOT NULL,
        description TEXT,
        mechanical_effect TEXT,
        duration_type TEXT,
        duration_value INTEGER,
        FOREIGN KEY (character_id) REFERENCES characters(id),
        FOREIGN KEY (npc_id) REFERENCES npcs(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_abilities (
        character_id INTEGER NOT NULL,
        ability_name TEXT NOT NULL,
        ability_type TEXT NOT NULL,
        rating INTEGER NOT NULL,
        specialty TEXT,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_disciplines (
        character_id INTEGER NOT NULL,
        discipline_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_arts (
        character_id INTEGER NOT NULL,
        art_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS character_realms (
        character_id INTEGER NOT NULL,
        realm_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
  }

  public getInstance(): Database.Database {
    return this.db;
  }

  public close() {
    this.db.close();
  }
}
````

## File: game-state-server/src/index.ts
````typescript
// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import fs from 'fs';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Server as MCPServer } from '@modelcontextprotocol/sdk/server/index.js';

// Utility: Serialize any array of strings/objects as { type: 'text', text: string }[] for MCP compliance
export function makeTextContentArray(contentArr: any[]): { type: 'text', text: string }[] {
  return contentArr.map(entry => {
    if (typeof entry === "string") {
      return { type: 'text', text: entry };
    }
    // For any other objects/values, serialize as prettified JSON
    return { type: 'text', text: JSON.stringify(entry, null, 2) };
  });
}
import { toolDefinitions } from './tool-definitions.js';
import { formatSheetByGameLine } from './characterSheets.js';
import { GameDatabase as GameDatabaseClass } from './db.js';
import type { GameDatabase as GameDatabaseType } from './types/db.types.js';
import { createGameDatabase } from './repositories/game-database.js';
import type { AntagonistRow } from './types/antagonist.types.js';

import { spend_xp_handler } from './tool-handlers/spend_xp.handler.js';

// Import repositories for the new data access pattern
import {
  CharacterRepository,
  AntagonistRepository,
  InventoryRepository,
  StatusEffectRepository,
} from './repositories/index.js';
import { create_character_handler } from './tool-handlers/create_character.handler.js';
import { get_character_handler } from './tool-handlers/get_character.handler.js';
import { get_character_by_name_handler } from './tool-handlers/get_character_by_name.handler.js';
import { update_character_handler } from './tool-handlers/update_character.handler.js';
import { spend_resource_handler } from './tool-handlers/spend_resource.handler.js';
import { restore_resource_handler } from './tool-handlers/restore_resource.handler.js';
import { gain_resource_handler } from './tool-handlers/gain_resource.handler.js';
import { apply_damage_handler } from './tool-handlers/apply_damage.handler.js';

// Additional handlers imported by tool name for full MCP compliance
import { list_characters_handler } from './tool-handlers/list_characters.handler.js';

import { create_antagonist_handler } from './tool-handlers/create_antagonist.handler.js';
import { get_antagonist_handler } from './tool-handlers/get_antagonist.handler.js';
import { update_antagonist_handler } from './tool-handlers/update_antagonist.handler.js';
import { list_antagonists_handler } from './tool-handlers/list_antagonists.handler.js';
import { remove_antagonist_handler } from './tool-handlers/remove_antagonist.handler.js';

import { award_xp_handler } from './tool-handlers/award_xp.handler.js';
import { improve_trait_handler } from './tool-handlers/improve_trait.handler.js';
import { get_trait_improvement_cost_handler } from './tool-handlers/get_trait_improvement_cost.handler.js';

import { apply_status_effect_handler } from './tool-handlers/apply_status_effect.handler.js';
import { get_status_effects_handler } from './tool-handlers/get_status_effects.handler.js';
import { remove_status_effect_handler } from './tool-handlers/remove_status_effect.handler.js';

import { add_item_handler } from './tool-handlers/add_item.handler.js';
import { get_inventory_handler } from './tool-handlers/get_inventory.handler.js';
import { update_item_handler } from './tool-handlers/update_item.handler.js';
import { remove_item_handler } from './tool-handlers/remove_item.handler.js';
import { save_world_state_handler } from './tool-handlers/save_world_state.handler.js';
import { get_world_state_handler } from './tool-handlers/get_world_state.handler.js';
import { save_story_progress_handler } from './tool-handlers/save_story_progress.handler.js';
import { set_initiative_handler } from './tool-handlers/set_initiative.handler.js';
import { get_initiative_order_handler } from './tool-handlers/get_initiative_order.handler.js';
import { advance_turn_handler } from './tool-handlers/advance_turn.handler.js';
import { get_current_turn_handler } from './tool-handlers/get_current_turn.handler.js';

// Centralized toolDefinitions import

import { toolDispatcher } from './tool-handlers/index.js';

async function startServer() {
  try {
    console.log("Initializing server...");

    // 1. Load tool definitions first
    const allTools = Object.values(toolDefinitions);

    // 2. Pass the tools directly into the constructor
    const server = new Server(
      { name: 'rpg-game-state-server', version: '2.1.0' },
      {
        capabilities: {
          // Create the tools map that the SDK expects
          tools: Object.fromEntries(allTools.map(tool => [tool.name, tool]))
        }
      }
    );
    const transport = new StdioServerTransport();
    
    console.log("Initializing database...");
    let db: GameDatabaseClass;
    let repositories: GameDatabaseType;
    try {
      db = new GameDatabaseClass();
      console.log("Database initialized successfully.");

      // Use canonical aggregated GameDatabase interface for handlers
      repositories = createGameDatabase(db.getInstance());
    } catch (err: any) {
      console.error("Error initializing database:", err.message);
      process.exit(1);
    }
    
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools: Object.values(toolDefinitions) };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
        const { name, arguments: args } = request.params;
        const handler = toolDispatcher[name];
        if (handler) {
            try {
                return await handler(repositories, args);
            } catch (error: any) {
                console.error(`Error in tool '${name}':`, error);
                return { content: makeTextContentArray([`❌ Error in tool '${name}': ${error.message}`]), isError: true };
            }
        }
        return { content: makeTextContentArray([`❌ Unknown tool: ${name}`]), isError: true };
    });
    
    server.connect(transport);
    console.error('✅ oWoD RPG Game State MCP Server v2.1.0 running on stdio');

  } catch (error: any) {
    console.error('❌ FATAL: Server failed to start:', error.message);
    process.exit(1);
  }
}

startServer();
````
