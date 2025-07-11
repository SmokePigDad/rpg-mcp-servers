# MCP Server Tools & API Reference

This document provides a complete reference for all Model Context Protocol (MCP) tools available in the World of Darkness server suite. These tools are the building blocks for all game mechanics, character management, and chronicle progression.

## 📁 Server Architecture

The system uses a two-server model:

* **`game-state-server`**: Manages persistent data, including character sheets, NPC records, inventory, experience, and world state. It is the "source of truth" for the chronicle.
* **`combat-engine-server`**: A stateless server that handles the game's dice mechanics and rule adjudications, such as rolling dice pools, resolving contested actions, and applying game-line-specific rules (e.g., Frenzy, Magick, Cantrips).

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
  // --- Relational Traits (optional, database format) ---
  "abilities": [ { "ability_name": "Firearms", "ability_type": "skills", "rating": 2 } ],
  "disciplines": [ { "discipline_name": "Auspex", "rating": 1 } ]
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
---

### Resource & Health Management

#### `spend_resource` / `restore_resource`
Spends or restores a character's resource pool (e.g., Willpower, Blood, Rage).

**Input Schema:**
```json
{
  "character_id": 1,
  "resource_name": "willpower" | "blood" | "rage" | "gnosis" | "glamour" | "quintessence",
  "amount": 1
}
```
**Example Response (`spend_resource`):**
```json
{
  "content": [
    { "type": "text", "text": "✅ Marcus spent 1 rage. New total: 3" }
  ]
}
```
**Error Messages:**
- Not enough Willpower: `❌ Not enough Willpower. Has 2, needs 3.`
- Not enough Blood:    `❌ Not enough Blood. Has 2, needs 3.`
- Not enough Rage:     `❌ Not enough Rage. Has 1, needs 2.`
- Invalid resource type: `❌ Invalid or inapplicable resource 'resource_name' for this character.`

Restore returns the updated resource total on success.

---

## 🎲 `combat-engine-server` Tools

This server handles dice pools and rule/mechanical adjudication. All input fields are required unless specified otherwise.

### Dice Pool Rolling Tools

#### `roll_wod_pool`
Rolls a World of Darkness dice pool.
See schema in code for full details.

#### `roll_contested_action`
Resolves a contested action between two actors, attacker and defender.

**Input Schema:**
```json
{
  "attacker_pool": 8,
  "attacker_difficulty": 6,
  "attacker_specialty": false,
  "defender_pool": 3,
  "defender_difficulty": 6,
  "defender_specialty": false
}
```
**Error responses:**
- If `attacker_difficulty` is missing/invalid:  
  `Error: 'attacker_difficulty' is required and must be a number.`
- If `defender_difficulty` is missing/invalid:  
  `Error: 'defender_difficulty' is required and must be a number.`
- If any pool is invalid or any difficulty out of range:  
  `Error: All pools must be non-negative integers and all difficulties must be in the range 2–10.`

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "🎯 CONTESTED/RESISTED ACTION\n\nAttacker: Pool 8 vs Diff 6 → Rolls: [7, 6, 10, 3, 2, 4, 6, 8] (4 successes)\nDefender: Pool 3 vs Diff 6 → Rolls: [5, 9, 10] (2 successes)\n\nResult: Attacker nets +2 successes."
    }
  ]
}
```

---

### Handler Validation & Error Style Audit

- All handlers now validate required arguments up front and return explicit error messages for missing/invalid arguments. 
- Standard error response: `{ "content": [ "❌ <explanation>" ], isError: true }` (❌ or similar icon).
- Field names in documentation match precisely the query and database layer for each tool.
- Error messages are actionable, tied to field context, and use consistent iconography and explanatory phrasing.
- Dice/engine server tools return `"Error: ..."` in responses for validation failures (as per code).
- Successes always use a positive icon (✅ or formatted content block) with updated details.

If you see any deviation, please report for update, but as of this revision, the documentation and handler validation are tightly coupled.
