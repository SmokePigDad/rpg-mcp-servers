/**
 * Centralized tool definitions for every MCP tool supported by the game-state server.
 * To add new tools or update schemas, modify this file.
 */
export const toolDefinitions = {
  // Character Management
  create_character: {},
  get_character: {},
  get_character_by_name: {},
  update_character: {},
  list_characters: {},

  // Antagonist Management
  create_antagonist: {},
  get_antagonist: {},
  update_antagonist: {},
  list_antagonists: {},
  remove_antagonist: {},

  // Resources & Health
  spend_resource: {},
  restore_resource: {},
  gain_resource: {},
  apply_damage: {},

  // XP & Progression
  award_xp: {},
  spend_xp: {},
  improve_trait: {},
  get_trait_improvement_cost: {},

  // Status Effects
  apply_status_effect: {},
  get_status_effects: {},
  remove_status_effect: {},

  // Inventory
  add_item: {},
  get_inventory: {},
  update_item: {},
  remove_item: {},

  // World State & Initiative
  save_world_state: {},
  get_world_state: {},
  save_story_progress: {},
  set_initiative: {},
  get_initiative_order: {},
  advance_turn: {},
  get_current_turn: {}
};