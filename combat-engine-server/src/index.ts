import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Combat state storage
let combatLog: string[] = [];
let currentTurn = 0;

// Dice rolling function with support for advantage/disadvantage notation
function rollDice(notation: string): { total: number, rolls: number[], modifier: number, kept?: number[] } {
  // Check for keep highest/lowest notation (e.g., 2d20kh1, 2d20kl1)
  const keepMatch = notation.match(/(\d+)d(\d+)(k[hl]\d+)?([+-]\d+)?/);
  
  if (keepMatch) {
    const count = parseInt(keepMatch[1]);
    const sides = parseInt(keepMatch[2]);
    const keepRule = keepMatch[3]; // e.g., 'kh1' or 'kl1'
    const modifier = parseInt(keepMatch[4] || '0');
    
    // Roll all dice
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    
    let kept = rolls;
    if (keepRule) {
      const keepType = keepRule[1]; // 'h' for highest, 'l' for lowest
      const keepCount = parseInt(keepRule.substring(2));
      
      // Sort and keep the appropriate dice
      const sorted = [...rolls].sort((a, b) => b - a); // descending order
      if (keepType === 'h') {
        kept = sorted.slice(0, keepCount);
      } else if (keepType === 'l') {
        kept = sorted.slice(-keepCount);
      }
    }
    
    const total = kept.reduce((sum, roll) => sum + roll, 0) + modifier;
    
    return { total, rolls, modifier, kept: keepRule ? kept : undefined };
  }
  
  // Fallback to simple notation
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
      description: 'Roll dice with D&D notation. Supports advantage/disadvantage: 2d20kh1 (keep highest), 2d20kl1 (keep lowest)',
      inputSchema: {
        type: 'object',
        properties: {
          notation: { 
            type: 'string', 
            description: 'Dice notation: 1d20+5, 3d6, 2d20kh1+3 (advantage), 2d20kl1+3 (disadvantage)' 
          },
          reason: { 
            type: 'string', 
            description: 'What the roll is for' 
          }
        },
        required: ['notation']
      }
    },
    {
      name: 'roll_check',
      description: 'Roll an ability check or skill check',
      inputSchema: {
        type: 'object',
        properties: {
          character: { type: 'string' },
          ability: { type: 'string', description: 'Ability or skill name' },
          modifier: { type: 'number' },
          advantage: { type: 'boolean' },
          disadvantage: { type: 'boolean' },
          dc: { type: 'number', description: 'Difficulty Class (optional)' }
        },
        required: ['character', 'ability', 'modifier']
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
      name: 'initiative_roll',
      description: 'Roll initiative for combat',
      inputSchema: {
        type: 'object',
        properties: {
          character: { type: 'string' },
          modifier: { type: 'number' }
        },
        required: ['character', 'modifier']
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
        const reason = (args as any).reason || 'Dice roll';
        
        // Format the log entry based on whether dice were kept
        let logEntry: string;
        if (result.kept) {
          logEntry = `${reason}: ${(args as any).notation} = rolled [${result.rolls.join(', ')}], kept [${result.kept.join(', ')}]${result.modifier !== 0 ? (result.modifier > 0 ? '+' : '') + result.modifier : ''} = ${result.total}`;
        } else {
          logEntry = `${reason}: ${(args as any).notation} = ${result.rolls.join('+')}${result.modifier !== 0 ? (result.modifier > 0 ? '+' : '') + result.modifier : ''} = ${result.total}`;
        }
        
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }
      
      case 'roll_check': {
        const { character, ability, modifier, advantage, disadvantage, dc } = args as any;
        
        // Build the dice notation
        let notation = advantage ? '2d20kh1' : disadvantage ? '2d20kl1' : '1d20';
        notation += modifier >= 0 ? `+${modifier}` : `${modifier}`;
        
        const result = rollDice(notation);
        const success = dc ? result.total >= dc : null;
        
        const advantageText = advantage ? ' (ADVANTAGE)' : disadvantage ? ' (DISADVANTAGE)' : '';
        const dcText = dc ? ` vs DC ${dc} - ${success ? 'SUCCESS' : 'FAILURE'}` : '';
        const logEntry = `${character} ${ability} check${advantageText}: ${result.total}${dcText}`;
        combatLog.push(logEntry);
        
        const response: any = {
          character,
          ability,
          total: result.total,
          modifier,
          rolls: result.rolls
        };
        
        if (result.kept) response.kept = result.kept;
        if (advantage) response.advantage = true;
        if (disadvantage) response.disadvantage = true;
        if (dc) {
          response.dc = dc;
          response.success = success;
        }
        
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }]
        };
      }
      
      case 'initiative_roll': {
        const result = rollDice(`1d20+${(args as any).modifier}`);
        const logEntry = `${(args as any).character} initiative: ${result.total}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({ 
              character: (args as any).character,
              total: result.total,
              roll: result.rolls[0],
              modifier: result.modifier
            }, null, 2) 
          }]
        };
      }
      
      case 'attack_roll': {
        const modifier = (args as any).modifier || 0;
        const hasAdvantage = (args as any).advantage;
        const hasDisadvantage = (args as any).disadvantage;
        
        // Roll the d20s without modifier
        let roll1 = rollDice('1d20');
        let roll2 = (hasAdvantage || hasDisadvantage) ? rollDice('1d20') : null;
        
        // Determine which d20 to use
        let selectedD20 = roll1.total;
        let diceUsed = [roll1.total];
        
        if (hasAdvantage && roll2) {
          selectedD20 = Math.max(roll1.total, roll2.total);
          diceUsed = [roll1.total, roll2.total];
        } else if (hasDisadvantage && roll2) {
          selectedD20 = Math.min(roll1.total, roll2.total);
          diceUsed = [roll1.total, roll2.total];
        }
        
        // Add modifier to the selected d20
        const finalTotal = selectedD20 + modifier;
        
        // Check for critical/fumble based on the d20 roll (before modifier)
        const critical = selectedD20 === 20;
        const fumble = selectedD20 === 1;
        
        const advantageText = hasAdvantage ? ' (ADVANTAGE)' : hasDisadvantage ? ' (DISADVANTAGE)' : '';
        const logEntry = `${(args as any).attacker} attacks ${(args as any).target}: ${finalTotal}${advantageText} ${critical ? '(CRITICAL!)' : fumble ? '(FUMBLE!)' : ''}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({ 
              total: finalTotal,
              d20: selectedD20,
              modifier: modifier,
              allRolls: diceUsed,
              advantage: hasAdvantage,
              disadvantage: hasDisadvantage,
              critical, 
              fumble
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
