import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Combat state storage
let combatLog: string[] = [];
let currentTurn = 0;

// Dice rolling function
function rollDice(notation: string): { total: number, rolls: number[], modifier: number } {
  const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) throw new Error('Invalid dice notation');
  
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = parseInt(match[3] || '0');
  
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
  
  return { total, rolls, modifier };
}

// Create server
const server = new Server({
  name: 'rpg-combat-engine-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'roll_dice',
      description: 'Roll dice with D&D notation (e.g., 1d20+5)',
      inputSchema: {
        type: 'object',
        properties: {
          notation: { type: 'string', description: 'Dice notation like 1d20+5' },
          reason: { type: 'string', description: 'What the roll is for' }
        },
        required: ['notation']
      }
    },
    {
      name: 'attack_roll',
      description: 'Make an attack roll',
      inputSchema: {
        type: 'object',
        properties: {
          attacker: { type: 'string' },
          target: { type: 'string' },
          modifier: { type: 'number' },
          advantage: { type: 'boolean' },
          disadvantage: { type: 'boolean' }
        },
        required: ['attacker', 'target', 'modifier']
      }
    },
    {
      name: 'damage_roll',
      description: 'Roll damage',
      inputSchema: {
        type: 'object',
        properties: {
          notation: { type: 'string' },
          damage_type: { type: 'string' },
          critical: { type: 'boolean' }
        },
        required: ['notation', 'damage_type']
      }
    },
    {
      name: 'saving_throw',
      description: 'Make a saving throw',
      inputSchema: {
        type: 'object',
        properties: {
          character: { type: 'string' },
          ability: { type: 'string' },
          dc: { type: 'number' },
          modifier: { type: 'number' }
        },
        required: ['character', 'ability', 'dc', 'modifier']
      }
    },
    {
      name: 'get_combat_log',
      description: 'Get recent combat log entries',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 10 }
        }
      }
    },
    {
      name: 'clear_combat_log',
      description: 'Clear the combat log',
      inputSchema: { type: 'object', properties: {} }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'roll_dice': {
        const result = rollDice((args as any).notation);
        const logEntry = `${(args as any).reason || 'Dice roll'}: ${(args as any).notation} = ${result.rolls.join('+')}${result.modifier !== 0 ? (result.modifier > 0 ? '+' : '') + result.modifier : ''} = ${result.total}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }
      
      case 'attack_roll': {
        let roll1 = rollDice('1d20+' + (args as any).modifier);
        let roll2 = (args as any).advantage || (args as any).disadvantage ? rollDice('1d20+' + (args as any).modifier) : null;
        
        let finalRoll = roll1;
        if ((args as any).advantage && roll2) finalRoll = roll1.total >= roll2.total ? roll1 : roll2;
        if ((args as any).disadvantage && roll2) finalRoll = roll1.total <= roll2.total ? roll1 : roll2;
        
        const critical = finalRoll.rolls[0] === 20;
        const fumble = finalRoll.rolls[0] === 1;
        
        const logEntry = `${(args as any).attacker} attacks ${(args as any).target}: ${finalRoll.total} ${critical ? '(CRITICAL!)' : fumble ? '(FUMBLE!)' : ''}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({ 
              total: finalRoll.total, 
              critical, 
              fumble, 
              rolls: finalRoll.rolls,
              modifier: finalRoll.modifier 
            }, null, 2) 
          }]
        };
      }
      
      case 'damage_roll': {
        let result = rollDice((args as any).notation);
        if ((args as any).critical) {
          const critRoll = rollDice((args as any).notation);
          result.total += critRoll.total;
          result.rolls = [...result.rolls, ...critRoll.rolls];
        }
        
        const logEntry = `Damage (${(args as any).damage_type}): ${result.total}${(args as any).critical ? ' (CRITICAL)' : ''}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }
      
      case 'saving_throw': {
        const result = rollDice(`1d20+${(args as any).modifier}`);
        const success = result.total >= (args as any).dc;
        
        const logEntry = `${(args as any).character} ${(args as any).ability} save: ${result.total} vs DC ${(args as any).dc} - ${success ? 'SUCCESS' : 'FAILURE'}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({ 
              total: result.total, 
              dc: (args as any).dc, 
              success,
              rolls: result.rolls,
              modifier: result.modifier
            }, null, 2) 
          }]
        };
      }
      
      case 'get_combat_log': {
        const limit = (args as any).limit || 10;
        const recentLog = combatLog.slice(-limit);
        return {
          content: [{ type: 'text', text: recentLog.join('\n') }]
        };
      }
      
      case 'clear_combat_log': {
        combatLog = [];
        return {
          content: [{ type: 'text', text: 'Combat log cleared' }]
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
console.error('RPG Combat Engine MCP Server running on stdio');
