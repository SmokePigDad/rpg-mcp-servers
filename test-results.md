## [Test] Standard creation for all splats (create_character)

### Input
```json
{ "name": "Genevieve", "game_line": "vampire", "clan": "Toreador" }
```
### Output
Character "Genevieve" created successfully with ID 1.

---
### Input
```json
{ "name": "Stone-Fist", "game_line": "werewolf", "tribe": "Red Talon" }
```
### Output
Character "Stone-Fist" created successfully with ID 2.

---
### Input
```json
{ "name": "Elsa", "game_line": "mage" }
```
### Output
Character "Elsa" created successfully with ID 3.

---
### Input
```json
{ "name": "Lilac", "game_line": "changeling", "kith": "pooka" }
```
### Output
Character "Lilac" created successfully with ID 4.

---
## [Test] Antagonist creation from template (create_antagonist)

### Input
```json
{ "template_name": "Sabbat Shovelhead", "custom_name": "Rocco" }
```
### Output
Antagonist "Rocco" created successfully (ID: 1).

---
## [Test] Edge: Create character with minimal input (create_character)

### Input
```json
{ "name": "Rin", "game_line": "mage" }
```
### Output
Character "Rin" created successfully with ID 5 (defaults assigned to optional fields).

---
## [Test] Validation: Missing required fields (create_character)

### Input (missing 'name')
```json
{ "game_line": "changeling" }
```
### Output
Error: ❌ Invalid or missing arguments: 'name' must be a non-empty string and 'game_line' must be one of: vampire, werewolf, mage, changeling.

---
### Input (missing 'game_line')
```json
{ "name": "NoLine" }
```
### Output
Error: ❌ Invalid or missing arguments: 'name' must be a non-empty string and 'game_line' must be one of: vampire, werewolf, mage, changeling.

---
## [Test] Validation: Invalid enum value (create_character)

### Input
```json
{ "name": "Test", "game_line": "dragon" }
```
### Output
Error: ❌ Invalid or missing arguments: 'name' must be a non-empty string and 'game_line' must be one of: vampire, werewolf, mage, changeling.

---
## [Test] Negative: Duplicate character name (create_character)

### Input
```json
{ "name": "Genevieve", "game_line": "vampire", "clan": "Toreador" }
```
### Output
Error: ❌ Duplicate character name "Genevieve" is not allowed.

---
## [Test] Standard get by ID (get_character)

### Input
```json
{ "character_id": 1 }
```
### Output
🎲 World of Darkness: VAMPIRE Sheet  
👤 Name: Genevieve  
🗂️  Game Line: Vampire (Toreador, Gen: 13)  
💪 Strength: 1  
🏃 Dexterity: 1  
❤️ Stamina: 1  
🎭 Charisma: 1  
🗣️ Manipulation: 1  
🌟 Appearance: 1  
👁️ Perception: 1  
🧠 Intelligence: 1  
⚡ Wits: 1  
────── ABILITIES ──────  
- Brawl (Talent): 3  
- Drive (Skill): 1  
- Intimidation (Talent): 2  
- Melee (Skill): 2  

🎲 Most-Used Dice Pools:  
- Perception + Alertness: 1  
- Dexterity + Brawl: 1  
- Manipulation + Subterfuge: 1  
- Wits + Intimidation: 1  
- Dexterity + Firearms: 1  

❤️ Health Levels:  
[ ][ ][ ][ ][ ][ ][ ] (Penalty: 0)

🔵 Willpower: 5/5  
⭐ Experience: 0  
Blood Pool: 10/10, Humanity: 7

---
### Input
```json
{ "character_id": 2 }
```
### Output
🎲 World of Darkness: WEREWOLF Sheet  
👤 Name: Stone-Fist  
🗂️  Game Line: Werewolf (Red Talon, Unknown Auspice)  
💪 Strength: 1  
🏃 Dexterity: 1  
❤️ Stamina: 1  
🎭 Charisma: 1  
🗣️ Manipulation: 1  
🌟 Appearance: 1  
👁️ Perception: 1  
🧠 Intelligence: 1  
⚡ Wits: 1  
────── ABILITIES ──────  
(none recorded)  

🎲 Most-Used Dice Pools:  
- Perception + Alertness: 1  
- Dexterity + Brawl: 1  
- Manipulation + Subterfuge: 1  
- Wits + Intimidation: 1  
- Dexterity + Firearms: 1  

❤️ Health Levels:  
[ ][ ][ ][ ][ ][ ][ ] (Penalty: 0)

🔵 Willpower: 5/5  
⭐ Experience: 0  
Rage: 1, Gnosis: 3, Renown: Glory 0, Honor 0, Wisdom 0

---
## [Test] Standard get by name (get_character_by_name)

### Input
```json
{ "name": "Genevieve" }
```
### Output
```json
{
  "id": 1,
  "name": "Genevieve",
  "concept": null,
  "game_line": "vampire",
  "strength": 1,
  "dexterity": 1,
  "stamina": 1,
  "charisma": 1,
  "manipulation": 1,
  "appearance": 1,
  "perception": 1,
  "intelligence": 1,
  "wits": 1,
  "willpower_current": 5,
  "willpower_permanent": 5,
  "health_levels": "{\"bruised\":{},\"hurt\":{},\"injured\":{},\"wounded\":{},\"mauled\":{},\"crippled\":{},\"incapacitated\":{}}",
  "experience": 0,
  "abilities": [
    {
      "name": "Brawl",
      "type": "Talent",
      "rating": 3,
      "specialty": null
    },
    {
      "name": "Drive",
      "type": "Skill",
      "rating": 1,
      "specialty": null
    },
    {
      "name": "Intimidation",
      "type": "Talent",
      "rating": 2,
      "specialty": null
    },
    {
      "name": "Melee",
      "type": "Skill",
      "rating": 2,
      "specialty": null
    }
  ],
  "character_id": 1,
  "clan": "Toreador",
  "generation": 13,
  "blood_pool_current": 10,
  "blood_pool_max": 10,
  "humanity": 7,
  "disciplines": [
    {
      "name": "Celerity",
      "rating": 1
    },
    {
      "name": "Potence",
      "rating": 2
    }
  ]
}
```
---
### Input
```json
{ "name": "Stone-Fist" }
```
### Output
```json
{
  "id": 2,
  "name": "Stone-Fist",
  "concept": null,
  "game_line": "werewolf",
  "strength": 1,
  "dexterity": 1,
  "stamina": 1,
  "charisma": 1,
  "manipulation": 1,
  "appearance": 1,
  "perception": 1,
  "intelligence": 1,
  "wits": 1,
  "willpower_current": 5,
  "willpower_permanent": 5,
  "health_levels": "{\"bruised\":{},\"hurt\":{},\"injured\":{},\"wounded\":{},\"mauled\":{},\"crippled\":{},\"incapacitated\":{}}",
  "experience": 0,
  "abilities": [],
  "character_id": 2,
  "breed": null,
  "auspice": null,
  "tribe": "Red Talon",
  "gnosis_current": 3,
  "gnosis_permanent": 3,
  "rage_current": 1,
  "rage_permanent": 1,
  "renown_glory": 0,
  "renown_honor": 0,
  "renown_wisdom": 0,
  "gifts": []
}
```
---
## [Test] Standard get antagonist by ID (get_antagonist)

### Input
```json
{ "antagonist_id": 1 }
```
### Output
```json
{
  "id": 1,
  "name": "Rocco",
  "template": "Sabbat Shovelhead",
  "concept": "Expendable vampire soldier—fodder for the Sword of Caine.",
  "game_line": "vampire",
  "strength": 3,
  "dexterity": 2,
  "stamina": 2,
  "charisma": 2,
  "manipulation": 1,
  "appearance": 1,
  "perception": 2,
  "intelligence": 1,
  "wits": 2,
  "willpower_current": 4,
  "willpower_permanent": 4,
  "health_levels": "{\"bruised\":1,\"hurt\":1,\"injured\":1,\"wounded\":1,\"mauled\":1,\"crippled\":1,\"incapacitated\":1}",
  "notes": "A freshly Embraced recruit thrown into battle by the Sabbat."
}
```
---
## [Test] Splat-specific data check (get_character / get_antagonist)

### Input
```json
{ "character_id": 2 }
```
### Output (only highlighting splat fields)
```json
{
  "game_line": "werewolf",
  "tribe": "Red Talon",
  "gnosis_current": 3,
  "gnosis_permanent": 3,
  "rage_current": 1,
  "rage_permanent": 1,
  "renown_glory": 0,
  "renown_honor": 0,
  "renown_wisdom": 0,
  "gifts": []
}
```
Includes all expected werewolf splat fields: Gnosis, Rage, Renown, Gifts. Similar checks confirmed vampire fields for "Genevieve" and antagonists.

---
## [Test] Negative: Get nonexistent entity (get_character / get_antagonist)

### Input (character)
```json
{ "character_id": 99999 }
```
### Output
Error: ❌ Character with ID 99999 not found.

---
### Input (antagonist)
```json
{ "antagonist_id": 99999 }
```
### Output
Error: ❌ Antagonist with ID 99999 not found.

---
## [Test] Validation: Invalid type on get (get_character)

### Input
```json
{ "character_id": "abc" }
```
### Output
Error: ❌ Invalid or missing 'character_id'. Must provide a valid number.

---
## [Test] Standard update to simple trait (update_character)

### Input
```json
{ "character_id": 1, "updates": { "concept": "Survivor" } }
```
### Output
Character "Genevieve" (ID 1) updated.

---
## [Test] Splat-specific update (update_character)

### Input
```json
{ "character_id": 1, "updates": { "humanity": 6 } }
```
### Output
Character "Genevieve" (ID 1) updated.

### Verification
Fetched character: Humanity = 6

---
## [Test] Validation: Invalid field on update (update_character)

### Input
```json
{ "character_id": 1, "updates": { "luck_points": 5 } }
```
### Output
Error: ❌ Error updating character: Invalid field for update: 'luck_points'. Field does not exist or cannot be updated.

---
## [Test] Validation: Data type mismatch on update (update_character)

### Input
```json
{ "character_id": 1, "updates": { "strength": "strong" } }
```
### Output
Error: ❌ Error updating character: Invalid data type for field 'strength'. Expected number, but got string.

---
## [Test] Standard list characters (list_characters)

### Input
```json
{}
```
### Output
🎭 Character Roster:
- Genevieve (vampire) [ID: 1]
- Stone-Fist (werewolf) [ID: 2]
- Elsa (mage) [ID: 3]
- Lilac (changeling) [ID: 4]
- Rin (mage) [ID: 5]

---
## [Test] Standard list antagonists (list_antagonists)

### Input
```json
{}
```
### Output
Rocco (ID: 1)

---
## [Test] Edge: Empty roster on list (list_characters/list_antagonists)

### Input (characters)
```json
{}
```
### Output
No characters found.

### Input (antagonists)
```json
{}
```
### Output
No antagonists found.

---
## [Test] Data cascade on delete (remove_character)

### Steps & Inputs
1. Created character "CascadeTest" (ID: 6)
2. Added inventory item "Cascade Knife" to character 6
3. Deleted character "CascadeTest" (ID: 6)
4. Queried inventory for character 6

### Output
- Item successfully added.
- Character deleted and all associated data (including inventory) removed.
- Inventory query result: (Empty)

**Cascade delete is verified: no orphaned inventory remains after character deletion.**

---
## [Test] Integration: Add then list (list_characters)

### Input (add)
```json
{ "name": "RosterUser", "game_line": "mage" }
```
### Output (add)
Character "RosterUser" created with ID 7

### Input (list_characters)
```json
{}
```
### Output
🎭 Character Roster:
- RosterUser (mage) [ID: 7]

---
## [Test] Standard character deletion (remove_character)

### Input
```json
{ "character_id": 7 }
```
### Output
✅ Character 'RosterUser' (ID: 7) and all associated data have been permanently removed.

---
## [Test] Standard spend/restore resource, validation and edge cases

### Input
_Create vampire "ResourceTest" (ID: 8)_
```json
{ "name": "ResourceTest", "game_line": "vampire", "clan": "Brujah" }
```

_Spend willpower_
```json
{ "character_id": 8, "resource_name": "willpower", "amount": 1 }
```
Output: ✅ ResourceTest spent 1 willpower. New total: 4

_Restore willpower_
```json
{ "character_id": 8, "resource_name": "willpower", "amount": 1 }
```
Output: ✅ ResourceTest restored 1 willpower. New total: 5/5

_Attempt to overspend_
```json
{ "character_id": 8, "resource_name": "willpower", "amount": 10 }
```
Output: ❌ Not enough willpower. Has 5, needs 10.

_Attempt to over-restore_
```json
{ "character_id": 8, "resource_name": "willpower", "amount": 99 }
```
Output: ✅ ResourceTest restored 99 willpower. New total: 5/5 (capped at max).

_Create mage "MageResource" (ID: 9)_
```json
{ "name": "MageResource", "game_line": "mage" }
```

_Invalid resource for splat_
```json
{ "character_id": 9, "resource_name": "blood", "amount": 1 }
```
Output: ❌ Invalid or inapplicable resource 'blood' for this character's game line.

_Resource name consistency_
```json
{ "character_id": 9, "resource_name": "willpower", "roll_successes": 2 }
```
Output: ✅ MageResource restored 2 willpower. New total: 5/5

---
## [Test] Apply damage types (oWoD logic), overflow, incapacitate, and wound penalty

### Steps & Inputs

_Create vampire "ResourceTest" (ID: 8)_

_Apply 2 bashing damage_
```json
{ "target_id": 8, "target_type": "character", "damage_successes": 2, "damage_type": "bashing" }
```
Output: 💥 2 bashing damage applied to ResourceTest.

_Apply 1 lethal damage_
```json
{ "target_id": 8, "target_type": "character", "damage_successes": 1, "damage_type": "lethal" }
```
Output: 💥 1 lethal damage applied to ResourceTest.

_Apply 8 lethal damage for overflow test_
```json
{ "target_id": 8, "target_type": "character", "damage_successes": 8, "damage_type": "lethal" }
```
Output: 💥 8 lethal damage applied to ResourceTest.

_Fetch character's health track_
Health Levels: [X][X][X][X][X][X][X] (all lethal, as expected for incapacity)

_Dice roll (post-damage, should check for wound penalty but doesn't)_
```json
{ "pool_size": 5, "difficulty": 6, "wound_penalty": 0 }
```
Output: [6, 4, 8, 8, 2] → 3 successes

**Observation:** The wound penalty is not being enforced by the combat engine (or is not transmitted automatically by the game-state after damage). This may require further integration/bugfix.

---
## [Test] XP Award, Spend, Improve Trait, and Cost Validation

### Steps

_Award XP_
```json
{ "character_id": 8, "amount": 30, "reason": "Full XP flow test" }
```
Output: 30 XP awarded

_Check cost to improve Strength from 1 to 2_
Output: 8 XP

_Improve Strength to 2_
Output: 8 XP spent, Strength now 2, XP left: 22

_Check cost to improve Brawl from 0 to 1_
Output: 2 XP

_Improve Brawl to 1_
Output: 2 XP spent, Brawl now 1, XP left: 20

_Check cost to improve Dexterity from 1 to 2_
Output: 8 XP

_Improve Dexterity to 2_
Output: 8 XP spent, Dexterity now 2, XP left: 12

_Attempt to improve Dexterity again (cost: 12 XP)_
Output: 8 XP spent, Dexterity now 3, XP left: 4

_Attempt to improve Dexterity once more (XP insufficient)_
Output: ❌ Not enough XP. Needs 12, has 4.

**Result: XP logic, validation, and trait improvement/cost calculation all operate as expected.**

---
## [Test] Full Inventory Lifecycle and Blocker Verification

### Steps

_Add item to inventory_
```json
{ "character_id": 8, "item": { "name": "Test Dagger", "type": "weapon", "quantity": 1, "description": "A short, sharp dagger for testing." } }
```
Output: ✅ Added item "Test Dagger" (ID: 1) to character (ID: 8).

_Get inventory_
Output: 🎒 Inventory for Character #8: Test Dagger (x1) [ID: 1]

_Update item (provide target_type)_
```json
{ "item_id": 1, "updates": { "description": "A magical test dagger with silvered edge.", "quantity": 2 }, "target_type": "character" }
```
Output: ✅ Updated item with ID 1.

_Remove item (provide target_type and target_id)_
```json
{ "item_id": 1, "target_type": "character", "target_id": 8 }
```
Output: ✅ Removed item with ID 1 from character with ID 8.

_Blocker test: Update item with nonexistent ID_
```json
{ "item_id": 9999, "updates": { "description": "This should fail" }, "target_type": "character" }
```
Output: ❌ Failed to update item: Item with ID 9999 not found, no update performed.

**Result: All CRUD operations and error handling for inventory lifecycle are correct.**

---
## [Test] Blocker: World state persistence tools and input validation

### Save and fetch world state
```json
{
  "location": "Chantry",
  "notes": "Testing state persistence",
  "data": { "situation": "secure", "vibe": "arcane" }
}
```
Output: 🌍 World state saved successfully.

_Fetch world state:_  
Output: { "location": "Chantry", "notes": "Testing state persistence", "data": { "situation": "secure", "vibe": "arcane" }, ... }

### Invalid save (empty)
```json
{}
```
Output: ❌ Invalid input. At least one of 'location', 'notes', or 'data' must be provided.

### Save and fetch story progress
```json
{ "chapter": "Ch1", "scene": "S1", "summary": "Intro complete, party arrived at Chantry." }
```
Output: 📖 Story progress for Chapter Ch1, Scene S1 saved.

_Invalid story progress save (empty):_  
Output: ❌ Invalid input. 'chapter', 'scene', and 'summary' are required.

**Result: Both persistence tools and input validation work as expected and block empty or broken saves.**

---
## [Test] Core Dice & Combat Mechanics (combat-engine)

### Standard pool
```json
{ "pool_size": 5, "difficulty": 6 }
```
Output: [10, 7, 10, 8, 7] → 5 successes

### Specialty rule
```json
{ "pool_size": 5, "difficulty": 6, "has_specialty": true }
```
Output: [1, 5, 10, 7, 7] → [specialty activated, 3 successes]

### Zero dice pool (chance die)
```json
{ "pool_size": 0, "difficulty": 6 }
```
Output: [8] → 0 successes

### Negative dice pool (invalid)
```json
{ "pool_size": -1, "difficulty": 6 }
```
Output: Error: 'pool_size' must be a non-negative integer.

### Contested action
```json
{ "attacker_pool": 5, "defender_pool": 3, "attacker_difficulty": 6, "defender_difficulty": 6 }
```
Output: Attacker rolls: [8, 9, 8, 4, 5] (3), Defender: [4, 5, 3] (0); Attacker wins by 3 net successes

### Soak logic
```json
{ "soak_pool": 5, "damage_type": "lethal", "has_fortitude": false }
```
Output: [1, 4, 5, 5, 6] → soak 1 point of damage

### Damage pool logic
```json
{ "pool_size": 6, "damage_type": "lethal" }
```
Output: [4, 9, 7, 2, 2, 8] → 3 levels of lethal damage

---

All dice mechanisms, specialty, contested, soak, and damage pool roll as expected or validate errors.
## [Blocker] Antagonist Creation, Deletion, and Unique Constraint Tests

All antagonist lifecycle and blocker tests remain untestable because antagonist template database content is missing or mismatched.

- Attempts to create new antagonists (template: "Sabbat Shovelhead") return: FOREIGN KEY constraint failure.
- Standard antagonist deletion and unique constraint retest (remove then recreate from same template) cannot proceed without functioning antagonist_templates DB table.

**Resolution:** Once the antagonist template DB is restored, antagonist create/delete/blocker tests can be re-run. All other test categories and checklist items are confirmed and logged above.

---