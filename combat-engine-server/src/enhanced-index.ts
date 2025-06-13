import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { SpatialEngine } from './spatial-engine.js';
import { 
  BaseAction, 
  ReactionAction, 
  LegendaryAction, 
  ActionResult, 
  ActionEconomy,
  EnhancedCreature,
  STANDARD_ACTIONS,
  STANDARD_REACTIONS 
} from './action-types.js';

// Enhanced combat state storage
let combatLog: string[] = [];
let spatialEngine: SpatialEngine = new SpatialEngine();
let activeReactions: Map<string, ReactionAction[]> = new Map();
let pendingReactions: any[] = [];

// Enhanced dice rolling with multiple roll types
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

// Enhanced action execution
function executeAction(action: BaseAction, actor: any, targets: any[], context: any): ActionResult {
  const rolls: any[] = [];
  let damage: any[] = [];
  let healing = 0;
  const effectsApplied: any[] = [];
  const economyConsumed: any = {};

  // Basic action execution logic
  if (action.actionType === 'action') {
    economyConsumed.actions = 1;
  } else if (action.actionType === 'bonus_action') {
    economyConsumed.bonusActions = 1;
  } else if (action.actionType === 'reaction') {
    economyConsumed.reactions = 1;
  } else if (action.actionType === 'legendary') {
    economyConsumed.legendaryActions = (action as LegendaryAction).cost || 1;
  }

  // Log action
  const actionLog = `${actor.name} uses ${action.name}`;
  combatLog.push(actionLog);

  return {
    success: true,
    rolls,
    damage,
    healing: healing > 0 ? healing : undefined,
    effectsApplied,
    targets: targets.map(t => t.id || t.name),
    description: actionLog,
    economyConsumed
  };
}

// Trigger reaction system
function triggerReaction(triggerType: string, triggeringCreature: string, targetCreature?: string): any[] {
  const availableReactions = [];
  
  // Check for opportunity attacks
  if (triggerType === 'creature_moves' && targetCreature) {
    const distance = spatialEngine.getDistance(
      spatialEngine.getBattlefieldState().creatures.get(triggeringCreature)?.position || { x: 0, y: 0, z: 0 },
      spatialEngine.getBattlefieldState().creatures.get(targetCreature)?.position || { x: 0, y: 0, z: 0 }
    );
    
    if (distance <= 5) { // Within reach
      availableReactions.push({
        type: 'opportunity_attack',
        reactor: targetCreature,
        trigger: triggeringCreature,
        action: STANDARD_REACTIONS.opportunity_attack
      });
    }
  }
  
  return availableReactions;
}

// Create enhanced server
const server = new Server({
  name: 'rpg-enhanced-combat-engine-server',
  version: '2.0.0',
}, {
  capabilities: { 
    tools: {},
  },
});

// Enhanced tool definitions
const enhancedToolDefinitions = [
  // Original dice tools
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
    description: 'Make an attack roll (pure dice calculation)',
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
  // Enhanced Action Economy Tools
  {
    name: 'use_reaction',
    description: 'Trigger and execute a reaction',
    inputSchema: {
      type: 'object',
      properties: {
        character: { type: 'string' },
        reaction_name: { type: 'string' },
        trigger_event: { type: 'string' },
        target: { type: 'string' }
      },
      required: ['character', 'reaction_name', 'trigger_event']
    }
  },
  {
    name: 'use_legendary_action',
    description: 'Execute a legendary action',
    inputSchema: {
      type: 'object',
      properties: {
        character: { type: 'string' },
        action_name: { type: 'string' },
        cost: { type: 'number', default: 1 },
        target: { type: 'string' }
      },
      required: ['character', 'action_name']
    }
  },
  {
    name: 'trigger_lair_action',
    description: 'Execute a lair action on initiative 20',
    inputSchema: {
      type: 'object',
      properties: {
        lair_name: { type: 'string' },
        action_name: { type: 'string' },
        description: { type: 'string' },
        area_effect: { type: 'object' }
      },
      required: ['lair_name', 'action_name', 'description']
    }
  },
  {
    name: 'execute_multiattack',
    description: 'Execute a creature\'s multiattack sequence',
    inputSchema: {
      type: 'object',
      properties: {
        attacker: { type: 'string' },
        targets: { type: 'array', items: { type: 'string' } },
        attack_sequence: { type: 'object' }
      },
      required: ['attacker', 'targets']
    }
  },
  // Spatial Combat Tools
  {
    name: 'initialize_battlefield',
    description: 'Set up a spatial battlefield with grid and terrain',
    inputSchema: {
      type: 'object',
      properties: {
        width: { type: 'number', description: 'Grid width in 5-foot squares' },
        height: { type: 'number', description: 'Grid height in 5-foot squares' },
        terrain: { 
          type: 'array', 
          items: { type: 'object' },
          description: 'Array of terrain features'
        }
      },
      required: ['width', 'height']
    }
  },
  {
    name: 'place_creature',
    description: 'Position a creature on the battlefield',
    inputSchema: {
      type: 'object',
      properties: {
        creature_id: { type: 'string' },
        name: { type: 'string' },
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number', default: 0 },
        size: { 
          type: 'string',
          enum: ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'],
          default: 'medium'
        },
        speed: { type: 'number', default: 30 },
        reach: { type: 'number', default: 5 }
      },
      required: ['creature_id', 'name', 'x', 'y']
    }
  },
  {
    name: 'move_creature',
    description: 'Move a creature and validate movement with opportunity attacks',
    inputSchema: {
      type: 'object',
      properties: {
        creature_id: { type: 'string' },
        target_x: { type: 'number' },
        target_y: { type: 'number' },
        target_z: { type: 'number', default: 0 },
        speed: { type: 'number' }
      },
      required: ['creature_id', 'target_x', 'target_y', 'speed']
    }
  },
  {
    name: 'check_line_of_sight',
    description: 'Check line of sight and cover between two positions',
    inputSchema: {
      type: 'object',
      properties: {
        from_creature: { type: 'string' },
        to_creature: { type: 'string' }
      },
      required: ['from_creature', 'to_creature']
    }
  },
  {
    name: 'get_area_effect_targets',
    description: 'Get all creatures in an area of effect',
    inputSchema: {
      type: 'object',
      properties: {
        center_x: { type: 'number' },
        center_y: { type: 'number' },
        center_z: { type: 'number', default: 0 },
        shape: { 
          type: 'string',
          enum: ['sphere', 'cube', 'cone', 'line', 'cylinder']
        },
        size: { type: 'number' },
        direction: { type: 'number', description: 'For cones and lines (degrees)' }
      },
      required: ['center_x', 'center_y', 'shape', 'size']
    }
  },
  {
    name: 'get_tactical_summary',
    description: 'Get LLM-friendly description of the tactical situation',
    inputSchema: {
      type: 'object',
      properties: {
        creature_id: { type: 'string' }
      },
      required: ['creature_id']
    }
  },
  {
    name: 'check_flanking',
    description: 'Check if a creature is flanked for advantage',
    inputSchema: {
      type: 'object',
      properties: {
        creature_id: { type: 'string' }
      },
      required: ['creature_id']
    }
  },
  {
    name: 'check_height_advantage',
    description: 'Check if attacker has height advantage over target',
    inputSchema: {
      type: 'object',
      properties: {
        attacker_id: { type: 'string' },
        target_id: { type: 'string' }
      },
      required: ['attacker_id', 'target_id']
    }
  },
  // Combat log tools
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
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: enhancedToolDefinitions
}));

// Enhanced tool request handler
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      // Original dice rolling tools (unchanged)
      case 'roll_dice': {
        const result = rollDice((args as any).notation);
        const reason = (args as any).reason || 'Dice roll';
        
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

      // Enhanced Action Economy Tools
      case 'use_reaction': {
        const { character, reaction_name, trigger_event, target } = args as any;
        
        // Execute the reaction
        const reactionResult = {
          character,
          reaction: reaction_name,
          trigger: trigger_event,
          target,
          success: true,
          description: `${character} uses ${reaction_name} in response to ${trigger_event}`
        };
        
        combatLog.push(reactionResult.description);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(reactionResult, null, 2) }]
        };
      }

      case 'use_legendary_action': {
        const { character, action_name, cost = 1, target } = args as any;
        
        const legendaryResult = {
          character,
          action: action_name,
          cost,
          target,
          success: true,
          description: `${character} spends ${cost} legendary action${cost > 1 ? 's' : ''} to use ${action_name}${target ? ` on ${target}` : ''}`
        };
        
        combatLog.push(legendaryResult.description);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(legendaryResult, null, 2) }]
        };
      }

      case 'trigger_lair_action': {
        const { lair_name, action_name, description, area_effect } = args as any;
        
        const lairResult = {
          lair: lair_name,
          action: action_name,
          initiative: 20,
          description,
          area_effect,
          success: true
        };
        
        combatLog.push(`Lair Action (Initiative 20): ${description}`);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(lairResult, null, 2) }]
        };
      }

      case 'execute_multiattack': {
        const { attacker, targets, attack_sequence } = args as any;
        
        const attacks = [];
        for (const target of targets) {
          const attackRoll = rollDice('1d20+5'); // Example attack
          const hit = attackRoll.total >= 15; // Example AC
          
          attacks.push({
            target,
            attackRoll: attackRoll.total,
            hit,
            damage: hit ? rollDice('1d8+3').total : 0
          });
        }
        
        const multiattackResult = {
          attacker,
          attacks,
          description: `${attacker} makes a multiattack against ${targets.length} target${targets.length > 1 ? 's' : ''}`
        };
        
        combatLog.push(multiattackResult.description);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(multiattackResult, null, 2) }]
        };
      }

      // Spatial Combat Tools
      case 'initialize_battlefield': {
        const { width, height, terrain = [] } = args as any;
        
        spatialEngine.initializeBattlefield(width, height, terrain);
        
        const result = {
          width,
          height,
          terrain: terrain.length,
          description: `Initialized ${width}x${height} battlefield with ${terrain.length} terrain features`
        };
        
        combatLog.push(result.description);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'place_creature': {
        const { creature_id, name, x, y, z = 0, size = 'medium', speed = 30, reach = 5 } = args as any;
        
        const creature = {
          id: creature_id,
          name,
          position: { x, y, z },
          size: { category: size as any, squares: size === 'large' ? 2 : 1 },
          speed,
          reach
        };
        
        spatialEngine.addCreature(creature);
        
        const result = {
          creature_id,
          name,
          position: { x, y, z },
          size,
          description: `Placed ${name} at position (${x}, ${y}, ${z})`
        };
        
        combatLog.push(result.description);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'move_creature': {
        const { creature_id, target_x, target_y, target_z = 0, speed } = args as any;
        
        const battlefield = spatialEngine.getBattlefieldState();
        const creature = battlefield.creatures.get(creature_id);
        
        if (!creature) {
          throw new Error(`Creature ${creature_id} not found on battlefield`);
        }
        
        const from = creature.position;
        const to = { x: target_x, y: target_y, z: target_z };
        
        const movement = spatialEngine.validateMovement(creature, from, to, speed);
        
        if (movement.isValid) {
          spatialEngine.moveCreature(creature_id, to);
        }
        
        const result = {
          creature_id,
          from,
          to,
          movement_valid: movement.isValid,
          distance: movement.pathLength,
          opportunity_attacks: movement.opportunityAttacks,
          description: movement.isValid 
            ? `${creature.name} moves from (${from.x}, ${from.y}) to (${to.x}, ${to.y})`
            : `${creature.name} cannot move to (${to.x}, ${to.y}) - ${movement.pathLength > speed ? 'insufficient speed' : 'path blocked'}`
        };
        
        combatLog.push(result.description);
        
        if (movement.opportunityAttacks.length > 0) {
          combatLog.push(`Opportunity attacks triggered by: ${movement.opportunityAttacks.join(', ')}`);
        }
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'check_line_of_sight': {
        const { from_creature, to_creature } = args as any;
        
        const battlefield = spatialEngine.getBattlefieldState();
        const fromCreature = battlefield.creatures.get(from_creature);
        const toCreature = battlefield.creatures.get(to_creature);
        
        if (!fromCreature || !toCreature) {
          throw new Error('One or both creatures not found on battlefield');
        }
        
        const los = spatialEngine.calculateLineOfSight(fromCreature.position, toCreature.position);
        const distance = spatialEngine.getDistance(fromCreature.position, toCreature.position);
        const rangeCategory = spatialEngine.getRangeCategory(distance);
        
        const result = {
          from_creature,
          to_creature,
          distance: Math.round(distance),
          range_category: rangeCategory,
          line_of_sight: los.hasLineOfSight,
          cover_type: los.coverType,
          blocked_by: los.blockedBy || [],
          description: `${from_creature} to ${to_creature}: ${Math.round(distance)}ft (${rangeCategory}), ${los.hasLineOfSight ? 'clear line of sight' : 'blocked'}, ${los.coverType} cover`
        };
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'get_area_effect_targets': {
        const { center_x, center_y, center_z = 0, shape, size, direction } = args as any;
        
        const areaEffect = {
          id: 'temp_effect',
          name: 'Area Effect',
          shape,
          center: { x: center_x, y: center_y, z: center_z },
          sizeParameter: size,
          direction,
          durationRounds: 1
        };
        
        const targets = spatialEngine.getTargetsInArea(areaEffect);
        
        const result = {
          area_effect: {
            center: { x: center_x, y: center_y, z: center_z },
            shape,
            size
          },
          targets,
          count: targets.length,
          description: `${shape.charAt(0).toUpperCase() + shape.slice(1)} effect (${size}ft) at (${center_x}, ${center_y}) affects ${targets.length} creature${targets.length !== 1 ? 's' : ''}`
        };
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'get_tactical_summary': {
        const { creature_id } = args as any;
        
        const description = spatialEngine.describeTacticalSituation(creature_id);
        const flanked = spatialEngine.isCreatureFlanked(creature_id);
        
        const result = {
          creature_id,
          tactical_situation: description,
          flanked,
          description
        };
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'check_flanking': {
        const { creature_id } = args as any;
        
        const flanked = spatialEngine.isCreatureFlanked(creature_id);
        
        const result = {
          creature_id,
          flanked,
          advantage: flanked,
          description: flanked 
            ? `${creature_id} is flanked and enemies have advantage on attacks`
            : `${creature_id} is not flanked`
        };
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'check_height_advantage': {
        const { attacker_id, target_id } = args as any;
        
        const hasAdvantage = spatialEngine.hasHeightAdvantage(attacker_id, target_id);
        
        const result = {
          attacker_id,
          target_id,
          height_advantage: hasAdvantage,
          advantage: hasAdvantage,
          description: hasAdvantage 
            ? `${attacker_id} has height advantage over ${target_id} (+2 to attack)`
            : `${attacker_id} does not have height advantage over ${target_id}`
        };
        
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      // Original tools with enhanced logging
      case 'roll_check': {
        const { character, ability, modifier, advantage, disadvantage, dc } = args as any;
        
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
        const { attacker, target, modifier = 0, advantage: hasAdvantage, disadvantage: hasDisadvantage } = args as any; 

        let roll1 = rollDice('1d20');
        let roll2 = (hasAdvantage || hasDisadvantage) ? rollDice('1d20') : null;
        
        let selectedD20 = roll1.total;
        let diceUsed = [roll1.total];
        
        if (hasAdvantage && roll2) {
          selectedD20 = Math.max(roll1.total, roll2.total);
          diceUsed = [roll1.total, roll2.total];
        } else if (hasDisadvantage && roll2) {
          selectedD20 = Math.min(roll1.total, roll2.total);
          diceUsed = [roll1.total, roll2.total];
        }
        
        const finalTotal = selectedD20 + modifier;
        const critical = selectedD20 === 20;
        const fumble = selectedD20 === 1;
        
        const advantageText = hasAdvantage ? ' (ADVANTAGE)' : hasDisadvantage ? ' (DISADVANTAGE)' : '';
        const logEntry = `${attacker} attacks ${target}: ${finalTotal}${advantageText} ${critical ? '(CRITICAL!)' : fumble ? '(FUMBLE!)' : ''}`;
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
console.error('Enhanced RPG Combat Engine MCP Server v2.0 running on stdio');