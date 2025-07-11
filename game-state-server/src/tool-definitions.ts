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
        name: { type: "string", description: "Custom name for the antagonist" },
        modifications: { type: "object", description: "Custom modifications" }
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
    description: "Apply damage to a character.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        damage: { type: "object", description: "Damage to apply (bashing, lethal, aggravated)" }
      },
      required: ["character_id", "damage"]
    }
  },
  spend_resource: {
    name: "spend_resource",
    description: "Spend a character resource (blood, willpower, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        resource_type: { type: "string", description: "Type of resource to spend" },
        amount: { type: "number", description: "Amount to spend" }
      },
      required: ["character_id", "resource_type", "amount"]
    }
  },
  restore_resource: {
    name: "restore_resource",
    description: "Restore a character resource.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        resource_type: { type: "string", description: "Type of resource to restore" },
        amount: { type: "number", description: "Amount to restore" }
      },
      required: ["character_id", "resource_type", "amount"]
    }
  },
  gain_resource: {
    name: "gain_resource",
    description: "Gain a character resource (beyond maximum).",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        resource_type: { type: "string", description: "Type of resource to gain" },
        amount: { type: "number", description: "Amount to gain" }
      },
      required: ["character_id", "resource_type", "amount"]
    }
  },
  award_xp: {
    name: "award_xp",
    description: "Award experience points to a character.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        amount: { type: "number", description: "Amount of XP to award" }
      },
      required: ["character_id", "amount"]
    }
  },
  spend_xp: {
    name: "spend_xp",
    description: "Spend experience points to improve a trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        trait_name: { type: "string", description: "Name of the trait to improve" },
        trait_type: { type: "string", description: "Type of trait (attribute, ability, etc.)" },
        new_rating: { type: "number", description: "New rating for the trait" }
      },
      required: ["character_id", "trait_name", "trait_type", "new_rating"]
    }
  },
  improve_trait: {
    name: "improve_trait",
    description: "Improve a character trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        trait_name: { type: "string", description: "Name of the trait to improve" },
        trait_type: { type: "string", description: "Type of trait" },
        new_rating: { type: "number", description: "New rating" }
      },
      required: ["character_id", "trait_name", "trait_type", "new_rating"]
    }
  },
  get_trait_improvement_cost: {
    name: "get_trait_improvement_cost",
    description: "Get the XP cost to improve a trait.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        trait_name: { type: "string", description: "Name of the trait" },
        trait_type: { type: "string", description: "Type of trait" },
        new_rating: { type: "number", description: "Target rating" }
      },
      required: ["character_id", "trait_name", "trait_type", "new_rating"]
    }
  },
  apply_status_effect: {
    name: "apply_status_effect",
    description: "Apply a status effect to a character.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        effect_name: { type: "string", description: "Name of the effect" },
        description: { type: "string", description: "Description of the effect" },
        duration: { type: "number", description: "Duration in rounds/scenes" }
      },
      required: ["character_id", "effect_name"]
    }
  },
  get_status_effects: {
    name: "get_status_effects",
    description: "Get all status effects on a character.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" }
      },
      required: ["character_id"]
    }
  },
  remove_status_effect: {
    name: "remove_status_effect",
    description: "Remove a status effect from a character.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        effect_id: { type: "number", description: "ID of the effect to remove" }
      },
      required: ["character_id", "effect_id"]
    }
  },
  add_item: {
    name: "add_item",
    description: "Add an item to a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        item_name: { type: "string", description: "Name of the item" },
        item_type: { type: "string", description: "Type of item" },
        quantity: { type: "number", description: "Quantity to add" }
      },
      required: ["character_id", "item_name"]
    }
  },
  get_inventory: {
    name: "get_inventory",
    description: "Get a character's inventory.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" }
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
        item_id: { type: "number", description: "ID of the item" },
        updates: { type: "object", description: "Fields to update" }
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
        item_id: { type: "number", description: "ID of the item" }
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
        location: { type: "string", description: "Current location" },
        notes: { type: "string", description: "World state notes" },
        data: { type: "object", description: "Additional world data" }
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
        character_id: { type: "number", description: "ID of the character" },
        chapter: { type: "number", description: "Chapter number" },
        scene: { type: "number", description: "Scene number" },
        summary: { type: "string", description: "Summary of progress" }
      },
      required: ["chapter", "scene", "summary"]
    }
  },
  set_initiative: {
    name: "set_initiative",
    description: "Set initiative for a character or antagonist.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" },
        antagonist_id: { type: "number", description: "ID of the antagonist" },
        initiative_value: { type: "number", description: "Initiative value" }
      },
      required: ["initiative_value"]
    }
  },
  get_initiative_order: {
    name: "get_initiative_order",
    description: "Get the current initiative order.",
    inputSchema: { type: "object", properties: {} }
  },
  advance_turn: {
    name: "advance_turn",
    description: "Advance to the next turn in combat.",
    inputSchema: { type: "object", properties: {} }
  },
  get_current_turn: {
    name: "get_current_turn",
    description: "Get information about the current turn.",
    inputSchema: { type: "object", properties: {} }
  }
};
