# Test Block 5: World State & Initiative Management

## Overview
This test block covers world state persistence, story progress tracking, and initiative/turn management systems. These tools manage the broader game state and combat flow.

## Tools Covered
- `save_world_state`
- `get_world_state`
- `save_story_progress`
- `set_initiative`
- `get_initiative_order`
- `advance_turn`
- `get_current_turn`
- `roll_initiative_for_scene` (combat-engine-server)

---

## Test Cases

### World State Management

#### `save_world_state`
**Test 5.1: Save Basic World State**
- **Goal**: Persist current game world information
- **Input**: `{ "location": "The Elysium", "notes": "Prince Hardestadt has called a gathering", "data": { "time": "midnight", "weather": "stormy", "npcs_present": ["Prince Hardestadt", "Sheriff Marcus"] } }`
- **Expected**: World state saved successfully

**Test 5.2: Save Complex World Data**
- **Goal**: Store detailed world information
- **Input**: `{ "location": "Downtown Investigation Site", "notes": "Blood trail leads to warehouse", "data": { "clues_found": ["bloody footprints", "torn fabric"], "time": "2:30 AM", "danger_level": "high", "witnesses": [] } }`
- **Expected**: Complex data structure saved correctly

**Test 5.3: Update Existing World State**
- **Goal**: Overwrite previous world state
- **Input**: Save new world state after Test 5.1
- **Expected**: New state replaces old, previous data overwritten

**Test 5.4: Save Minimal World State**
- **Goal**: Handle minimal required data
- **Input**: `{ "location": "Unknown", "notes": "" }`
- **Expected**: Minimal state saved, empty fields handled gracefully

#### `get_world_state`
**Test 5.5: Retrieve World State**
- **Goal**: Get last saved world state
- **Input**: `{}`
- **Expected**: Returns complete world state from Test 5.3

**Test 5.6: Get Empty World State**
- **Goal**: Handle case with no saved state
- **Input**: Get world state when none has been saved
- **Expected**: Empty state or default values returned

**Test 5.7: Verify Data Persistence**
- **Goal**: Confirm world state persists across operations
- **Input**: Save state, perform other operations, then get state
- **Expected**: World state unchanged by other operations

---

### Story Progress Tracking

#### `save_story_progress`
**Test 5.8: Log Story Checkpoint**
- **Goal**: Record narrative progress
- **Input**: `{ "chapter": "Chapter 1", "scene": "The Missing Ghoul", "summary": "The coterie discovered the ghoul was taken by Sabbat infiltrators. Investigation led to warehouse district." }`
- **Expected**: Story progress logged with timestamp

**Test 5.9: Log Multiple Story Points**
- **Goal**: Track story progression over time
- **Input**: Save multiple story progress entries
- **Expected**: Each entry logged separately with timestamps

**Test 5.10: Log Chapter Completion**
- **Goal**: Mark major story milestone
- **Input**: `{ "chapter": "Chapter 1", "scene": "Confrontation", "summary": "Coterie defeated Sabbat pack and rescued the ghoul. Prince rewards with boons." }`
- **Expected**: Chapter completion logged

**Test 5.11: Validation - Empty Summary**
- **Goal**: Handle minimal story data
- **Input**: `{ "chapter": "Chapter 2", "scene": "Opening", "summary": "" }`
- **Expected**: Entry saved with empty summary

---

### Initiative & Turn Management

#### `set_initiative`
**Test 5.12: Set Basic Initiative Order**
- **Goal**: Establish turn order for combat
- **Input**: `{ "scene_id": "combat_1", "entries": [{ "character_id": 1, "actor_name": "Marcus", "initiative_score": 15, "turn_order": 1 }, { "npc_id": 2, "actor_name": "Sheriff", "initiative_score": 12, "turn_order": 2 }] }`
- **Expected**: Initiative order established for scene

**Test 5.13: Set Complex Initiative**
- **Goal**: Handle multiple actors with mixed types
- **Input**: `{ "scene_id": "combat_2", "entries": [{ "character_id": 1, "actor_name": "Alice", "initiative_score": 18, "turn_order": 1 }, { "character_id": 2, "actor_name": "Bob", "initiative_score": 14, "turn_order": 2 }, { "npc_id": 3, "actor_name": "Sabbat Leader", "initiative_score": 16, "turn_order": 3 }, { "npc_id": 4, "actor_name": "Sabbat Grunt", "initiative_score": 10, "turn_order": 4 }] }`
- **Expected**: All actors properly ordered by initiative

**Test 5.14: Update Initiative Order**
- **Goal**: Modify existing initiative order
- **Input**: Set new initiative for existing scene
- **Expected**: Previous order replaced with new order

#### `get_initiative_order`
**Test 5.15: Get Initiative Order**
- **Goal**: Retrieve current turn order
- **Input**: `{ "scene_id": "combat_1" }`
- **Expected**: Returns actors in initiative order with scores

**Test 5.16: Get Nonexistent Scene**
- **Goal**: Handle request for missing scene
- **Input**: `{ "scene_id": "nonexistent_scene" }`
- **Expected**: Error: "Scene not found" or empty result

**Test 5.17: Get Multiple Scene Orders**
- **Goal**: Verify scene isolation
- **Input**: Get initiative for both combat_1 and combat_2
- **Expected**: Each scene returns its own separate initiative order

#### `advance_turn`
**Test 5.18: Advance to Next Actor**
- **Goal**: Move turn to next in sequence
- **Input**: `{ "scene_id": "combat_1" }`
- **Expected**: Turn advances to next actor in initiative order

**Test 5.19: Advance Through Full Round**
- **Goal**: Cycle through all actors
- **Input**: Advance turn through all actors in combat_1
- **Expected**: After last actor, advances to round 2 with first actor

**Test 5.20: Advance Multiple Scenes**
- **Goal**: Verify independent scene management
- **Input**: Advance turns in both combat_1 and combat_2
- **Expected**: Each scene maintains separate turn state

#### `get_current_turn`
**Test 5.21: Get Current Actor**
- **Goal**: Check whose turn it is
- **Input**: `{ "scene_id": "combat_1" }`
- **Expected**: Returns current actor, round number, turn position

**Test 5.22: Get Turn After Advance**
- **Goal**: Verify turn advancement
- **Input**: Get current turn after advancing from Test 5.18
- **Expected**: Shows next actor as current

**Test 5.23: Get Turn in New Round**
- **Goal**: Check round cycling
- **Input**: Get current turn after completing full round
- **Expected**: Shows round 2 with first actor

---

### Combat Engine Initiative Integration

#### `roll_initiative_for_scene` (Combat Engine)
**Test 5.24: Roll Initiative Scores**
- **Goal**: Generate initiative for multiple actors
- **Input**: `{ "scene_id": "combat_3", "actors": [{ "name": "Marcus", "dex": 3, "wits": 2 }, { "name": "Sheriff", "dex": 4, "wits": 3 }] }`
- **Expected**: Initiative scores rolled and turn order established

**Test 5.25: Cross-Server Integration**
- **Goal**: Verify combat engine delegates to game-state server
- **Input**: Use combat engine initiative tools
- **Expected**: Tools properly delegate to game-state server for persistence

**Test 5.26: Initiative with Modifiers**
- **Goal**: Handle initiative modifiers
- **Input**: Roll initiative with wound penalties or other modifiers
- **Expected**: Modifiers properly applied to initiative rolls

---

### Integration & Edge Cases

**Test 5.27: World State During Combat**
- **Goal**: Verify world state independence from combat
- **Input**: Save world state, run combat, check world state
- **Expected**: World state unaffected by combat operations

**Test 5.28: Multiple Concurrent Combats**
- **Goal**: Handle multiple simultaneous combat scenes
- **Input**: Set up initiative for 3 different scenes
- **Expected**: Each scene maintains independent state

**Test 5.29: Story Progress During Combat**
- **Goal**: Log story events during combat
- **Input**: Save story progress while combat is active
- **Expected**: Story logging works independently of combat state

**Test 5.30: Initiative Persistence**
- **Goal**: Verify initiative survives server operations
- **Input**: Set initiative, perform other operations, check initiative
- **Expected**: Initiative order unchanged by other operations

**Test 5.31: Scene Cleanup**
- **Goal**: Test removing completed combat scenes
- **Input**: Complete combat, then try to access scene
- **Expected**: Appropriate handling of completed/removed scenes

**Test 5.32: Turn Order Edge Cases**
- **Goal**: Handle tied initiative scores
- **Input**: Set initiative with identical scores
- **Expected**: Tie-breaking rules applied consistently

**Test 5.33: Empty Scene Management**
- **Goal**: Handle scene with no actors
- **Input**: Try to advance turn in empty scene
- **Expected**: Appropriate error or empty state handling

---

## Success Criteria
- World state saves and retrieves correctly with all data types
- Story progress logs accumulate properly with timestamps
- Initiative order maintains correct sequence and round tracking
- Turn advancement cycles properly through actors and rounds
- Multiple scenes operate independently
- Cross-server integration works for combat engine tools
- All edge cases are handled gracefully
- Data persistence works across all operations

## Dependencies
- Requires characters and antagonists from Test Block 1
- May reference characters with status effects from Test Block 3
- Should be run after dice mechanics are verified in Test Block 4
- This is the final test block and integrates all previous systems
