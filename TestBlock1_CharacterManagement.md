# Test Block 1: Character & Antagonist Management

## Overview
This test block covers all character and antagonist creation, retrieval, updating, and management tools. These are foundational tools that other systems depend on.

## Tools Covered
- `create_character`
- `get_character` 
- `get_character_by_name`
- `update_character`
- `list_characters`
- `create_antagonist`
- `get_antagonist`
- `update_antagonist`
- `list_antagonists`
- `remove_antagonist`

---

## Test Cases

### Character Creation & Retrieval

#### `create_character`
**Test 1.1: Standard Character Creation**
- **Goal**: Create a basic vampire character
- **Input**: `{ "name": "TestVampire_1", "game_line": "vampire", "concept": "Neonate", "clan": "Brujah" }`
- **Expected**: Character created successfully with ID returned

**Test 1.2: Werewolf Character Creation**
- **Goal**: Create werewolf with tribe-specific data
- **Input**: `{ "name": "TestWerewolf_1", "game_line": "werewolf", "concept": "Ahroun", "tribe": "Get of Fenris" }`
- **Expected**: Character created with Rage, Gnosis, and tribal traits

**Test 1.3: Mage Character Creation**
- **Goal**: Create mage with tradition
- **Input**: `{ "name": "TestMage_1", "game_line": "mage", "concept": "Hermetic", "tradition": "Order of Hermes" }`
- **Expected**: Character created with Arete and spheres

**Test 1.4: Changeling Character Creation**
- **Goal**: Create changeling with kith
- **Input**: `{ "name": "TestChangeling_1", "game_line": "changeling", "concept": "Sidhe Noble", "kith": "Sidhe" }`
- **Expected**: Character created with Glamour and Banality

**Test 1.5: Validation - Missing Name**
- **Goal**: Reject character creation without name
- **Input**: `{ "game_line": "vampire", "clan": "Brujah" }`
- **Expected**: Error: "Missing required field: name."

**Test 1.6: Validation - Invalid Game Line**
- **Goal**: Reject invalid game line
- **Input**: `{ "name": "TestInvalid", "game_line": "dragon" }`
- **Expected**: Error: "Invalid value for game_line."

**Test 1.7: Validation - Duplicate Name**
- **Goal**: Prevent duplicate character names
- **Input**: Create character with same name as Test 1.1
- **Expected**: Error containing "UNIQUE constraint failed"

#### `get_character` & `get_character_by_name`
**Test 1.8: Get Character by ID**
- **Goal**: Retrieve character using ID from Test 1.1
- **Input**: `{ "character_id": <ID_from_test_1.1> }`
- **Expected**: Complete character sheet returned

**Test 1.9: Get Character by Name**
- **Goal**: Retrieve character using name
- **Input**: `{ "name": "TestVampire_1" }`
- **Expected**: Same character data as Test 1.8

**Test 1.10: Get Nonexistent Character**
- **Goal**: Handle missing character gracefully
- **Input**: `{ "character_id": 99999 }`
- **Expected**: Error: "Character not found"

#### `update_character`
**Test 1.11: Update Basic Trait**
- **Goal**: Modify character concept
- **Input**: `{ "character_id": <ID>, "updates": { "concept": "Updated Concept" } }`
- **Expected**: Character updated, change reflected in get_character

**Test 1.12: Update Attributes**
- **Goal**: Modify character attributes
- **Input**: `{ "character_id": <ID>, "updates": { "strength": 3, "dexterity": 4 } }`
- **Expected**: Attributes updated successfully

**Test 1.13: Update Splat-Specific Trait**
- **Goal**: Update vampire-specific trait
- **Input**: `{ "character_id": <vampire_ID>, "updates": { "humanity": 6 } }`
- **Expected**: Humanity updated in vampire-specific data

#### `list_characters`
**Test 1.14: List All Characters**
- **Goal**: Get summary of all created characters
- **Input**: `{}`
- **Expected**: List containing all test characters created above

---

### Antagonist Management

#### `create_antagonist`
**Test 1.15: Create Vampire Sheriff**
- **Goal**: Create antagonist from template
- **Input**: `{ "name": "Sheriff Marcus", "template": "vampire_sheriff", "game_line": "vampire" }`
- **Expected**: Antagonist created with sheriff-appropriate stats

**Test 1.16: Create Sabbat Shovelhead**
- **Goal**: Create basic vampire antagonist
- **Input**: `{ "name": "Sabbat Grunt", "template": "sabbat_shovelhead", "game_line": "vampire" }`
- **Expected**: Antagonist created with shovelhead stats

**Test 1.17: Validation - Invalid Template**
- **Goal**: Reject unknown template
- **Input**: `{ "name": "Test", "template": "dragon_lord", "game_line": "vampire" }`
- **Expected**: Error about unknown template

#### `get_antagonist`
**Test 1.18: Get Antagonist by ID**
- **Goal**: Retrieve antagonist data
- **Input**: `{ "npc_id": <ID_from_test_1.15> }`
- **Expected**: Complete antagonist sheet with stats

#### `update_antagonist`
**Test 1.19: Update Antagonist Stats**
- **Goal**: Modify antagonist resources
- **Input**: `{ "npc_id": <ID>, "updates": { "willpower_current": 6, "notes": "Recently fed" } }`
- **Expected**: Antagonist updated successfully

#### `list_antagonists`
**Test 1.20: List All Antagonists**
- **Goal**: Get summary of all antagonists
- **Input**: `{}`
- **Expected**: List containing Sheriff Marcus and Sabbat Grunt

#### `remove_antagonist`
**Test 1.21: Remove Antagonist**
- **Goal**: Delete an antagonist
- **Input**: `{ "npc_id": <sabbat_grunt_ID> }`
- **Expected**: Antagonist removed, no longer in list_antagonists

---

## Success Criteria
- All character creation tests pass for each game line
- Character retrieval works by both ID and name
- Character updates modify the correct data
- Antagonist templates create appropriate NPCs
- All validation tests properly reject invalid input
- List functions return complete and accurate data
- Remove operations properly delete data

## Dependencies
This test block has no dependencies and should be run first, as other test blocks depend on having characters and antagonists created.
