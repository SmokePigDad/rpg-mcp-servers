import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GameDatabase } from '../../game-state-server/dist/db.js';
// Define Encounter interface for typing
interface Encounter {
  id: number;
  character_id: number; // Assuming this is the ID of one of the participants, or the one who initiated
  name: string;
  description?: string | null;
  status: string; // e.g., 'active', 'completed', 'TURN_STARTED', 'AWAITING_ACTION', 'TURN_ENDED'
  current_round: number;
  current_turn: number; // Index or ID of the current actor in the turn order
  environment?: string | null;
  created_at: string; // ISO date string
  ended_at?: string | null; // ISO date string
  currentState: 'TURN_STARTED' | 'AWAITING_ACTION' | 'TURN_ENDED';
  currentActorActions: {
    actionAvailable: boolean;
    bonusActionAvailable: boolean;
    movementRemaining: number;
  };
  // TODO: Add a list of participants with their initiative scores to properly manage turn order
  // participants: Array<{ actorId: string | number, initiative: number, type: 'character' | 'npc' }>;
}

// Game State DB instance
const gameStateDb = new GameDatabase(); 

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
    tools: {
      list_tools: { name: 'list_tools', description: 'Lists all available tools on this server.', inputSchema: {} },
      roll_dice: { name: 'roll_dice', description: 'Roll dice with D&D notation.', inputSchema: {} },
      roll_check: { name: 'roll_check', description: 'Roll an ability check or skill check.', inputSchema: {} },
      attack_roll: { name: 'attack_roll', description: 'Make an attack roll.', inputSchema: {} },
      initiative_roll: { name: 'initiative_roll', description: 'Roll initiative for combat.', inputSchema: {} },
      damage_roll: { name: 'damage_roll', description: 'Roll damage.', inputSchema: {} },
      saving_throw: { name: 'saving_throw', description: 'Make a saving throw.', inputSchema: {} },
      get_combat_log: { name: 'get_combat_log', description: 'Get recent combat log entries.', inputSchema: {} },
      clear_combat_log: { name: 'clear_combat_log', description: 'Clear the combat log.', inputSchema: {} },
      start_combat: { name: 'start_combat', description: 'Starts a new combat encounter.', inputSchema: {} },
      end_turn: { name: 'end_turn', description: "Explicitly end current player's turn.", inputSchema: {} },
      next_turn: { name: 'next_turn', description: 'Advances to the next turn.', inputSchema: {} }
    }, 
  },
});

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsList = [
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
    },
    {
      name: 'start_combat',
      description: 'Starts a new combat encounter and logs it.',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number', description: 'ID of the character initiating combat' },
          name: { type: 'string', description: 'Name of the combat encounter' },
          description: { type: 'string', description: 'Description of the combat encounter' },
          environment: { type: 'string', description: 'Environment where the combat takes place' }
        },
        required: ['character_id', 'name', 'description', 'environment']
      }
    },
    {
      name: 'end_turn',
      description: "Explicitly end current player's turn",
      inputSchema: {
        type: 'object',
        properties: {
          encounter_id: { type: 'number', description: 'ID of active encounter' }
        },
        required: ['encounter_id']
      }
    },
    {
      name: 'next_turn',
      description: 'Advances to the next turn in an encounter, resets action states for the new actor.',
      inputSchema: {
        type: 'object',
        properties: {
          encounter_id: { type: 'number', description: 'ID of the active encounter' }
        },
        required: ['encounter_id']
      }
    }
  ];
  return { tools: toolsList };
});

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
        const { attacker, target, modifier = 0, advantage: hasAdvantage, disadvantage: hasDisadvantage, encounter_id } = args as any; 

        if (typeof encounter_id !== 'number') {
          throw new Error("Encounter ID is required for attack rolls to check action availability.");
        }

        let encounter = gameStateDb.getEncounter(encounter_id) as Encounter | undefined;
        // console.log(`[attack_roll] Encounter ID: ${encounter_id}, Raw Encounter Data: ${JSON.stringify(encounter)}`);
        if (!encounter) {
          throw new Error(`Encounter with ID ${encounter_id} not found.`);
        }
        // console.log(`[attack_roll] Raw encounter.currentActorActions: ${encounter.currentActorActions}`);
        // console.log(`[attack_roll] Type of encounter.currentActorActions: ${typeof encounter.currentActorActions}`);

        // Parse currentActorActions if it's a string
        if (typeof encounter.currentActorActions === 'string') {
            try {
                // Ensure the type assertion is correct after parsing
                encounter.currentActorActions = JSON.parse(encounter.currentActorActions) as {
                    actionAvailable: boolean;
                    bonusActionAvailable: boolean;
                    movementRemaining: number;
                };
                // console.log(`[attack_roll] Parsed encounter.currentActorActions: ${JSON.stringify(encounter.currentActorActions)}`);
            } catch (e) {
                // console.error(`[attack_roll] Failed to parse currentActorActions for encounter ${encounter_id}: ${encounter.currentActorActions}`);
                throw new Error(`Failed to parse currentActorActions for encounter ${encounter_id}`);
            }
        }

        if (encounter.status !== 'active' || (encounter.currentState !== 'AWAITING_ACTION' && encounter.currentState !== 'TURN_STARTED')) {
            throw new Error(`Cannot attack in encounter ${encounter_id}. Current status: ${encounter.status}, state: ${encounter.currentState}. Turn may not have started or is already ended.`);
        }
        // console.log(`[attack_roll] Checking actionAvailable: !encounter.currentActorActions?.actionAvailable = ${!encounter.currentActorActions?.actionAvailable}`);
        if (!encounter.currentActorActions?.actionAvailable) {
            throw new Error(`${attacker} has no action available to make an attack.`);
        }

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
        const logEntry = `${attacker} attacks ${target}: ${finalTotal}${advantageText} ${critical ? '(CRITICAL!)' : fumble ? '(FUMBLE!)' : ''}`;
        combatLog.push(logEntry);

        // Consume the action
        const updatedActions = { ...encounter.currentActorActions, actionAvailable: false }; 
        const consumeActionStmt = gameStateDb['db'].prepare(`
            UPDATE encounters
            SET currentActorActions = ?
            WHERE id = ?
        `); 
        consumeActionStmt.run(JSON.stringify(updatedActions), encounter_id); 
        
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
              fumble,
              actionConsumed: true 
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

      case 'start_combat': {
        const { character_id, name: combatName, description, environment } = args as any; 

        if (typeof character_id !== 'number' || !combatName || typeof combatName !== 'string' || !description || typeof description !== 'string' || !environment || typeof environment !== 'string') {
          throw new Error('Invalid arguments for start_combat. Required: character_id (number), name (string), description (string), environment (string)');
        }
        
        try {
            const encounterData = {
                character_id,
                name: combatName,
                description,
                environment
            };
            let createdEncounter = gameStateDb.createEncounter(encounterData) as Encounter; 

            const initialActorActions = {
              actionAvailable: true,
              bonusActionAvailable: true,
              movementRemaining: 30, 
            };
            const initialStateUpdates: Partial<Encounter> = {
              currentState: 'TURN_STARTED', 
              currentActorActions: initialActorActions,
              current_turn: 1, 
              current_round: 1, 
            };

            const stmt = gameStateDb['db'].prepare(`
              UPDATE encounters
              SET currentState = ?, currentActorActions = ?, current_turn = ?, current_round = ?
              WHERE id = ?
            `); 
            stmt.run( 
              initialStateUpdates.currentState,
              JSON.stringify(initialStateUpdates.currentActorActions),
              initialStateUpdates.current_turn,
              initialStateUpdates.current_round,
              createdEncounter.id
            );
            
            createdEncounter = gameStateDb.getEncounter(createdEncounter.id) as Encounter; 

            const logEntry = `Combat Started: "${combatName}" (Encounter ID: ${createdEncounter.id}). Initial state set. Round: ${createdEncounter.current_round}, Turn: ${createdEncounter.current_turn}.`;
            combatLog.push(logEntry);
            currentTurn = 0;

            return {
              content: [{ type: 'text', text: JSON.stringify({ success: true, message: 'Combat started and persisted successfully with initial turn state.', encounter: createdEncounter, log: logEntry }, null, 2) }]
            };
        } catch (dbError: any) {
            console.error("Error interacting with GameDatabase during start_combat:", dbError);
            combatLog.push(`Failed to persist combat start for "${combatName}": ${dbError.message}`);
            throw new Error(`Failed to persist combat start: ${dbError.message}`);
        }
      }

      case 'end_turn': {
        const { encounter_id } = args as any; 
        if (typeof encounter_id !== 'number') {
          throw new Error('Invalid arguments for end_turn. Required: encounter_id (number)');
        }

        try {
          let encounter = gameStateDb.getEncounter(encounter_id) as Encounter | undefined; 
          if (!encounter) {
            throw new Error(`Encounter with ID ${encounter_id} not found.`);
          }

          if (encounter.currentState === undefined) {
            encounter.currentState = 'AWAITING_ACTION'; 
          }
          if (encounter.currentActorActions === undefined) {
            encounter.currentActorActions = {
              actionAvailable: true,
              bonusActionAvailable: true,
              movementRemaining: 30, 
            };
          }
          
          if (encounter.status !== 'active' || (encounter.currentState !== 'AWAITING_ACTION' && encounter.currentState !== 'TURN_STARTED')) {
            throw new Error(`Encounter ${encounter_id} is not in a state where a turn can be ended (current status: ${encounter.status}, currentState: ${encounter.currentState}).`);
          }

          const endTurnUpdates: Partial<Encounter> = {
            currentState: 'TURN_ENDED',
          };
          
          const endTurnStmt = gameStateDb['db'].prepare(`
            UPDATE encounters
            SET currentState = ?
            WHERE id = ?
          `); 
          endTurnStmt.run(endTurnUpdates.currentState, encounter_id); 
          const logEntry = `Turn ended for current actor in encounter ${encounter_id}. Current state is now TURN_ENDED. Call 'next_turn' to proceed.`;
          combatLog.push(logEntry);

          return {
            content: [{ type: 'text', text: JSON.stringify({ success: true, message: logEntry, encounter_id: encounter_id, newState: 'TURN_ENDED' }, null, 2) }]
          };

        } catch (dbError: any) {
          console.error("Error interacting with GameDatabase during end_turn:", dbError);
          combatLog.push(`Failed to end turn for encounter ${encounter_id}: ${dbError.message}`);
          throw new Error(`Failed to end turn: ${dbError.message}`);
        }
      }

      case 'next_turn': {
        const { encounter_id } = args as any; 
        if (typeof encounter_id !== 'number') {
          throw new Error('Invalid arguments for next_turn. Required: encounter_id (number)');
        }

        try {
          let encounter = gameStateDb.getEncounter(encounter_id) as Encounter | undefined; 
          if (!encounter) {
            throw new Error(`Encounter with ID ${encounter_id} not found.`);
          }

          if (encounter.status !== 'active') {
             throw new Error(`Encounter ${encounter_id} is not active. Status: ${encounter.status}`);
          }
          if (encounter.currentState !== 'TURN_ENDED' && encounter.currentState !== 'TURN_STARTED' && encounter.currentState !== 'AWAITING_ACTION' ) {
             console.warn(`Advancing turn for encounter ${encounter_id} from an unusual state: ${encounter.currentState}. Expected TURN_ENDED.`);
          }
          
          const nextParticipantDetails = gameStateDb.nextTurn(encounter_id); 

          if (!nextParticipantDetails) {
            const endedEncounter = gameStateDb.getEncounter(encounter_id) as Encounter; 
            const endLog = `Combat in encounter ${encounter_id} has concluded or no active participants remain. Status: ${endedEncounter?.status}.`;
            combatLog.push(endLog);
            return {
              content: [{ type: 'text', text: JSON.stringify({ success: true, message: endLog, encounter: endedEncounter }, null, 2) }]
            };
          }
          
          encounter = gameStateDb.getEncounter(encounter_id) as Encounter; 
           if (!encounter) {
            throw new Error(`Encounter ${encounter_id} data lost after advancing turn in DB.`);
          }

          const newActorActions = {
            actionAvailable: true,
            bonusActionAvailable: true,
            movementRemaining: 30, 
          };

          const updates: Partial<Encounter> = {
            currentState: 'TURN_STARTED',
            currentActorActions: newActorActions,
          };
          // console.log(`[next_turn] Encounter ID: ${encounter_id}, newActorActions before stringification: ${JSON.stringify(newActorActions)}`);

          const stmt = gameStateDb['db'].prepare(`
            UPDATE encounters
            SET currentState = ?, currentActorActions = ?
            WHERE id = ?
          `);
          stmt.run(
            updates.currentState,
            JSON.stringify(updates.currentActorActions),
            encounter_id
          );
          // console.log(`[next_turn] Database update for currentActorActions attempted for encounter ID: ${encounter_id}.`);
          
          const logEntry = `Advanced to next turn in encounter ${encounter_id}. Current actor: ${nextParticipantDetails.name} (ID: ${nextParticipantDetails.participant_id}, Type: ${nextParticipantDetails.participant_type}). Actions reset. Turn: ${encounter.current_turn}, Round: ${encounter.current_round}.`;
          combatLog.push(logEntry);

          const finalEncounterStateAfterUpdate = gameStateDb.getEncounter(encounter_id) as Encounter;
          // console.log(`[next_turn] Fetched encounter state after DB update. Raw currentActorActions: ${finalEncounterStateAfterUpdate?.currentActorActions}`);
          // if (finalEncounterStateAfterUpdate && typeof finalEncounterStateAfterUpdate.currentActorActions === 'string') {
          //   try {
          //     const parsedActions = JSON.parse(finalEncounterStateAfterUpdate.currentActorActions);
          //     console.log(`[next_turn] Parsed currentActorActions from DB after update: ${JSON.stringify(parsedActions)}`);
          //   } catch (e) {
          //     console.error(`[next_turn] Error parsing currentActorActions from DB after update: ${e}`);
          //   }
          // }


          return {
            content: [{ type: 'text', text: JSON.stringify({ success: true, message: logEntry, encounter: finalEncounterStateAfterUpdate, nextParticipant: nextParticipantDetails }, null, 2) }]
          };

        } catch (dbError: any) {
          console.error("Error during next_turn:", dbError);
          combatLog.push(`Failed to advance to next turn for encounter ${encounter_id}: ${dbError.message}`);
          throw new Error(`Failed to advance turn: ${dbError.message}`);
        }
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
