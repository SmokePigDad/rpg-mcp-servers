import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GameDatabase } from './db.js';

// Initialize database
const db = new GameDatabase();

// Create server
const server = new Server({
  name: 'rpg-game-state-server',
  version: '2.0.0',
}, {
  capabilities: { 
    tools: {},
  },
});

// Enhanced tool definitions with complete action economy and spatial features
const toolDefinitions = [
  // Character Management
  {
    name: 'create_character',
    description: 'Create a new D&D 5E character',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        class: {
          type: 'string',
          enum: ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard']
        },
        race: {
          type: 'string',
          default: 'Human',
          enum: ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling']
        },
        background: {
          type: 'string',
          default: 'Folk Hero',
          enum: ['Acolyte', 'Criminal', 'Folk Hero', 'Noble', 'Sage', 'Soldier', 'Charlatan', 'Entertainer', 'Guild Artisan', 'Hermit', 'Outlander', 'Sailor']
        },
        alignment: {
          type: 'string',
          default: 'Neutral',
          enum: ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil']
        },
        level: { type: 'number', default: 1, minimum: 1, maximum: 20 },
        stats: {
          type: 'object',
          properties: {
            strength: { type: 'number', minimum: 3, maximum: 18, default: 10 },
            dexterity: { type: 'number', minimum: 3, maximum: 18, default: 10 },
            constitution: { type: 'number', minimum: 3, maximum: 18, default: 10 },
            intelligence: { type: 'number', minimum: 3, maximum: 18, default: 10 },
            wisdom: { type: 'number', minimum: 3, maximum: 18, default: 10 },
            charisma: { type: 'number', minimum: 3, maximum: 18, default: 10 }
          }
        }
      },
      required: ['name', 'class']
    }
  },
  {
    name: 'get_character',
    description: 'Get character information',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'update_character',
    description: 'Update character stats',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        updates: { type: 'object' }
      },
      required: ['character_id', 'updates']
    }
  },
  {
    name: 'list_characters',
    description: 'List all characters',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_character_by_name',
    description: 'Get character by name',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    }
  },
  
  // Inventory Management
  {
    name: 'add_item',
    description: 'Add one or more items to a character\'s inventory',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              item_name: { type: 'string' },
              item_type: { type: 'string' },
              quantity: { type: 'number', default: 1 },
              properties: { type: 'object', default: {} }
            },
            required: ['item_name']
          }
        }
      },
      required: ['character_id', 'items']
    }
  },
  {
    name: 'get_inventory',
    description: 'Get character inventory',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'remove_item',
    description: 'Remove one or more items from inventory by their IDs',
    inputSchema: {
      type: 'object',
      properties: {
        item_ids: {
          type: 'array',
          items: { type: 'number' }
        }
      },
      required: ['item_ids']
    }
  },
  {
    name: 'update_item',
    description: 'Update item quantity or equipped status',
    inputSchema: {
      type: 'object',
      properties: {
        item_id: { type: 'number' },
        quantity: { type: 'number' },
        equipped: { type: 'boolean' }
      },
      required: ['item_id']
    }
  },

  // World State Management
  {
    name: 'save_world_state',
    description: 'Save the current world state',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        location: { type: 'string' },
        npcs: { type: 'object' },
        events: { type: 'object' },
        environment: { type: 'object' }
      },
      required: ['character_id', 'location']
    }
  },
  {
    name: 'get_world_state',
    description: 'Get the current world state',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'update_world_state',
    description: 'Update the current world state for a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        location: { type: 'string' },
        npcs: { type: 'object' },
        events: { type: 'object' },
        environment: { type: 'object' }
      },
      required: ['character_id', 'location']
    }
  },

  // Enhanced NPC Management
  {
    name: 'create_npc',
    description: 'Create a new NPC or enemy',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        template: { type: 'string', description: 'Use a preset: goblin, orc, skeleton, etc.' },
        type: {
          type: 'string',
          enum: ['enemy', 'ally', 'neutral']
        },
        customStats: { type: 'object', description: 'Override template stats' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_npc_group',
    description: 'Create multiple identical NPCs',
    inputSchema: {
      type: 'object',
      properties: {
        template: { type: 'string' },
        count: { type: 'number' },
        namePrefix: { type: 'string' }
      },
      required: ['template', 'count']
    }
  },
  {
    name: 'get_npc',
    description: 'Get NPC information',
    inputSchema: {
      type: 'object',
      properties: {
        npc_id: { type: 'number' }
      },
      required: ['npc_id']
    }
  },
  {
    name: 'list_npcs',
    description: 'List all NPCs',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['enemy', 'ally', 'neutral']
        },
        aliveOnly: { type: 'boolean' }
      }
    }
  },
  {
    name: 'update_npc',
    description: 'Update NPC stats. Valid fields: name, type, creature_type, size, current_hp, max_hp, armor_class, speed, strength, dexterity, constitution, intelligence, wisdom, charisma, proficiency_bonus, initiative_modifier, attacks, abilities, conditions, challenge_rating, experience_value. Also accepts: hit_points->current_hp, max_hit_points->max_hp, level->challenge_rating, special_abilities->abilities',
    inputSchema: {
      type: 'object',
      properties: {
        npc_id: { type: 'number' },
        updates: {
          type: 'object',
          description: 'Object containing field updates. Use current_hp/max_hp instead of hit_points/max_hit_points, challenge_rating instead of level'
        }
      },
      required: ['npc_id', 'updates']
    }
  },
  {
    name: 'remove_npc',
    description: 'Remove NPC from game',
    inputSchema: {
      type: 'object',
      properties: {
        npc_id: { type: 'number' }
      },
      required: ['npc_id']
    }
  },

  // Enhanced Encounter Management
  {
    name: 'create_encounter',
    description: 'Start a new combat encounter',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        environment: { type: 'string' }
      },
      required: ['character_id', 'name']
    }
  },
  {
    name: 'add_to_encounter',
    description: 'Add participants to encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' },
        participants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['character', 'npc']
              },
              id: { type: 'number' },
              initiative: { type: 'number' }
            }
          }
        }
      },
      required: ['encounter_id', 'participants']
    }
  },
  {
    name: 'get_encounter_state',
    description: 'Get current encounter status',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'next_turn',
    description: 'Advance to next turn in initiative',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'end_encounter',
    description: 'End the current encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' },
        outcome: {
          type: 'string',
          enum: ['victory', 'fled', 'defeat']
        }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'apply_damage',
    description: 'Apply damage to character or NPC',
    inputSchema: {
      type: 'object',
      properties: {
        target_type: {
          type: 'string',
          enum: ['character', 'npc']
        },
        target_id: { type: 'number' },
        damage: { type: 'number' }
      },
      required: ['target_type', 'target_id', 'damage']
    }
  },
  {
    name: 'get_active_encounter',
    description: 'Get the active encounter for a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' }
      },
      required: ['character_id']
    }
  },

  // Enhanced Turn Management
  {
    name: 'start_turn',
    description: 'Start a turn for the current actor in an encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'end_turn',
    description: 'End the current turn in an encounter',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' }
      },
      required: ['encounter_id']
    }
  },
  {
    name: 'consume_action',
    description: 'Consume an action for the current actor',
    inputSchema: {
      type: 'object',
      properties: {
        encounter_id: { type: 'number' },
        action_type: {
          type: 'string',
          enum: ['action', 'bonus_action', 'movement']
        }
      },
      required: ['encounter_id', 'action_type']
    }
  },

  // Story Progress Management
  {
    name: 'save_story_progress',
    description: 'Save story progress checkpoint for a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character whose progress is being saved.' },
        chapter: { type: 'string', description: 'Current chapter of the story.' },
        checkpoint: { type: 'string', description: 'Specific checkpoint within the chapter.' },
        summary: { type: 'string', description: 'A brief summary of the events at this checkpoint.' }
      },
      required: ['character_id', 'chapter', 'checkpoint', 'summary']
    }
  },

  // Quest Management
  {
    name: 'add_quest',
    description: 'Add a new quest to the game master list',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the quest' },
        description: { type: 'string', description: 'Detailed description of the quest' },
        objectives: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of objectives for the quest (e.g., ["Defeat the dragon", "Retrieve the artifact"])'
        },
        rewards: {
          type: 'object',
          properties: {
            gold: { type: 'number' },
            experience: { type: 'number' },
            items: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of item names or IDs'
            }
          },
          description: 'Rewards for completing the quest'
        }
      },
      required: ['title', 'description', 'objectives', 'rewards']
    }
  },
  {
    name: 'get_active_quests',
    description: 'Get all active quests for a specific character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character' }
      },
      required: ['character_id']
    }
  },
  {
    name: 'update_quest_state',
    description: 'Update the status or progress of a character\'s quest',
    inputSchema: {
      type: 'object',
      properties: {
        character_quest_id: { type: 'number', description: 'ID of the character-quest link (from character_quests table)' },
        status: {
          type: 'string',
          enum: ['active', 'completed', 'failed'],
          description: 'New status of the quest'
        },
        progress: {
          type: 'object',
          additionalProperties: true,
          description: 'JSON object detailing progress on specific objectives (optional)'
        }
      },
      required: ['character_quest_id', 'status']
    }
  },
  {
    name: 'assign_quest_to_character',
    description: 'Assign an existing quest to a character',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number', description: 'ID of the character' },
        quest_id: { type: 'number', description: 'ID of the quest to assign' },
        status: {
          type: 'string',
          enum: ['active', 'completed', 'failed'],
          default: 'active',
          description: 'Initial status of the quest for the character'
        }
      },
      required: ['character_id', 'quest_id']
    }
  },
  // Batch Operations for Efficiency
  {
    name: 'batch_create_npcs',
    description: 'Create multiple NPCs at once',
    inputSchema: {
      type: 'object',
      properties: {
        npcs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              template: { type: 'string', description: 'Use a preset: goblin, orc, skeleton, etc.' },
              type: {
                type: 'string',
                enum: ['enemy', 'ally', 'neutral']
              },
              customStats: { type: 'object', description: 'Override template stats' }
            },
            required: ['name']
          }
        }
      },
      required: ['npcs']
    }
  },
  {
    name: 'batch_update_npcs',
    description: 'Update multiple NPCs at once',
    inputSchema: {
      type: 'object',
      properties: {
        updates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              npc_id: { type: 'number' },
              updates: { type: 'object' }
            },
            required: ['npc_id', 'updates']
          }
        }
      },
      required: ['updates']
    }
  },
  {
    name: 'batch_apply_damage',
    description: 'Apply damage to multiple targets at once',
    inputSchema: {
      type: 'object',
      properties: {
        targets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              target_type: {
                type: 'string',
                enum: ['character', 'npc']
              },
              target_id: { type: 'number' },
              damage: { type: 'number' }
            },
            required: ['target_type', 'target_id', 'damage']
          }
        }
      },
      required: ['targets']
    }
  },
  {
    name: 'batch_remove_npcs',
    description: 'Remove multiple NPCs at once',
    inputSchema: {
      type: 'object',
      properties: {
        npc_ids: {
          type: 'array',
          items: { type: 'number' }
        }
      },
      required: ['npc_ids']
    }
  }
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      // Character management
      case 'create_character': {
        // Flatten stats object and include D&D 5E fields for database compatibility
        const flatArgs = {
          name: (args as any).name,
          class: (args as any).class,
          race: (args as any).race,
          background: (args as any).background,
          alignment: (args as any).alignment,
          level: (args as any).level,
          ...(args as any).stats // Spread the stats object to flatten it
        };
        const character = db.createCharacter(flatArgs) as any;

        // Calculate ability modifiers for display
        const getModifier = (score: number) => Math.floor((score - 10) / 2);
        const formatModifier = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;
        
        const level = character.level || 1;
        const profBonus = Math.ceil(level / 4) + 1;
        const dexMod = getModifier(character.dexterity || 10);
        
        const output = `🎭 NEW D&D 5E CHARACTER CREATED!

═══════════════════════════════════════════════════════════════
👤 ${character.name} - Level ${level} ${character.race || 'Human'} ${character.class}
📚 Background: ${character.background || 'Folk Hero'}
⚖️ Alignment: ${character.alignment || 'Neutral'}
🆔 Character ID: ${character.id}
═══════════════════════════════════════════════════════════════

💪 ABILITY SCORES:
┌────────────────────────────────────────────┐
│ 💪 STR: ${String(character.strength || 10).padStart(2)} (${formatModifier(getModifier(character.strength || 10)).padStart(3)})  🧠 INT: ${String(character.intelligence || 10).padStart(2)} (${formatModifier(getModifier(character.intelligence || 10)).padStart(3)}) │
│ 🏃 DEX: ${String(character.dexterity || 10).padStart(2)} (${formatModifier(dexMod).padStart(3)})  🧙 WIS: ${String(character.wisdom || 10).padStart(2)} (${formatModifier(getModifier(character.wisdom || 10)).padStart(3)}) │
│ ❤️ CON: ${String(character.constitution || 10).padStart(2)} (${formatModifier(getModifier(character.constitution || 10)).padStart(3)})  ✨ CHA: ${String(character.charisma || 10).padStart(2)} (${formatModifier(getModifier(character.charisma || 10)).padStart(3)}) │
└────────────────────────────────────────────┘

⚔️ COMBAT STATS:
🛡️ Armor Class: ${character.armor_class || 10}
❤️ Hit Points: ${character.current_hp || character.max_hp}/${character.max_hp}
🎯 Proficiency Bonus: ${formatModifier(profBonus)}
🏃 Initiative: ${formatModifier(dexMod)}
🦶 Speed: ${character.speed || 30} ft

📅 Created: ${new Date().toLocaleString()}

🎉 Ready for adventure! Use 'get_character' for full character sheet! 🗡️⚔️`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_character': {
        const character = db.getCharacter((args as any).character_id) as any;
        if (!character) {
          return {
            content: [{ type: 'text', text: '❌ Character not found!' }]
          };
        }

        // Calculate ability modifiers
        const getModifier = (score: number) => Math.floor((score - 10) / 2);
        const formatModifier = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;
        
        // Calculate proficiency bonus based on level
        const level = character.level || 1;
        const profBonus = Math.ceil(level / 4) + 1;
        
        // Calculate derived stats
        const strMod = getModifier(character.strength || 10);
        const dexMod = getModifier(character.dexterity || 10);
        const conMod = getModifier(character.constitution || 10);
        const intMod = getModifier(character.intelligence || 10);
        const wisMod = getModifier(character.wisdom || 10);
        const chaMod = getModifier(character.charisma || 10);
        
        const initiative = dexMod;
        const speed = 30; // Default human speed
        
        const output = `🎭 D&D 5E CHARACTER SHEET

═══════════════════════════════════════════════════════════════
👤 ${character.name}                                    🆔 ID: ${character.id}
🏛️ Class: ${character.class}                           📊 Level: ${level}
🧬 Race: ${character.race || 'Human'}                  ⚖️ Alignment: ${character.alignment || 'Neutral'}
📚 Background: ${character.background || 'Folk Hero'}
═══════════════════════════════════════════════════════════════

💪 ABILITY SCORES & MODIFIERS:
┌──────────────┬──────────────┬──────────────┐
│ 💪 STR: ${String(character.strength || 10).padStart(2)} (${formatModifier(strMod).padStart(3)}) │ 🧠 INT: ${String(character.intelligence || 10).padStart(2)} (${formatModifier(intMod).padStart(3)}) │ 🎯 Prof Bonus: ${formatModifier(profBonus).padStart(3)} │
│ 🏃 DEX: ${String(character.dexterity || 10).padStart(2)} (${formatModifier(dexMod).padStart(3)}) │ 🧙 WIS: ${String(character.wisdom || 10).padStart(2)} (${formatModifier(wisMod).padStart(3)}) │ 🏃 Initiative: ${formatModifier(initiative).padStart(3)} │
│ ❤️ CON: ${String(character.constitution || 10).padStart(2)} (${formatModifier(conMod).padStart(3)}) │ ✨ CHA: ${String(character.charisma || 10).padStart(2)} (${formatModifier(chaMod).padStart(3)}) │ 🦶 Speed: ${speed} ft      │
└──────────────┴──────────────┴──────────────┘

⚔️ COMBAT STATS:
┌────────────────────────────────────────────────────────────┐
│ 🛡️ Armor Class: ${String(character.armor_class || 10).padStart(2)}                              │
│ ❤️ Hit Points: ${String(character.current_hp || character.max_hp || 10).padStart(3)}/${String(character.max_hp || 10).padStart(3)}                            │
│ 🎲 Hit Dice: ${level}d${character.class === 'Wizard' ? '6' : character.class === 'Rogue' ? '8' : character.class === 'Fighter' ? '10' : character.class === 'Barbarian' ? '12' : '8'} (${level} remaining)                     │
│ ⭐ Experience: ${String(character.experience || 0).padStart(6)} XP                         │
│ 💰 Gold: ${String(character.gold || 0).padStart(8)} gp                              │
└────────────────────────────────────────────────────────────┘

🛡️ SAVING THROWS:
┌─────────────────────────────────────────────────────────────┐
│ 💪 Strength:     ${formatModifier(strMod).padStart(3)}  │ 🧠 Intelligence: ${formatModifier(intMod).padStart(3)}  │
│ 🏃 Dexterity:    ${formatModifier(dexMod).padStart(3)}  │ 🧙 Wisdom:       ${formatModifier(wisMod).padStart(3)}  │
│ ❤️ Constitution: ${formatModifier(conMod).padStart(3)}  │ ✨ Charisma:     ${formatModifier(chaMod).padStart(3)}  │
└─────────────────────────────────────────────────────────────┘

🎯 SKILLS:
┌─────────────────────────────────────────────────────────────┐
│ 🤸 Acrobatics (Dex):    ${formatModifier(dexMod).padStart(3)}  │ 🌿 Nature (Int):        ${formatModifier(intMod).padStart(3)}  │
│ 🐾 Animal Handling (Wis): ${formatModifier(wisMod).padStart(3)}  │ 👁️ Perception (Wis):    ${formatModifier(wisMod).padStart(3)}  │
│ 🏛️ Arcana (Int):        ${formatModifier(intMod).padStart(3)}  │ 🎭 Performance (Cha):   ${formatModifier(chaMod).padStart(3)}  │
│ 💪 Athletics (Str):     ${formatModifier(strMod).padStart(3)}  │ 🗣️ Persuasion (Cha):    ${formatModifier(chaMod).padStart(3)}  │
│ 😈 Deception (Cha):     ${formatModifier(chaMod).padStart(3)}  │ 🙏 Religion (Int):      ${formatModifier(intMod).padStart(3)}  │
│ 📚 History (Int):       ${formatModifier(intMod).padStart(3)}  │ 🤫 Sleight of Hand (Dex): ${formatModifier(dexMod).padStart(3)}  │
│ 🔍 Insight (Wis):       ${formatModifier(wisMod).padStart(3)}  │ 👤 Stealth (Dex):       ${formatModifier(dexMod).padStart(3)}  │
│ 😠 Intimidation (Cha):  ${formatModifier(chaMod).padStart(3)}  │ 🏕️ Survival (Wis):      ${formatModifier(wisMod).padStart(3)}  │
│ 🔬 Investigation (Int): ${formatModifier(intMod).padStart(3)}  │ 🩺 Medicine (Wis):      ${formatModifier(wisMod).padStart(3)}  │
└─────────────────────────────────────────────────────────────┘

📅 CHARACTER INFO:
┌─────────────────────────────────────────────────────────────┐
│ 🎂 Created: ${new Date(character.created_at).toLocaleDateString().padEnd(12)} │ 🎮 Last Played: ${new Date(character.last_played).toLocaleDateString().padEnd(12)} │
└─────────────────────────────────────────────────────────────┘

🎒 Use 'get_inventory' to view equipment and items`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'update_character': {
        const character = db.updateCharacter((args as any).character_id, (args as any).updates) as any;
        const output = `✅ CHARACTER UPDATED!

👤 ${character.name} - ${character.class}

📊 CURRENT STATS:
💪 Strength: ${character.strength || 10}     🧠 Intelligence: ${character.intelligence || 10}
🏃 Dexterity: ${character.dexterity || 10}    🧙 Wisdom: ${character.wisdom || 10}
❤️ Constitution: ${character.constitution || 10}  ✨ Charisma: ${character.charisma || 10}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'list_characters': {
        const characters = db.listCharacters() as any[];
        if (characters.length === 0) {
          return {
            content: [{ type: 'text', text: '📋 NO CHARACTERS FOUND\n\nCreate your first character to begin your adventure! 🎭✨' }]
          };
        }
        
        let output = '📋 CHARACTER ROSTER\n\n';
        characters.forEach((char: any, index: number) => {
          output += `${index + 1}. 👤 ${char.name} (${char.class}) - ID: ${char.id}\n`;
        });
        output += `\n📊 Total Characters: ${characters.length}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_character_by_name': {
        const character = db.getCharacterByName((args as any).name) as any;
        if (!character) {
          return {
            content: [{ type: 'text', text: `❌ No character found with name "${(args as any).name}"` }]
          };
        }

        // Calculate ability modifiers
        const getModifier = (score: number) => Math.floor((score - 10) / 2);
        const formatModifier = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;
        
        // Calculate proficiency bonus based on level
        const level = character.level || 1;
        const profBonus = Math.ceil(level / 4) + 1;
        
        // Calculate derived stats
        const strMod = getModifier(character.strength || 10);
        const dexMod = getModifier(character.dexterity || 10);
        const conMod = getModifier(character.constitution || 10);
        const intMod = getModifier(character.intelligence || 10);
        const wisMod = getModifier(character.wisdom || 10);
        const chaMod = getModifier(character.charisma || 10);
        
        const initiative = dexMod;
        const speed = 30; // Default human speed
        
        const output = `🎭 D&D 5E CHARACTER SHEET

═══════════════════════════════════════════════════════════════
👤 ${character.name}                                    🆔 ID: ${character.id}
🏛️ Class: ${character.class}                           📊 Level: ${level}
🧬 Race: ${character.race || 'Human'}                  ⚖️ Alignment: ${character.alignment || 'Neutral'}
📚 Background: ${character.background || 'Folk Hero'}
═══════════════════════════════════════════════════════════════

💪 ABILITY SCORES & MODIFIERS:
┌──────────────┬──────────────┬──────────────┐
│ 💪 STR: ${String(character.strength || 10).padStart(2)} (${formatModifier(strMod).padStart(3)}) │ 🧠 INT: ${String(character.intelligence || 10).padStart(2)} (${formatModifier(intMod).padStart(3)}) │ 🎯 Prof Bonus: ${formatModifier(profBonus).padStart(3)} │
│ 🏃 DEX: ${String(character.dexterity || 10).padStart(2)} (${formatModifier(dexMod).padStart(3)}) │ 🧙 WIS: ${String(character.wisdom || 10).padStart(2)} (${formatModifier(wisMod).padStart(3)}) │ 🏃 Initiative: ${formatModifier(initiative).padStart(3)} │
│ ❤️ CON: ${String(character.constitution || 10).padStart(2)} (${formatModifier(conMod).padStart(3)}) │ ✨ CHA: ${String(character.charisma || 10).padStart(2)} (${formatModifier(chaMod).padStart(3)}) │ 🦶 Speed: ${speed} ft      │
└──────────────┴──────────────┴──────────────┘

⚔️ COMBAT STATS:
┌────────────────────────────────────────────────────────────┐
│ 🛡️ Armor Class: ${String(character.armor_class || 10).padStart(2)}                              │
│ ❤️ Hit Points: ${String(character.current_hp || character.max_hp || 10).padStart(3)}/${String(character.max_hp || 10).padStart(3)}                            │
│ 🎲 Hit Dice: ${level}d${character.class === 'Wizard' ? '6' : character.class === 'Rogue' ? '8' : character.class === 'Fighter' ? '10' : character.class === 'Barbarian' ? '12' : '8'} (${level} remaining)                     │
│ ⭐ Experience: ${String(character.experience || 0).padStart(6)} XP                         │
│ 💰 Gold: ${String(character.gold || 0).padStart(8)} gp                              │
└────────────────────────────────────────────────────────────┘

🛡️ SAVING THROWS:
┌─────────────────────────────────────────────────────────────┐
│ 💪 Strength:     ${formatModifier(strMod).padStart(3)}  │ 🧠 Intelligence: ${formatModifier(intMod).padStart(3)}  │
│ 🏃 Dexterity:    ${formatModifier(dexMod).padStart(3)}  │ 🧙 Wisdom:       ${formatModifier(wisMod).padStart(3)}  │
│ ❤️ Constitution: ${formatModifier(conMod).padStart(3)}  │ ✨ Charisma:     ${formatModifier(chaMod).padStart(3)}  │
└─────────────────────────────────────────────────────────────┘

🎯 SKILLS:
┌─────────────────────────────────────────────────────────────┐
│ 🤸 Acrobatics (Dex):    ${formatModifier(dexMod).padStart(3)}  │ 🌿 Nature (Int):        ${formatModifier(intMod).padStart(3)}  │
│ 🐾 Animal Handling (Wis): ${formatModifier(wisMod).padStart(3)}  │ 👁️ Perception (Wis):    ${formatModifier(wisMod).padStart(3)}  │
│ 🏛️ Arcana (Int):        ${formatModifier(intMod).padStart(3)}  │ 🎭 Performance (Cha):   ${formatModifier(chaMod).padStart(3)}  │
│ 💪 Athletics (Str):     ${formatModifier(strMod).padStart(3)}  │ 🗣️ Persuasion (Cha):    ${formatModifier(chaMod).padStart(3)}  │
│ 😈 Deception (Cha):     ${formatModifier(chaMod).padStart(3)}  │ 🙏 Religion (Int):      ${formatModifier(intMod).padStart(3)}  │
│ 📚 History (Int):       ${formatModifier(intMod).padStart(3)}  │ 🤫 Sleight of Hand (Dex): ${formatModifier(dexMod).padStart(3)}  │
│ 🔍 Insight (Wis):       ${formatModifier(wisMod).padStart(3)}  │ 👤 Stealth (Dex):       ${formatModifier(dexMod).padStart(3)}  │
│ 😠 Intimidation (Cha):  ${formatModifier(chaMod).padStart(3)}  │ 🏕️ Survival (Wis):      ${formatModifier(wisMod).padStart(3)}  │
│ 🔬 Investigation (Int): ${formatModifier(intMod).padStart(3)}  │ 🩺 Medicine (Wis):      ${formatModifier(wisMod).padStart(3)}  │
└─────────────────────────────────────────────────────────────┘

📅 CHARACTER INFO:
┌─────────────────────────────────────────────────────────────┐
│ 🎂 Created: ${new Date(character.created_at).toLocaleDateString().padEnd(12)} │ 🎮 Last Played: ${new Date(character.last_played).toLocaleDateString().padEnd(12)} │
└─────────────────────────────────────────────────────────────┘

🎒 Use 'get_inventory' to view equipment and items`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Inventory management
      case 'add_item': {
        const { character_id, items } = args as any;
        const numCharacterId = Number(character_id);
        
        // Get character name
        const character = db.getCharacter(numCharacterId) as any;
        const characterName = character ? character.name : 'Unknown Character';
        
        const addedItems = [];
        
        for (const item of items) {
          // Transform MCP schema to database schema with proper defaults
          const dbItem = {
            name: item.item_name,
            type: item.item_type || 'misc',
            quantity: item.quantity || 1,
            properties: item.properties || null,
            equipped: item.equipped || false
          };
          const itemId = db.addItem(numCharacterId, dbItem);
          addedItems.push({ id: itemId, ...item });
        }
        
        let output = `🎒 ${characterName.toUpperCase()}'S INVENTORY UPDATED!\n\n`;
        addedItems.forEach((item: any) => {
          const equippedText = item.equipped ? ' 🔥(EQUIPPED)' : '';
          const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
          output += `📦 ${item.item_name}${quantityText}${equippedText}\n`;
          if (item.item_type) output += `   📋 Type: ${item.item_type}\n`;
        });
        
        if (addedItems.length === 1) {
          output += `\n✅ ${characterName} acquired the ${addedItems[0].item_name}!`;
        } else {
          output += `\n✅ ${characterName} acquired ${addedItems.length} new items!`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_inventory': {
        const inventory = db.getInventory((args as any).character_id) as any[];
        if (!inventory || inventory.length === 0) {
          return {
            content: [{ type: 'text', text: '🎒 INVENTORY EMPTY\n\nThis character has no items yet. Time to go adventuring! 🗡️✨' }]
          };
        }
        
        let output = '🎒 INVENTORY\n\n';
        let totalItems = 0;
        let equippedCount = 0;
        
        inventory.forEach((item: any, index: number) => {
          const equippedText = item.equipped ? ' 🔥(EQUIPPED)' : '';
          const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
          output += `${index + 1}. 📦 ${item.item_name}${quantityText}${equippedText}\n`;
          if (item.item_type) output += `    📋 Type: ${item.item_type}\n`;
          totalItems += item.quantity || 1;
          if (item.equipped) equippedCount++;
        });
        
        output += `\n📊 SUMMARY:\n`;
        output += `📦 Total Items: ${totalItems}\n`;
        output += `🔥 Equipped: ${equippedCount}\n`;
        output += `🎒 Unique Items: ${inventory.length}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'remove_item': {
        const { item_ids } = args as any;
        
        // Get item details before removing them
        const itemsToRemove = [];
        let characterName = 'Unknown Character';
        
        for (const itemId of item_ids) {
          const item = db.getItem(itemId);
          if (item) {
            itemsToRemove.push(item);
            // Get character name from the first item
            if (characterName === 'Unknown Character' && item.character_id) {
              const character = db.getCharacter(item.character_id) as any;
              if (character) characterName = character.name;
            }
          }
          db.removeItem(itemId);
        }
        
        let output = `🗑️ ${characterName.toUpperCase()}'S INVENTORY UPDATED!\n\n`;
        
        if (itemsToRemove.length === 1) {
          output += `✅ ${characterName} discarded the ${itemsToRemove[0].item_name}`;
        } else if (itemsToRemove.length > 1) {
          output += `✅ ${characterName} discarded ${itemsToRemove.length} items:\n`;
          itemsToRemove.forEach((item: any) => {
            const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
            output += `   📦 ${item.item_name}${quantityText}\n`;
          });
        } else {
          output += `✅ Items removed from inventory`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'update_item': {
        const { item_id, ...updates } = args as any;
        
        // Get the item and character details
        const item = db.getItem(item_id);
        const itemName = item ? item.item_name : `Item ${item_id}`;
        
        // Get character name if we have the item
        let characterName = 'Unknown Character';
        if (item && item.character_id) {
          const character = db.getCharacter(item.character_id) as any;
          if (character) characterName = character.name;
        }
        
        // Handle boolean conversion for equipped field
        if ('equipped' in updates && typeof updates.equipped === 'boolean') {
          updates.equipped = updates.equipped ? 1 : 0;
        }
        db.updateItem(item_id, updates);
        
        let output = `✅ ${itemName.toUpperCase()} UPDATED!\n\n`;
        
        if (updates.quantity !== undefined) {
          output += `📊 Quantity updated to: ${updates.quantity}\n`;
        }
        if ('equipped' in updates) {
          const isEquipped = updates.equipped === 1 || updates.equipped === true;
          if (isEquipped) {
            output += `🔥 ${characterName} equipped the ${itemName}\n`;
          } else {
            output += `🔥 ${characterName} unequipped the ${itemName}\n`;
          }
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // World state management
      case 'save_world_state': {
        const { character_id, location, npcs, events, environment } = args as any;
        
        try {
          db.saveWorldState(character_id, args as any);
          
          let output = `🌍 WORLD STATE SAVED!\n\n`;
          output += `👤 Character ID: ${character_id}\n`;
          output += `📍 Location: ${location}\n`;
          
          if (npcs && Object.keys(npcs).length > 0) {
            output += `👥 NPCs: ${Object.keys(npcs).length} tracked\n`;
          }
          
          if (events && Object.keys(events).length > 0) {
            output += `📚 Events: ${Object.keys(events).length} recorded\n`;
          }
          
          if (environment && Object.keys(environment).length > 0) {
            output += `🌿 Environment: ${Object.keys(environment).length} details saved\n`;
          }
          
          output += `\n💾 Saved: ${new Date().toLocaleString()}\n`;
          output += `✅ World state successfully preserved!`;
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } catch (error: any) {
          return {
            content: [{ type: 'text', text: `❌ SAVE FAILED\n\nError saving world state: ${error.message}\n\n💡 Make sure the character ID exists and try again.` }],
            isError: true
          };
        }
      }

      case 'get_world_state': {
        const character_id = (args as any).character_id;
        
        try {
          const state = db.getWorldState(character_id);
          
          if (!state) {
            return {
              content: [{ type: 'text', text: `🌍 NO WORLD STATE FOUND\n\nNo saved world state for character ID ${character_id}.\n\n💡 Use 'save_world_state' to create the first save!` }]
            };
          }
          
          let output = `🌍 WORLD STATE\n\n`;
          output += `👤 Character ID: ${character_id}\n`;
          output += `📍 Current Location: ${state.location || 'Unknown'}\n`;
          output += `📅 Last Updated: ${state.updated_at ? new Date(state.updated_at).toLocaleString() : 'Unknown'}\n\n`;
          
          if (state.npcs) {
            const npcData = typeof state.npcs === 'string' ? JSON.parse(state.npcs) : state.npcs;
            const npcCount = Object.keys(npcData).length;
            output += `👥 NPCs TRACKED: ${npcCount}\n`;
            if (npcCount > 0) {
              const npcNames = Object.keys(npcData).slice(0, 5);
              output += `   📋 Recent: ${npcNames.join(', ')}${npcCount > 5 ? '...' : ''}\n`;
            }
          }
          
          if (state.events) {
            const eventData = typeof state.events === 'string' ? JSON.parse(state.events) : state.events;
            const eventCount = Object.keys(eventData).length;
            output += `📚 EVENTS RECORDED: ${eventCount}\n`;
          }
          
          if (state.environment) {
            const envData = typeof state.environment === 'string' ? JSON.parse(state.environment) : state.environment;
            const envCount = Object.keys(envData).length;
            output += `🌿 ENVIRONMENT DETAILS: ${envCount} tracked elements\n`;
          }
          
          output += `\n📊 RAW DATA:\n\`\`\`json\n${JSON.stringify(state, null, 2)}\n\`\`\``;
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } catch (error: any) {
          return {
            content: [{ type: 'text', text: `❌ ERROR RETRIEVING WORLD STATE\n\nError: ${error.message}\n\n💡 Check that the character ID is valid.` }],
            isError: true
          };
        }
      }

      case 'update_world_state': {
        const { character_id, location, npcs, events, environment } = args as any;
        
        try {
          db.saveWorldState(character_id, args as any);
          
          let output = `🔄 WORLD STATE UPDATED!\n\n`;
          output += `👤 Character ID: ${character_id}\n`;
          output += `📍 New Location: ${location}\n`;
          
          const changes = [];
          if (npcs) changes.push('NPCs');
          if (events) changes.push('Events');
          if (environment) changes.push('Environment');
          
          if (changes.length > 0) {
            output += `📝 Updated: ${changes.join(', ')}\n`;
          }
          
          output += `\n💾 Updated: ${new Date().toLocaleString()}\n`;
          output += `✅ World state successfully updated!`;
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } catch (error: any) {
          return {
            content: [{ type: 'text', text: `❌ UPDATE FAILED\n\nError updating world state: ${error.message}\n\n💡 Make sure the character ID exists and try again.` }],
            isError: true
          };
        }
      }

      // Enhanced NPC management
      case 'create_npc': {
        const npc = db.createNPC(args as any) as any;
        const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
        const output = `${typeIcon} NEW NPC CREATED!

🏷️ ${npc.name} (${npc.template || 'Custom'})
📋 Type: ${npc.type || 'neutral'}
🆔 NPC ID: ${npc.id}

⚔️ COMBAT STATS:
❤️ HP: ${npc.current_hp || 'N/A'}    🛡️ AC: ${npc.armor_class || 'N/A'}
💪 STR: ${npc.strength || 10}  🧠 INT: ${npc.intelligence || 10}
🏃 DEX: ${npc.dexterity || 10}  🧙 WIS: ${npc.wisdom || 10}
❤️ CON: ${npc.constitution || 10}  ✨ CHA: ${npc.charisma || 10}

✅ Ready for encounters!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'create_npc_group': {
        const { template, count, namePrefix = '' } = args as any;
        const npcs = db.createNPCGroup(template, count, namePrefix) as any[];
        
        let output = `👥 NPC GROUP CREATED!\n\n`;
        output += `📋 Template: ${template}\n`;
        output += `🔢 Count: ${count}\n\n`;
        output += `CREATED NPCs:\n`;
        
        npcs.forEach((npc: any, index: number) => {
          const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
          output += `${index + 1}. ${typeIcon} ${npc.name} (ID: ${npc.id})\n`;
        });
        
        output += `\n✅ Successfully created ${count} ${template}s!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_npc': {
        const npc = db.getNPC((args as any).npc_id) as any;
        if (!npc) {
          return {
            content: [{ type: 'text', text: '❌ NPC not found!' }]
          };
        }
        
        const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
        const aliveStatus = npc.current_hp <= 0 ? '💀 DEAD' : npc.current_hp < (npc.max_hp || npc.current_hp) / 2 ? '🩸 WOUNDED' : '💚 HEALTHY';
        
        const output = `${typeIcon} NPC DETAILS

🏷️ ${npc.name} (${npc.template || 'Custom'})
📋 Type: ${npc.type || 'neutral'}
🩺 Status: ${aliveStatus}
🆔 NPC ID: ${npc.id}

⚔️ COMBAT STATS:
❤️ HP: ${npc.current_hp}${npc.max_hp ? `/${npc.max_hp}` : ''}    🛡️ AC: ${npc.armor_class || 'N/A'}
💪 STR: ${npc.strength || 10}  🧠 INT: ${npc.intelligence || 10}
🏃 DEX: ${npc.dexterity || 10}  🧙 WIS: ${npc.wisdom || 10}
❤️ CON: ${npc.constitution || 10}  ✨ CHA: ${npc.charisma || 10}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'list_npcs': {
        const npcs = db.listNPCs((args as any).type, (args as any).aliveOnly) as any[];
        if (!npcs || npcs.length === 0) {
          return {
            content: [{ type: 'text', text: '👥 NO NPCs FOUND\n\nCreate some NPCs to populate your world! 🌍✨' }]
          };
        }
        
        let output = '👥 NPC ROSTER\n\n';
        let enemyCount = 0, allyCount = 0, neutralCount = 0;
        
        npcs.forEach((npc: any, index: number) => {
          const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
          const aliveStatus = npc.current_hp <= 0 ? '💀' : npc.current_hp < (npc.max_hp || npc.current_hp) / 2 ? '🩸' : '💚';
          
          output += `${index + 1}. ${typeIcon} ${npc.name} ${aliveStatus} (ID: ${npc.id})\n`;
          output += `    📋 ${npc.template || 'Custom'} | ❤️ ${npc.current_hp}HP\n`;
          
          if (npc.type === 'enemy') enemyCount++;
          else if (npc.type === 'ally') allyCount++;
          else neutralCount++;
        });
        
        output += `\n📊 SUMMARY:\n`;
        output += `👹 Enemies: ${enemyCount}  🤝 Allies: ${allyCount}  🧑 Neutral: ${neutralCount}\n`;
        output += `📋 Total NPCs: ${npcs.length}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'update_npc': {
        const npc = db.updateNPC((args as any).npc_id, (args as any).updates) as any;
        const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
        
        const output = `✅ NPC UPDATED!

${typeIcon} ${npc.name} (${npc.template || 'Custom'})

⚔️ CURRENT STATS:
❤️ HP: ${npc.current_hp}${npc.max_hp ? `/${npc.max_hp}` : ''}    🛡️ AC: ${npc.armor_class || 'N/A'}
💪 STR: ${npc.strength || 10}  🧠 INT: ${npc.intelligence || 10}
🏃 DEX: ${npc.dexterity || 10}  🧙 WIS: ${npc.wisdom || 10}
❤️ CON: ${npc.constitution || 10}  ✨ CHA: ${npc.charisma || 10}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'remove_npc': {
        db.removeNPC((args as any).npc_id);
        return {
          content: [{ type: 'text', text: '🗑️ NPC REMOVED!\n\n✅ NPC has been successfully removed from the world.' }]
        };
      }

      // Enhanced encounter management
      case 'create_encounter': {
        const encounter = db.createEncounter(args as any) as any;
        const output = `⚔️ NEW ENCOUNTER CREATED!

🏷️ ${encounter.name}
📜 Description: ${encounter.description || 'No description provided'}
🌍 Environment: ${encounter.environment || 'Unknown location'}
🆔 Encounter ID: ${encounter.id}
📅 Started: ${new Date().toLocaleString()}

⏳ STATUS: Waiting for participants...
🎲 Use 'add_to_encounter' to add characters and NPCs!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'add_to_encounter': {
        const { encounter_id, participants } = args as any;
        const addedParticipants = [];
        
        for (const participant of participants) {
          const participantId = db.addEncounterParticipant(
            encounter_id,
            participant.type,
            participant.id,
            participant.initiative
          );
          addedParticipants.push({ participantId, ...participant });
        }
        
        let output = `🎲 PARTICIPANTS ADDED TO ENCOUNTER!\n\n`;
        addedParticipants.forEach((p: any, index: number) => {
          const typeIcon = p.type === 'character' ? '🎭' : p.type === 'npc' ? '👹' : '🧑';
          output += `${index + 1}. ${typeIcon} ${p.type.toUpperCase()} (ID: ${p.id}) - Initiative: ${p.initiative}\n`;
        });
        
        // Sort by initiative to show turn order
        const sorted = [...addedParticipants].sort((a, b) => b.initiative - a.initiative);
        output += `\n🎯 INITIATIVE ORDER:\n`;
        sorted.forEach((p: any, index: number) => {
          const typeIcon = p.type === 'character' ? '🎭' : '👹';
          output += `${index + 1}. ${typeIcon} Initiative ${p.initiative} - ${p.type.toUpperCase()} ${p.id}\n`;
        });
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_encounter_state': {
        const encounter = db.getEncounter((args as any).encounter_id) as any;
        const participants = db.getEncounterParticipants((args as any).encounter_id) as any[];
        
        if (!encounter) {
          return {
            content: [{ type: 'text', text: '❌ Encounter not found!' }]
          };
        }
        
        let output = `⚔️ ENCOUNTER STATUS\n\n`;
        output += `🏷️ ${encounter.name}\n`;
        output += `📜 ${encounter.description || 'No description'}\n`;
        output += `🌍 Location: ${encounter.environment || 'Unknown'}\n`;
        output += `📊 Status: ${encounter.status || 'Active'}\n`;
        output += `🕒 Round: ${encounter.current_round || 1}\n`;
        output += `👤 Current Turn: ${encounter.current_turn || 'Not started'}\n\n`;
        
        if (participants && participants.length > 0) {
          output += `🎯 PARTICIPANTS:\n`;
          const sorted = participants.sort((a: any, b: any) => b.initiative - a.initiative);
          sorted.forEach((p: any, index: number) => {
            const typeIcon = p.participant_type === 'character' ? '🎭' : '👹';
            const current = p.initiative_order === encounter.current_turn ? ' 👈 CURRENT TURN' : '';
            const participantType = (p.participant_type || 'unknown').toUpperCase();
            output += `${index + 1}. ${typeIcon} Initiative ${p.initiative} - ${participantType} ${p.participant_id}${current}\n`;
          });
        } else {
          output += `❓ No participants yet - add some with 'add_to_encounter'!`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'next_turn': {
        const currentParticipant = db.nextTurn((args as any).encounter_id) as any;
        const typeIcon = currentParticipant?.type === 'character' ? '🎭' : '👹';
        
        const output = `🎯 TURN ADVANCED!

${typeIcon} CURRENT TURN: ${currentParticipant?.type?.toUpperCase() || 'Unknown'} ${currentParticipant?.id || 'Unknown'}
🎲 Initiative: ${currentParticipant?.initiative || 'N/A'}

⚡ Ready for action! What will they do?`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'end_encounter': {
        db.endEncounter((args as any).encounter_id, (args as any).outcome);
        const outcomeIcon = (args as any).outcome === 'victory' ? '🏆' : (args as any).outcome === 'fled' ? '🏃‍♂️' : '💀';
        
        const output = `${outcomeIcon} ENCOUNTER ENDED!

📊 OUTCOME: ${((args as any).outcome || 'unknown').toUpperCase()}
🕒 DURATION: ${new Date().toLocaleString()}

${(args as any).outcome === 'victory' ? '🎉 Victory! Well fought!' :
  (args as any).outcome === 'fled' ? '💨 Tactical retreat - live to fight another day!' :
  '💀 Defeat... but heroes never truly die!'}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'apply_damage': {
        const result = db.applyDamage(
          (args as any).target_type,
          (args as any).target_id,
          (args as any).damage
        ) as any;
        
        // Get the target's name based on type
        let targetName = `${(args as any).target_type.toUpperCase()} ${(args as any).target_id}`;
        if ((args as any).target_type === 'character') {
          const character = db.getCharacter((args as any).target_id) as any;
          if (character) targetName = character.name;
        } else if ((args as any).target_type === 'npc') {
          const npc = db.getNPC((args as any).target_id) as any;
          if (npc) targetName = npc.name;
        }
        
        const typeIcon = (args as any).target_type === 'character' ? '🎭' : '👹';
        const damage = (args as any).damage;
        const hpStatus = result.current_hp <= 0 ? '💀 DEAD' : result.current_hp < result.max_hp / 2 ? '🩸 WOUNDED' : '💚 HEALTHY';
        
        const output = `💥 DAMAGE APPLIED!
        
        ${typeIcon} TARGET: ${targetName}
        ⚔️ DAMAGE: ${damage} points
        ❤️ HP: ${result.current_hp}/${result.max_hp || result.current_hp} ${hpStatus}
        
        ${result.current_hp <= 0 ? '💀 Target has fallen!' : result.current_hp < result.max_hp / 2 ? '🩸 Target is badly wounded!' : '💪 Target is still fighting strong!'}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_active_encounter': {
        const encounter = db.getActiveEncounter((args as any).character_id) as any;
        if (encounter) {
          const participants = db.getEncounterParticipants(encounter.id) as any[];
          
          let output = `⚔️ ACTIVE ENCOUNTER\n\n`;
          output += `🏷️ ${encounter.name}\n`;
          output += `📜 ${encounter.description || 'No description'}\n`;
          output += `🌍 Location: ${encounter.environment || 'Unknown'}\n`;
          output += `🕒 Round: ${encounter.current_round || 1}\n\n`;
          
          if (participants && participants.length > 0) {
            output += `🎯 INITIATIVE ORDER:\n`;
            const sorted = participants.sort((a: any, b: any) => b.initiative - a.initiative);
            sorted.forEach((p: any, index: number) => {
              const typeIcon = p.type === 'character' ? '🎭' : '👹';
              const current = p.id === encounter.current_turn ? ' 👈 CURRENT TURN' : '';
              output += `${index + 1}. ${typeIcon} Initiative ${p.initiative} - ${p.type.toUpperCase()} ${p.id}${current}\n`;
            });
          }
          
          return {
            content: [{ type: 'text', text: output }]
          };
        } else {
          return {
            content: [{ type: 'text', text: '🕊️ NO ACTIVE ENCOUNTER\n\nCharacter is currently out of combat. Use "create_encounter" to start a new battle!' }]
          };
        }
      }

      // Enhanced turn management
      case 'start_turn': {
        return {
          content: [{ type: 'text', text: '▶️ TURN STARTED!\n\n⚡ Ready for action! Choose your moves wisely.' }]
        };
      }

      case 'end_turn': {
        return {
          content: [{ type: 'text', text: '⏹️ TURN ENDED!\n\n🔄 Turn complete. Initiative moves to the next participant.' }]
        };
      }

      case 'consume_action': {
        const actionType = (args as any).action_type;
        const actionIcons: any = {
          action: '⚔️',
          bonus_action: '✨',
          movement: '🏃'
        };
        
        const output = `${actionIcons[actionType] || '⚡'} ${actionType.toUpperCase().replace('_', ' ')} CONSUMED!\n\n🎯 Action used this turn.`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Story progress management
      case 'save_story_progress': {
        const { character_id, chapter, checkpoint, summary } = args as any;
        db.saveStoryProgress(character_id, {
          chapter,
          scene: checkpoint,
          description: summary
        });
        
        const output = `📖 STORY PROGRESS SAVED!

📚 Chapter: ${chapter}
🔖 Checkpoint: ${checkpoint}
📝 Summary: ${summary}
💾 Saved: ${new Date().toLocaleString()}

✅ Your adventure continues!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Quest management
      case 'add_quest': {
        const quest = db.addQuest(args as any) as any;
        
        let output = `🎯 NEW QUEST ADDED!\n\n`;
        output += `📜 ${quest.title}\n`;
        output += `📋 ${quest.description}\n\n`;
        
        output += `🎯 OBJECTIVES:\n`;
        if (quest.objectives && Array.isArray(quest.objectives)) {
          quest.objectives.forEach((obj: string, index: number) => {
            output += `${index + 1}. ☐ ${obj}\n`;
          });
        }
        
        output += `\n🏆 REWARDS:\n`;
        if (quest.rewards) {
          if (quest.rewards.gold) output += `💰 Gold: ${quest.rewards.gold}\n`;
          if (quest.rewards.experience) output += `⭐ Experience: ${quest.rewards.experience}\n`;
          if (quest.rewards.items && quest.rewards.items.length > 0) {
            output += `🎁 Items: ${quest.rewards.items.join(', ')}\n`;
          }
        }
        
        output += `\n🆔 Quest ID: ${quest.id}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_active_quests': {
        const quests = db.getCharacterActiveQuests((args as any).character_id) as any[];
        
        if (!quests || quests.length === 0) {
          return {
            content: [{ type: 'text', text: '📜 NO ACTIVE QUESTS\n\nThis character has no active quests. Time to find some adventure! 🗺️✨' }]
          };
        }
        
        let output = '📜 ACTIVE QUESTS\n\n';
        
        quests.forEach((quest: any, index: number) => {
          const statusIcon = quest.status === 'completed' ? '✅' : quest.status === 'failed' ? '❌' : '🔄';
          output += `${index + 1}. ${statusIcon} ${quest.title}\n`;
          output += `    📋 ${quest.description}\n`;
          output += `    📊 Status: ${quest.status}\n`;
          if (quest.progress) {
            output += `    📈 Progress: ${JSON.stringify(quest.progress)}\n`;
          }
          output += `\n`;
        });
        
        output += `📊 SUMMARY: ${quests.length} active quest${quests.length > 1 ? 's' : ''}`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'update_quest_state': {
        const quest = db.updateCharacterQuestStatus(
          (args as any).character_quest_id,
          (args as any).status,
          (args as any).progress
        ) as any;
        
        const statusIcon = (args as any).status === 'completed' ? '🎉' : (args as any).status === 'failed' ? '💔' : '🔄';
        const statusText = (args as any).status === 'completed' ? 'COMPLETED!' :
                          (args as any).status === 'failed' ? 'FAILED!' : 'UPDATED!';
        
        let output = `${statusIcon} QUEST ${statusText}\n\n`;
        output += `📜 Quest Status Changed\n`;
        output += `📊 New Status: ${(args as any).status.toUpperCase()}\n`;
        
        if ((args as any).progress) {
          output += `📈 Progress Updated: ${JSON.stringify((args as any).progress)}\n`;
        }
        
        if ((args as any).status === 'completed') {
          output += `\n🎉 Congratulations! Quest completed successfully!`;
        } else if ((args as any).status === 'failed') {
          output += `\n💔 Quest failed... but every failure is a learning experience!`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'assign_quest_to_character': {
        const assignment = db.assignQuestToCharacter(
          (args as any).character_id,
          (args as any).quest_id,
          (args as any).status || 'active'
        ) as any;
        
        const output = `🎯 QUEST ASSIGNED!

📜 Quest has been assigned to character
👤 Character ID: ${(args as any).character_id}
🎯 Quest ID: ${(args as any).quest_id}
📊 Initial Status: ${(args as any).status || 'active'}
🆔 Assignment ID: ${assignment.id}

✅ Ready to begin the quest!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Batch operations
      case 'batch_create_npcs': {
        const { npcs } = args as any;
        const createdNpcs = [];
        
        for (const npcData of npcs) {
          const npc = db.createNPC(npcData) as any;
          createdNpcs.push(npc);
        }
        
        let output = `👥 BATCH NPC CREATION COMPLETE!\n\n`;
        output += `📊 Created ${createdNpcs.length} NPCs:\n\n`;
        
        createdNpcs.forEach((npc: any, index: number) => {
          const typeIcon = npc.type === 'enemy' ? '👹' : npc.type === 'ally' ? '🤝' : '🧑';
          output += `${index + 1}. ${typeIcon} ${npc.name} (${npc.template || 'Custom'}) - ID: ${npc.id}\n`;
        });
        
        output += `\n✅ All NPCs successfully created and ready for encounters!`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_update_npcs': {
        const { updates } = args as any;
        const updatedNpcs = [];
        
        for (const update of updates) {
          try {
            const npc = db.updateNPC(update.npc_id, update.updates) as any;
            updatedNpcs.push({ success: true, npc, npc_id: update.npc_id });
          } catch (error: any) {
            updatedNpcs.push({ success: false, error: error.message, npc_id: update.npc_id });
          }
        }
        
        let output = `🔄 BATCH NPC UPDATE COMPLETE!\n\n`;
        const successful = updatedNpcs.filter(u => u.success);
        const failed = updatedNpcs.filter(u => !u.success);
        
        output += `📊 Results: ${successful.length} successful, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ SUCCESSFUL UPDATES:\n`;
          successful.forEach((update: any, index: number) => {
            const typeIcon = update.npc.type === 'enemy' ? '👹' : update.npc.type === 'ally' ? '🤝' : '🧑';
            output += `${index + 1}. ${typeIcon} ${update.npc.name} (ID: ${update.npc_id})\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED UPDATES:\n`;
          failed.forEach((update: any, index: number) => {
            output += `${index + 1}. NPC ID: ${update.npc_id} - Error: ${update.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_apply_damage': {
        const { targets } = args as any;
        const results = [];
        
        for (const target of targets) {
          try {
            const result = db.applyDamage(target.target_type, target.target_id, target.damage) as any;
            
            // Get target name
            let targetName = `${target.target_type.toUpperCase()} ${target.target_id}`;
            if (target.target_type === 'character') {
              const character = db.getCharacter(target.target_id) as any;
              if (character) targetName = character.name;
            } else if (target.target_type === 'npc') {
              const npc = db.getNPC(target.target_id) as any;
              if (npc) targetName = npc.name;
            }
            
            results.push({
              success: true,
              targetName,
              damage: target.damage,
              current_hp: result.current_hp,
              max_hp: result.max_hp,
              target_type: target.target_type,
              target_id: target.target_id
            });
          } catch (error: any) {
            results.push({
              success: false,
              error: error.message,
              target_type: target.target_type,
              target_id: target.target_id,
              damage: target.damage
            });
          }
        }
        
        let output = `💥 BATCH DAMAGE APPLICATION COMPLETE!\n\n`;
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        output += `📊 Results: ${successful.length} successful, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ DAMAGE APPLIED:\n`;
          successful.forEach((result: any, index: number) => {
            const typeIcon = result.target_type === 'character' ? '🎭' : '👹';
            const hpStatus = result.current_hp <= 0 ? '💀' : result.current_hp < result.max_hp / 2 ? '🩸' : '💚';
            output += `${index + 1}. ${typeIcon} ${result.targetName}: -${result.damage}HP → ${result.current_hp}/${result.max_hp} ${hpStatus}\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. ${result.target_type.toUpperCase()} ${result.target_id}: ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_remove_npcs': {
        const { npc_ids } = args as any;
        const results = [];
        
        for (const npc_id of npc_ids) {
          try {
            // Get NPC name before removing
            const npc = db.getNPC(npc_id) as any;
            const npcName = npc ? npc.name : `NPC ${npc_id}`;
            
            db.removeNPC(npc_id);
            results.push({ success: true, npc_id, name: npcName });
          } catch (error: any) {
            results.push({ success: false, npc_id, error: error.message });
          }
        }
        
        let output = `🗑️ BATCH NPC REMOVAL COMPLETE!\n\n`;
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        output += `📊 Results: ${successful.length} removed, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ REMOVED:\n`;
          successful.forEach((result: any, index: number) => {
            output += `${index + 1}. 👹 ${result.name} (ID: ${result.npc_id})\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. NPC ID: ${result.npc_id} - Error: ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport);
console.error('Enhanced RPG Game State MCP Server v2.0 running on stdio');
