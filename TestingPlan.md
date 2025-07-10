# **Revised & Complete MCP Testing Plan**

This document outlines a rigorous, comprehensive testing plan for every Model Context Protocol (MCP) tool defined in the World of Darkness server suite. The plan covers all available server APIs (`game-state-server` and `combat-engine-server`), providing thorough test cases, clear methodologies, expected results, and rationales to ensure reliability, correctness, and robustness.

## Table of Contents
*   **Game-State Server Tools**
    *   Character & Antagonist Management: `create_character`, `get_character`, `get_character_by_name`, `update_character`, `list_characters`, `create_antagonist`, `get_antagonist`, `update_antagonist`, `list_antagonists`, `remove_antagonist`
    *   Resource & Health: `spend_resource`, `restore_resource`, `gain_resource`, `apply_damage`
    *   Progression (XP): `award_xp`, `spend_xp`, `improve_trait`, `get_trait_improvement_cost`
    *   Status Effects: `apply_status_effect`, `remove_status_effect`, `get_status_effects`
    *   Inventory Management: `add_item`, `get_inventory`, `update_item`, `remove_item`
    *   World State & Story: `save_world_state`, `get_world_state`, `save_story_progress`
    *   Initiative & Turn Management: `set_initiative`, `get_initiative_order`, `advance_turn`, `get_current_turn`
*   **Combat-Engine Server Tools**
    *   Core Dice Mechanics: `roll_wod_pool`, `roll_contested_action`, `roll_soak`, `roll_damage_pool`
    *   Initiative & Turn Management: `roll_initiative_for_scene`, `set_initiative`, `get_initiative_order`, `advance_turn`, `get_current_turn`
    *   Game-Line Specific Mechanics: `roll_virtue_check`, `change_form`, `spend_rage_for_extra_actions`, `roll_magick_effect`, `invoke_cantrip`
    *   Social Combat: `roll_social_combat`

---

## **`game-state-server` Tools**

### Character & Antagonist Management

#### `create_character` & `create_antagonist`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Standard Creation** | Verify successful creation for each splat. | `{ "name": "Armand", "game_line": "vampire", "clan": "Toreador" }`, `{ "template_name": "Sabbat Shovelhead", "custom_name": "Rocco" }` | Character/NPC created and retrievable. Splat-specific tables populated. |
| **Edge: Minimal Input** | Ensure optional fields can be omitted. | `{ "name": "Elsa", "game_line": "werewolf" }` | Character created with default values for all omitted fields. |
| **Validation: Missing Required** | Fail if required fields like `name` or `game_line` are missing. | `{ "game_line": "mage" }` | Error message: "Missing required field: name". |
| **Validation: Invalid Enum** | Reject invalid `game_line` or splat-specific enums. | `{ "name": "Test", "game_line": "dragon" }` | Error message: "Invalid value for game_line". |
| **Negative: Duplicate Name** | Reject duplicate character names. | Create "Armand" twice. | `UNIQUE constraint failed` error on second attempt. |
| **Integration: Usability** | Ensure newly created entity can be used in other tools. | Create char, then `apply_damage` using its new ID. | Both tool calls succeed. |

</details>

---
#### `get_character` & `get_character_by_name` / `get_antagonist`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Standard Get by ID/Name** | Retrieve existing entities successfully. | `{ "character_id": 1 }`, `{ "name": "Armand" }` | Full, correctly formatted character sheet is returned. |
| **Splat-Specific Data** | Verify all splat-specific data is joined and returned. | Get a Werewolf character. | Response includes Rage, Gnosis, Gifts, etc. |
| **Negative: Nonexistent** | Handle queries for nonexistent entities gracefully. | `{ "character_id": 99999 }` | Clear "Not Found" error message. |
| **Validation: Invalid Type** | Reject non-integer IDs or non-string names. | `{ "character_id": "abc" }` | Input validation error. |

</details>

---
#### `update_character` & `update_antagonist`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Standard Update** | Change a single, simple trait. | `{ "character_id": 1, "updates": { "concept": "Survivor" } }` | Success confirmation. `get_character` reflects the change. |
| **Splat-Specific Update** | Update a trait in a joined table (e.g., `humanity`). | `{ "character_id": 1, "updates": { "humanity": 6 } }` | Success confirmation. `get_character` shows new humanity. |
| **Validation: Invalid Field** | Reject updates to fields that do not exist. | `{ "character_id": 1, "updates": { "luck_points": 5 } }` | Error message: "Invalid field 'luck_points'". |
| **Validation: Data Type Mismatch** | Reject updates with incorrect data types. | `{ "character_id": 1, "updates": { "strength": "strong" } }` | Input validation error. |

</details>

---
### Resource, Health, & Progression

#### `spend_resource` & `restore_resource`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Standard Spend/Restore** | Spend/restore a valid resource. | `{ "character_id": 1, "resource_name": "willpower", "amount": 1 }` | Success message with new and max values (e.g., "Willpower: 4/5"). |
| **Validation: Insufficient** | Prevent spending more than available. | Spend 10 Willpower when character has 5. | Error: "Not enough willpower. Has 5, needs 10." |
| **Validation: Over-Restoring** | Prevent restoring beyond the permanent maximum. | Restore 3 Willpower when at 4/5. | Success message. New value is 5/5 (capped at max). |
| **Validation: Invalid Resource** | Reject spending a resource the character doesn't have. | `spend_resource` with `resource_name: "blood"` on a Mage character. | Error: "Invalid resource 'blood' for game_line 'mage'". |

</details>

---
#### `gain_resource`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Standard Gain** | Gain a resource from an action. | `{ "character_id": 1, "resource_name": "blood", "roll_successes": 3 }` | Success message. Blood pool increases by 3 (up to max). |
| **Validation: Invalid Resource** | Reject gaining a resource not applicable to the game line. | Gain 'gnosis' for a Vampire. | Error message. |
| **Validation: Non-Positive** | Reject zero or negative successes. | `{ ..., "roll_successes": 0 }` | Error: "roll_successes must be a positive number." |

</details>

---
#### `apply_damage`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Damage Types** | Verify Bashing, Lethal, and Aggravated damage apply correctly. | Apply 2 Bashing, then 1 Lethal. | Bashing upgrades to Lethal. Health track shows `X|X|X| | | |`. |
| **Incapacitated/Overflow** | Test damage that fills or exceeds the health track. | Apply 8 Lethal damage. | Health track is full of 'X'. Status is Incapacitated. |
| **Integration** | Ensure wound penalties are reflected in subsequent rolls. | Apply 3 Lethal damage, then `roll_wod_pool`. | A -1 wound penalty should be noted/applied to the roll. |

</details>

---
#### `award_xp`, `spend_xp`, `improve_trait`, `get_trait_improvement_cost`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **XP Flow** | Award, check cost, improve, and verify new XP total. | `award_xp`, `get_trait_improvement_cost`, `improve_trait`. | Each step succeeds. `get_character` shows increased trait and decreased XP. |
| **Cost Calculation** | Verify cost calculation is correct for all trait types. | `get_trait_improvement_cost` for Attribute, Ability, Discipline, etc. | Correct costs returned (e.g., Attribute = new rating * 4). |
| **Validation: Insufficient XP** | Prevent improving a trait without enough XP. | `improve_trait` when XP is too low. | Error: "Not enough XP." |
| **Validation: Invalid Trait** | Reject attempts to improve a nonexistent trait. | `improve_trait` with `trait_name: "Cooking"`. | Error: "Trait 'Cooking' not found." |

</details>

---
### Status Effects

#### `apply_status_effect`, `remove_status_effect`, `get_status_effects`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Standard Application** | Apply a temporary status effect to a character. | `{ "target_type": "character", "target_id": 1, "effect_name": "Stunned", "description": "Cannot act this round", "duration_type": "rounds", "duration_value": 1 }` | Success message with effect ID. Effect is retrievable via `get_status_effects`. |
| **Permanent Effect** | Apply a permanent status effect. | `{ "target_type": "character", "target_id": 1, "effect_name": "Cursed", "duration_type": "indefinite" }` | Effect applied with no expiration. |
| **Mechanical Effects** | Apply effect with mechanical modifiers. | `{ ..., "mechanical_effect": { "dice_penalty": -2, "can_act": false } }` | Effect includes mechanical data in JSON format. |
| **Remove Effect** | Remove an existing status effect. | `{ "effect_id": 101 }` | Effect is removed. `get_status_effects` no longer shows it. |
| **List Effects** | Retrieve all effects on a target. | `{ "target_type": "character", "target_id": 1 }` | Returns array of all active effects with full details. |
| **Validation: Invalid Target** | Reject effects on nonexistent targets. | `{ "target_type": "character", "target_id": 99999, ... }` | Error: "Character not found." |

</details>

---
### Inventory Management

#### `add_item`, `get_inventory`, `update_item`, `remove_item`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Add Item** | Add a new item to character inventory. | `{ "character_id": 1, "item": { "name": "Healing Potion", "description": "Restores 3 health", "quantity": 2, "type": "consumable" } }` | Item added successfully. `get_inventory` shows the item. |
| **Get Inventory** | Retrieve all items for a character. | `{ "character_id": 1 }` | Returns formatted list of all items with quantities and descriptions. |
| **Update Item Quantity** | Modify item quantity (e.g., after use). | `{ "item_id": 5, "updates": { "quantity": 1 } }` | Item quantity updated. Inventory reflects change. |
| **Update Item Properties** | Modify item description or equipped status. | `{ "item_id": 5, "updates": { "equipped": true, "description": "Enchanted sword" } }` | Item properties updated successfully. |
| **Remove Item** | Delete an item from inventory. | `{ "item_id": 5 }` | Item removed. `get_inventory` no longer shows it. |
| **Validation: Invalid Item** | Reject operations on nonexistent items. | `{ "item_id": 99999, ... }` | Error: "Item not found." |
| **Validation: Invalid Character** | Reject inventory operations for nonexistent characters. | `{ "character_id": 99999, ... }` | Error: "Character not found." |

</details>

---
### World State & Story Management

#### `save_world_state`, `get_world_state`, `save_story_progress`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Save World State** | Persist current game world state. | `{ "location": "The Elysium", "notes": "Prince's gathering", "data": { "time": "midnight", "weather": "stormy" } }` | State saved successfully. `get_world_state` returns the data. |
| **Get World State** | Retrieve last saved world state. | `{}` | Returns complete world state with location, notes, and custom data. |
| **Update World State** | Overwrite existing world state. | `{ "location": "Downtown", "notes": "Investigation continues" }` | New state replaces old. Previous data is overwritten. |
| **Save Story Progress** | Log narrative checkpoint. | `{ "chapter": "Chapter 1", "scene": "The Missing Ghoul", "summary": "Coterie discovered Sabbat involvement" }` | Story progress logged with timestamp. |
| **Validation: Empty Data** | Handle empty or minimal input gracefully. | `{ "location": "" }` | Accepts empty strings but validates required structure. |

</details>

---
### Antagonist Management

#### `create_antagonist`, `get_antagonist`, `update_antagonist`, `list_antagonists`, `remove_antagonist`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Create from Template** | Create NPC from predefined template. | `{ "name": "Sheriff Marcus", "template": "vampire_sheriff", "game_line": "vampire" }` | Antagonist created with template stats. Has appropriate disciplines, attributes. |
| **Get Antagonist** | Retrieve antagonist by ID. | `{ "npc_id": 1 }` | Returns complete antagonist sheet with all stats and notes. |
| **Update Stats** | Modify antagonist attributes or resources. | `{ "npc_id": 1, "updates": { "willpower_current": 6, "notes": "Recently fed" } }` | Stats updated successfully. Changes reflected in `get_antagonist`. |
| **List All** | Get summary of all antagonists. | `{}` | Returns list with names, types, and IDs of all created antagonists. |
| **Remove Antagonist** | Delete an antagonist permanently. | `{ "npc_id": 1 }` | Antagonist removed. `list_antagonists` no longer shows it. |
| **Validation: Invalid Template** | Reject unknown templates. | `{ "template": "dragon_lord", ... }` | Error: "Unknown template 'dragon_lord'." |
| **Validation: Missing Name** | Require name for antagonist creation. | `{ "template": "vampire_sheriff" }` | Error: "Missing required field: name." |

</details>

---
### Initiative & Turn Management

#### `set_initiative`, `get_initiative_order`, `advance_turn`, `get_current_turn`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Set Initiative Order** | Establish turn order for combat scene. | `{ "scene_id": "combat_1", "entries": [{ "character_id": 1, "actor_name": "Marcus", "initiative_score": 15, "turn_order": 1 }, { "npc_id": 2, "actor_name": "Sheriff", "initiative_score": 12, "turn_order": 2 }] }` | Initiative order set. `get_initiative_order` returns sorted list. |
| **Get Initiative Order** | Retrieve current turn order. | `{ "scene_id": "combat_1" }` | Returns actors in initiative order with scores and current turn indicator. |
| **Advance Turn** | Move to next actor in sequence. | `{ "scene_id": "combat_1" }` | Turn advances. `get_current_turn` shows next actor. |
| **Get Current Turn** | Check whose turn it is. | `{ "scene_id": "combat_1" }` | Returns current actor, round number, and turn position. |
| **Round Cycling** | Verify turn order cycles through rounds. | Advance through all actors in a round. | After last actor, advances to round 2 with first actor. |
| **Validation: Invalid Scene** | Reject operations on nonexistent scenes. | `{ "scene_id": "nonexistent" }` | Error: "Scene not found." |

</details>

---

## **`combat-engine-server` Tools**

### Core Dice Mechanics

#### `roll_wod_pool` & `roll_contested_action`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Standard Roll** | Verify basic success/failure/botch logic. | `{ "pool_size": 5, "difficulty": 6 }` | Correct number of successes calculated. |
| **Specialty Rule** | Ensure a '10' counts as two successes when specialty is true. | `{ "pool_size": 3, "difficulty": 6, "has_specialty": true }` | Rolls of 10 add 2 successes. |
| **Zero/Negative Pool** | Handle zero or negative dice pools gracefully. | `{ "pool_size": 0 }` | Rolls 1 chance die (10=success, 1=botch). `{ "pool_size": -1 }` -> Error. |
| **Contested Logic** | Verify net successes and tie/botch resolution. | Attacker gets 3 successes, Defender gets 1. | "Attacker wins by 2 net successes." |

</details>

---
#### `roll_soak` & `roll_damage_pool`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Soak Lethal Damage** | Roll to reduce incoming lethal damage. | `{ "soak_pool": 3, "damage_type": "lethal", "has_fortitude": false }` | Soak successes calculated. Damage reduction shown. |
| **Soak with Fortitude** | Vampire soaks lethal damage with Fortitude. | `{ "soak_pool": 5, "damage_type": "lethal", "has_fortitude": true }` | Fortitude allows soaking lethal damage normally. |
| **Aggravated Damage** | Attempt to soak aggravated damage. | `{ "soak_pool": 4, "damage_type": "aggravated", "has_fortitude": true }` | Only Fortitude dice count for aggravated soak. |
| **Damage Pool Roll** | Roll damage dice for an attack. | `{ "pool_size": 4, "damage_type": "lethal" }` | Damage successes calculated. Each success = 1 health level. |
| **Bashing Damage** | Roll bashing damage pool. | `{ "pool_size": 3, "damage_type": "bashing" }` | Bashing damage calculated correctly. |

</details>

---
### Game-Line Specific Mechanics

#### `roll_virtue_check` (Vampire)
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Frenzy/Rötschreck** | Simulate resisting a fear or anger frenzy. | `{ "character_id": 1, "virtue_name": "self-control", "difficulty": 8 }` | Success/failure based on Self-Control roll. |

</details>

---
#### `change_form` & `spend_rage_for_extra_actions` (Werewolf)
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Form Modifiers** | Verify correct attribute modifiers are returned for each form. | `{ "character_id": 2, "target_form": "Crinos" }` | Returns `{ "str": +4, "dex": +1, "sta": +3, ... }`. |
| **Rage for Actions** | Confirm the tool returns a valid confirmation. | `{ "character_id": 2, "actions_to_gain": 2 }` | Success message. Game-state should reflect Rage spent. |

</details>

---
#### `roll_magick_effect` (Mage)
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Coincidental vs. Vulgar** | Test both coincidental and vulgar magick. | `{ ..., "is_coincidental": true }` vs. `{ ..., "is_coincidental": false }` | Vulgar effect that fails generates Paradox points. |
| **Paradox Backlash** | A roll that botches should trigger a significant Paradox effect. | Botch a vulgar roll. | Tool returns a high number of Paradox points and a narrative of a backlash. |

</details>

---
#### `invoke_cantrip` (Changeling)
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Art + Realm Pool** | Verify the dice pool is calculated correctly from Art + Realm. | `{ "art_pool": 3, "realm_pool": 2, ... }` | Tool rolls a pool of 5 dice. |
| **Banality Trigger** | A botch should trigger a Banality check or consequence. | Botch a cantrip roll. | Tool returns a botch result and a narrative suggestion about Banality. |

</details>

---
### Social Combat

#### `roll_social_combat`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Intimidation vs Willpower** | Contested social action. | `{ "attacker_name": "Marcus", "attacker_pool": 6, "target_name": "Sheriff", "target_pool": 4, "attack_type": "intimidation" }` | Net successes calculated. Winner determined. Narrative suggestion provided. |
| **Persuasion Attack** | Social persuasion attempt. | `{ "attacker_name": "Alice", "attacker_pool": 5, "target_name": "Bob", "target_pool": 3, "attack_type": "persuasion" }` | Contested roll resolved. Social damage or effect suggested. |
| **Seduction** | Seduction social combat. | `{ "attacker_name": "Toreador", "attacker_pool": 7, "target_name": "Mortal", "target_pool": 2, "attack_type": "seduction" }` | High success margin suggests strong effect. |
| **Tie Resolution** | Handle tied social combat. | Equal successes on both sides. | Tie-breaking rules applied. Stalemate or re-roll suggested. |
| **Botch Consequences** | Social botch effects. | Attacker botches social roll. | Botch consequences described. Relationship damage suggested. |

</details>

---
### Initiative & Turn Management (Combat Engine)

#### `roll_initiative_for_scene`, `set_initiative`, `get_initiative_order`, `advance_turn`, `get_current_turn`
<details>
<summary>Expand Test Cases</summary>

| Test Case | Goal | Test Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **Roll Initiative** | Generate initiative scores for scene. | `{ "scene_id": "combat_1", "actors": [{ "name": "Marcus", "dex": 3, "wits": 2 }, { "name": "Sheriff", "dex": 4, "wits": 3 }] }` | Initiative scores rolled and sorted. Turn order established. |
| **Cross-Server Integration** | Verify combat engine delegates to game-state server. | Call initiative tools from combat engine. | Tools properly delegate to game-state server for persistence. |
| **Scene Management** | Handle multiple concurrent scenes. | Create initiative for "combat_1" and "combat_2". | Each scene maintains separate turn order. |

</details>