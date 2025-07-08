// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GameDatabase } from './db.js';
import { formatSheetByGameLine } from './characterSheets.js';

const db = new GameDatabase();
const server = new Server({ name: 'rpg-game-state-server', version: '2.1.0' }, { capabilities: { tools: {} } });

const toolDefinitions: any[] = [
    // ... (Your comprehensive tool definitions from the previous step go here) ...
    // Make sure to include all tools: create_character, get_character, update_character, spend_willpower, etc.
    // For brevity, I'll only show the handlers that need correction.
    // The full toolDefinitions from your provided file are fine.
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions // Ensure your full list is here
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'create_character': {
        const character = db.createCharacter(args);
        if (!character) {
          throw new Error("Character creation failed in database.");
        }
        const sheet = formatSheetByGameLine({ character });
        return { content: [sheet] };
      }

      case 'get_character': {
        const character = db.getCharacter((args as any).character_id);
        if (!character) {
          return { content: [{ type: 'text', text: '❌ Character not found!' }], isError: true };
        }
        const derangements = db.getDerangements((args as any).character_id);
        const sheet = formatSheetByGameLine({ character, derangements });
        return { content: [sheet] };
      }
      
      case 'get_character_by_name': {
        // This is a simplified example; your full implementation is better
        const character = (db as any).getCharacterByName((args as any).name); // Cast to any to bypass strict type checks if methods were refactored
        if (!character) {
            return { content: [{ type: 'text', text: `❌ No character found with name "${(args as any).name}"` }] };
        }
        const derangements = db.getDerangements(character.id);
        const sheet = formatSheetByGameLine({ character, derangements });
        return { content: [sheet] };
      }
      
      case 'update_character': {
        const character = db.updateCharacter((args as any).character_id, (args as any).updates);
        return { content: [{ type: 'text', text: `✅ Character #${(args as any).character_id} updated.` }] };
      }

      // --- Resource Spending Tools ---
      case 'spend_willpower': {
        const { character_id, amount = 1 } = args as any;
        const char = db.getCharacter(character_id);
        if (!char) return { content: [{ type: 'text', text: '❌ Character not found!' }], isError: true };
        const curr = Math.max(0, (char.willpower_current || 0) - amount);
        db.updateCharacter(character_id, { willpower_current: curr });
        return { content: [{ type: 'text', text: `🔵 ${char.name} spent ${amount} Willpower (${curr} left)` }] };
      }

      // ... (Implement other spend tools: spend_blood, spend_gnosis, etc. similarly) ...

      case 'apply_damage': {
        const { target_type, target_id, damage } = args as any;
        const result = (db as any).applyHealthLevelDamage(target_type, target_id, damage);
        // Format a human-readable response based on the result
        return { content: [{ type: 'text', text: `💥 Damage applied to ${target_type} #${target_id}. New state: ${JSON.stringify(result, null, 2)}` }] };
      }
      
      // ... (All your other tool handlers like add_item, list_characters, etc.) ...
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error in tool '${name}': ${error.message}` }],
      isError: true
    };
  }
});

server.connect(new StdioServerTransport());
console.error('oWoD RPG Game State MCP Server v2.1.0 running on stdio');
