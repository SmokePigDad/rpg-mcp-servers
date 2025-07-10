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