import type { GameDatabase } from '../db.js';

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