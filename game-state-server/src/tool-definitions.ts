// File: game-state-server/src/tool-definitions.ts

/**
 * Centralized tool definitions for every MCP tool supported by the game-state server.
 * Exports ONLY a plain object, with tool name as key and tool data as value.
 */
export const toolDefinitions = {
  create_character: {
    name: "create_character",
    description: "Create a new character in the game state.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Character name" },
        game_line: { type: "string", description: "Game line (e.g., Vampire, Werewolf, Mage, etc.)" },
        player: { type: "string", description: "Player name (optional)" }
      },
      required: ["name", "game_line"]
    }
  },
  get_character: {
    name: "get_character",
    description: "Retrieve a character and their full data by character ID.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" }
      },
      required: ["character_id"]
    }
  },
  get_character_by_name: {
    name: "get_character_by_name",
    description: "Retrieve a character and their full data by character name.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Character name" }
      },
      required: ["name"]
    }
  },
  list_characters: {
    name: "list_characters",
    description: "List all characters in the game state.",
    inputSchema: { type: "object", properties: {} }
  },
  remove_character: {
    name: "remove_character",
    description: "Permanently delete a character and all of their associated data (abilities, inventory, etc.). This action is irreversible.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: {
          type: "number",
          description: "The unique ID of the character to be deleted."
        }
      },
      required: ["character_id"]
    }
  },
  update_character: {
    name: "update_character",
    description: "Update an existing character's attributes.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        updates: { type: "object", description: "Fields to update" }
      },
      required: ["character_id", "updates"]
    }
  },
  create_antagonist: {
    name: "create_antagonist",
    description: "Create a new antagonist/NPC.",
    inputSchema: {
      type: "object",
      properties: {
        template_name: { type: "string", description: "Name of the antagonist template" },
        custom_name: { type: "string", description: "Custom name for the antagonist (optional)" }
      },
      required: ["template_name"]
    }
  },
  get_antagonist: {
    name: "get_antagonist",
    description: "Retrieve an antagonist by ID.",
    inputSchema: {
      type: "object",
      properties: {
        antagonist_id: { type: "number", description: "ID of the antagonist" }
      },
      required: ["antagonist_id"]
    }
  },
  list_antagonists: {
    name: "list_antagonists",
    description: "List all antagonists/NPCs.",
    inputSchema: { type: "object", properties: {} }
  },
  update_antagonist: {
    name: "update_antagonist",
    description: "Update an existing antagonist.",
    inputSchema: {
      type: "object",
      properties: {
        antagonist_id: { type: "number", description: "ID of the antagonist" },
        updates: { type: "object", description: "Fields to update" }
      },
      required: ["antagonist_id", "updates"]
    }
  },
  remove_antagonist: {
    name: "remove_antagonist",
    description: "Remove an antagonist from the game.",
    inputSchema: {
      type: "object",
      properties: {
        antagonist_id: { type: "number", description: "ID of the antagonist" }
      },
      required: ["antagonist_id"]
    }
  },
  apply_damage: {
    name: "apply_damage",
    description: "Apply damage to a character or NPC.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "npc"] },
        damage_successes: { type: "number" },
        damage_type: { type: "string", enum: ["bashing", "lethal", "aggravated"] }
      },
      required: ["target_id", "target_type", "damage_successes", "damage_type"]
    }
  },
  spend_resource: {
    name: "spend_resource",
    description: "Spend a character resource (e.g., willpower, blood).",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string", description: "e.g., 'willpower', 'blood', 'rage'" },
        amount: { type: "number", default: 1 }
      },
      required: ["character_id", "resource_name"]
    }
  },
  restore_resource: {
    name: "restore_resource",
    description: "Restore a character resource.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        amount: { type: "number", default: 1 }
      },
      required: ["character_id", "resource_name"]
    }
  },
  gain_resource: {
    name: "gain_resource",
    description: "Gain a character resource from an in-game action.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        roll_successes: { type: "number" }
      },
      required: ["character_id", "resource_name", "roll_successes"]
    }
  },
  award_xp: {
    name: "award_xp",
    description: "Award experience points to a character.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        amount: { type: "number" },
        reason: { type: "string", description: "Reason for the award (optional)" }
      },
      required: ["character_id", "amount"]
    }
  },
  spend_xp: {
    name: "spend_xp",
    description: "Spend experience points. Note: This logs the expense. Use 'improve_trait' to actually change a trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        amount: { type: "number" },
        reason: { type: "string" }
      },
      required: ["character_id", "amount", "reason"]
    }
  },
  improve_trait: {
    name: "improve_trait",
    description: "Spend XP to improve a character trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        trait_type: { type: "string", enum: ["attribute", "ability", "discipline", "art", "willpower"] },
        trait_name: { type: "string" }
      },
      required: ["character_id", "trait_type", "trait_name"]
    }
  },
  get_trait_improvement_cost: {
    name: "get_trait_improvement_cost",
    description: "Get the XP cost to improve a trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        trait_type: { type: "string" },
        trait_name: { type: "string" }
      },
      required: ["character_id", "trait_type", "trait_name"]
    }
  },
  apply_status_effect: {
    name: "apply_status_effect",
    description: "Apply a status effect to a character or NPC.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "npc"] },
        effect_name: { type: "string" },
        description: { type: "string", description: "Narrative description of the effect." },
        duration_type: { type: "string", enum: ["rounds", "scene", "indefinite"] },
        duration_value: { type: "number", description: "e.g., number of rounds" }
      },
      required: ["target_id", "target_type", "effect_name"]
    }
  },
  get_status_effects: {
    name: "get_status_effects",
    description: "Get all status effects on a target.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "npc"] }
      },
      required: ["target_id", "target_type"]
    }
  },
  remove_status_effect: {
    name: "remove_status_effect",
    description: "Remove a status effect by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        effect_id: { type: "number" }
      },
      required: ["effect_id"]
    }
  },
  add_item: {
    name: "add_item",
    description: "Add an item to a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        item: { type: "object", description: "An object with name, type, quantity, etc." }
      },
      required: ["character_id", "item"]
    }
  },
  get_inventory: {
    name: "get_inventory",
    description: "Get a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" }
      },
      required: ["character_id"]
    }
  },
  update_item: {
    name: "update_item",
    description: "Update an item in inventory.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "number" },
        updates: { type: "object" }
      },
      required: ["item_id", "updates"]
    }
  },
  remove_item: {
    name: "remove_item",
    description: "Remove an item from inventory.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "number" }
      },
      required: ["item_id"]
    }
  },
  save_world_state: {
    name: "save_world_state",
    description: "Save the current world state.",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string" },
        notes: { type: "string" },
        data: { type: "object" }
      }
    }
  },
  get_world_state: {
    name: "get_world_state",
    description: "Get the current world state.",
    inputSchema: { type: "object", properties: {} }
  },
  save_story_progress: {
    name: "save_story_progress",
    description: "Save story progress.",
    inputSchema: {
      type: "object",
      properties: {
        chapter: { type: "string" },
        scene: { type: "string" },
        summary: { type: "string" }
      },
      required: ["chapter", "scene", "summary"]
    }
  },
  set_initiative: {
    name: "set_initiative",
    description: "Set the initiative order for a scene. Overwrites all entries for that scene.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" },
        entries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              character_id: { type: ["number", "null"] },
              npc_id: { type: ["number", "null"] },
              actor_name: { type: "string" },
              initiative_score: { type: "number" },
              turn_order: { type: "number" }
            },
            required: ["initiative_score", "turn_order"]
          }
        }
      },
      required: ["scene_id", "entries"]
    }
  },
  get_initiative_order: {
    name: "get_initiative_order",
    description: "Get the current initiative order.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"]
    }
  },
  advance_turn: {
    name: "advance_turn",
    description: "Advance to the next turn in combat.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"]
    }
  },
  get_current_turn: {
    name: "get_current_turn",
    description: "Get information about the current turn.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"]
    }
  }
};