// File: game-state-server/src/tool-definitions.ts

export const toolDefinitions = {
  create_character: {
    name: "create_character",
    description: "Create a new character.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        game_line: { type: "string", enum: ["vampire", "werewolf", "mage", "changeling"] },
        concept: { type: "string" },
        title: { type: "string" },
        notes: { type: "string" }
      },
      required: ["name", "game_line"],
    },
  },
  get_character: {
    name: "get_character",
    description: "Retrieve a character by ID.",
    inputSchema: {
      type: "object",
      properties: { character_id: { type: "number" } },
      required: ["character_id"],
    },
  },
  get_character_by_name: {
    name: "get_character_by_name",
    description: "Retrieve a character by name.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
  list_characters: {
    name: "list_characters",
    description: "List all created characters.",
    inputSchema: { type: "object", properties: {} },
  },
  remove_character: {
    name: "remove_character",
    description: "Permanently delete a character.",
    inputSchema: {
      type: "object",
      properties: { character_id: { type: "number" } },
      required: ["character_id"],
    },
  },
  update_character: {
    name: "update_character",
    description: "Update character traits.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        updates: { type: "object" },
      },
      required: ["character_id", "updates"],
    },
  },
  create_antagonist: {
    name: "create_antagonist",
    description: "Create an NPC from a template.",
    inputSchema: {
      type: "object",
      properties: {
        template_name: { type: "string" },
        custom_name: { type: "string" },
      },
      required: ["template_name"],
    },
  },
  create_custom_antagonist: {
    name: "create_custom_antagonist",
    description: "Creates a unique NPC from scratch.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        game_line: { type: "string", enum: ["vampire", "werewolf", "mage", "changeling", "mortal"] }
      },
      required: ["name", "game_line"],
    },
  },
  get_antagonist: {
    name: "get_antagonist",
    description: "Retrieve an antagonist by ID.",
    inputSchema: {
      type: "object",
      properties: { antagonist_id: { type: "number" } },
      required: ["antagonist_id"],
    },
  },
  list_antagonists: {
    name: "list_antagonists",
    description: "List all antagonists.",
    inputSchema: { type: "object", properties: {} },
  },
  remove_antagonist: {
    name: "remove_antagonist",
    description: "Remove an antagonist.",
    inputSchema: {
      type: "object",
      properties: { antagonist_id: { type: "number" } },
      required: ["antagonist_id"],
    },
  },
  update_antagonist: {
    name: "update_antagonist",
    description: "Update an antagonist's traits.",
    inputSchema: {
      type: "object",
      properties: {
        antagonist_id: { type: "number" },
        updates: { type: "object" },
      },
      required: ["antagonist_id", "updates"],
    },
  },
  apply_damage: {
    name: "apply_damage",
    description: "Apply damage to a target.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] },
        damage_successes: { type: "number" },
        damage_type: { type: "string", enum: ["bashing", "lethal", "aggravated"] },
      },
      required: ["target_id", "target_type", "damage_successes", "damage_type"],
    },
  },
  spend_resource: {
    name: "spend_resource",
    description: "Spend a character resource.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        amount: { type: "number", default: 1 },
      },
      required: ["character_id", "resource_name"],
    },
  },
  restore_resource: {
    name: "restore_resource",
    description: "Restore a character resource.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        amount: { type: "number", default: 1 },
      },
      required: ["character_id", "resource_name"],
    },
  },
  gain_resource: {
    name: "gain_resource",
    description: "Gain a resource from an action.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string" },
        roll_successes: { type: "number" },
      },
      required: ["character_id", "resource_name", "roll_successes"],
    },
  },
  award_xp: {
    name: "award_xp",
    description: "Award experience points.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] },
        amount: { type: "number", minimum: 1 },
        reason: { type: "string" },
      },
      required: ["target_id", "target_type", "amount", "reason"],
    },
  },
  improve_trait: {
    name: "improve_trait",
    description: "Spend XP to improve a single trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        trait_type: { type: "string" },
        trait_name: { type: "string" },
      },
      required: ["character_id", "trait_type", "trait_name"],
    },
  },
  batch_improve_traits: {
    name: "batch_improve_traits",
    description: "Spend XP to improve multiple character traits.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        improvements: {
          type: "array",
          items: {
            type: "object",
            properties: { trait_type: { type: "string" }, trait_name: { type: "string" } },
            required: ["trait_type", "trait_name"],
          },
        },
      },
      required: ["character_id", "improvements"],
    },
  },
  batch_improve_antagonist_traits: {
    name: "batch_improve_antagonist_traits",
    description: "Spend XP to improve multiple antagonist traits.",
    inputSchema: {
      type: "object",
      properties: {
        antagonist_id: { type: "number" },
        improvements: {
          type: "array",
          items: {
            type: "object",
            properties: { trait_type: { type: "string" }, trait_name: { type: "string" } },
            required: ["trait_type", "trait_name"],
          },
        },
      },
      required: ["antagonist_id", "improvements"],
    },
  },
  get_trait_improvement_cost: {
    name: "get_trait_improvement_cost",
    description: "Calculate the XP cost to improve a trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        trait_type: { type: "string" },
        trait_name: { type: "string" },
      },
      required: ["character_id", "trait_type", "trait_name"],
    },
  }, // <--- THIS IS THE MISSING COMMA
  add_item: {
    name: "add_item",
    description: "Add an item to a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        item: { type: "object" }
      },
      required: ["character_id", "item"],
    },
  },
  get_inventory: {
    name: "get_inventory",
    description: "Get a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" }
      },
      required: ["character_id"],
    },
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
      required: ["item_id", "updates"],
    },
  },
  remove_item: {
    name: "remove_item",
    description: "Remove an item from inventory.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "number" }
      },
      required: ["item_id"],
    },
  },
  apply_status_effect: {
    name: "apply_status_effect",
    description: "Apply a status effect.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] },
        effect_name: { type: "string" }
      },
      required: ["target_id", "target_type", "effect_name"],
    }
  },
  get_status_effects: {
    name: "get_status_effects",
    description: "Get all status effects on a target.",
    inputSchema: {
      type: "object",
      properties: {
        target_id: { type: "number" },
        target_type: { type: "string", enum: ["character", "antagonist"] }
      },
      required: ["target_id", "target_type"],
    },
  },
  remove_status_effect: {
    name: "remove_status_effect",
    description: "Remove a status effect by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        effect_id: { type: "number" }
      },
      required: ["effect_id"],
    },
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
    },
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
    description: "Set the initiative order.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" },
        entries: { type: "array" }
      },
      required: ["scene_id", "entries"],
    },
  },
  get_initiative_order: {
    name: "get_initiative_order",
    description: "Get the initiative order for a scene.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"],
    },
  },
  get_current_turn: {
    name: "get_current_turn",
    description: "Get the current turn for a scene.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"],
    },
  },
  advance_turn: {
    name: "advance_turn",
    description: "Advance to the next turn in initiative.",
    inputSchema: {
      type: "object",
      properties: {
        scene_id: { type: "string" }
      },
      required: ["scene_id"],
    },
  }
};