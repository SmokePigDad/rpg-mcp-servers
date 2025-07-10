# Test Block 5: World State & Initiative Management – RESULTS

## Summary
All tests relating to saving/retrieving world state, story progress, and initiative/turn management were blocked due to the absence of required MCP tool handlers (`save_world_state`, `get_world_state`, `save_story_progress`, `set_initiative`, `get_initiative_order`, `advance_turn`, `get_current_turn`, `roll_initiative_for_scene`) in [`game-state-server/src/index.ts`](game-state-server/src/index.ts).

Attempts to use `roll_initiative_for_scene` in the combat engine MCP server result in delegation to the game state server, but this tool is not implemented there, so all such calls fail with "Unknown tool request".

---

## Test Results

_All world state, narrative logging, initiative and turn management tests in Block 5 fail due to the known dispatcher wire-up issue._

- Example actual output:  
  `{"description": "Delegating to rpg-game-state. Please call roll_initiative_for_scene there."}`  
  Followed by:  
  `❌ Unknown tool request.`

---

## Critical Issue

**Stateful game and world management features cannot be validated; end-to-end combat/initiative integration is impossible until all relevant handlers are added.**

---

## Recommendations

Implement and register all required CRUD/initiative/story persistence tool handlers to the dispatcher.  
Re-run the full suite to verify persistence, multi-scene isolation, round cycling, and cross-server integration.