// Batch creation helper: do not include in your dispatcher, this is just for visibility.
// The following files should exist as stubs for dispatcher robustness—they export an async handler.
export const stub_list = [
  "create_antagonist.handler.ts",
  "get_antagonist.handler.ts",
  "update_antagonist.handler.ts",
  "list_antagonists.handler.ts",
  "remove_antagonist.handler.ts",
  "award_xp.handler.ts",
  "improve_trait.handler.ts",
  "get_trait_improvement_cost.handler.ts",
  "apply_status_effect.handler.ts",
  "get_status_effects.handler.ts",
  "remove_status_effect.handler.ts",
  "add_item.handler.ts",
  "get_inventory.handler.ts",
  "update_item.handler.ts",
  "remove_item.handler.ts",
  "save_world_state.handler.ts",
  "get_world_state.handler.ts",
  "save_story_progress.handler.ts",
  "set_initiative.handler.ts",
  "get_initiative_order.handler.ts",
  "advance_turn.handler.ts",
  "get_current_turn.handler.ts"
];
// Each stub:
///// FILE TEMPLATE /////
// import { makeTextContentArray } from "../index.js";
// export async function <name>_handler(args: any) {
//   return { content: makeTextContentArray(["Not implemented (<name>_handler)"]) };
// }