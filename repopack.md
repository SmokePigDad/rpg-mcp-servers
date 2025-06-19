This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitattributes
.gitignore
character-sheet-template.md
combat-engine-server/package.json
combat-engine-server/src/action-types.ts
combat-engine-server/src/dice.ts
combat-engine-server/src/enhanced-index.ts
combat-engine-server/src/index.ts
combat-engine-server/src/spatial-engine.ts
combat-engine-server/tsconfig.json
dice-rolling-guide.md
dungeon-master-mode.json
ENHANCEMENTS.md
game-state-server/package.json
game-state-server/src/db.d.ts
game-state-server/src/db.d.ts.map
game-state-server/src/db.js
game-state-server/src/db.js.map
game-state-server/src/db.ts
game-state-server/src/enhanced-db-schema.sql
game-state-server/src/index.ts
game-state-server/src/monsters.d.ts
game-state-server/src/monsters.d.ts.map
game-state-server/src/monsters.js
game-state-server/src/monsters.js.map
game-state-server/src/monsters.ts
game-state-server/tsconfig.json
quick-start-guide.md
README.md
rebuild.bat
roll-examples.md
setup.bat
test-checklist.txt
update-summary.md
```

# Files

## File: .gitattributes
````
# Auto detect text files and perform LF normalization
* text=auto
````

## File: .gitignore
````
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Database files
*.db
*.sqlite

# Logs
*.log
npm-debug.log*

# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# TypeScript cache
*.tsbuildinfo

# Coverage
coverage/
.nyc_output/
````

## File: character-sheet-template.md
````markdown
# Character Sheet Template

## Character Information
- **Name**: [Character Name]
- **Class**: [Character Class]
- **Level**: [Level]
- **Experience**: [XP] / [Next Level XP]

## Ability Scores
| Ability | Score | Modifier |
|---------|-------|----------|
| STR     | [##]  | [+/-#]   |
| DEX     | [##]  | [+/-#]   |
| CON     | [##]  | [+/-#]   |
| INT     | [##]  | [+/-#]   |
| WIS     | [##]  | [+/-#]   |
| CHA     | [##]  | [+/-#]   |

## Combat Stats
- **Hit Points**: [Current HP] / [Max HP]
- **Armor Class**: [AC]
- **Initiative**: [+/-#]
- **Speed**: 30 ft

## Proficiencies
- **Proficiency Bonus**: +[#]
- **Saving Throws**: [List]
- **Skills**: [List]

## Inventory
### Equipped
- [Item Name] ([Item Type])

### Backpack
- [Item Name] x[Quantity]

## Notes
- [Story notes and important information]

---
*Last Updated: [Timestamp]*
````

## File: combat-engine-server/package.json
````json
{
  "name": "rpg-combat-engine-server",
  "version": "1.0.0",
  "description": "MCP server for D&D-style combat mechanics",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
````

## File: combat-engine-server/src/action-types.ts
````typescript
// Enhanced D&D 5e Action Economy Types
// Complete implementation of all action types

export interface DiceRoll {
  notation: string;
  result: number;
  individual: number[];
  modifier: number;
}

export interface ActionEconomy {
  actionsAvailable: number;
  bonusActionsAvailable: number;
  reactionsAvailable: number;
  movementRemaining: number;
  freeActionsUnlimited: boolean;
}

export interface BaseAction {
  id: string;
  name: string;
  description: string;
  actionType: 'action' | 'bonus_action' | 'reaction' | 'free' | 'legendary' | 'lair';
  targeting: 'self' | 'single' | 'multiple' | 'area' | 'special';
  range: number | 'touch' | 'sight' | 'unlimited' | 'self' | 'special';
  duration: number | 'instantaneous' | 'concentration' | 'permanent' | 'special';
  components?: string[];
}

export interface AttackAction extends BaseAction {
  actionType: 'action' | 'bonus_action';
  attackType: 'melee' | 'ranged' | 'spell';
  attackBonus: number;
  damageRolls: {
    damage: string;
    type: string;
    versatile?: string;
  }[];
  criticalRange?: number; // 19-20 for improved critical
  reach?: number;
  ammunition?: boolean;
  finesse?: boolean;
  special?: string[];
}

export interface SpellAction extends BaseAction {
  level: number;
  school: string;
  castingTime: string;
  saveType?: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
  saveDC?: number;
  damage?: {
    dice: string;
    type: string;
    scaling?: string;
  };
  healing?: {
    dice: string;
    scaling?: string;
  };
  effects?: EffectDefinition[];
}

export interface ReactionAction extends BaseAction {
  actionType: 'reaction';
  trigger: string;
  triggerConditions: {
    event: 'creature_moves' | 'spell_cast' | 'attack_made' | 'damage_taken' | 'custom';
    range?: number;
    specificConditions?: string[];
  };
  interruptsTurn: boolean;
}

export interface LegendaryAction extends BaseAction {
  actionType: 'legendary';
  cost: number; // How many legendary action points it costs
  availableAt: 'end_of_turn' | 'initiative_20' | 'any_time';
  restrictions?: string[];
}

export interface LairAction extends BaseAction {
  actionType: 'lair';
  initiative: 20; // Always goes on initiative 20
  regionEffect: boolean;
  persistentEffect: boolean;
  cooldown?: number; // Rounds before can be used again
}

export interface MultiattackAction extends BaseAction {
  actionType: 'action';
  attacks: {
    attackId: string;
    count: number;
    canReplace?: boolean; // Can replace with other actions
    replacementOptions?: string[];
  }[];
  restrictions?: string[];
}

export interface EffectDefinition {
  name: string;
  type: 'condition' | 'buff' | 'debuff' | 'damage_over_time' | 'heal_over_time';
  duration: number | 'concentration' | 'permanent' | 'until_end_of_turn';
  stackable: boolean;
  effects: {
    statModifier?: { [stat: string]: number };
    conditionImmunities?: string[];
    resistances?: string[];
    vulnerabilities?: string[];
    customEffect?: string;
  };
}

export interface ActionResult {
  success: boolean;
  rolls: DiceRoll[];
  damage?: {
    amount: number;
    type: string;
    critical: boolean;
  }[];
  healing?: number;
  effectsApplied?: EffectDefinition[];
  targets: string[];
  description: string;
  economyConsumed: {
    actions?: number;
    bonusActions?: number;
    reactions?: number;
    movement?: number;
    legendaryActions?: number;
  };
}

export interface TurnState {
  actorId: string;
  actorType: 'character' | 'npc';
  roundNumber: number;
  economy: ActionEconomy;
  actionsUsed: BaseAction[];
  conditionsActive: EffectDefinition[];
  canAct: boolean;
  isIncapacitated: boolean;
}

export interface CombatTimingEvent {
  id: string;
  eventType: 'turn_start' | 'turn_end' | 'round_start' | 'round_end' | 'initiative_20' | 'reaction_trigger';
  participantId?: string;
  roundNumber: number;
  description: string;
  triggeredActions: string[];
  resolved: boolean;
}

// Predefined D&D 5e Actions
export const STANDARD_ACTIONS: { [key: string]: BaseAction } = {
  attack: {
    id: 'attack',
    name: 'Attack',
    description: 'Make a melee or ranged attack',
    actionType: 'action',
    targeting: 'single',
    range: 'special',
    duration: 'instantaneous'
  },
  cast_spell: {
    id: 'cast_spell',
    name: 'Cast a Spell',
    description: 'Cast a spell of 1st level or higher',
    actionType: 'action',
    targeting: 'special',
    range: 'special',
    duration: 'special'
  },
  dash: {
    id: 'dash',
    name: 'Dash',
    description: 'Double your speed for this turn',
    actionType: 'action',
    targeting: 'self',
    range: 'self',
    duration: 'instantaneous'
  },
  disengage: {
    id: 'disengage',
    name: 'Disengage',
    description: 'Avoid opportunity attacks for the rest of your turn',
    actionType: 'action',
    targeting: 'self',
    range: 'self',
    duration: 'instantaneous'
  },
  dodge: {
    id: 'dodge',
    name: 'Dodge',
    description: 'Focus on avoiding attacks',
    actionType: 'action',
    targeting: 'self',
    range: 'self',
    duration: 'instantaneous'
  },
  help: {
    id: 'help',
    name: 'Help',
    description: 'Aid another creature in a task',
    actionType: 'action',
    targeting: 'single',
    range: 5,
    duration: 'instantaneous'
  },
  hide: {
    id: 'hide',
    name: 'Hide',
    description: 'Attempt to hide from enemies',
    actionType: 'action',
    targeting: 'self',
    range: 'self',
    duration: 'instantaneous'
  },
  ready: {
    id: 'ready',
    name: 'Ready',
    description: 'Prepare an action to trigger later',
    actionType: 'action',
    targeting: 'special',
    range: 'special',
    duration: 'special'
  },
  search: {
    id: 'search',
    name: 'Search',
    description: 'Look for something in your environment',
    actionType: 'action',
    targeting: 'area',
    range: 'special',
    duration: 'instantaneous'
  },
  use_object: {
    id: 'use_object',
    name: 'Use an Object',
    description: 'Interact with an object',
    actionType: 'action',
    targeting: 'single',
    range: 'special',
    duration: 'special'
  }
};

export const STANDARD_REACTIONS: { [key: string]: ReactionAction } = {
  opportunity_attack: {
    id: 'opportunity_attack',
    name: 'Opportunity Attack',
    description: 'Attack a creature that leaves your reach',
    actionType: 'reaction',
    targeting: 'single',
    range: 5,
    duration: 'instantaneous',
    trigger: 'A creature you can see moves out of your reach',
    triggerConditions: {
      event: 'creature_moves',
      range: 5
    },
    interruptsTurn: false
  },
  counterspell: {
    id: 'counterspell',
    name: 'Counterspell',
    description: 'Attempt to interrupt a creature in the process of casting a spell',
    actionType: 'reaction',
    targeting: 'single',
    range: 60,
    duration: 'instantaneous',
    trigger: 'A creature within 60 feet begins casting a spell',
    triggerConditions: {
      event: 'spell_cast',
      range: 60
    },
    interruptsTurn: true
  }
};

// Action execution interface
export interface ActionExecutor {
  executeAction(action: BaseAction, actor: any, targets: any[], context: any): ActionResult;
  validateAction(action: BaseAction, actor: any, economy: ActionEconomy): { valid: boolean; reason?: string };
  getAvailableActions(actor: any, economy: ActionEconomy): BaseAction[];
  applyActionEconomy(economy: ActionEconomy, action: BaseAction): ActionEconomy;
}

// Enhanced creature capabilities
export interface CreatureCapabilities {
  legendaryActions?: {
    count: number;
    actions: LegendaryAction[];
    rechargeCondition: 'start_of_turn' | 'end_of_turn';
  };
  lairActions?: {
    actions: LairAction[];
    hasLair: boolean;
    initiative: number;
  };
  reactions?: {
    available: ReactionAction[];
    rechargeCondition: 'start_of_turn' | 'long_rest';
  };
  multiattack?: MultiattackAction;
  spellcasting?: {
    level: number;
    modifier: number;
    saveDC: number;
    slots: { [level: number]: number };
    spellsKnown: SpellAction[];
    cantripsKnown: SpellAction[];
  };
  legendaryResistance?: {
    uses: number;
    rechargeCondition: 'long_rest';
  };
}

export interface EnhancedCreature {
  id: string;
  name: string;
  type: 'character' | 'npc';
  capabilities: CreatureCapabilities;
  currentState: {
    actionEconomy: ActionEconomy;
    activeEffects: EffectDefinition[];
    legendaryActionsRemaining: number;
    legendaryResistanceRemaining: number;
    spellSlots: { [level: number]: number };
  };
}
````

## File: combat-engine-server/src/dice.ts
````typescript
export interface DiceRoll {
  dice: string;
  rolls: number[];
  modifier: number;
  total: number;
  expression: string;
}

export interface CombatRoll {
  attackRoll: DiceRoll;
  hit: boolean;
  critical: boolean;
  fumble: boolean;
  damageRoll?: DiceRoll;
}

export class DiceEngine {
  /**
   * Parse a dice expression like "1d20+5" or "3d6-2"
   */
  private parseDiceExpression(expression: string): {
    count: number;
    sides: number;
    modifier: number;
  } {
    const match = expression.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
    if (!match) {
      throw new Error(`Invalid dice expression: ${expression}`);
    }

    const count = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    return { count, sides, modifier };
  }

  /**
   * Roll a single die
   */
  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }

  /**
   * Roll dice based on expression (e.g., "1d20+5", "3d6-2")
   */
  roll(expression: string): DiceRoll {
    const { count, sides, modifier } = this.parseDiceExpression(expression);
    const rolls: number[] = [];
    
    for (let i = 0; i < count; i++) {
      rolls.push(this.rollDie(sides));
    }
    
    const sum = rolls.reduce((acc, val) => acc + val, 0);
    const total = sum + modifier;
    
    return {
      dice: `${count}d${sides}`,
      rolls,
      modifier,
      total,
      expression,
    };
  }

  /**
   * Roll multiple dice expressions and sum them
   */
  rollMultiple(expressions: string[]): DiceRoll {
    const allRolls: number[] = [];
    let totalModifier = 0;
    const diceParts: string[] = [];
    
    for (const expr of expressions) {
      const result = this.roll(expr);
      allRolls.push(...result.rolls);
      totalModifier += result.modifier;
      diceParts.push(result.dice);
    }
    
    const sum = allRolls.reduce((acc, val) => acc + val, 0);
    const total = sum + totalModifier;
    
    return {
      dice: diceParts.join('+'),
      rolls: allRolls,
      modifier: totalModifier,
      total,
      expression: expressions.join('+'),
    };
  }

  /**
   * Roll with advantage (roll twice, take higher)
   */
  rollAdvantage(expression: string): DiceRoll {
    const roll1 = this.roll(expression);
    const roll2 = this.roll(expression);
    
    const chosen = roll1.total >= roll2.total ? roll1 : roll2;
    return {
      ...chosen,
      expression: `${expression} (advantage)`,
    };
  }

  /**
   * Roll with disadvantage (roll twice, take lower)
   */
  rollDisadvantage(expression: string): DiceRoll {
    const roll1 = this.roll(expression);
    const roll2 = this.roll(expression);
    
    const chosen = roll1.total <= roll2.total ? roll1 : roll2;
    return {
      ...chosen,
      expression: `${expression} (disadvantage)`,
    };
  }

  /**
   * Perform an attack roll
   */
  attackRoll(
    attackBonus: number,
    targetAC: number,
    advantage: boolean = false,
    disadvantage: boolean = false
  ): CombatRoll {
    const expression = `1d20+${attackBonus}`;
    
    let attackRoll: DiceRoll;
    if (advantage && !disadvantage) {
      attackRoll = this.rollAdvantage(expression);
    } else if (disadvantage && !advantage) {
      attackRoll = this.rollDisadvantage(expression);
    } else {
      attackRoll = this.roll(expression);
    }
    
    const d20Roll = attackRoll.rolls[0];
    const critical = d20Roll === 20;
    const fumble = d20Roll === 1;
    const hit = critical || (!fumble && attackRoll.total >= targetAC);
    
    return {
      attackRoll,
      hit,
      critical,
      fumble,
    };
  }

  /**
   * Roll damage for an attack
   */
  damageRoll(damageExpression: string, critical: boolean = false): DiceRoll {
    if (critical) {
      // Double the dice on critical hit
      const { count, sides, modifier } = this.parseDiceExpression(damageExpression);
      const critExpression = `${count * 2}d${sides}+${modifier}`;
      const result = this.roll(critExpression);
      return {
        ...result,
        expression: `${damageExpression} (critical)`,
      };
    }
    
    return this.roll(damageExpression);
  }

  /**
   * Perform a saving throw
   */
  savingThrow(
    saveBonus: number,
    dc: number,
    advantage: boolean = false,
    disadvantage: boolean = false
  ): {
    roll: DiceRoll;
    success: boolean;
    criticalSuccess: boolean;
    criticalFailure: boolean;
  } {
    const expression = `1d20+${saveBonus}`;
    
    let roll: DiceRoll;
    if (advantage && !disadvantage) {
      roll = this.rollAdvantage(expression);
    } else if (disadvantage && !advantage) {
      roll = this.rollDisadvantage(expression);
    } else {
      roll = this.roll(expression);
    }
    
    const d20Roll = roll.rolls[0];
    const criticalSuccess = d20Roll === 20;
    const criticalFailure = d20Roll === 1;
    const success = criticalSuccess || (!criticalFailure && roll.total >= dc);
    
    return {
      roll,
      success,
      criticalSuccess,
      criticalFailure,
    };
  }

  /**
   * Roll initiative for combat order
   */
  initiative(dexterityModifier: number): DiceRoll {
    return this.roll(`1d20+${dexterityModifier}`);
  }

  /**
   * Roll for ability check
   */
  abilityCheck(
    abilityModifier: number,
    proficiencyBonus: number = 0,
    dc: number,
    advantage: boolean = false,
    disadvantage: boolean = false
  ): {
    roll: DiceRoll;
    success: boolean;
    criticalSuccess: boolean;
    criticalFailure: boolean;
  } {
    const totalBonus = abilityModifier + proficiencyBonus;
    return this.savingThrow(totalBonus, dc, advantage, disadvantage);
  }
}
````

## File: combat-engine-server/src/enhanced-index.ts
````typescript
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
````

## File: combat-engine-server/src/spatial-engine.ts
````typescript
// Complete D&D 5e Spatial Combat Engine
// Hybrid LLM + Algorithmic Approach for Tactical Combat

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface SizeInfo {
  category: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  squares: number; // Number of 5-foot squares the creature occupies
}

export interface Creature {
  id: string;
  name: string;
  position: Position;
  size: SizeInfo;
  speed: number;
  reach: number;
}

export interface TerrainFeature {
  type: 'wall' | 'pillar' | 'pit' | 'stairs' | 'door' | 'window';
  position: Position;
  dimensions: { width: number; height: number; depth: number };
  blocksMovement: boolean;
  blocksLineOfSight: boolean;
  coverType: 'none' | 'half' | 'three_quarters' | 'total';
}

export interface AreaEffect {
  id: string;
  name: string;
  shape: 'sphere' | 'cube' | 'cone' | 'line' | 'cylinder';
  center: Position;
  sizeParameter: number; // radius, side length, etc.
  direction?: number; // for cones and lines
  durationRounds: number;
}

export interface Battlefield {
  width: number;
  height: number;
  creatures: Map<string, Creature>;
  terrain: TerrainFeature[];
  areaEffects: AreaEffect[];
}

export class SpatialEngine {
  private battlefield: Battlefield;

  constructor(width: number = 20, height: number = 20) {
    this.battlefield = {
      width,
      height,
      creatures: new Map(),
      terrain: [],
      areaEffects: []
    };
  }

  // Distance calculation with proper 5-foot grid rules
  getDistance(pos1: Position, pos2: Position): number {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    const dz = Math.abs(pos1.z - pos2.z);
    
    // D&D 5e uses the "5-4-5" rule for diagonals in 3D
    const horizontal = Math.max(dx, dy) + Math.min(dx, dy) * 0.5;
    return Math.max(horizontal, dz) * 5; // Convert to feet
  }

  // Range categories for LLM processing
  getRangeCategory(distance: number): string {
    if (distance <= 5) return 'melee';
    if (distance <= 30) return 'close';
    if (distance <= 120) return 'medium';
    if (distance <= 600) return 'long';
    return 'extreme';
  }

  // Line of Sight calculation with cover assessment
  calculateLineOfSight(from: Position, to: Position): {
    hasLineOfSight: boolean;
    coverType: 'none' | 'half' | 'three_quarters' | 'total';
    blockedBy?: string[];
  } {
    const result: {
      hasLineOfSight: boolean;
      coverType: 'none' | 'half' | 'three_quarters' | 'total';
      blockedBy: string[];
    } = {
      hasLineOfSight: true,
      coverType: 'none',
      blockedBy: []
    };

    // Simple ray casting through terrain
    const steps = Math.max(
      Math.abs(to.x - from.x),
      Math.abs(to.y - from.y),
      Math.abs(to.z - from.z)
    );

    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const testPos = {
        x: Math.round(from.x + (to.x - from.x) * progress),
        y: Math.round(from.y + (to.y - from.y) * progress),
        z: Math.round(from.z + (to.z - from.z) * progress)
      };

      // Check terrain blocking
      for (const terrain of this.battlefield.terrain) {
        if (this.positionIntersectsTerrain(testPos, terrain)) {
          if (terrain.blocksLineOfSight) {
            if (terrain.coverType === 'total') {
              result.hasLineOfSight = false;
              result.coverType = 'total';
              result.blockedBy.push(terrain.type);
              return result;
            } else {
              result.coverType = this.getCombinedCover(result.coverType, terrain.coverType);
              result.blockedBy.push(terrain.type);
            }
          }
        }
      }
    }

    return result;
  }

  // A* pathfinding for movement validation
  findPath(from: Position, to: Position, creature: Creature): Position[] | null {
    // Simplified pathfinding - in production would use full A*
    const path: Position[] = [];
    let current = { ...from };

    while (this.getDistance(current, to) > 5) {
      const dx = to.x > current.x ? 1 : to.x < current.x ? -1 : 0;
      const dy = to.y > current.y ? 1 : to.y < current.y ? -1 : 0;
      
      const next = { x: current.x + dx, y: current.y + dy, z: current.z };
      
      if (this.isPositionValid(next, creature)) {
        current = next;
        path.push({ ...current });
      } else {
        return null; // Path blocked
      }
    }

    return path;
  }

  // Movement validation with opportunity attack detection
  validateMovement(creature: Creature, from: Position, to: Position, speed: number): {
    isValid: boolean;
    pathLength: number;
    opportunityAttacks: string[];
    path?: Position[];
  } {
    const path = this.findPath(from, to, creature);
    if (!path) {
      return { isValid: false, pathLength: 0, opportunityAttacks: [] };
    }

    const pathLength = this.calculatePathLength(path);
    if (pathLength > speed) {
      return { isValid: false, pathLength, opportunityAttacks: [] };
    }

    const opportunityAttacks = this.detectOpportunityAttacks(creature, path);
    
    return {
      isValid: true,
      pathLength,
      opportunityAttacks,
      path
    };
  }

  // Area of Effect targeting
  getTargetsInArea(effect: AreaEffect): string[] {
    const targets: string[] = [];

    for (const [id, creature] of this.battlefield.creatures) {
      if (this.isCreatureInAreaEffect(creature, effect)) {
        targets.push(id);
      }
    }

    return targets;
  }

  // LLM-friendly tactical situation description
  describeTacticalSituation(creatureId: string): string {
    // More robust creature lookup - try exact match first, then partial match
    let creature = this.battlefield.creatures.get(creatureId);
    
    if (!creature) {
      // Try to find by partial name match if exact ID fails
      for (const [id, c] of this.battlefield.creatures) {
        if (id.includes(creatureId) || c.name.toLowerCase().includes(creatureId.toLowerCase())) {
          creature = c;
          break;
        }
      }
    }
    
    if (!creature) {
      // Last resort: return detailed info about what's actually on the battlefield
      const availableCreatures = Array.from(this.battlefield.creatures.entries())
        .map(([id, c]) => `${id}:"${c.name}"`)
        .join(', ');
      return `Creature "${creatureId}" not found. Available creatures: ${availableCreatures || 'none'}`;
    }

    const descriptions: string[] = [];
    descriptions.push(`${creature.name} (${creature.size.category})`);

    // Describe position relative to others
    for (const [otherId, other] of this.battlefield.creatures) {
      if (otherId === creatureId) continue;

      const distance = this.getDistance(creature.position, other.position);
      const rangeCategory = this.getRangeCategory(distance);
      const los = this.calculateLineOfSight(creature.position, other.position);
      
      let positionDesc = `${rangeCategory} range to ${other.name} (${Math.round(distance)}ft)`;
      
      if (!los.hasLineOfSight) {
        positionDesc += ', no line of sight';
      } else if (los.coverType !== 'none') {
        positionDesc += `, ${los.coverType} cover`;
      } else {
        positionDesc += ', clear shot';
      }

      descriptions.push(positionDesc);
    }

    // Describe immediate threats
    const threateningCreatures = this.getThreateningCreatures(creatureId);
    if (threateningCreatures.length > 0) {
      descriptions.push(`Threatened by: ${threateningCreatures.join(', ')}`);
    }

    // Describe tactical features
    const nearbyTerrain = this.getNearbyTerrain(creature.position, 10);
    if (nearbyTerrain.length > 0) {
      descriptions.push(`Nearby: ${nearbyTerrain.map(t => t.type).join(', ')}`);
    }

    return descriptions.join('. ') + '.';
  }

  // Human-readable battlefield overview
  describeBattlefield(): string {
    const description: string[] = [];
    
    // Battlefield dimensions
    description.push(`⚔️ **BATTLEFIELD**: ${this.battlefield.width}×${this.battlefield.height} squares (${this.battlefield.width * 5}×${this.battlefield.height * 5} feet)`);
    
    // Terrain features
    if (this.battlefield.terrain.length > 0) {
      description.push('\n🏗️ **TERRAIN**:');
      for (const terrain of this.battlefield.terrain) {
        const pos = `(${terrain.position.x},${terrain.position.y})`;
        const size = `${terrain.dimensions.width}×${terrain.dimensions.height}×${terrain.dimensions.depth}ft`;
        const cover = terrain.coverType !== 'none' ? ` [${terrain.coverType} cover]` : '';
        const blocks = terrain.blocksMovement ? ' [blocks movement]' : '';
        description.push(`  • ${this.capitalizeFirst(terrain.type)} at ${pos} - ${size}${cover}${blocks}`);
      }
    }
    
    // Creature positions
    if (this.battlefield.creatures.size > 0) {
      description.push('\n👥 **COMBATANTS**:');
      const sortedCreatures = Array.from(this.battlefield.creatures.entries())
        .sort(([,a], [,b]) => b.position.z - a.position.z); // Sort by height (highest first)
      
      for (const [id, creature] of sortedCreatures) {
        const pos = `(${creature.position.x},${creature.position.y},${creature.position.z})`;
        const elevation = this.getElevationDescription(creature.position.z);
        const nearby = this.getTerrainAtPosition(creature.position);
        const location = nearby ? ` on ${nearby.type}` : elevation;
        description.push(`  • ${creature.name} at ${pos}${location} - ${creature.size.category} creature`);
      }
    }
    
    return description.join('\n');
  }

  // Enhanced tactical situation with narrative description
  describeDetailedTacticalSituation(creatureId: string): string {
    const creature = this.battlefield.creatures.get(creatureId);
    if (!creature) {
      return `❌ Creature "${creatureId}" not found on battlefield.`;
    }

    const sections: string[] = [];
    
    // Current position
    const elevation = this.getElevationDescription(creature.position.z);
    const terrain = this.getTerrainAtPosition(creature.position);
    const position = terrain ? `standing on a ${terrain.type}` : `positioned ${elevation}`;
    sections.push(`🎯 **${creature.name}** is ${position} at coordinates (${creature.position.x},${creature.position.y},${creature.position.z}).`);
    
    // Combat positioning
    const enemies: string[] = [];
    const allies: string[] = [];
    
    for (const [otherId, other] of this.battlefield.creatures) {
      if (otherId === creatureId) continue;
      
      const distance = this.getDistance(creature.position, other.position);
      const rangeCategory = this.getRangeCategory(distance);
      const los = this.calculateLineOfSight(creature.position, other.position);
      const heightDiff = other.position.z - creature.position.z;
      
      let positionDesc = `${other.name} (${Math.round(distance)}ft ${rangeCategory})`;
      
      // Height relationship
      if (heightDiff > 5) {
        positionDesc += ` above`;
      } else if (heightDiff < -5) {
        positionDesc += ` below`;
      }
      
      // Line of sight and cover
      if (!los.hasLineOfSight) {
        positionDesc += ` - NO LINE OF SIGHT`;
      } else if (los.coverType !== 'none') {
        positionDesc += ` - ${los.coverType} cover`;
      } else {
        positionDesc += ` - clear shot`;
      }
      
      // Assume others are enemies for now (could be enhanced with faction data)
      enemies.push(positionDesc);
    }
    
    if (enemies.length > 0) {
      sections.push(`⚔️ **ENEMIES IN SIGHT**: ${enemies.join(', ')}`);
    }
    
    // Tactical advantages/disadvantages
    const tactical: string[] = [];
    
    if (this.isCreatureFlanked(creatureId)) {
      tactical.push("⚠️ **FLANKED** - vulnerable to sneak attacks");
    }
    
    const threatening = this.getThreateningCreatures(creatureId);
    if (threatening.length > 0) {
      tactical.push(`⚠️ **THREATENED** by ${threatening.join(', ')} - movement provokes opportunity attacks`);
    }
    
    // Height advantages
    for (const [otherId, other] of this.battlefield.creatures) {
      if (otherId === creatureId) continue;
      if (this.hasHeightAdvantage(creatureId, otherId)) {
        tactical.push(`🏔️ **HEIGHT ADVANTAGE** over ${other.name}`);
      }
    }
    
    if (tactical.length > 0) {
      sections.push(tactical.join('\n'));
    }
    
    // Movement options
    const nearbyTerrain = this.getNearbyTerrain(creature.position, 15);
    if (nearbyTerrain.length > 0) {
      const options = nearbyTerrain.map(t => {
        const dist = Math.round(this.getDistance(creature.position, t.position));
        return `${t.type} (${dist}ft away)`;
      });
      sections.push(`🏃 **MOVEMENT OPTIONS**: ${options.join(', ')}`);
    }
    
    return sections.join('\n\n');
  }

  // ASCII battlefield visualization (simplified)
  generateBattlefieldMap(): string {
    const map: string[] = [];
    const width = Math.min(this.battlefield.width, 20); // Limit for readability
    const height = Math.min(this.battlefield.height, 15);
    
    map.push('📍 **BATTLEFIELD MAP** (X→, Y↓):');
    map.push('');
    
    // Create grid
    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        let cell = '·'; // Empty space
        
        // Check for terrain
        const terrain = this.battlefield.terrain.find(t =>
          x >= t.position.x && x < t.position.x + t.dimensions.width &&
          y >= t.position.y && y < t.position.y + t.dimensions.height
        );
        
        if (terrain) {
          switch (terrain.type) {
            case 'wall': cell = '█'; break;
            case 'pillar': cell = '■'; break;
            case 'stairs': cell = '≡'; break;
            case 'door': cell = '▫'; break;
            default: cell = '▓';
          }
        }
        
        // Check for creatures (they override terrain)
        for (const [id, creature] of this.battlefield.creatures) {
          if (creature.position.x === x && creature.position.y === y) {
            cell = creature.name.charAt(0).toUpperCase(); // First letter of name
            break;
          }
        }
        
        row += cell + ' ';
      }
      map.push(`${y.toString().padStart(2)}│${row}`);
    }
    
    // Add coordinate labels
    let xLabels = '  └';
    for (let x = 0; x < width; x++) {
      xLabels += (x % 10).toString() + ' ';
    }
    map.push(xLabels);
    
    // Add legend
    map.push('');
    map.push('**LEGEND**: █=wall, ■=pillar, ≡=stairs, Letters=creatures');
    
    return map.join('\n');
  }

  // Helper methods for descriptive text
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  private getElevationDescription(z: number): string {
    if (z === 0) return 'at ground level';
    if (z <= 5) return 'slightly elevated';
    if (z <= 10) return 'at moderate height';
    return 'at significant height';
  }
  
  private getTerrainAtPosition(pos: Position): TerrainFeature | null {
    return this.battlefield.terrain.find(terrain =>
      pos.x >= terrain.position.x &&
      pos.x < terrain.position.x + terrain.dimensions.width &&
      pos.y >= terrain.position.y &&
      pos.y < terrain.position.y + terrain.dimensions.height &&
      pos.z >= terrain.position.z &&
      pos.z <= terrain.position.z + terrain.dimensions.depth
    ) || null;
  }

  // Flanking calculation
  isCreatureFlanked(creatureId: string): boolean {
    const creature = this.battlefield.creatures.get(creatureId);
    if (!creature) return false;

    const enemies = Array.from(this.battlefield.creatures.values())
      .filter(c => c.id !== creatureId && this.getDistance(c.position, creature.position) <= 5);

    if (enemies.length < 2) return false;

    // Check if enemies are on opposite sides
    for (let i = 0; i < enemies.length; i++) {
      for (let j = i + 1; j < enemies.length; j++) {
        if (this.areOpposite(enemies[i].position, enemies[j].position, creature.position)) {
          return true;
        }
      }
    }

    return false;
  }

  // Height advantage calculation
  hasHeightAdvantage(attackerId: string, targetId: string): boolean {
    const attacker = this.battlefield.creatures.get(attackerId);
    const target = this.battlefield.creatures.get(targetId);
    
    if (!attacker || !target) return false;
    
    return attacker.position.z > target.position.z + 5; // 5+ feet higher
  }

  // Private helper methods
  private positionIntersectsTerrain(pos: Position, terrain: TerrainFeature): boolean {
    return pos.x >= terrain.position.x && 
           pos.x < terrain.position.x + terrain.dimensions.width &&
           pos.y >= terrain.position.y && 
           pos.y < terrain.position.y + terrain.dimensions.height &&
           pos.z >= terrain.position.z && 
           pos.z < terrain.position.z + terrain.dimensions.depth;
  }

  private getCombinedCover(
    current: 'none' | 'half' | 'three_quarters' | 'total',
    additional: 'none' | 'half' | 'three_quarters' | 'total'
  ): 'none' | 'half' | 'three_quarters' | 'total' {
    const coverValues: Record<string, number> = { 'none': 0, 'half': 1, 'three_quarters': 2, 'total': 3 };
    const coverNames: ('none' | 'half' | 'three_quarters' | 'total')[] = ['none', 'half', 'three_quarters', 'total'];
    const maxValue = Math.max(coverValues[current], coverValues[additional]);
    return coverNames[maxValue];
  }

  private isPositionValid(pos: Position, creature: Creature): boolean {
    // Check bounds
    if (pos.x < 0 || pos.x >= this.battlefield.width || 
        pos.y < 0 || pos.y >= this.battlefield.height) {
      return false;
    }

    // Check terrain blocking
    for (const terrain of this.battlefield.terrain) {
      if (terrain.blocksMovement && this.positionIntersectsTerrain(pos, terrain)) {
        return false;
      }
    }

    // Check creature collision
    for (const [id, other] of this.battlefield.creatures) {
      if (other.id === creature.id) continue;
      if (this.getDistance(pos, other.position) < 5) {
        return false; // Occupied space
      }
    }

    return true;
  }

  private calculatePathLength(path: Position[]): number {
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      total += this.getDistance(path[i-1], path[i]);
    }
    return total;
  }

  private detectOpportunityAttacks(creature: Creature, path: Position[]): string[] {
    const attacks: string[] = [];
    
    for (const pos of path) {
      for (const [id, other] of this.battlefield.creatures) {
        if (other.id === creature.id) continue;
        
        const distance = this.getDistance(pos, other.position);
        if (distance <= other.reach) {
          if (!attacks.includes(other.name)) {
            attacks.push(other.name);
          }
        }
      }
    }
    
    return attacks;
  }

  private isCreatureInAreaEffect(creature: Creature, effect: AreaEffect): boolean {
    const distance = this.getDistance(creature.position, effect.center);
    
    switch (effect.shape) {
      case 'sphere':
        return distance <= effect.sizeParameter;
      case 'cube':
        const halfSize = effect.sizeParameter / 2;
        return Math.abs(creature.position.x - effect.center.x) <= halfSize &&
               Math.abs(creature.position.y - effect.center.y) <= halfSize &&
               Math.abs(creature.position.z - effect.center.z) <= halfSize;
      // Add other shapes as needed
      default:
        return false;
    }
  }

  private getThreateningCreatures(creatureId: string): string[] {
    const creature = this.battlefield.creatures.get(creatureId);
    if (!creature) return [];

    const threatening: string[] = [];
    for (const [id, other] of this.battlefield.creatures) {
      if (id === creatureId) continue;
      
      const distance = this.getDistance(creature.position, other.position);
      if (distance <= other.reach) {
        threatening.push(other.name);
      }
    }

    return threatening;
  }

  private getNearbyTerrain(pos: Position, radius: number): TerrainFeature[] {
    return this.battlefield.terrain.filter(terrain => {
      const distance = this.getDistance(pos, terrain.position);
      return distance <= radius;
    });
  }

  private areOpposite(pos1: Position, pos2: Position, center: Position): boolean {
    // Simplified check - in production would use proper vector math
    const dx1 = pos1.x - center.x;
    const dy1 = pos1.y - center.y;
    const dx2 = pos2.x - center.x;
    const dy2 = pos2.y - center.y;
    
    // Check if roughly opposite (dot product negative)
    return (dx1 * dx2 + dy1 * dy2) < 0;
  }

  // Public API methods for MCP tools
  addCreature(creature: Creature): void {
    this.battlefield.creatures.set(creature.id, creature);
  }

  removeCreature(id: string): void {
    this.battlefield.creatures.delete(id);
  }

  moveCreature(id: string, newPosition: Position): boolean {
    const creature = this.battlefield.creatures.get(id);
    if (!creature) return false;
    
    if (this.isPositionValid(newPosition, creature)) {
      creature.position = newPosition;
      return true;
    }
    return false;
  }

  addTerrain(terrain: TerrainFeature): void {
    this.battlefield.terrain.push(terrain);
  }

  initializeBattlefield(width: number, height: number, terrain: TerrainFeature[] = []): void {
    // Preserve existing creatures if any
    const existingCreatures = this.battlefield?.creatures || new Map();
    
    this.battlefield = {
      width,
      height,
      creatures: existingCreatures,
      terrain: [...terrain],
      areaEffects: []
    };
  }

  getBattlefieldState(): Battlefield {
    return this.battlefield;
  }
}
````

## File: dice-rolling-guide.md
````markdown
# Dice Rolling Guide for RPG MCP Servers

## Basic Dice Notation

### Standard Rolls
- `1d20` - Roll one 20-sided die
- `3d6` - Roll three 6-sided dice and sum them
- `1d20+5` - Roll 1d20 and add 5
- `2d8-2` - Roll 2d8 and subtract 2

### Advantage/Disadvantage Notation
- `2d20kh1` - Roll 2d20, keep highest 1 (advantage)
- `2d20kl1` - Roll 2d20, keep lowest 1 (disadvantage)
- `2d20kh1+5` - Roll with advantage, add 5
- `2d20kl1+3` - Roll with disadvantage, add 3

## Available Tools

### 1. `roll_dice` - Generic dice rolling
Use for any dice roll with full notation support:
```json
{
  "notation": "2d20kh1+5",
  "reason": "Perception check with advantage"
}
```

### 2. `roll_check` - Ability/Skill checks
Simplified tool for ability checks:
```json
{
  "character": "Thorin",
  "ability": "Perception",
  "modifier": 5,
  "advantage": true,
  "dc": 15  // optional
}
```

### 3. `attack_roll` - Combat attacks
Specifically for attack rolls:
```json
{
  "attacker": "Thorin",
  "target": "Goblin",
  "modifier": 7,
  "advantage": false,
  "disadvantage": false
}
```

### 4. `saving_throw` - Saving throws
For saves against effects:
```json
{
  "character": "Thorin",
  "ability": "Constitution",
  "dc": 13,
  "modifier": 5
}
```

## Examples

### Rolling with Advantage (Two Ways)

**Method 1: Using dice notation**
```
roll_dice with notation "2d20kh1+5" for "Stealth check with advantage"
```
Output shows all rolls: `rolled [15, 8], kept [15]+5 = 20`

**Method 2: Using roll_check**
```
roll_check for character "Elara", ability "Stealth", modifier 5, advantage true
```
Output clearly shows the advantage was applied

### Complex Rolls

**Fireball damage (many dice)**
```
roll_dice with notation "8d6" for "Fireball damage"
```

**Great Weapon Fighting (keep specific dice)**
```
roll_dice with notation "2d6kh1" for "Greatsword damage, rerolling low die"
```

## Tips

1. **For ability checks**: Use `roll_check` - it's cleaner and tracks success/failure
2. **For damage**: Use `roll_dice` with appropriate notation
3. **For attacks**: Use `attack_roll` - it handles crits/fumbles properly
4. **For complex rolls**: The notation system supports any combination

## Common D&D 5e Rolls

- **Ability Check**: `1d20 + ability modifier`
- **Attack Roll**: `1d20 + proficiency + ability modifier`
- **Damage Roll**: Varies by weapon (e.g., `1d8+3` for longsword)
- **Saving Throw**: `1d20 + ability modifier (+ proficiency if proficient)`
- **Initiative**: `1d20 + Dexterity modifier`
- **Death Save**: `1d20` (10+ succeeds)

## Advantage/Disadvantage Rules

- **Advantage**: Roll 2d20, use the higher
- **Disadvantage**: Roll 2d20, use the lower
- **Multiple sources**: Having multiple sources of advantage/disadvantage doesn't stack
- **Cancellation**: One source of advantage and one of disadvantage cancel out

The system now properly handles all these cases!
````

## File: ENHANCEMENTS.md
````markdown
# 🎉 RPG MCP Servers - Human-Friendly VS Code Enhancements

## 🚀 What's New

This enhancement update focuses on making the RPG MCP servers **dramatically more human-friendly** in the VS Code editor environment. Every tool output has been redesigned for better readability, context, and user experience.

## ✨ Combat Engine Server Enhancements

### 🎲 Dice & Checks
- **Enhanced Roll Outputs**: Beautiful formatted results with emojis, context, and difficulty assessments
- **Contextual Feedback**: Automatic evaluation of roll quality (Exceptional, Great, Decent, etc.)
- **Margin Analysis**: Clear indication of success/failure margins
- **Natural 20/1 Indicators**: Special highlighting for critical successes and failures

### ⚔️ Combat Analysis
- **Line of Sight**: Rich tactical analysis with cover information and combat advice
- **Area Effects**: Detailed creature targeting with distances and saving throw reminders
- **Flanking Checks**: Comprehensive positioning analysis with tactical suggestions
- **Height Advantage**: Detailed elevation analysis with combat bonuses explanation

### 📋 Combat Management
- **Enhanced Combat Log**: Structured, numbered entries with summary information
- **Tactical Summaries**: Rich creature analysis with positioning tips and warnings
- **Error Handling**: Clear, helpful error messages with available options listed

### 🗺️ Spatial Intelligence
- **Battlefield Descriptions**: Human-readable overviews with creature positioning
- **ASCII Maps**: Visual battlefield representation with legend
- **Tactical Advice**: Context-aware suggestions for optimal play

## 🏰 Game State Server Enhancements

### 👤 Character Management
- **Rich Character Sheets**: Beautiful formatted ability scores and information
- **Character Roster**: Clean, organized character lists with IDs and classes
- **Update Feedback**: Clear confirmation of character modifications

### 🎒 Inventory System
- **Visual Inventory**: Organized item displays with equipped status and quantities
- **Add/Remove Feedback**: Clear confirmation of inventory changes
- **Item Categories**: Better organization and display of gear

### 🌍 World State Management
- **Detailed Save Confirmation**: Comprehensive feedback on what was saved
- **Rich State Retrieval**: Formatted world state with timestamps and summaries
- **Update Tracking**: Clear indication of what changed during updates

### 👹 NPC Management
- **Visual NPC Roster**: Health status indicators and type icons
- **Group Creation**: Batch NPC creation with detailed feedback
- **Combat Status**: Health indicators (Healthy, Wounded, Dead) with icons

### ⚔️ Encounter Management
- **Initiative Tracking**: Clear turn order with current turn highlighting
- **Encounter Status**: Rich encounter overviews with participant details
- **Turn Management**: Enhanced feedback for combat flow

### 🎯 Quest System
- **Quest Display**: Beautiful quest formatting with objectives and rewards
- **Progress Tracking**: Clear status indicators and completion feedback
- **Assignment Confirmation**: Detailed quest assignment information

## 🛠️ Technical Improvements

### 🔧 Error Handling
- **Helpful Error Messages**: Clear explanations with suggested solutions
- **Available Options**: When entities not found, show what's available
- **Context-Aware Guidance**: Specific advice based on the error situation

### 🎨 Visual Design
- **Consistent Emoji Usage**: Visual icons for different types of information
- **Structured Formatting**: Clear headers, sections, and hierarchical information
- **Status Indicators**: Color-coded (via emojis) status representations

### 💡 User Experience
- **Contextual Tips**: Tactical advice and gameplay suggestions
- **Progress Feedback**: Clear indication of what was accomplished
- **Next Steps**: Guidance on what to do next in many situations

## 📊 Before vs After Examples

### Before (Raw JSON):
```json
{
  "total": 15,
  "dc": 12,
  "success": true,
  "rolls": [13],
  "modifier": 2
}
```

### After (Human-Friendly):
```
🛡️ **CONSTITUTION SAVING THROW**

👤 **Character:** Lyra Swiftarrow
🎲 **Rolled:** 13
➕ **Modifier:** +2
🏆 **TOTAL:** 15
🎯 **DC:** 12
📊 **RESULT:** ✅ SUCCESS! 🎉 **Solid Save!** (beat DC by 3)
```

## 🎮 Impact on Gameplay

These enhancements make the MCP servers:
- **Easier to Use**: Clear, readable outputs reduce cognitive load
- **More Informative**: Rich context helps players make better decisions
- **Tactically Helpful**: Built-in advice improves gameplay experience
- **Error-Resilient**: Better error handling reduces frustration
- **Visually Appealing**: Beautiful formatting enhances the VS Code experience

## 🔄 Migration

No breaking changes! All existing functionality is preserved while adding these enhancements. Simply rebuild and restart your servers to enjoy the improved experience.

---

**Ready to experience D&D like never before in VS Code!** 🎲⚔️✨
````

## File: game-state-server/package.json
````json
{
  "name": "rpg-game-state-server",
  "version": "1.0.0",
  "description": "MCP server for RPG game state management using SQLite",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "sqlite3": "^5.1.6",
    "better-sqlite3": "^9.2.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/better-sqlite3": "^7.6.8",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
````

## File: game-state-server/src/db.d.ts
````typescript
interface EncounterParticipant {
    id: number;
    encounter_id: number;
    participant_type: 'character' | 'npc';
    participant_id: number;
    initiative: number;
    initiative_order?: number | null;
    has_acted: boolean;
    conditions?: string | null;
    is_active: boolean;
    name: string;
    current_hp: number;
    max_hp: number;
}
interface Quest {
    id: number;
    title: string;
    description: string;
    objectives: string;
    rewards: string;
    created_at: string;
}
interface CharacterQuest {
    id: number;
    character_id: number;
    quest_id: number;
    status: 'active' | 'completed' | 'failed';
    progress?: string | null;
    assigned_at: string;
    updated_at: string;
    title?: string;
    description?: string;
    objectives?: string;
    rewards?: string;
}
export declare class GameDatabase {
    private db;
    constructor();
    private initializeSchema;
    createCharacter(data: {
        name: string;
        class: string;
        strength?: number;
        dexterity?: number;
        constitution?: number;
        intelligence?: number;
        wisdom?: number;
        charisma?: number;
    }): unknown;
    getCharacter(id: number): unknown;
    getCharacterByName(name: string): unknown;
    listCharacters(): unknown[];
    updateCharacter(id: number, updates: Record<string, any>): unknown;
    addItem(characterId: number, item: {
        name: string;
        type: string;
        quantity?: number;
        properties?: Record<string, any>;
    }): {
        name: string;
        type: string;
        quantity?: number;
        properties?: Record<string, any>;
        id: number | bigint;
    };
    getInventory(characterId: number): any[];
    updateItem(id: number, updates: {
        quantity?: number;
        equipped?: boolean;
    }): void;
    removeItem(id: number): void;
    saveStoryProgress(characterId: number, data: {
        chapter: string;
        scene: string;
        description?: string;
        flags?: Record<string, any>;
    }): void;
    getLatestStoryProgress(characterId: number): any;
    saveWorldState(characterId: number, data: {
        location: string;
        npcs?: Record<string, any>;
        events?: Record<string, any>;
        environment?: Record<string, any>;
    }): void;
    getWorldState(characterId: number): any;
    logCombat(characterId: number, sessionId: string, action: string, result?: string): void;
    getCombatLog(characterId: number, sessionId?: string): unknown[];
    createNPC(data: {
        name: string;
        template?: string;
        type?: string;
        customStats?: Record<string, any>;
    }): any;
    createNPCGroup(template: string, count: number, namePrefix?: string): any[];
    getNPC(id: number): any;
    listNPCs(type?: string, aliveOnly?: boolean): any[];
    updateNPC(id: number, updates: Record<string, any>): any;
    removeNPC(id: number): void;
    createEncounter(data: {
        character_id: number;
        name: string;
        description?: string;
        environment?: string;
    }): unknown;
    getEncounter(id: number): unknown;
    getActiveEncounter(characterId: number): unknown;
    addEncounterParticipant(encounterId: number, type: string, participantId: number, initiative: number): void;
    updateInitiativeOrder(encounterId: number): void;
    getEncounterParticipants(encounterId: number): EncounterParticipant[];
    nextTurn(encounterId: number): EncounterParticipant | null | undefined;
    endEncounter(id: number, outcome?: string): void;
    applyDamage(targetType: string, targetId: number, damage: number): any;
    addQuest(data: {
        title: string;
        description: string;
        objectives: Record<string, any>[] | string[];
        rewards: Record<string, any>;
    }): Quest | null;
    getQuestById(id: number): Quest | null;
    assignQuestToCharacter(characterId: number, questId: number, status?: 'active' | 'completed' | 'failed'): CharacterQuest | null;
    getCharacterQuestById(characterQuestId: number): CharacterQuest | null;
    getCharacterActiveQuests(characterId: number): CharacterQuest[];
    updateCharacterQuestStatus(characterQuestId: number, status: 'active' | 'completed' | 'failed', progress?: Record<string, any> | null): CharacterQuest | null;
    close(): void;
}
export {};
//# sourceMappingURL=db.d.ts.map
````

## File: game-state-server/src/db.d.ts.map
````
{"version":3,"file":"db.d.ts","sourceRoot":"","sources":["db.ts"],"names":[],"mappings":"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"}
````

## File: game-state-server/src/db.js.map
````
{"version":3,"file":"db.js","sourceRoot":"","sources":["db.ts"],"names":[],"mappings":"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"}
````

## File: game-state-server/src/enhanced-db-schema.sql
````sql
-- Enhanced Database Schema for Complete D&D 5e Combat
-- Adds spatial positioning and advanced action economy

-- Enhanced NPCs table with complete action economy
ALTER TABLE npcs ADD COLUMN legendary_actions TEXT; -- JSON array of legendary actions
ALTER TABLE npcs ADD COLUMN legendary_actions_per_round INTEGER DEFAULT 0;
ALTER TABLE npcs ADD COLUMN legendary_resistance_uses INTEGER DEFAULT 0;
ALTER TABLE npcs ADD COLUMN lair_actions TEXT; -- JSON array of lair actions
ALTER TABLE npcs ADD COLUMN multiattack_actions TEXT; -- Enhanced multiattack definition
ALTER TABLE npcs ADD COLUMN reaction_abilities TEXT; -- JSON array of reactions
ALTER TABLE npcs ADD COLUMN has_lair BOOLEAN DEFAULT FALSE;

-- Enhanced encounters table with spatial and advanced timing
ALTER TABLE encounters ADD COLUMN lair_actions_data TEXT; -- JSON array
ALTER TABLE encounters ADD COLUMN lair_action_used BOOLEAN DEFAULT FALSE;
ALTER TABLE encounters ADD COLUMN current_reactions TEXT; -- JSON tracking reactions this round

-- Enhanced participants table with complete action economy
ALTER TABLE encounter_participants ADD COLUMN legendary_actions_remaining INTEGER DEFAULT 0;
ALTER TABLE encounter_participants ADD COLUMN legendary_resistance_remaining INTEGER DEFAULT 0;
ALTER TABLE encounter_participants ADD COLUMN reaction_used BOOLEAN DEFAULT FALSE;
ALTER TABLE encounter_participants ADD COLUMN reaction_available TEXT; -- JSON
ALTER TABLE encounter_participants ADD COLUMN turn_actions TEXT; -- JSON: current turn action economy

-- Spatial positioning tables
CREATE TABLE IF NOT EXISTS battlefield_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  width INTEGER NOT NULL,      -- Grid width
  height INTEGER NOT NULL,     -- Grid height
  terrain_data TEXT,           -- JSON: terrain features
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

CREATE TABLE IF NOT EXISTS creature_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  participant_type TEXT NOT NULL,
  x INTEGER NOT NULL,          -- Grid X coordinate
  y INTEGER NOT NULL,          -- Grid Y coordinate  
  z INTEGER DEFAULT 0,         -- Elevation in feet
  facing INTEGER,              -- Direction facing (0-7, cardinal + diagonal)
  size_category TEXT,          -- 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

CREATE TABLE IF NOT EXISTS terrain_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  feature_type TEXT NOT NULL,  -- 'wall', 'pillar', 'pit', 'stairs', etc.
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  elevation INTEGER DEFAULT 0,
  blocks_movement BOOLEAN DEFAULT FALSE,
  blocks_los BOOLEAN DEFAULT FALSE,
  cover_type TEXT DEFAULT 'none', -- 'none', 'half', 'three_quarters', 'total'
  properties TEXT,             -- JSON: additional properties
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

CREATE TABLE IF NOT EXISTS area_effects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  effect_name TEXT NOT NULL,
  shape TEXT NOT NULL,         -- 'sphere', 'cube', 'cone', 'line', 'cylinder'
  center_x INTEGER NOT NULL,
  center_y INTEGER NOT NULL,
  center_z INTEGER DEFAULT 0,
  size_parameter INTEGER,      -- Radius for sphere, side for cube, etc.
  direction INTEGER,           -- For cones and lines
  duration_rounds INTEGER,
  effect_data TEXT,            -- JSON: effect details
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

-- Action history tracking
CREATE TABLE IF NOT EXISTS action_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'action', 'reaction', 'legendary_action', etc.
  action_details TEXT, -- JSON
  timing TEXT, -- 'on_turn', 'end_of_turn', 'initiative_20', 'triggered'
  trigger_event TEXT, -- What triggered this action
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Special initiative entries (for lair actions)
CREATE TABLE IF NOT EXISTS initiative_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  initiative_value INTEGER NOT NULL,
  entry_type TEXT NOT NULL, -- 'participant', 'lair_action'
  participant_id INTEGER, -- NULL for lair actions
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Spatial relationship caching for performance
CREATE TABLE IF NOT EXISTS spatial_relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battlefield_state_id INTEGER NOT NULL,
  creature1_id INTEGER NOT NULL,
  creature2_id INTEGER NOT NULL,
  distance_feet INTEGER NOT NULL,
  has_line_of_sight BOOLEAN NOT NULL,
  cover_type TEXT NOT NULL,
  range_category TEXT NOT NULL, -- 'melee', 'close', 'medium', 'long', 'extreme'
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (battlefield_state_id) REFERENCES battlefield_states(id)
);

-- Reaction triggers and timing
CREATE TABLE IF NOT EXISTS reaction_triggers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  trigger_type TEXT NOT NULL,
  triggering_participant_id INTEGER,
  triggering_action TEXT,
  available_reactions TEXT, -- JSON: list of available reactions
  resolved BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id)
);

-- Enhanced indexes for performance
CREATE INDEX IF NOT EXISTS idx_battlefield_encounter ON battlefield_states(encounter_id);
CREATE INDEX IF NOT EXISTS idx_positions_battlefield ON creature_positions(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_positions_participant ON creature_positions(participant_id, participant_type);
CREATE INDEX IF NOT EXISTS idx_terrain_battlefield ON terrain_features(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_effects_battlefield ON area_effects(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_action_history_encounter ON action_history(encounter_id, round_number);
CREATE INDEX IF NOT EXISTS idx_initiative_entries_encounter ON initiative_entries(encounter_id);
CREATE INDEX IF NOT EXISTS idx_spatial_relationships_battlefield ON spatial_relationships(battlefield_state_id);
CREATE INDEX IF NOT EXISTS idx_reaction_triggers_encounter ON reaction_triggers(encounter_id, resolved);
````

## File: game-state-server/src/monsters.d.ts
````typescript
export declare const MONSTER_TEMPLATES: {
    bandit: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        challenge_rating: number;
        experience_value: number;
    };
    goblin: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        abilities: string;
        challenge_rating: number;
        experience_value: number;
    };
    skeleton: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        abilities: string;
        challenge_rating: number;
        experience_value: number;
    };
    wolf: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        abilities: string;
        challenge_rating: number;
        experience_value: number;
    };
    zombie: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        abilities: string;
        challenge_rating: number;
        experience_value: number;
    };
    orc: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        abilities: string;
        challenge_rating: number;
        experience_value: number;
    };
    dire_wolf: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        abilities: string;
        challenge_rating: number;
        experience_value: number;
    };
    ogre: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        challenge_rating: number;
        experience_value: number;
    };
    guard: {
        name: string;
        creature_type: string;
        size: string;
        max_hp: number;
        armor_class: number;
        speed: number;
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
        proficiency_bonus: number;
        initiative_modifier: number;
        attacks: string;
        challenge_rating: number;
        experience_value: number;
    };
};
export declare function rollHitDice(notation: string): number;
export declare function getAbilityModifier(score: number): number;
//# sourceMappingURL=monsters.d.ts.map
````

## File: game-state-server/src/monsters.d.ts.map
````
{"version":3,"file":"monsters.d.ts","sourceRoot":"","sources":["monsters.ts"],"names":[],"mappings":"AACA,eAAO,MAAM,iBAAiB;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CAyO7B,CAAC;AAGF,wBAAgB,WAAW,CAAC,QAAQ,EAAE,MAAM,GAAG,MAAM,CAcpD;AAGD,wBAAgB,kBAAkB,CAAC,KAAK,EAAE,MAAM,GAAG,MAAM,CAExD"}
````

## File: game-state-server/src/monsters.js
````javascript
// Monster templates for common creatures
export const MONSTER_TEMPLATES = {
    // CR 1/8
    bandit: {
        name: 'Bandit',
        creature_type: 'humanoid',
        size: 'medium',
        max_hp: 11,
        armor_class: 12,
        speed: 30,
        strength: 11,
        dexterity: 12,
        constitution: 12,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        proficiency_bonus: 2,
        initiative_modifier: 1,
        attacks: JSON.stringify([
            { name: 'Scimitar', bonus: 3, damage: '1d6+1', type: 'slashing' },
            { name: 'Light Crossbow', bonus: 3, damage: '1d8+1', type: 'piercing', range: 80 }
        ]),
        challenge_rating: 0.125,
        experience_value: 25
    },
    // CR 1/4
    goblin: {
        name: 'Goblin',
        creature_type: 'humanoid',
        size: 'small',
        max_hp: 7,
        armor_class: 15,
        speed: 30,
        strength: 8,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 8,
        charisma: 8,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Scimitar', bonus: 4, damage: '1d6+2', type: 'slashing' },
            { name: 'Shortbow', bonus: 4, damage: '1d6+2', type: 'piercing', range: 80 }
        ]),
        abilities: JSON.stringify({
            'Nimble Escape': 'Can take Disengage or Hide as bonus action'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    skeleton: {
        name: 'Skeleton',
        creature_type: 'undead',
        size: 'medium',
        max_hp: 13,
        armor_class: 13,
        speed: 30,
        strength: 10,
        dexterity: 14,
        constitution: 15,
        intelligence: 6,
        wisdom: 8,
        charisma: 5,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Shortsword', bonus: 4, damage: '1d6+2', type: 'piercing' },
            { name: 'Shortbow', bonus: 4, damage: '1d6+2', type: 'piercing', range: 80 }
        ]),
        abilities: JSON.stringify({
            'Damage Vulnerabilities': 'Bludgeoning',
            'Damage Immunities': 'Poison',
            'Condition Immunities': 'Exhaustion, Poisoned'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    wolf: {
        name: 'Wolf',
        creature_type: 'beast',
        size: 'medium',
        max_hp: 11,
        armor_class: 13,
        speed: 40,
        strength: 12,
        dexterity: 15,
        constitution: 12,
        intelligence: 3,
        wisdom: 12,
        charisma: 6,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Bite', bonus: 4, damage: '2d4+2', type: 'piercing', special: 'DC 11 STR save or knocked prone' }
        ]),
        abilities: JSON.stringify({
            'Keen Hearing and Smell': 'Advantage on Perception checks using hearing or smell',
            'Pack Tactics': 'Advantage on attacks if ally is within 5 ft of target'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    zombie: {
        name: 'Zombie',
        creature_type: 'undead',
        size: 'medium',
        max_hp: 22,
        armor_class: 8,
        speed: 20,
        strength: 13,
        dexterity: 6,
        constitution: 16,
        intelligence: 3,
        wisdom: 6,
        charisma: 5,
        proficiency_bonus: 2,
        initiative_modifier: -2,
        attacks: JSON.stringify([
            { name: 'Slam', bonus: 3, damage: '1d6+1', type: 'bludgeoning' }
        ]),
        abilities: JSON.stringify({
            'Undead Fortitude': 'If reduced to 0 HP, make CON save (DC = 5 + damage taken). Success = 1 HP instead',
            'Damage Immunities': 'Poison',
            'Condition Immunities': 'Poisoned'
        }),
        challenge_rating: 0.25,
        experience_value: 50
    },
    // CR 1/2
    orc: {
        name: 'Orc',
        creature_type: 'humanoid',
        size: 'medium',
        max_hp: 15,
        armor_class: 13,
        speed: 30,
        strength: 16,
        dexterity: 12,
        constitution: 16,
        intelligence: 7,
        wisdom: 11,
        charisma: 10,
        proficiency_bonus: 2,
        initiative_modifier: 1,
        attacks: JSON.stringify([
            { name: 'Greataxe', bonus: 5, damage: '1d12+3', type: 'slashing' },
            { name: 'Javelin', bonus: 5, damage: '1d6+3', type: 'piercing', range: 30 }
        ]),
        abilities: JSON.stringify({
            'Aggressive': 'Can move up to speed toward hostile creature as bonus action'
        }),
        challenge_rating: 0.5,
        experience_value: 100
    },
    // CR 1
    dire_wolf: {
        name: 'Dire Wolf',
        creature_type: 'beast',
        size: 'large',
        max_hp: 37,
        armor_class: 14,
        speed: 50,
        strength: 17,
        dexterity: 15,
        constitution: 15,
        intelligence: 3,
        wisdom: 12,
        charisma: 7,
        proficiency_bonus: 2,
        initiative_modifier: 2,
        attacks: JSON.stringify([
            { name: 'Bite', bonus: 5, damage: '2d6+3', type: 'piercing', special: 'DC 13 STR save or knocked prone' }
        ]),
        abilities: JSON.stringify({
            'Keen Hearing and Smell': 'Advantage on Perception checks using hearing or smell',
            'Pack Tactics': 'Advantage on attacks if ally is within 5 ft of target'
        }),
        challenge_rating: 1,
        experience_value: 200
    },
    // CR 2
    ogre: {
        name: 'Ogre',
        creature_type: 'giant',
        size: 'large',
        max_hp: 59,
        armor_class: 11,
        speed: 40,
        strength: 19,
        dexterity: 8,
        constitution: 16,
        intelligence: 5,
        wisdom: 7,
        charisma: 7,
        proficiency_bonus: 2,
        initiative_modifier: -1,
        attacks: JSON.stringify([
            { name: 'Greatclub', bonus: 6, damage: '2d8+4', type: 'bludgeoning' },
            { name: 'Javelin', bonus: 6, damage: '2d6+4', type: 'piercing', range: 30 }
        ]),
        challenge_rating: 2,
        experience_value: 450
    },
    // Guards and soldiers
    guard: {
        name: 'Guard',
        creature_type: 'humanoid',
        size: 'medium',
        max_hp: 11,
        armor_class: 16,
        speed: 30,
        strength: 13,
        dexterity: 12,
        constitution: 12,
        intelligence: 10,
        wisdom: 11,
        charisma: 10,
        proficiency_bonus: 2,
        initiative_modifier: 1,
        attacks: JSON.stringify([
            { name: 'Spear', bonus: 3, damage: '1d6+1', type: 'piercing', versatile: '1d8+1' }
        ]),
        challenge_rating: 0.125,
        experience_value: 25
    }
};
// Helper function to roll hit dice
export function rollHitDice(notation) {
    const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match)
        return 10; // default
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || '0');
    let total = modifier;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return Math.max(1, total); // Minimum 1 HP
}
// Helper to calculate ability modifier
export function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}
//# sourceMappingURL=monsters.js.map
````

## File: game-state-server/src/monsters.js.map
````
{"version":3,"file":"monsters.js","sourceRoot":"","sources":["monsters.ts"],"names":[],"mappings":"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"}
````

## File: game-state-server/src/monsters.ts
````typescript
// Monster templates for common creatures
export const MONSTER_TEMPLATES = {
  // CR 1/8
  bandit: {
    name: 'Bandit',
    creature_type: 'humanoid',
    size: 'medium',
    max_hp: 11,
    armor_class: 12,
    speed: 30,
    strength: 11,
    dexterity: 12,
    constitution: 12,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    proficiency_bonus: 2,
    initiative_modifier: 1,
    attacks: JSON.stringify([
      { name: 'Scimitar', bonus: 3, damage: '1d6+1', type: 'slashing' },
      { name: 'Light Crossbow', bonus: 3, damage: '1d8+1', type: 'piercing', range: 80 }
    ]),
    challenge_rating: 0.125,
    experience_value: 25
  },
  
  // CR 1/4
  goblin: {
    name: 'Goblin',
    creature_type: 'humanoid',
    size: 'small',
    max_hp: 7,
    armor_class: 15,
    speed: 30,
    strength: 8,
    dexterity: 14,
    constitution: 10,
    intelligence: 10,
    wisdom: 8,
    charisma: 8,
    proficiency_bonus: 2,
    initiative_modifier: 2,
    attacks: JSON.stringify([
      { name: 'Scimitar', bonus: 4, damage: '1d6+2', type: 'slashing' },
      { name: 'Shortbow', bonus: 4, damage: '1d6+2', type: 'piercing', range: 80 }
    ]),
    abilities: JSON.stringify({
      'Nimble Escape': 'Can take Disengage or Hide as bonus action'
    }),
    challenge_rating: 0.25,
    experience_value: 50
  },
  
  skeleton: {
    name: 'Skeleton',
    creature_type: 'undead',
    size: 'medium',
    max_hp: 13,
    armor_class: 13,
    speed: 30,
    strength: 10,
    dexterity: 14,
    constitution: 15,
    intelligence: 6,
    wisdom: 8,
    charisma: 5,
    proficiency_bonus: 2,
    initiative_modifier: 2,
    attacks: JSON.stringify([
      { name: 'Shortsword', bonus: 4, damage: '1d6+2', type: 'piercing' },
      { name: 'Shortbow', bonus: 4, damage: '1d6+2', type: 'piercing', range: 80 }
    ]),
    abilities: JSON.stringify({
      'Damage Vulnerabilities': 'Bludgeoning',
      'Damage Immunities': 'Poison',
      'Condition Immunities': 'Exhaustion, Poisoned'
    }),
    challenge_rating: 0.25,
    experience_value: 50
  },
  
  wolf: {
    name: 'Wolf',
    creature_type: 'beast',
    size: 'medium',
    max_hp: 11,
    armor_class: 13,
    speed: 40,
    strength: 12,
    dexterity: 15,
    constitution: 12,
    intelligence: 3,
    wisdom: 12,
    charisma: 6,
    proficiency_bonus: 2,
    initiative_modifier: 2,
    attacks: JSON.stringify([
      { name: 'Bite', bonus: 4, damage: '2d4+2', type: 'piercing', special: 'DC 11 STR save or knocked prone' }
    ]),
    abilities: JSON.stringify({
      'Keen Hearing and Smell': 'Advantage on Perception checks using hearing or smell',
      'Pack Tactics': 'Advantage on attacks if ally is within 5 ft of target'
    }),
    challenge_rating: 0.25,
    experience_value: 50
  },
  
  zombie: {
    name: 'Zombie',
    creature_type: 'undead',
    size: 'medium',
    max_hp: 22,
    armor_class: 8,
    speed: 20,
    strength: 13,
    dexterity: 6,
    constitution: 16,
    intelligence: 3,
    wisdom: 6,
    charisma: 5,
    proficiency_bonus: 2,
    initiative_modifier: -2,
    attacks: JSON.stringify([
      { name: 'Slam', bonus: 3, damage: '1d6+1', type: 'bludgeoning' }
    ]),
    abilities: JSON.stringify({
      'Undead Fortitude': 'If reduced to 0 HP, make CON save (DC = 5 + damage taken). Success = 1 HP instead',
      'Damage Immunities': 'Poison',
      'Condition Immunities': 'Poisoned'
    }),
    challenge_rating: 0.25,
    experience_value: 50
  },
  
  // CR 1/2
  orc: {
    name: 'Orc',
    creature_type: 'humanoid',
    size: 'medium',
    max_hp: 15,
    armor_class: 13,
    speed: 30,
    strength: 16,
    dexterity: 12,
    constitution: 16,
    intelligence: 7,
    wisdom: 11,
    charisma: 10,
    proficiency_bonus: 2,
    initiative_modifier: 1,
    attacks: JSON.stringify([
      { name: 'Greataxe', bonus: 5, damage: '1d12+3', type: 'slashing' },
      { name: 'Javelin', bonus: 5, damage: '1d6+3', type: 'piercing', range: 30 }
    ]),
    abilities: JSON.stringify({
      'Aggressive': 'Can move up to speed toward hostile creature as bonus action'
    }),
    challenge_rating: 0.5,
    experience_value: 100
  },
  
  // CR 1
  dire_wolf: {
    name: 'Dire Wolf',
    creature_type: 'beast',
    size: 'large',
    max_hp: 37,
    armor_class: 14,
    speed: 50,
    strength: 17,
    dexterity: 15,
    constitution: 15,
    intelligence: 3,
    wisdom: 12,
    charisma: 7,
    proficiency_bonus: 2,
    initiative_modifier: 2,
    attacks: JSON.stringify([
      { name: 'Bite', bonus: 5, damage: '2d6+3', type: 'piercing', special: 'DC 13 STR save or knocked prone' }
    ]),
    abilities: JSON.stringify({
      'Keen Hearing and Smell': 'Advantage on Perception checks using hearing or smell',
      'Pack Tactics': 'Advantage on attacks if ally is within 5 ft of target'
    }),
    challenge_rating: 1,
    experience_value: 200
  },
  
  // CR 2
  ogre: {
    name: 'Ogre',
    creature_type: 'giant',
    size: 'large',
    max_hp: 59,
    armor_class: 11,
    speed: 40,
    strength: 19,
    dexterity: 8,
    constitution: 16,
    intelligence: 5,
    wisdom: 7,
    charisma: 7,
    proficiency_bonus: 2,
    initiative_modifier: -1,
    attacks: JSON.stringify([
      { name: 'Greatclub', bonus: 6, damage: '2d8+4', type: 'bludgeoning' },
      { name: 'Javelin', bonus: 6, damage: '2d6+4', type: 'piercing', range: 30 }
    ]),
    challenge_rating: 2,
    experience_value: 450
  },
  
  // Guards and soldiers
  guard: {
    name: 'Guard',
    creature_type: 'humanoid',
    size: 'medium',
    max_hp: 11,
    armor_class: 16,
    speed: 30,
    strength: 13,
    dexterity: 12,
    constitution: 12,
    intelligence: 10,
    wisdom: 11,
    charisma: 10,
    proficiency_bonus: 2,
    initiative_modifier: 1,
    attacks: JSON.stringify([
      { name: 'Spear', bonus: 3, damage: '1d6+1', type: 'piercing', versatile: '1d8+1' }
    ]),
    challenge_rating: 0.125,
    experience_value: 25
  }
};

// Helper function to roll hit dice
export function rollHitDice(notation: string): number {
  const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) return 10; // default
  
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = parseInt(match[3] || '0');
  
  let total = modifier;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  
  return Math.max(1, total); // Minimum 1 HP
}

// Helper to calculate ability modifier
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}
````

## File: game-state-server/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
````

## File: quick-start-guide.md
````markdown
# AI Dungeon Master - Quick Start Guide

## Creating Your First Character

Ask the AI Dungeon Master:
> "I want to create a human fighter named Marcus"

The DM will use the `create_character` tool to set up your character with appropriate stats.

## Starting an Adventure

> "I'm ready to start my adventure. Where am I?"

The DM will set the scene and begin your story.

## Combat Example

When you encounter enemies:
> "I attack the goblin with my sword!"

The DM will:
1. Use `attack_roll` to determine if you hit
2. Use `damage_roll` to calculate damage
3. Track HP using `update_character`
4. Describe the action cinematically

## Inventory Management

> "I search the goblin's body"

The DM will use `add_item` to add any loot to your inventory.

## Checking Status

> "Show me my character sheet"

The DM will use `get_character` and `get_inventory` to display your current status.

## Tips for Best Experience

1. Be descriptive in your actions
2. Ask questions about your surroundings
3. Interact with NPCs
4. Make creative use of your abilities
5. The DM will handle all the mechanics - just focus on roleplaying!

## Example Commands the DM Uses

- **Creating a character**: `create_character({ name: "Marcus", class: "Fighter", stats: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 8 }})`
- **Rolling initiative**: `roll_dice({ notation: "1d20+2", reason: "Marcus initiative" })`
- **Making an attack**: `attack_roll({ attacker: "Marcus", target: "Goblin", modifier: 5 })`
- **Dealing damage**: `damage_roll({ notation: "1d8+3", damage_type: "slashing" })`
- **Adding loot**: `add_item({ character_id: 1, item_name: "Health Potion", item_type: "consumable", quantity: 2 })`

Have fun adventuring!
````

## File: rebuild.bat
````
@echo off
echo Rebuilding RPG MCP Servers after fixes...
echo.

echo Building Game State Server...
cd game-state-server
call npm run build
echo.

echo Building Combat Engine Server...
cd ../combat-engine-server
call npm run build
echo.

cd ..
echo Build complete!
pause
````

## File: roll-examples.md
````markdown
# Roll Examples - Old vs New

## Ability Check with Advantage

### ❌ Old Way (Confusing)
```
User: "I want to make a Perception check with advantage"
DM: "Roll 2d20kh1+5"
Result: Unclear what happened, notation is cryptic
```

### ✅ New Way (Clear)
```
User: "I want to make a Perception check with advantage"
DM uses: roll_check(character="Thorin", ability="Perception", modifier=5, advantage=true)
Result: 
{
  "character": "Thorin",
  "ability": "Perception",
  "total": 23,
  "rolls": [18, 11],
  "kept": [18],
  "advantage": true
}
```

## Attack Roll Comparison

### ❌ Old Attack with Advantage
```
attack_roll(modifier=5, advantage=true)
Result: Rolled 1d20+5 twice, then added modifiers to both (wrong!)
Total could be inflated by double modifier
```

### ✅ New Attack with Advantage  
```
attack_roll(modifier=5, advantage=true)
Result: 
{
  "total": 18,        // Only one modifier added
  "d20": 13,          // The d20 that was kept
  "allRolls": [13, 7], // Both d20s shown
  "advantage": true
}
```

## Direct Dice Notation

### Now Supports Standard D&D Notation
- `1d20` - Simple roll
- `3d6+2` - Multiple dice with modifier
- `2d20kh1` - Keep highest (advantage)
- `2d20kl1` - Keep lowest (disadvantage)
- `4d6kh3` - Roll 4d6, keep highest 3 (ability scores)

### Example: Rolling for Stats
```
roll_dice("4d6kh3")
Result: rolled [6, 4, 4, 2], kept [6, 4, 4] = 14
```

## Why This Matters

1. **Follows D&D 5e Rules**: Advantage/disadvantage work correctly
2. **Clear Output**: See all rolls and understand what happened
3. **Flexible Options**: Use simple tools or advanced notation
4. **Better for Storytelling**: DM can focus on narrative, not math

## Quick Reference

**For Ability Checks**: Use `roll_check`
**For Attacks**: Use `attack_roll` 
**For Damage**: Use `damage_roll`
**For Anything Else**: Use `roll_dice` with notation
````

## File: setup.bat
````
@echo off
echo Setting up RPG MCP Servers...
echo.

echo Installing Game State Server dependencies...
cd game-state-server
call npm install
call npm run build
echo Game State Server ready!
echo.

echo Installing Combat Engine Server dependencies...
cd ../combat-engine-server
call npm install
call npm run build
echo Combat Engine Server ready!
echo.

cd ..
echo.
echo Setup complete! The servers are ready to use.
echo.
echo To use the AI Dungeon Master mode:
echo 1. Open Roo Code
echo 2. Go to Prompts tab (icon in top menu)
echo 3. Click "Create New Mode" 
echo 4. Import the settings from dungeon-master-mode.json
echo.
echo Or ask Roo to create the custom mode for you!
echo.
pause
````

## File: test-checklist.txt
````
#!/bin/bash
# Test script for RPG MCP servers
# Run this after building to verify everything works

echo "Testing RPG MCP Servers..."
echo "=========================="
echo ""

echo "1. Testing Game State Server"
echo "   - Create character"
echo "   - Add items"
echo "   - Update item"
echo "   - Remove item"
echo ""

echo "2. Testing Combat Engine"
echo "   - Basic roll: 1d20+5"
echo "   - Advantage: 2d20kh1+5"
echo "   - Disadvantage: 2d20kl1+5"
echo "   - New roll_check tool"
echo ""

echo "3. Testing in Roo Code:"
echo "   Ask: 'Create a dwarf fighter named Thorin with 16 strength'"
echo "   Ask: 'Thorin makes a Perception check with advantage'"
echo "   Ask: 'Add a longsword to Thorin's inventory'"
echo "   Ask: 'Thorin attacks a goblin'"
echo ""

echo "4. Expected Results:"
echo "   - Character created with proper stats"
echo "   - Advantage shows both d20 rolls"
echo "   - Items can be added/removed/updated"
echo "   - Combat mechanics work correctly"
echo ""

echo "If any tests fail, check:"
echo "   - Servers are built (dist folders exist)"
echo "   - Roo Code was restarted"
echo "   - MCP servers show as connected"
echo "   - No TypeScript errors in build"
````

## File: update-summary.md
````markdown
# RPG MCP Servers - Update Summary

## 🔧 Fixed Issues

### 1. **Inventory Management**
Added missing tools to game-state server:
- `remove_item` - Remove items from inventory by ID
- `update_item` - Update item quantity or equipped status

Now you can fully manage inventory:
```
# Add a sword
add_item: { character_id: 1, item_name: "Longsword", quantity: 1 }

# Equip the sword (using the item's ID from inventory)
update_item: { item_id: 1, equipped: true }

# Use a potion (reduce quantity)
update_item: { item_id: 2, quantity: 1 }  // from 2 to 1

# Remove an item completely
remove_item: { item_id: 3 }
```

### 2. **Fixed Advantage/Disadvantage Mechanics**
Corrected D&D 5e rules implementation:
- **Before**: Roll 1d20+mod twice, compare totals (wrong)
- **After**: Roll 2d20, take highest/lowest, THEN add modifier (correct)

Example output now shows all rolls:
```json
{
  "total": 17,          // Final result (d20 + modifier)
  "d20": 15,           // The d20 that was used
  "modifier": 2,       // Modifier added once
  "allRolls": [15, 8], // Both d20s rolled
  "advantage": true,
  "critical": false,
  "fumble": false
}
```

### 3. **Added Initiative Roll**
New tool for combat management:
- `initiative_roll` - Roll initiative with character name and modifier
- Returns structured data for easy sorting

## 📝 Updated Tool Lists

### Game State Server Tools:
- create_character
- get_character
- get_character_by_name
- list_characters
- update_character
- add_item
- get_inventory
- **remove_item** (NEW)
- **update_item** (NEW)
- save_world_state
- get_world_state

### Combat Engine Tools:
- roll_dice
- attack_roll (FIXED)
- **initiative_roll** (NEW)
- damage_roll
- saving_throw
- get_combat_log
- clear_combat_log

## 🚀 To Apply Updates

1. Rebuild the servers:
   ```bash
   cd C:\Users\mnehm\AppData\Roaming\Roo-Code\MCP\rpg-mcp-servers
   rebuild.bat
   ```

2. Restart Roo Code and Claude Desktop

3. The updated tools will be immediately available!

## ✅ Testing the Fixes

### Test Inventory Management:
```
1. Add a healing potion (quantity: 3)
2. Use one potion (update quantity to 2)
3. Remove empty vial from inventory
```

### Test Combat Mechanics:
```
1. Roll attack with advantage
2. Check that it shows both d20 rolls
3. Verify only one modifier is added to the final total
```

The servers now properly support full D&D 5e mechanics!
````

## File: combat-engine-server/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext", 
    "moduleResolution": "NodeNext", 
    "outDir": "./dist",
    "rootDirs": [
      "./src"
    ],
    "noEmitOnError": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
````

## File: dungeon-master-mode.json
````json
{
  "customModes": [
    {
      "slug": "dungeon-master",
      "name": "🐉 AI Dungeon Master",
      "roleDefinition": "You are an expert Dungeon Master running an immersive D&D 5e style adventure game. You create engaging narratives, memorable NPCs, and challenging encounters while maintaining game balance and player agency. You excel at improvisation and adapting to player choices.",
      "groups": ["read", "edit", "mcp"],
      "customInstructions": "IMPORTANT: You have access to two MCP servers for game management:\n\n1. **rpg-game-state** - For persistent character and world data:\n   - create_character: Create new characters with stats\n   - get_character: Retrieve character information by ID\n   - get_character_by_name: Find character by name\n   - list_characters: View all created characters\n   - update_character: Modify character stats/level/HP\n   - add_item: Add items to inventory\n   - get_inventory: View character inventory\n   - remove_item: Remove items from inventory\n   - update_item: Change item quantity or equipped status\n   - save_world_state: Save location, NPCs, and events\n   - get_world_state: Retrieve saved world state\n\n2. **rpg-combat-engine** - For combat mechanics:\n   - roll_dice: Roll any dice (e.g., '1d20+5', '2d20kh1+5' for advantage)\n   - roll_check: Simplified ability/skill checks with advantage/disadvantage\n   - attack_roll: Make attack rolls with advantage/disadvantage\n   - initiative_roll: Roll initiative for turn order\n   - damage_roll: Calculate damage (supports critical hits)\n   - saving_throw: Make saving throws against DCs\n   - get_combat_log: Review recent combat actions\n   - clear_combat_log: Clear the combat history\n\nGAME FLOW:\n1. Always check character stats before describing actions\n2. Use combat engine for ALL dice rolls\n3. Track HP, inventory, and story progress\n4. Create immersive descriptions while respecting mechanics\n5. Give players meaningful choices\n6. Balance challenge with fun\n\nNARRATIVE STYLE:\n- Use vivid, sensory descriptions\n- Give NPCs distinct personalities and voices\n- Create atmosphere appropriate to the scene\n- React dynamically to player choices\n- Maintain narrative consistency with stored world state\n\nCOMBAT:\n- Always use combat engine tools\n- Roll initiative at combat start\n- Describe actions cinematically\n- Track initiative order\n- Apply status effects appropriately\n- Make combat tactical and engaging"
    }
  ]
}
````

## File: game-state-server/src/db.js
````javascript
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { MONSTER_TEMPLATES, getAbilityModifier } from './monsters.js';
// Create data directory in user's home folder
const DATA_DIR = join(homedir(), '.rpg-dungeon-data');
if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}
const DB_PATH = join(DATA_DIR, 'game-state.db');
export class GameDatabase {
    db;
    constructor() {
        this.db = new Database(DB_PATH);
        this.db.pragma('journal_mode = WAL');
        this.initializeSchema();
    }
    initializeSchema() {
        // Characters table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        class TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        current_hp INTEGER,
        max_hp INTEGER,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        gold INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_played DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // NPCs table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS npcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'enemy',
        creature_type TEXT,
        size TEXT DEFAULT 'medium',
        current_hp INTEGER NOT NULL,
        max_hp INTEGER NOT NULL,
        armor_class INTEGER NOT NULL,
        speed INTEGER DEFAULT 30,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        proficiency_bonus INTEGER DEFAULT 2,
        initiative_modifier INTEGER DEFAULT 0,
        attacks TEXT,
        abilities TEXT,
        conditions TEXT,
        is_alive BOOLEAN DEFAULT TRUE,
        challenge_rating REAL DEFAULT 0,
        experience_value INTEGER DEFAULT 0,
        template_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Encounters table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        current_round INTEGER DEFAULT 0,
        current_turn INTEGER DEFAULT 0,
        environment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);
        // Encounter participants table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounter_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encounter_id INTEGER NOT NULL,
        participant_type TEXT NOT NULL,
        participant_id INTEGER NOT NULL,
        initiative INTEGER NOT NULL,
        initiative_order INTEGER,
        has_acted BOOLEAN DEFAULT FALSE,
        conditions TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (encounter_id) REFERENCES encounters(id)
      )
    `);
        // Inventory table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_type TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        equipped BOOLEAN DEFAULT FALSE,
        properties TEXT, -- JSON string
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);
        // Story progress table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS story_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        chapter TEXT NOT NULL,
        scene TEXT NOT NULL,
        description TEXT,
        flags TEXT, -- JSON string
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);
        // World state table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        location TEXT NOT NULL,
        npcs TEXT, -- JSON string
        events TEXT, -- JSON string
        environment TEXT, -- JSON string
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);
        // Combat log table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS combat_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        action TEXT NOT NULL,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
            )
          `);
        // Quests table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              objectives TEXT, -- JSON string, e.g., [{id: "obj1", text: "Do X", completed: false}]
              rewards TEXT,    -- JSON string, e.g., {gold: 100, exp: 50, items: ["item_id_1"]}
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
        // Character Quests table (join table)
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS character_quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              character_id INTEGER NOT NULL,
              quest_id INTEGER NOT NULL,
              status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'
              progress TEXT, -- JSON string for detailed objective tracking
              assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
              FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
              UNIQUE (character_id, quest_id)
            )
          `);
        // Create indexes
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_inventory_character ON inventory(character_id);
      CREATE INDEX IF NOT EXISTS idx_story_character ON story_progress(character_id);
      CREATE INDEX IF NOT EXISTS idx_world_character ON world_state(character_id);
      CREATE INDEX IF NOT EXISTS idx_combat_character ON combat_log(character_id);
      CREATE INDEX IF NOT EXISTS idx_npc_type ON npcs(type);
      CREATE INDEX IF NOT EXISTS idx_npc_alive ON npcs(is_alive);
      CREATE INDEX IF NOT EXISTS idx_encounter_character ON encounters(character_id);
      CREATE INDEX IF NOT EXISTS idx_encounter_status ON encounters(status);
      CREATE INDEX IF NOT EXISTS idx_participants_encounter ON encounter_participants(encounter_id);
      CREATE INDEX IF NOT EXISTS idx_participants_order ON encounter_participants(encounter_id, initiative_order);
      CREATE INDEX IF NOT EXISTS idx_quests_title ON quests(title);
      CREATE INDEX IF NOT EXISTS idx_character_quests_character_id ON character_quests(character_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_quest_id ON character_quests(quest_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_status ON character_quests(status);
    `);
    }
    // Character operations
    createCharacter(data) {
        const maxHp = 10 + (data.constitution || 10);
        const stmt = this.db.prepare(`
      INSERT INTO characters (
        name, class, max_hp, current_hp,
        strength, dexterity, constitution,
        intelligence, wisdom, charisma
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(data.name, data.class, maxHp, maxHp, data.strength || 10, data.dexterity || 10, data.constitution || 10, data.intelligence || 10, data.wisdom || 10, data.charisma || 10);
        return this.getCharacter(result.lastInsertRowid);
    }
    getCharacter(id) {
        const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?');
        return stmt.get(id);
    }
    getCharacterByName(name) {
        const stmt = this.db.prepare('SELECT * FROM characters WHERE name = ?');
        return stmt.get(name);
    }
    listCharacters() {
        const stmt = this.db.prepare('SELECT * FROM characters ORDER BY last_played DESC');
        return stmt.all();
    }
    updateCharacter(id, updates) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const stmt = this.db.prepare(`
      UPDATE characters 
      SET ${setClause}, last_played = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
        stmt.run(...values, id);
        return this.getCharacter(id);
    }
    // Inventory operations
    addItem(characterId, item) {
        const stmt = this.db.prepare(`
      INSERT INTO inventory (character_id, item_name, item_type, quantity, properties, equipped)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(
            characterId,
            item.name,
            item.type || 'misc',
            item.quantity || 1,
            item.properties ? JSON.stringify(item.properties) : null,
            item.equipped ? 1 : 0  // Convert boolean to integer for SQLite
        );
        return { id: result.lastInsertRowid, ...item };
    }
    getInventory(characterId) {
        const stmt = this.db.prepare(`
      SELECT * FROM inventory WHERE character_id = ? ORDER BY item_type, item_name
    `);
        const items = stmt.all(characterId);
        return items.map((item) => ({
            ...item,
            properties: item.properties ? JSON.parse(item.properties) : null
        }));
    }
    updateItem(id, updates) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
        stmt.run(...values, id);
    }
    removeItem(id) {
        const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
        stmt.run(id);
    }
    // Story operations
    saveStoryProgress(characterId, data) {
        const stmt = this.db.prepare(`
      INSERT INTO story_progress (character_id, chapter, scene, description, flags)
      VALUES (?, ?, ?, ?, ?)
    `);
        stmt.run(characterId, data.chapter, data.scene, data.description || null, data.flags ? JSON.stringify(data.flags) : null);
    }
    getLatestStoryProgress(characterId) {
        const stmt = this.db.prepare(`
      SELECT * FROM story_progress 
      WHERE character_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);
        const result = stmt.get(characterId);
        if (result && result.flags) {
            result.flags = JSON.parse(result.flags);
        }
        return result;
    }
    // World state operations
    saveWorldState(characterId, data) {
        // Check if world state exists
        const existing = this.db.prepare('SELECT id FROM world_state WHERE character_id = ?').get(characterId);
        if (existing) {
            // Update existing
            const stmt = this.db.prepare(`
        UPDATE world_state 
        SET location = ?, npcs = ?, events = ?, environment = ?, last_updated = CURRENT_TIMESTAMP
        WHERE character_id = ?
      `);
            stmt.run(data.location, data.npcs ? JSON.stringify(data.npcs) : null, data.events ? JSON.stringify(data.events) : null, data.environment ? JSON.stringify(data.environment) : null, characterId);
        }
        else {
            // Insert new
            const stmt = this.db.prepare(`
        INSERT INTO world_state (character_id, location, npcs, events, environment)
        VALUES (?, ?, ?, ?, ?)
      `);
            stmt.run(characterId, data.location, data.npcs ? JSON.stringify(data.npcs) : null, data.events ? JSON.stringify(data.events) : null, data.environment ? JSON.stringify(data.environment) : null);
        }
    }
    getWorldState(characterId) {
        const stmt = this.db.prepare('SELECT * FROM world_state WHERE character_id = ?');
        const result = stmt.get(characterId);
        if (result) {
            if (result.npcs)
                result.npcs = JSON.parse(result.npcs);
            if (result.events)
                result.events = JSON.parse(result.events);
            if (result.environment)
                result.environment = JSON.parse(result.environment);
        }
        return result;
    }
    // Combat log operations
    logCombat(characterId, sessionId, action, result) {
        const stmt = this.db.prepare(`
      INSERT INTO combat_log (character_id, session_id, action, result)
      VALUES (?, ?, ?, ?)
    `);
        stmt.run(characterId, sessionId, action, result || null);
    }
    getCombatLog(characterId, sessionId) {
        if (sessionId) {
            const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ? AND session_id = ?
        ORDER BY timestamp
      `);
            return stmt.all(characterId, sessionId);
        }
        else {
            const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ?
        ORDER BY timestamp DESC
        LIMIT 50
      `);
            return stmt.all(characterId);
        }
    }
    // NPC operations
    createNPC(data) {
        let npcData = {
            name: data.name,
            type: data.type || 'enemy'
        };
        // Apply template if specified
        if (data.template && MONSTER_TEMPLATES[data.template]) {
            const template = MONSTER_TEMPLATES[data.template];
            npcData = { ...template, ...npcData };
        }
        // Apply custom stats
        if (data.customStats) {
            npcData = { ...npcData, ...data.customStats };
        }
        // Ensure required fields
        if (!npcData.max_hp)
            npcData.max_hp = 10;
        if (!npcData.current_hp)
            npcData.current_hp = npcData.max_hp;
        if (!npcData.armor_class)
            npcData.armor_class = 10;
        // Calculate initiative modifier if not set
        if (npcData.initiative_modifier === undefined) {
            npcData.initiative_modifier = getAbilityModifier(npcData.dexterity || 10);
        }
        const stmt = this.db.prepare(`
      INSERT INTO npcs (
        name, type, creature_type, size, current_hp, max_hp, armor_class, speed,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        proficiency_bonus, initiative_modifier, attacks, abilities, conditions,
        challenge_rating, experience_value, template_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
        // Serialize complex objects to JSON if they are not already strings
        const attacksValue = typeof npcData.attacks === 'object' && npcData.attacks !== null
            ? JSON.stringify(npcData.attacks)
            : npcData.attacks || null;
        const abilitiesValue = typeof npcData.abilities === 'object' && npcData.abilities !== null
            ? JSON.stringify(npcData.abilities)
            : npcData.abilities || null;
        const conditionsValue = typeof npcData.conditions === 'object' && npcData.conditions !== null
            ? JSON.stringify(npcData.conditions)
            : npcData.conditions || null;
        const result = stmt.run(npcData.name, npcData.type, npcData.creature_type || null, npcData.size || 'medium', npcData.current_hp, npcData.max_hp, npcData.armor_class, npcData.speed || 30, npcData.strength || 10, npcData.dexterity || 10, npcData.constitution || 10, npcData.intelligence || 10, npcData.wisdom || 10, npcData.charisma || 10, npcData.proficiency_bonus || 2, npcData.initiative_modifier, attacksValue, abilitiesValue, conditionsValue, npcData.challenge_rating || 0, npcData.experience_value || 0, data.template || null);
        return this.getNPC(result.lastInsertRowid);
    }
    createNPCGroup(template, count, namePrefix) {
        const npcs = [];
        const prefix = namePrefix || MONSTER_TEMPLATES[template]?.name || 'NPC';
        for (let i = 1; i <= count; i++) {
            const npc = this.createNPC({
                name: `${prefix} ${i}`,
                template: template
            });
            npcs.push(npc);
        }
        return npcs;
    }
    getNPC(id) {
        const stmt = this.db.prepare('SELECT * FROM npcs WHERE id = ?');
        const npc = stmt.get(id);
        if (npc) {
            // Parse JSON fields
            if (npc.attacks)
                npc.attacks = JSON.parse(npc.attacks);
            if (npc.abilities)
                npc.abilities = JSON.parse(npc.abilities);
            if (npc.conditions)
                npc.conditions = JSON.parse(npc.conditions);
        }
        return npc;
    }
    listNPCs(type, aliveOnly = true) {
        let query = 'SELECT * FROM npcs WHERE 1=1';
        const params = [];
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        if (aliveOnly) {
            query += ' AND is_alive = TRUE';
        }
        query += ' ORDER BY name';
        const stmt = this.db.prepare(query);
        const npcs = stmt.all(...params);
        return npcs.map((npc) => {
            if (npc.attacks)
                npc.attacks = JSON.parse(npc.attacks);
            if (npc.abilities)
                npc.abilities = JSON.parse(npc.abilities);
            if (npc.conditions)
                npc.conditions = JSON.parse(npc.conditions);
            return npc;
        });
    }
    updateNPC(id, updates) {
        // Handle JSON fields
        if (updates.attacks && typeof updates.attacks === 'object') {
            updates.attacks = JSON.stringify(updates.attacks);
        }
        if (updates.abilities && typeof updates.abilities === 'object') {
            updates.abilities = JSON.stringify(updates.abilities);
        }
        if (updates.conditions && typeof updates.conditions === 'object') {
            updates.conditions = JSON.stringify(updates.conditions);
        }
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
        stmt.run(...values, id);
        return this.getNPC(id);
    }
    removeNPC(id) {
        const stmt = this.db.prepare('DELETE FROM npcs WHERE id = ?');
        stmt.run(id);
    }
    // Encounter operations
    createEncounter(data) {
        const stmt = this.db.prepare(`
      INSERT INTO encounters (character_id, name, description, environment)
      VALUES (?, ?, ?, ?)
    `);
        const result = stmt.run(data.character_id, data.name, data.description || null, data.environment || null);
        return this.getEncounter(result.lastInsertRowid);
    }
    getEncounter(id) {
        const stmt = this.db.prepare('SELECT * FROM encounters WHERE id = ?');
        return stmt.get(id);
    }
    getActiveEncounter(characterId) {
        const stmt = this.db.prepare(`
      SELECT * FROM encounters 
      WHERE character_id = ? AND status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
        return stmt.get(characterId);
    }
    addEncounterParticipant(encounterId, type, participantId, initiative) {
        const stmt = this.db.prepare(`
      INSERT INTO encounter_participants (encounter_id, participant_type, participant_id, initiative)
      VALUES (?, ?, ?, ?)
    `);
        stmt.run(encounterId, type, participantId, initiative);
        // Recalculate initiative order
        this.updateInitiativeOrder(encounterId);
    }
    updateInitiativeOrder(encounterId) {
        // Get all participants sorted by initiative (descending)
        const participants = this.db.prepare(`
      SELECT id, initiative FROM encounter_participants 
      WHERE encounter_id = ? AND is_active = TRUE
      ORDER BY initiative DESC
    `).all(encounterId);
        // Update initiative order
        const updateStmt = this.db.prepare(`
      UPDATE encounter_participants SET initiative_order = ? WHERE id = ?
    `);
        participants.forEach((p, index) => {
            updateStmt.run(index + 1, p.id);
        });
    }
    getEncounterParticipants(encounterId) {
        const stmt = this.db.prepare(`
      SELECT ep.*, 
        CASE 
          WHEN ep.participant_type = 'character' THEN c.name
          WHEN ep.participant_type = 'npc' THEN n.name
        END as name,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.current_hp
          WHEN ep.participant_type = 'npc' THEN n.current_hp
        END as current_hp,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.max_hp
          WHEN ep.participant_type = 'npc' THEN n.max_hp
        END as max_hp
      FROM encounter_participants ep
      LEFT JOIN characters c ON ep.participant_type = 'character' AND ep.participant_id = c.id
      LEFT JOIN npcs n ON ep.participant_type = 'npc' AND ep.participant_id = n.id
      WHERE ep.encounter_id = ? AND ep.is_active = TRUE
      ORDER BY ep.initiative_order
    `);
        return stmt.all(encounterId);
    }
    nextTurn(encounterId) {
        const encounter = this.getEncounter(encounterId);
        if (!encounter || encounter.status !== 'active')
            return null;
        // Get active participants
        const participants = this.getEncounterParticipants(encounterId);
        if (participants.length === 0)
            return null;
        // Mark current participant as having acted
        if (encounter.current_turn > 0) {
            const currentParticipant = participants.find((p) => p.initiative_order === encounter.current_turn);
            if (currentParticipant) {
                this.db.prepare(`
          UPDATE encounter_participants SET has_acted = TRUE WHERE id = ?
        `).run(currentParticipant.id);
            }
        }
        // Find next participant
        let nextTurn = encounter.current_turn + 1;
        // If we've gone through all participants, start new round
        if (nextTurn > participants.length) {
            nextTurn = 1;
            encounter.current_round += 1;
            // Reset has_acted for all participants
            this.db.prepare(`
        UPDATE encounter_participants 
        SET has_acted = FALSE 
        WHERE encounter_id = ?
      `).run(encounterId);
        }
        // Update encounter
        this.db.prepare(`
      UPDATE encounters 
      SET current_turn = ?, current_round = ? 
      WHERE id = ?
    `).run(nextTurn, encounter.current_round, encounterId);
        // Return the participant whose turn it is
        return participants.find((p) => p.initiative_order === nextTurn);
    }
    endEncounter(id, outcome = 'completed') {
        const stmt = this.db.prepare(`
      UPDATE encounters 
      SET status = ?, ended_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
        stmt.run(outcome, id);
    }
    applyDamage(targetType, targetId, damage) {
        let stmt;
        if (targetType === 'character') {
            stmt = this.db.prepare(`
        UPDATE characters 
        SET current_hp = MAX(0, current_hp - ?) 
        WHERE id = ?
      `);
        }
        else if (targetType === 'npc') {
            stmt = this.db.prepare(`
        UPDATE npcs 
        SET current_hp = MAX(0, current_hp - ?),
            is_alive = CASE WHEN current_hp - ? <= 0 THEN FALSE ELSE TRUE END
        WHERE id = ?
      `);
            stmt.run(damage, damage, targetId);
            // Check if NPC died and remove from active encounters
            const npc = this.getNPC(targetId);
            if (npc && !npc.is_alive) {
                this.db.prepare(`
          UPDATE encounter_participants 
          SET is_active = FALSE 
          WHERE participant_type = 'npc' AND participant_id = ?
        `).run(targetId);
            }
            return npc;
        }
        if (stmt && targetType === 'character') {
            stmt.run(damage, targetId);
            return this.getCharacter(targetId);
        }
    }
    // Quest Operations
    addQuest(data) {
        const stmt = this.db.prepare(`
      INSERT INTO quests (title, description, objectives, rewards)
      VALUES (?, ?, ?, ?)
    `);
        const result = stmt.run(data.title, data.description, JSON.stringify(data.objectives), JSON.stringify(data.rewards));
        return this.getQuestById(result.lastInsertRowid);
    }
    getQuestById(id) {
        const stmt = this.db.prepare('SELECT * FROM quests WHERE id = ?');
        const quest = stmt.get(id);
        if (quest) {
            // objectives and rewards are stored as JSON, parse them if needed by caller
            // For now, return as stored. Parsing can be done in handler or by caller.
        }
        return quest || null;
    }
    assignQuestToCharacter(characterId, questId, status = 'active') {
        // Check if character and quest exist
        const character = this.getCharacter(characterId);
        if (!character)
            throw new Error(`Character with ID ${characterId} not found.`);
        const quest = this.getQuestById(questId);
        if (!quest)
            throw new Error(`Quest with ID ${questId} not found.`);
        const stmt = this.db.prepare(`
      INSERT INTO character_quests (character_id, quest_id, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(character_id, quest_id) DO UPDATE SET
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
      WHERE character_quests.status != 'completed' AND character_quests.status != 'failed'
            OR excluded.status = 'active' -- Allow re-activating if previously completed/failed for some reason
    `);
        const result = stmt.run(characterId, questId, status);
        if (result.changes > 0) {
            // Need to get the ID of the inserted/updated row.
            // If it was an insert, result.lastInsertRowid works.
            // If it was an update due to conflict, we need to query it.
            const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
            const cq = cqStmt.get(characterId, questId);
            return cq ? this.getCharacterQuestById(cq.id) : null;
        }
        // If no changes, it means the quest was already completed/failed and we tried to assign it as active again without override.
        // Or some other edge case. Return existing record.
        const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
        const cq = cqStmt.get(characterId, questId);
        return cq ? this.getCharacterQuestById(cq.id) : null;
    }
    getCharacterQuestById(characterQuestId) {
        const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.id = ?
    `);
        const cq = stmt.get(characterQuestId);
        if (cq) {
            // Parse JSON fields
            if (cq.objectives)
                cq.objectives = JSON.parse(cq.objectives);
            if (cq.rewards)
                cq.rewards = JSON.parse(cq.rewards);
            if (cq.progress)
                cq.progress = JSON.parse(cq.progress);
        }
        return cq || null;
    }
    getCharacterActiveQuests(characterId) {
        const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.character_id = ? AND cq.status = 'active'
      ORDER BY cq.assigned_at DESC
    `);
        const quests = stmt.all(characterId);
        return quests.map(q => {
            if (q.objectives)
                q.objectives = JSON.parse(q.objectives);
            if (q.rewards)
                q.rewards = JSON.parse(q.rewards);
            if (q.progress)
                q.progress = JSON.parse(q.progress);
            return q;
        });
    }
    updateCharacterQuestStatus(characterQuestId, status, progress) {
        const fieldsToUpdate = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
        const values = [status];
        if (progress !== undefined) {
            fieldsToUpdate.push('progress = ?');
            values.push(progress ? JSON.stringify(progress) : null);
        }
        values.push(characterQuestId);
        const stmt = this.db.prepare(`
      UPDATE character_quests
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = ?
    `);
        const result = stmt.run(...values);
        if (result.changes > 0) {
            return this.getCharacterQuestById(characterQuestId);
        }
        return null; // Or throw error if not found/not updated
    }
    close() {
        this.db.close();
    }
}
//# sourceMappingURL=db.js.map
````

## File: combat-engine-server/src/index.ts
````typescript
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

// Create server
const server = new Server({
  name: 'rpg-combat-engine-server',
  version: '2.0.0',
}, {
  capabilities: { 
    tools: {},
  },
});

// Enhanced tool definitions
const toolDefinitions = [
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
  },
  // Human-readable battlefield description tools
  {
    name: 'describe_battlefield',
    description: 'Get a human-readable overview of the entire battlefield with terrain and creature positions',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'describe_detailed_tactical_situation',
    description: 'Get an enhanced narrative description of a creature\'s tactical situation',
    inputSchema: {
      type: 'object',
      properties: {
        creature_id: { type: 'string' }
      },
      required: ['creature_id']
    }
  },
  {
    name: 'generate_battlefield_map',
    description: 'Generate an ASCII map visualization of the battlefield',
    inputSchema: { type: 'object', properties: {} }
  },
  // Batch Operations for Efficiency
  {
    name: 'batch_place_creatures',
    description: 'Place multiple creatures on the battlefield at once',
    inputSchema: {
      type: 'object',
      properties: {
        creatures: {
          type: 'array',
          items: {
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
        }
      },
      required: ['creatures']
    }
  },
  {
    name: 'batch_move_creatures',
    description: 'Move multiple creatures at once',
    inputSchema: {
      type: 'object',
      properties: {
        movements: {
          type: 'array',
          items: {
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
        }
      },
      required: ['movements']
    }
  },
  {
    name: 'batch_attack_rolls',
    description: 'Make multiple attack rolls at once',
    inputSchema: {
      type: 'object',
      properties: {
        attacks: {
          type: 'array',
          items: {
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
        }
      },
      required: ['attacks']
    }
  },
  {
    name: 'batch_damage_rolls',
    description: 'Roll damage for multiple attacks at once',
    inputSchema: {
      type: 'object',
      properties: {
        damage_rolls: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              notation: { type: 'string' },
              damage_type: { type: 'string' },
              critical: { type: 'boolean' },
              source: { type: 'string', description: 'What caused this damage (optional)' }
            },
            required: ['notation', 'damage_type']
          }
        }
      },
      required: ['damage_rolls']
    }
  },
  {
    name: 'batch_saving_throws',
    description: 'Make multiple saving throws at once',
    inputSchema: {
      type: 'object',
      properties: {
        saves: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              character: { type: 'string' },
              ability: { type: 'string' },
              dc: { type: 'number' },
              modifier: { type: 'number' }
            },
            required: ['character', 'ability', 'dc', 'modifier']
          }
        }
      },
      required: ['saves']
    }
  }
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

// Enhanced tool request handler
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      // Original dice rolling tools (enhanced)
      case 'roll_dice': {
        const result = rollDice((args as any).notation);
        const reason = (args as any).reason || 'Dice roll';
        
        let output = `🎲 ${reason.toUpperCase()}\n\n`;
        output += `🎯 Roll: ${(args as any).notation}\n`;
        
        if (result.kept) {
          output += `🎲 Rolled: [${result.rolls.join(', ')}]\n`;
          output += `✨ Kept: [${result.kept.join(', ')}] ${result.kept.length === 1 ? (result.kept[0] === Math.max(...result.rolls) ? '(HIGHEST)' : '(LOWEST)') : ''}\n`;
        } else {
          output += `🎲 Rolled: [${result.rolls.join(', ')}]\n`;
        }
        
        if (result.modifier !== 0) {
          output += `➕ Modifier: ${result.modifier > 0 ? '+' : ''}${result.modifier}\n`;
        }
        
        output += `🏆 TOTAL: ${result.total}`;
        
        // Add special roll indicators
        if (result.rolls.includes(20)) output += ` 🎉`;
        if (result.rolls.includes(1)) output += ` 💥`;
        
        let logEntry: string;
        if (result.kept) {
          logEntry = `${reason}: ${(args as any).notation} = rolled [${result.rolls.join(', ')}], kept [${result.kept.join(', ')}]${result.modifier !== 0 ? (result.modifier > 0 ? '+' : '') + result.modifier : ''} = ${result.total}`;
        } else {
          logEntry = `${reason}: ${(args as any).notation} = ${result.rolls.join('+')}${result.modifier !== 0 ? (result.modifier > 0 ? '+' : '') + result.modifier : ''} = ${result.total}`;
        }
        
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: output }]
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
          const available = Array.from(battlefield.creatures.keys()).join(', ');
          return {
            content: [{ type: 'text', text: `❌ CREATURE NOT FOUND\n\nOne or both creatures not found on battlefield.\n🔍 Available creatures: ${available || 'none'}` }],
            isError: true
          };
        }
        
        const los = spatialEngine.calculateLineOfSight(fromCreature.position, toCreature.position);
        const distance = spatialEngine.getDistance(fromCreature.position, toCreature.position);
        const rangeCategory = spatialEngine.getRangeCategory(distance);
        
        let output = `👁️ LINE OF SIGHT CHECK\n\n`;
        output += `🎯 ${fromCreature.name} ➤ ${toCreature.name}\n\n`;
        output += `📏 Distance: ${Math.round(distance)}ft (${rangeCategory} range)\n`;
        
        if (los.hasLineOfSight) {
          output += `👁️ Line of Sight: ✅ CLEAR\n`;
        } else {
          output += `👁️ Line of Sight: ❌ BLOCKED\n`;
        }
        
        output += `🛡️ Cover: ${los.coverType === 'none' ? 'No cover' : los.coverType.replace('_', ' ') + ' cover'}\n`;
        
        if (los.blockedBy && los.blockedBy.length > 0) {
          output += `🚧 Blocked by: ${los.blockedBy.join(', ')}\n`;
        }
        
        // Add tactical advice
        output += `\n🎯 TACTICAL SUMMARY:\n`;
        if (los.hasLineOfSight) {
          if (los.coverType === 'none') {
            output += `✨ Perfect shot! No penalties to attack rolls.`;
          } else if (los.coverType === 'half') {
            output += `🛡️ Target has half cover (+2 AC and Dex saves).`;
          } else if (los.coverType === 'three_quarters') {
            output += `🛡️ Target has 3/4 cover (+5 AC and Dex saves).`;
          }
        } else {
          output += `❌ Cannot target with spells or ranged attacks.`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
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
        const battlefield = spatialEngine.getBattlefieldState();
        
        let output = `💥 AREA EFFECT TARGETING\n\n`;
        output += `📍 Center: (${center_x}, ${center_y}, ${center_z})\n`;
        output += `🔶 Shape: ${shape.charAt(0).toUpperCase() + shape.slice(1)}\n`;
        output += `📏 Size: ${size} feet`;
        
        if (direction !== undefined) {
          output += `\n🧭 Direction: ${direction}°`;
        }
        
        output += `\n\n🎯 TARGETS CAUGHT IN EFFECT:\n`;
        
        if (targets.length === 0) {
          output += `❌ No creatures in the affected area.\n`;
        } else {
          targets.forEach((targetId, index) => {
            const creature = battlefield.creatures.get(targetId);
            if (creature) {
              const distance = spatialEngine.getDistance(creature.position, areaEffect.center);
              output += `${index + 1}. 👹 ${creature.name} at (${creature.position.x},${creature.position.y},${creature.position.z}) - ${Math.round(distance)}ft from center\n`;
            }
          });
        }
        
        output += `\n📊 SUMMARY: ${targets.length} creature${targets.length !== 1 ? 's' : ''} affected`;
        
        if (targets.length > 0) {
          output += `\n💡 *Remember to roll saving throws for each target!*`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_tactical_summary': {
        const { creature_id } = args as any;
        
        const battlefield = spatialEngine.getBattlefieldState();
        const creature = battlefield.creatures.get(creature_id);
        
        if (!creature) {
          const available = Array.from(battlefield.creatures.keys()).join(', ');
          return {
            content: [{ type: 'text', text: `❌ CREATURE NOT FOUND\n\nCreature "${creature_id}" not found on battlefield.\n🔍 Available creatures: ${available || 'none'}` }],
            isError: true
          };
        }
        
        const description = spatialEngine.describeTacticalSituation(creature_id);
        const flanked = spatialEngine.isCreatureFlanked(creature_id);
        
        let output = `🎯 TACTICAL SUMMARY\n\n`;
        output += `👤 Creature: ${creature.name}\n`;
        output += `📍 Position: (${creature.position.x}, ${creature.position.y}, ${creature.position.z})\n`;
        output += `📏 Size: ${creature.size.category}\n`;
        output += `🏃 Speed: ${creature.speed}ft\n`;
        output += `🤏 Reach: ${creature.reach}ft\n\n`;
        
        output += `🔍 SITUATION ANALYSIS:\n${description}\n\n`;
        
        if (flanked) {
          output += `⚠️ WARNING: This creature is FLANKED! Enemies have advantage on melee attacks.\n\n`;
        }
        
        // Add quick combat tips
        output += `💡 TACTICAL TIPS:\n`;
        if (flanked) {
          output += `• 🏃 Consider repositioning to break flanking\n`;
        }
        output += `• 🎯 Use ranged attacks for safer positioning\n`;
        output += `• 🛡️ Look for cover to improve AC/saves`;
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'check_flanking': {
        const { creature_id } = args as any;
        
        const battlefield = spatialEngine.getBattlefieldState();
        const creature = battlefield.creatures.get(creature_id);
        
        if (!creature) {
          const available = Array.from(battlefield.creatures.keys()).join(', ');
          return {
            content: [{ type: 'text', text: `❌ CREATURE NOT FOUND\n\nCreature "${creature_id}" not found on battlefield.\n🔍 Available creatures: ${available || 'none'}` }],
            isError: true
          };
        }
        
        const flanked = spatialEngine.isCreatureFlanked(creature_id);
        
        let output = `🎯 FLANKING CHECK\n\n`;
        output += `👤 Creature: ${creature.name}\n`;
        output += `📍 Position: (${creature.position.x}, ${creature.position.y}, ${creature.position.z})\n\n`;
        
        if (flanked) {
          output += `⚠️ FLANKED: YES!\n`;
          output += `📊 Effect: Enemies have advantage on melee attack rolls\n`;
          output += `🎲 Sneak Attack: Rogues can use sneak attack (if applicable)\n\n`;
          output += `💡 TACTICAL ADVICE:\n`;
          output += `• 🏃 Move to break flanking positioning\n`;
          output += `• 🛡️ Use Disengage action to avoid opportunity attacks\n`;
          output += `• 🎯 Consider using ranged attacks or spells`;
        } else {
          output += `✅ FLANKED: NO\n`;
          output += `🛡️ Status: Secure positioning - no flanking advantage for enemies\n\n`;
          output += `💡 TACTICAL ADVICE:\n`;
          output += `• 💪 Good positioning - maintain your stance\n`;
          output += `• ⚔️ Look for opportunities to flank enemies\n`;
          output += `• 🎯 You can attack normally without disadvantage`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'check_height_advantage': {
        const { attacker_id, target_id } = args as any;
        
        const battlefield = spatialEngine.getBattlefieldState();
        const attacker = battlefield.creatures.get(attacker_id);
        const target = battlefield.creatures.get(target_id);
        
        if (!attacker || !target) {
          const available = Array.from(battlefield.creatures.keys()).join(', ');
          return {
            content: [{ type: 'text', text: `❌ CREATURES NOT FOUND\n\nOne or both creatures not found on battlefield.\n🔍 Available creatures: ${available || 'none'}` }],
            isError: true
          };
        }
        
        const hasAdvantage = spatialEngine.hasHeightAdvantage(attacker_id, target_id);
        const heightDiff = attacker.position.z - target.position.z;
        
        let output = `🏔️ HEIGHT ADVANTAGE CHECK\n\n`;
        output += `⚔️ Attacker: ${attacker.name} at height ${attacker.position.z}ft\n`;
        output += `🎯 Target: ${target.name} at height ${target.position.z}ft\n`;
        output += `📏 Height Difference: ${Math.abs(heightDiff)}ft`;
        
        if (heightDiff > 0) {
          output += ` (attacker higher)\n\n`;
        } else if (heightDiff < 0) {
          output += ` (target higher)\n\n`;
        } else {
          output += ` (same level)\n\n`;
        }
        
        if (hasAdvantage) {
          output += `✅ HEIGHT ADVANTAGE: YES!\n`;
          output += `🎲 Effect: Attacker has advantage on attack rolls\n`;
          output += `💪 Bonus: +2 bonus to ranged attacks (optional rule)\n\n`;
          output += `💡 TACTICAL BENEFITS:\n`;
          output += `• 🎯 Roll twice, take higher result\n`;
          output += `• 🏹 Better angle for ranged attacks\n`;
          output += `• 👁️ Improved line of sight over obstacles`;
        } else {
          output += `❌ HEIGHT ADVANTAGE: NO\n`;
          
          if (heightDiff < 0) {
            output += `⚠️ Disadvantage: Target is higher - they might have advantage!\n\n`;
            output += `💡 SUGGESTIONS:\n`;
            output += `• 🧗 Find higher ground if possible\n`;
            output += `• 🎯 Use spells that don't require attack rolls\n`;
            output += `• 🛡️ Seek cover from elevated attacks`;
          } else {
            output += `📊 Status: Normal attack rolls (no height modifier)\n\n`;
            output += `💡 SUGGESTIONS:\n`;
            output += `• 🧗 Look for elevated positions nearby\n`;
            output += `• 🎯 Standard combat tactics apply`;
          }
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      // Original tools with enhanced logging
      case 'roll_check': {
        const { character, ability, modifier, advantage, disadvantage, dc } = args as any;
        
        let notation = advantage ? '2d20kh1' : disadvantage ? '2d20kl1' : '1d20';
        notation += modifier >= 0 ? `+${modifier}` : `${modifier}`;
        
        const result = rollDice(notation);
        const success = dc ? result.total >= dc : null;
        
        let output = `🎯 ${ability.toUpperCase()} CHECK\n\n`;
        output += `👤 Character: ${character}\n`;
        output += `🎲 Roll: ${notation}`;
        
        if (advantage) output += ` ✨ ADVANTAGE`;
        if (disadvantage) output += ` 🌩️ DISADVANTAGE`;
        
        output += `\n`;
        
        if (result.kept) {
          output += `🎲 Rolled: [${result.rolls.join(', ')}]\n`;
          output += `✨ Used: ${result.kept[0]} ${result.kept[0] === Math.max(...result.rolls) ? '(HIGHEST)' : '(LOWEST)'}\n`;
        } else {
          output += `🎲 Rolled: ${result.rolls[0]}\n`;
        }
        
        output += `➕ Modifier: ${modifier >= 0 ? '+' : ''}${modifier}\n`;
        output += `🏆 TOTAL: ${result.total}`;
        
        // Add difficulty assessment for context
        if (dc) {
          const margin = result.total - dc;
          output += `\n🎯 DC: ${dc}\n`;
          output += `📊 RESULT: ${success ? '✅ SUCCESS!' : '❌ FAILURE!'}`;
          if (success && margin >= 10) {
            output += ` 🌟 CRITICAL SUCCESS! (beat DC by ${margin})`;
          } else if (success && margin >= 5) {
            output += ` 🎉 Solid Success! (beat DC by ${margin})`;
          } else if (!success && margin >= -5) {
            output += ` 😤 Close Call! (missed by ${Math.abs(margin)})`;
          } else if (!success) {
            output += ` 💥 Clear Failure (missed by ${Math.abs(margin)})`;
          }
        } else {
          // No DC - give context based on the roll
          if (result.total >= 20) output += ` 🌟 EXCEPTIONAL!`;
          else if (result.total >= 15) output += ` 🎉 GREAT ROLL!`;
          else if (result.total >= 10) output += ` 👍 DECENT`;
          else if (result.total >= 5) output += ` 😬 LOW`;
          else output += ` 💥 TERRIBLE`;
        }
        
        const advantageText = advantage ? ' (ADVANTAGE)' : disadvantage ? ' (DISADVANTAGE)' : '';
        const dcText = dc ? ` vs DC ${dc} - ${success ? 'SUCCESS' : 'FAILURE'}` : '';
        const logEntry = `${character} ${ability} check${advantageText}: ${result.total}${dcText}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'initiative_roll': {
        const result = rollDice(`1d20+${(args as any).modifier}`);
        const logEntry = `${(args as any).character} initiative: ${result.total}`;
        combatLog.push(logEntry);
        
        let output = `⚡ INITIATIVE ROLL\n\n`;
        output += `👤 Character: ${(args as any).character}\n`;
        output += `🎲 Rolled: ${result.rolls[0]}\n`;
        if (result.modifier !== 0) {
          output += `➕ Modifier: ${result.modifier >= 0 ? '+' : ''}${result.modifier}\n`;
        }
        output += `🏆 INITIATIVE: ${result.total}`;
        
        if (result.rolls[0] === 20) output += ` 🎉 NATURAL 20!`;
        if (result.rolls[0] === 1) output += ` 💥 NATURAL 1!`;
        
        return {
          content: [{ type: 'text', text: output }]
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
        
        let output = `⚔️ ATTACK ROLL\n\n`;
        output += `👤 ${attacker} ➤ 🎯 ${target}\n\n`;
        
        if (hasAdvantage || hasDisadvantage) {
          output += `🎲 Rolled: [${diceUsed.join(', ')}]\n`;
          output += `✨ Used: ${selectedD20} ${hasAdvantage ? '(HIGHEST)' : '(LOWEST)'}\n`;
          output += `📊 Type: ${hasAdvantage ? '✨ ADVANTAGE' : '🌩️ DISADVANTAGE'}\n`;
        } else {
          output += `🎲 Rolled: ${selectedD20}\n`;
        }
        
        if (modifier !== 0) {
          output += `➕ Modifier: ${modifier >= 0 ? '+' : ''}${modifier}\n`;
        }
        
        output += `🏆 TOTAL: ${finalTotal}`;
        
        if (critical) output += ` 🎉 CRITICAL HIT!`;
        if (fumble) output += ` 💥 CRITICAL MISS!`;
        
        const advantageText = hasAdvantage ? ' (ADVANTAGE)' : hasDisadvantage ? ' (DISADVANTAGE)' : '';
        const logEntry = `${attacker} attacks ${target}: ${finalTotal}${advantageText} ${critical ? '(CRITICAL!)' : fumble ? '(FUMBLE!)' : ''}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'damage_roll': {
        let result = rollDice((args as any).notation);
        if ((args as any).critical) {
          const critRoll = rollDice((args as any).notation);
          result.total += critRoll.total;
          result.rolls = [...result.rolls, ...critRoll.rolls];
        }
        
        let output = `💥 DAMAGE ROLL\n\n`;
        output += `🎲 Roll: ${(args as any).notation}\n`;
        output += `⚡ Type: ${(args as any).damage_type}`;
        if ((args as any).critical) output += ` 🎉 CRITICAL`;
        output += `\n`;
        
        if ((args as any).critical) {
          const normalRolls = result.rolls.slice(0, result.rolls.length / 2);
          const critRolls = result.rolls.slice(result.rolls.length / 2);
          output += `🎲 Normal: [${normalRolls.join(', ')}]\n`;
          output += `🎉 Critical: [${critRolls.join(', ')}]\n`;
        } else {
          output += `🎲 Rolled: [${result.rolls.join(', ')}]\n`;
        }
        
        if (result.modifier !== 0) {
          output += `➕ Modifier: ${result.modifier >= 0 ? '+' : ''}${result.modifier}\n`;
        }
        
        output += `💀 TOTAL DAMAGE: ${result.total} ${(args as any).damage_type}`;
        
        const logEntry = `Damage (${(args as any).damage_type}): ${result.total}${(args as any).critical ? ' (CRITICAL)' : ''}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'saving_throw': {
        const { character, ability, dc, modifier } = args as any;
        const result = rollDice(`1d20+${modifier}`);
        const success = result.total >= dc;
        const margin = result.total - dc;
        
        let output = `🛡️ ${ability.toUpperCase()} SAVING THROW\n\n`;
        output += `👤 Character: ${character}\n`;
        output += `🎲 Rolled: ${result.rolls[0]}\n`;
        if (result.modifier !== 0) {
          output += `➕ Modifier: ${result.modifier >= 0 ? '+' : ''}${result.modifier}\n`;
        }
        output += `🏆 TOTAL: ${result.total}\n`;
        output += `🎯 DC: ${dc}\n`;
        output += `📊 RESULT: ${success ? '✅ SUCCESS!' : '❌ FAILURE!'}`;
        
        // Add contextual feedback
        if (success && margin >= 10) {
          output += ` 🌟 EXCEPTIONAL! (beat DC by ${margin})`;
        } else if (success && margin >= 5) {
          output += ` 🎉 Strong Save! (beat DC by ${margin})`;
        } else if (success) {
          output += ` 😅 Barely Made It! (beat DC by ${margin})`;
        } else if (margin >= -5) {
          output += ` 😤 So Close! (missed by ${Math.abs(margin)})`;
        } else {
          output += ` 💥 Failed Badly (missed by ${Math.abs(margin)})`;
        }
        
        // Add natural 20/1 indicators
        if (result.rolls[0] === 20) output += `\n🎉 NATURAL 20! Auto-success against most effects!`;
        if (result.rolls[0] === 1) output += `\n💥 NATURAL 1! Critical failure!`;
        
        const logEntry = `${character} ${ability} save: ${result.total} vs DC ${dc} - ${success ? 'SUCCESS' : 'FAILURE'}`;
        combatLog.push(logEntry);
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'get_combat_log': {
        const limit = (args as any).limit || 10;
        const recentLog = combatLog.slice(-limit);
        
        if (recentLog.length === 0) {
          return {
            content: [{ type: 'text', text: '📋 COMBAT LOG EMPTY\n\nNo combat actions recorded yet. Start making some moves! ⚔️' }]
          };
        }
        
        let output = '📋 COMBAT LOG (Last ' + Math.min(limit, recentLog.length) + ' entries)\n\n';
        recentLog.forEach((entry, index) => {
          output += `${index + 1}. ${entry}\n`;
        });
        
        if (combatLog.length > limit) {
          output += `\n💡 *Showing last ${limit} of ${combatLog.length} total entries*`;
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'clear_combat_log': {
        combatLog = [];
        return {
          content: [{ type: 'text', text: 'Combat log cleared' }]
        };
      }

      // Human-readable battlefield description tools
      case 'describe_battlefield': {
        const description = spatialEngine.describeBattlefield();
        
        return {
          content: [{ type: 'text', text: description }]
        };
      }

      case 'describe_detailed_tactical_situation': {
        const { creature_id } = args as any;
        
        const description = spatialEngine.describeDetailedTacticalSituation(creature_id);
        
        return {
          content: [{ type: 'text', text: description }]
        };
      }

      case 'generate_battlefield_map': {
        const map = spatialEngine.generateBattlefieldMap();
        
        return {
          content: [{ type: 'text', text: map }]
        };
      }

      // Batch operations
      case 'batch_place_creatures': {
        const { creatures } = args as any;
        const placedCreatures = [];
        
        for (const creatureData of creatures) {
          try {
            const { creature_id, name, x, y, z = 0, size = 'medium', speed = 30, reach = 5 } = creatureData;
            
            const creature = {
              id: creature_id,
              name,
              position: { x, y, z },
              size: { category: size as any, squares: size === 'large' ? 2 : 1 },
              speed,
              reach
            };
            
            spatialEngine.addCreature(creature);
            placedCreatures.push({ success: true, creature_id, name, position: { x, y, z } });
          } catch (error: any) {
            placedCreatures.push({ success: false, creature_id: creatureData.creature_id, error: error.message });
          }
        }
        
        let output = `📍 BATCH CREATURE PLACEMENT COMPLETE!\n\n`;
        const successful = placedCreatures.filter(p => p.success);
        const failed = placedCreatures.filter(p => !p.success);
        
        output += `📊 Results: ${successful.length} placed, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ SUCCESSFULLY PLACED:\n`;
          successful.forEach((result: any, index: number) => {
            output += `${index + 1}. 👹 ${result.name} at (${result.position.x}, ${result.position.y}, ${result.position.z})\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED PLACEMENTS:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. ${result.creature_id}: ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_move_creatures': {
        const { movements } = args as any;
        const moveResults = [];
        
        for (const movement of movements) {
          try {
            const { creature_id, target_x, target_y, target_z = 0, speed } = movement;
            
            const battlefield = spatialEngine.getBattlefieldState();
            const creature = battlefield.creatures.get(creature_id);
            
            if (!creature) {
              moveResults.push({ success: false, creature_id, error: 'Creature not found' });
              continue;
            }
            
            const from = creature.position;
            const to = { x: target_x, y: target_y, z: target_z };
            
            const movementResult = spatialEngine.validateMovement(creature, from, to, speed);
            
            if (movementResult.isValid) {
              spatialEngine.moveCreature(creature_id, to);
              moveResults.push({
                success: true,
                creature_id,
                name: creature.name,
                from,
                to,
                distance: movementResult.pathLength,
                opportunity_attacks: movementResult.opportunityAttacks
              });
            } else {
              moveResults.push({
                success: false,
                creature_id,
                name: creature.name,
                error: `Cannot move - ${movementResult.pathLength > speed ? 'insufficient speed' : 'path blocked'}`
              });
            }
          } catch (error: any) {
            moveResults.push({ success: false, creature_id: movement.creature_id, error: error.message });
          }
        }
        
        let output = `🏃 BATCH CREATURE MOVEMENT COMPLETE!\n\n`;
        const successful = moveResults.filter(m => m.success);
        const failed = moveResults.filter(m => !m.success);
        
        output += `📊 Results: ${successful.length} moved, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `✅ SUCCESSFUL MOVEMENTS:\n`;
          successful.forEach((result: any, index: number) => {
            output += `${index + 1}. 👹 ${result.name}: (${result.from.x},${result.from.y}) → (${result.to.x},${result.to.y}) [${Math.round(result.distance)}ft]\n`;
            if (result.opportunity_attacks.length > 0) {
              output += `   ⚠️ Triggered opportunity attacks: ${result.opportunity_attacks.join(', ')}\n`;
            }
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED MOVEMENTS:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. ${result.name || result.creature_id}: ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_attack_rolls': {
        const { attacks } = args as any;
        const attackResults = [];
        
        for (const attack of attacks) {
          try {
            const { attacker, target, modifier = 0, advantage: hasAdvantage, disadvantage: hasDisadvantage } = attack;

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
            
            attackResults.push({
              success: true,
              attacker,
              target,
              roll: selectedD20,
              modifier,
              total: finalTotal,
              critical,
              fumble,
              advantage: hasAdvantage ? 'advantage' : hasDisadvantage ? 'disadvantage' : 'normal',
              diceUsed: diceUsed.length > 1 ? diceUsed : undefined
            });
            
            const advantageText = hasAdvantage ? ' (ADVANTAGE)' : hasDisadvantage ? ' (DISADVANTAGE)' : '';
            const logEntry = `${attacker} attacks ${target}: ${finalTotal}${advantageText} ${critical ? '(CRITICAL!)' : fumble ? '(FUMBLE!)' : ''}`;
            combatLog.push(logEntry);
            
          } catch (error: any) {
            attackResults.push({
              success: false,
              attacker: attack.attacker,
              target: attack.target,
              error: error.message
            });
          }
        }
        
        let output = `⚔️ BATCH ATTACK ROLLS COMPLETE!\n\n`;
        const successful = attackResults.filter(a => a.success);
        const failed = attackResults.filter(a => !a.success);
        
        output += `📊 Results: ${successful.length} attacks rolled, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `🎲 ATTACK RESULTS:\n`;
          successful.forEach((result: any, index: number) => {
            const advantageIcon = result.advantage === 'advantage' ? ' ✨' : result.advantage === 'disadvantage' ? ' 🌩️' : '';
            const specialIcon = result.critical ? ' 🎉' : result.fumble ? ' 💥' : '';
            const rollText = result.diceUsed ? `[${result.diceUsed.join(', ')}]→${result.roll}` : result.roll;
            output += `${index + 1}. ⚔️ ${result.attacker} → ${result.target}: ${rollText}+${result.modifier} = ${result.total}${advantageIcon}${specialIcon}\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED ATTACKS:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. ${result.attacker} → ${result.target}: ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_damage_rolls': {
        const { damage_rolls } = args as any;
        const damageResults = [];
        
        for (const damageRoll of damage_rolls) {
          try {
            const { notation, damage_type, critical, source } = damageRoll;
            
            let result = rollDice(notation);
            if (critical) {
              const critRoll = rollDice(notation);
              result.total += critRoll.total;
              result.rolls = [...result.rolls, ...critRoll.rolls];
            }
            
            damageResults.push({
              success: true,
              notation,
              damage_type,
              critical: !!critical,
              total: result.total,
              rolls: result.rolls,
              modifier: result.modifier,
              source: source || 'Unknown'
            });
            
            const logEntry = `Damage (${damage_type}): ${result.total}${critical ? ' (CRITICAL)' : ''}${source ? ` from ${source}` : ''}`;
            combatLog.push(logEntry);
            
          } catch (error: any) {
            damageResults.push({
              success: false,
              notation: damageRoll.notation,
              damage_type: damageRoll.damage_type,
              error: error.message
            });
          }
        }
        
        let output = `💥 BATCH DAMAGE ROLLS COMPLETE!\n\n`;
        const successful = damageResults.filter(d => d.success);
        const failed = damageResults.filter(d => !d.success);
        
        output += `📊 Results: ${successful.length} damage rolls, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          output += `🎲 DAMAGE RESULTS:\n`;
          successful.forEach((result: any, index: number) => {
            const critText = result.critical ? ' 🎉 CRITICAL' : '';
            const sourceText = result.source !== 'Unknown' ? ` (${result.source})` : '';
            
            if (result.critical) {
              const normalRolls = result.rolls.slice(0, result.rolls.length / 2);
              const critRolls = result.rolls.slice(result.rolls.length / 2);
              output += `${index + 1}. 💀 ${result.notation}${critText}: [${normalRolls.join(', ')}]+[${critRolls.join(', ')}] = ${result.total} ${result.damage_type}${sourceText}\n`;
            } else {
              output += `${index + 1}. 💀 ${result.notation}: [${result.rolls.join(', ')}] = ${result.total} ${result.damage_type}${sourceText}\n`;
            }
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED DAMAGE ROLLS:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. ${result.notation} (${result.damage_type}): ${result.error}\n`;
          });
        }
        
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'batch_saving_throws': {
        const { saves } = args as any;
        const saveResults = [];
        
        for (const save of saves) {
          try {
            const { character, ability, dc, modifier } = save;
            const result = rollDice(`1d20+${modifier}`);
            const success = result.total >= dc;
            const margin = result.total - dc;
            
            saveResults.push({
              success: true,
              character,
              ability,
              roll: result.rolls[0],
              modifier,
              total: result.total,
              dc,
              passed: success,
              margin,
              natural20: result.rolls[0] === 20,
              natural1: result.rolls[0] === 1
            });
            
            const logEntry = `${character} ${ability} save: ${result.total} vs DC ${dc} - ${success ? 'SUCCESS' : 'FAILURE'}`;
            combatLog.push(logEntry);
            
          } catch (error: any) {
            saveResults.push({
              success: false,
              character: save.character,
              ability: save.ability,
              error: error.message
            });
          }
        }
        
        let output = `🛡️ BATCH SAVING THROWS COMPLETE!\n\n`;
        const successful = saveResults.filter(s => s.success);
        const failed = saveResults.filter(s => !s.success);
        
        output += `📊 Results: ${successful.length} saves rolled, ${failed.length} failed\n\n`;
        
        if (successful.length > 0) {
          const passed = successful.filter(s => s.passed);
          const failedSaves = successful.filter(s => !s.passed);
          
          output += `🎲 SAVING THROW RESULTS:\n`;
          output += `✅ Passed: ${passed.length} | ❌ Failed: ${failedSaves.length}\n\n`;
          
          successful.forEach((result: any, index: number) => {
            const successIcon = result.passed ? '✅' : '❌';
            const specialIcon = result.natural20 ? ' 🎉' : result.natural1 ? ' 💥' : '';
            const marginText = result.passed ? `(+${result.margin})` : `(-${Math.abs(result.margin)})`;
            
            output += `${index + 1}. ${successIcon} ${result.character} ${result.ability}: ${result.roll}+${result.modifier} = ${result.total} vs DC${result.dc} ${marginText}${specialIcon}\n`;
          });
        }
        
        if (failed.length > 0) {
          output += `\n❌ FAILED SAVING THROWS:\n`;
          failed.forEach((result: any, index: number) => {
            output += `${index + 1}. ${result.character} ${result.ability}: ${result.error}\n`;
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
console.error('Enhanced RPG Combat Engine MCP Server v2.0 running on stdio');
````

## File: game-state-server/src/db.ts
````typescript
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { homedir } from 'os';
import { MONSTER_TEMPLATES, rollHitDice, getAbilityModifier } from './monsters.js';

// Define interfaces for Monster Templates
interface MonsterAttack {
  name: string;
  bonus: number;
  damage: string;
  type: string;
  range?: number;
  special?: string;
  versatile?: string;
}

interface MonsterTemplate {
  name: string;
  creature_type: string;
  size: string;
  max_hp: number;
  armor_class: number;
  speed: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiency_bonus: number;
  initiative_modifier: number;
  attacks: string; // JSON string of MonsterAttack[]
  abilities?: string; // JSON string of Record<string, string>
  challenge_rating: number;
  experience_value: number;
  'Damage Vulnerabilities'?: string;
  'Damage Immunities'?: string;
  'Condition Immunities'?: string;
}

type MonsterTemplatesCollection = Record<string, MonsterTemplate>;

// Define EncounterParticipant locally to avoid import issues for now
// Ideally, this would be in a shared types.ts file
interface EncounterParticipant {
  id: number;
  encounter_id: number;
  participant_type: 'character' | 'npc';
  participant_id: number;
  initiative: number;
  initiative_order?: number | null;
  has_acted: boolean;
  conditions?: string | null;
  is_active: boolean;
  // Properties from JOIN
  name: string;
  current_hp: number;
  max_hp: number;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  objectives: string; // JSON string
  rewards: string; // JSON string
  created_at: string;
}

interface CharacterQuest {
  id: number;
  character_id: number;
  quest_id: number;
  status: 'active' | 'completed' | 'failed';
  progress?: string | null; // JSON string for detailed objective tracking
  assigned_at: string;
  updated_at: string;
  // Properties from JOIN with quests table
  title?: string;
  description?: string;
  objectives?: string; // JSON string
  rewards?: string; // JSON string
}

// Create data directory in user's home folder
const DATA_DIR = join(homedir(), '.rpg-dungeon-data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = join(DATA_DIR, 'game-state.db');

export class GameDatabase {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  private initializeSchema() {
    // Characters table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        class TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        current_hp INTEGER,
        max_hp INTEGER,
        armor_class INTEGER DEFAULT 10,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        gold INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_played DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // NPCs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS npcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'enemy',
        creature_type TEXT,
        size TEXT DEFAULT 'medium',
        current_hp INTEGER NOT NULL,
        max_hp INTEGER NOT NULL,
        armor_class INTEGER NOT NULL,
        speed INTEGER DEFAULT 30,
        strength INTEGER DEFAULT 10,
        dexterity INTEGER DEFAULT 10,
        constitution INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        wisdom INTEGER DEFAULT 10,
        charisma INTEGER DEFAULT 10,
        proficiency_bonus INTEGER DEFAULT 2,
        initiative_modifier INTEGER DEFAULT 0,
        attacks TEXT,
        abilities TEXT,
        conditions TEXT,
        is_alive BOOLEAN DEFAULT TRUE,
        challenge_rating REAL DEFAULT 0,
        experience_value INTEGER DEFAULT 0,
        template_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Encounters table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        current_round INTEGER DEFAULT 0,
        current_turn INTEGER DEFAULT 0,
        environment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        FOREIGN KEY (character_id) REFERENCES characters(id)
      )
    `);

    // Encounter participants table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS encounter_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        encounter_id INTEGER NOT NULL,
        participant_type TEXT NOT NULL,
        participant_id INTEGER NOT NULL,
        initiative INTEGER NOT NULL,
        initiative_order INTEGER,
        has_acted BOOLEAN DEFAULT FALSE,
        conditions TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (encounter_id) REFERENCES encounters(id)
      )
    `);

    // Inventory table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        item_type TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        equipped BOOLEAN DEFAULT FALSE,
        properties TEXT, -- JSON string
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // Story progress table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS story_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        chapter TEXT NOT NULL,
        scene TEXT NOT NULL,
        description TEXT,
        flags TEXT, -- JSON string
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // World state table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS world_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        location TEXT NOT NULL,
        npcs TEXT, -- JSON string
        events TEXT, -- JSON string
        environment TEXT, -- JSON string
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `);

    // Combat log table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS combat_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        action TEXT NOT NULL,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
            )
          `);
      
          // Quests table
          this.db.exec(`
            CREATE TABLE IF NOT EXISTS quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              objectives TEXT, -- JSON string, e.g., [{id: "obj1", text: "Do X", completed: false}]
              rewards TEXT,    -- JSON string, e.g., {gold: 100, exp: 50, items: ["item_id_1"]}
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
      
          // Character Quests table (join table)
          this.db.exec(`
            CREATE TABLE IF NOT EXISTS character_quests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              character_id INTEGER NOT NULL,
              quest_id INTEGER NOT NULL,
              status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'
              progress TEXT, -- JSON string for detailed objective tracking
              assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
              FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
              UNIQUE (character_id, quest_id)
            )
          `);
      
          // Create indexes
          this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_inventory_character ON inventory(character_id);
      CREATE INDEX IF NOT EXISTS idx_story_character ON story_progress(character_id);
      CREATE INDEX IF NOT EXISTS idx_world_character ON world_state(character_id);
      CREATE INDEX IF NOT EXISTS idx_combat_character ON combat_log(character_id);
      CREATE INDEX IF NOT EXISTS idx_npc_type ON npcs(type);
      CREATE INDEX IF NOT EXISTS idx_npc_alive ON npcs(is_alive);
      CREATE INDEX IF NOT EXISTS idx_encounter_character ON encounters(character_id);
      CREATE INDEX IF NOT EXISTS idx_encounter_status ON encounters(status);
      CREATE INDEX IF NOT EXISTS idx_participants_encounter ON encounter_participants(encounter_id);
      CREATE INDEX IF NOT EXISTS idx_participants_order ON encounter_participants(encounter_id, initiative_order);
      CREATE INDEX IF NOT EXISTS idx_quests_title ON quests(title);
      CREATE INDEX IF NOT EXISTS idx_character_quests_character_id ON character_quests(character_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_quest_id ON character_quests(quest_id);
      CREATE INDEX IF NOT EXISTS idx_character_quests_status ON character_quests(status);
    `);

    // Migrations for existing tables
    this.addColumnIfNotExists('characters', 'armor_class', 'INTEGER DEFAULT 10');
    this.addColumnIfNotExists('inventory', 'equipped', 'BOOLEAN DEFAULT FALSE');
    this.addColumnIfNotExists('encounters', 'currentState', 'TEXT DEFAULT \'TURN_ENDED\'');
    this.addColumnIfNotExists('encounters', 'currentActorActions', 'TEXT');
    // Add D&D 5E character fields
    this.addColumnIfNotExists('characters', 'race', 'TEXT DEFAULT \'Human\'');
    this.addColumnIfNotExists('characters', 'background', 'TEXT DEFAULT \'Folk Hero\'');
    this.addColumnIfNotExists('characters', 'alignment', 'TEXT DEFAULT \'Neutral\'');
    this.addColumnIfNotExists('characters', 'hit_dice_remaining', 'INTEGER DEFAULT 1');
    this.addColumnIfNotExists('characters', 'speed', 'INTEGER DEFAULT 30');
  }

  private addColumnIfNotExists(tableName: string, columnName: string, columnDefinition: string) {
    const stmt = this.db.prepare(`PRAGMA table_info(\`${tableName}\`)`);
    const columns = stmt.all() as { name: string }[];
    if (!columns.some(col => col.name === columnName)) {
      try {
        this.db.exec(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`);
        console.log(`Added column ${columnName} to ${tableName}`);
      } catch (error) {
        console.error(`Failed to add column ${columnName} to ${tableName}:`, error);
      }
    }
  }

  // Character operations
  createCharacter(data: {
    name: string;
    class: string;
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
    armor_class?: number;
    race?: string;
    background?: string;
    alignment?: string;
    level?: number;
  }) {
    const level = data.level || 1;
    const constitution = data.constitution || 10;
    const conMod = Math.floor((constitution - 10) / 2);
    
    // Calculate HP based on class and level (simplified)
    const hitDieByClass: Record<string, number> = {
      'Wizard': 6, 'Sorcerer': 6,
      'Rogue': 8, 'Bard': 8, 'Cleric': 8, 'Druid': 8, 'Monk': 8, 'Warlock': 8,
      'Fighter': 10, 'Paladin': 10, 'Ranger': 10,
      'Barbarian': 12
    };
    const hitDie = hitDieByClass[data.class] || 8;
    const maxHp = hitDie + conMod + ((level - 1) * (Math.floor(hitDie / 2) + 1 + conMod));
    
    const stmt = this.db.prepare(`
      INSERT INTO characters (
        name, class, level, max_hp, current_hp, armor_class,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        race, background, alignment, hit_dice_remaining, speed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.class,
      level,
      maxHp,
      maxHp,
      data.armor_class || (10 + Math.floor(((data.dexterity || 10) - 10) / 2)), // AC = 10 + Dex mod
      data.strength || 10,
      data.dexterity || 10,
      data.constitution || 10,
      data.intelligence || 10,
      data.wisdom || 10,
      data.charisma || 10,
      data.race || 'Human',
      data.background || 'Folk Hero',
      data.alignment || 'Neutral',
      level, // Hit dice remaining = level
      30 // Default speed
    );

    return this.getCharacter(result.lastInsertRowid as number);
  }

  getCharacter(id: number) {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?');
    return stmt.get(id);
  }

  getCharacterByName(name: string) {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE name = ?');
    return stmt.get(name);
  }

  listCharacters() {
    const stmt = this.db.prepare('SELECT * FROM characters ORDER BY last_played DESC');
    return stmt.all();
  }

  updateCharacter(id: number, updates: Record<string, any>) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`
      UPDATE characters 
      SET ${setClause}, last_played = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.getCharacter(id);
  }

  // Inventory operations
  addItem(characterId: number, item: {
    name: string;
    type: string;
    quantity?: number;
    properties?: Record<string, any>;
    equipped?: boolean;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO inventory (character_id, item_name, item_type, quantity, properties, equipped)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      characterId,
      item.name,
      item.type,
      item.quantity || 1,
      item.properties ? JSON.stringify(item.properties) : null,
      item.equipped ? 1 : 0
    );

    return { id: result.lastInsertRowid, ...item };
  }

  getInventory(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM inventory WHERE character_id = ? ORDER BY item_type, item_name
    `);
    
    const items = stmt.all(characterId);
    return items.map((item: any) => ({
      ...item,
      properties: item.properties ? JSON.parse(item.properties as string) : null
    }));
  }

  updateItem(id: number, updates: { quantity?: number; equipped?: boolean }) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE inventory SET ${setClause} WHERE id = ?`);
    
    stmt.run(...values, id);
  }

  getItem(id: number) {
    const stmt = this.db.prepare('SELECT * FROM inventory WHERE id = ?');
    const item = stmt.get(id) as any;
    
    if (item && item.properties) {
      item.properties = JSON.parse(item.properties);
    }
    
    return item;
  }

  removeItem(id: number) {
    const stmt = this.db.prepare('DELETE FROM inventory WHERE id = ?');
    stmt.run(id);
  }

  // Story operations
  saveStoryProgress(characterId: number, data: {
    chapter: string;
    scene: string;
    description?: string;
    flags?: Record<string, any>;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO story_progress (character_id, chapter, scene, description, flags)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      characterId,
      data.chapter,
      data.scene,
      data.description || null,
      data.flags ? JSON.stringify(data.flags) : null
    );
  }

  getLatestStoryProgress(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM story_progress 
      WHERE character_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);
    
    const result = stmt.get(characterId) as any;
    if (result && result.flags) {
      result.flags = JSON.parse(result.flags as string);
    }
    return result;
  }

  // World state operations
  saveWorldState(characterId: number, data: {
    location: string;
    npcs?: Record<string, any>;
    events?: Record<string, any>;
    environment?: Record<string, any>;
  }) {
    // Check if world state exists
    const existing = this.db.prepare(
      'SELECT id FROM world_state WHERE character_id = ?'
    ).get(characterId);

    if (existing) {
      // Update existing
      const stmt = this.db.prepare(`
        UPDATE world_state 
        SET location = ?, npcs = ?, events = ?, environment = ?, last_updated = CURRENT_TIMESTAMP
        WHERE character_id = ?
      `);
      
      stmt.run(
        data.location,
        data.npcs ? JSON.stringify(data.npcs) : null,
        data.events ? JSON.stringify(data.events) : null,
        data.environment ? JSON.stringify(data.environment) : null,
        characterId
      );
    } else {
      // Insert new
      const stmt = this.db.prepare(`
        INSERT INTO world_state (character_id, location, npcs, events, environment)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        characterId,
        data.location,
        data.npcs ? JSON.stringify(data.npcs) : null,
        data.events ? JSON.stringify(data.events) : null,
        data.environment ? JSON.stringify(data.environment) : null
      );
    }
  }

  getWorldState(characterId: number) {
    const stmt = this.db.prepare('SELECT * FROM world_state WHERE character_id = ?');
    const result = stmt.get(characterId) as any;
    
    if (result) {
      if (result.npcs) result.npcs = JSON.parse(result.npcs as string);
      if (result.events) result.events = JSON.parse(result.events as string);
      if (result.environment) result.environment = JSON.parse(result.environment as string);
    }
    
    return result;
  }

  // Combat log operations
  logCombat(characterId: number, sessionId: string, action: string, result?: string) {
    const stmt = this.db.prepare(`
      INSERT INTO combat_log (character_id, session_id, action, result)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(characterId, sessionId, action, result || null);
  }

  getCombatLog(characterId: number, sessionId?: string) {
    if (sessionId) {
      const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ? AND session_id = ?
        ORDER BY timestamp
      `);
      return stmt.all(characterId, sessionId);
    } else {
      const stmt = this.db.prepare(`
        SELECT * FROM combat_log 
        WHERE character_id = ?
        ORDER BY timestamp DESC
        LIMIT 50
      `);
      return stmt.all(characterId);
    }
  }

  // NPC operations
  createNPC(data: {
    name: string;
    template?: string;
    type?: string;
    customStats?: Record<string, any>;
  }) {
    let npcData: any = {
      name: data.name,
      type: data.type || 'enemy'
    };

    // Apply template if specified
    if (data.template && (MONSTER_TEMPLATES as MonsterTemplatesCollection)[data.template]) {
      const template = (MONSTER_TEMPLATES as MonsterTemplatesCollection)[data.template];
      npcData = { ...template, ...npcData };
    }

    // Apply custom stats
    if (data.customStats) {
      npcData = { ...npcData, ...data.customStats };
    }

    // Ensure required fields
    if (!npcData.max_hp) npcData.max_hp = 10;
    if (!npcData.current_hp) npcData.current_hp = npcData.max_hp;
    if (!npcData.armor_class) npcData.armor_class = 10;

    // Calculate initiative modifier if not set
    if (npcData.initiative_modifier === undefined) {
      npcData.initiative_modifier = getAbilityModifier(npcData.dexterity || 10);
    }

    const stmt = this.db.prepare(`
      INSERT INTO npcs (
        name, type, creature_type, size, current_hp, max_hp, armor_class, speed,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        proficiency_bonus, initiative_modifier, attacks, abilities, conditions,
        challenge_rating, experience_value, template_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    // Serialize complex objects to JSON if they are not already strings
    const attacksValue = typeof npcData.attacks === 'object' && npcData.attacks !== null
                         ? JSON.stringify(npcData.attacks)
                         : npcData.attacks || null;
    const abilitiesValue = typeof npcData.abilities === 'object' && npcData.abilities !== null
                           ? JSON.stringify(npcData.abilities)
                           : npcData.abilities || null;
    const conditionsValue = typeof npcData.conditions === 'object' && npcData.conditions !== null
                            ? JSON.stringify(npcData.conditions)
                            : npcData.conditions || null;

    const result = stmt.run(
      npcData.name,
      npcData.type,
      npcData.creature_type || null,
      npcData.size || 'medium',
      npcData.current_hp,
      npcData.max_hp,
      npcData.armor_class,
      npcData.speed || 30,
      npcData.strength || 10,
      npcData.dexterity || 10,
      npcData.constitution || 10,
      npcData.intelligence || 10,
      npcData.wisdom || 10,
      npcData.charisma || 10,
      npcData.proficiency_bonus || 2,
      npcData.initiative_modifier,
      attacksValue,
      abilitiesValue,
      conditionsValue,
      npcData.challenge_rating || 0,
      npcData.experience_value || 0,
      data.template || null
    );

    return this.getNPC(result.lastInsertRowid as number);
  }

  createNPCGroup(template: string, count: number, namePrefix?: string) {
    const npcs = [];
    const prefix = namePrefix || (MONSTER_TEMPLATES as MonsterTemplatesCollection)[template]?.name || 'NPC';
    
    for (let i = 1; i <= count; i++) {
      const npc = this.createNPC({
        name: `${prefix} ${i}`,
        template: template
      });
      npcs.push(npc);
    }
    
    return npcs;
  }

  getNPC(id: number) {
    const stmt = this.db.prepare('SELECT * FROM npcs WHERE id = ?');
    const npc = stmt.get(id) as any;
    
    if (npc) {
      // Parse JSON fields
      if (npc.attacks) npc.attacks = JSON.parse(npc.attacks);
      if (npc.abilities) npc.abilities = JSON.parse(npc.abilities);
      if (npc.conditions) npc.conditions = JSON.parse(npc.conditions);
    }
    
    return npc;
  }

  listNPCs(type?: string, aliveOnly: boolean = true) {
    let query = 'SELECT * FROM npcs WHERE 1=1';
    const params: any[] = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (aliveOnly) {
      query += ' AND is_alive = TRUE';
    }
    
    query += ' ORDER BY name';
    
    const stmt = this.db.prepare(query);
    const npcs = stmt.all(...params);
    
    return npcs.map((npc: any) => {
      if (npc.attacks) npc.attacks = JSON.parse(npc.attacks);
      if (npc.abilities) npc.abilities = JSON.parse(npc.abilities);
      if (npc.conditions) npc.conditions = JSON.parse(npc.conditions);
      return npc;
    });
  }

  updateNPC(id: number, updates: Record<string, any>) {
    // Map common field names to database column names
    const fieldMapping: Record<string, string> = {
      'hit_points': 'current_hp',
      'max_hit_points': 'max_hp',
      'level': 'challenge_rating', // NPCs don't have levels, use CR instead
      'special_abilities': 'abilities',
      'damage_resistances': 'abilities', // Store in abilities JSON
      'damage_immunities': 'abilities',
      'condition_immunities': 'abilities'
    };

    // Apply field mapping
    const mappedUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMapping[key] || key;
      
      // Special handling for abilities-related fields
      if (['special_abilities', 'damage_resistances', 'damage_immunities', 'condition_immunities'].includes(key)) {
        // Get existing abilities or create new object
        const existingNPC = this.getNPC(id);
        let abilities = existingNPC?.abilities || {};
        
        // If it's an array, store it properly
        if (Array.isArray(value)) {
          abilities[key] = value;
        } else if (typeof value === 'string') {
          abilities[key] = value;
        }
        
        mappedUpdates['abilities'] = abilities;
      } else {
        mappedUpdates[dbField] = value;
      }
    }

    // Handle JSON fields
    if (mappedUpdates.attacks && typeof mappedUpdates.attacks === 'object') {
      mappedUpdates.attacks = JSON.stringify(mappedUpdates.attacks);
    }
    if (mappedUpdates.abilities && typeof mappedUpdates.abilities === 'object') {
      mappedUpdates.abilities = JSON.stringify(mappedUpdates.abilities);
    }
    if (mappedUpdates.conditions && typeof mappedUpdates.conditions === 'object') {
      mappedUpdates.conditions = JSON.stringify(mappedUpdates.conditions);
    }
    
    // Filter out any invalid fields that don't exist in the database
    const validFields = [
      'name', 'type', 'creature_type', 'size', 'current_hp', 'max_hp', 'armor_class', 'speed',
      'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
      'proficiency_bonus', 'initiative_modifier', 'attacks', 'abilities', 'conditions',
      'is_alive', 'challenge_rating', 'experience_value', 'template_id'
    ];
    
    const filteredUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(mappedUpdates)) {
      if (validFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }
    
    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid fields provided for NPC update');
    }
    
    const fields = Object.keys(filteredUpdates);
    const values = Object.values(filteredUpdates);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const stmt = this.db.prepare(`UPDATE npcs SET ${setClause} WHERE id = ?`);
    
    stmt.run(...values, id);
    return this.getNPC(id);
  }

  removeNPC(id: number) {
    const stmt = this.db.prepare('DELETE FROM npcs WHERE id = ?');
    stmt.run(id);
  }

  // Encounter operations
  createEncounter(data: {
    character_id: number;
    name: string;
    description?: string;
    environment?: string;
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO encounters (character_id, name, description, environment)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.character_id,
      data.name,
      data.description || null,
      data.environment || null
    );

    return this.getEncounter(result.lastInsertRowid as number);
  }

  getEncounter(id: number) {
    // console.log(`[GameDatabase.getEncounter] Querying for encounter ID: ${id}`);
    const stmt = this.db.prepare('SELECT * FROM encounters WHERE id = ?');
    const row = stmt.get(id);
    // console.log(`[GameDatabase.getEncounter] Raw row data for ID ${id}: ${JSON.stringify(row)}`);
    return row;
  }

  getActiveEncounter(characterId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM encounters 
      WHERE character_id = ? AND status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    return stmt.get(characterId);
  }

  addEncounterParticipant(encounterId: number, type: string, participantId: number, initiative: number) {
    const stmt = this.db.prepare(`
      INSERT INTO encounter_participants (encounter_id, participant_type, participant_id, initiative)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(encounterId, type, participantId, initiative);
    
    // Recalculate initiative order
    this.updateInitiativeOrder(encounterId);
  }

  updateInitiativeOrder(encounterId: number) {
    // Get all participants sorted by initiative (descending)
    const participants = this.db.prepare(`
      SELECT id, initiative FROM encounter_participants 
      WHERE encounter_id = ? AND is_active = TRUE
      ORDER BY initiative DESC
    `).all(encounterId) as EncounterParticipant[];
    
    // Update initiative order
    const updateStmt = this.db.prepare(`
      UPDATE encounter_participants SET initiative_order = ? WHERE id = ?
    `);
    
    participants.forEach((p: EncounterParticipant, index) => {
      updateStmt.run(index + 1, p.id);
    });
  }

  getEncounterParticipants(encounterId: number) {
    const stmt = this.db.prepare(`
      SELECT ep.*, 
        CASE 
          WHEN ep.participant_type = 'character' THEN c.name
          WHEN ep.participant_type = 'npc' THEN n.name
        END as name,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.current_hp
          WHEN ep.participant_type = 'npc' THEN n.current_hp
        END as current_hp,
        CASE 
          WHEN ep.participant_type = 'character' THEN c.max_hp
          WHEN ep.participant_type = 'npc' THEN n.max_hp
        END as max_hp
      FROM encounter_participants ep
      LEFT JOIN characters c ON ep.participant_type = 'character' AND ep.participant_id = c.id
      LEFT JOIN npcs n ON ep.participant_type = 'npc' AND ep.participant_id = n.id
      WHERE ep.encounter_id = ? AND ep.is_active = TRUE
      ORDER BY ep.initiative_order
    `);
    
    return stmt.all(encounterId) as EncounterParticipant[];
  }

  nextTurn(encounterId: number): EncounterParticipant | null {
    const encounter = this.getEncounter(encounterId) as any;
    if (!encounter || encounter.status !== 'active') {
      console.log(`Encounter ${encounterId} not active or not found.`);
      return null;
    }

    let participants: EncounterParticipant[] = this.getEncounterParticipants(encounterId);
    if (participants.length === 0) {
      console.log(`No active participants in encounter ${encounterId}.`);
      return null;
    }

    // Mark current participant as having acted, if there was a current turn
    const currentTurnOrder = encounter.current_turn;
    if (currentTurnOrder > 0 && currentTurnOrder <= participants.length) {
        // Find the participant by their *current* initiative_order, which might have shifted if others became inactive
        const currentParticipantInOriginalOrder = participants.find(p => p.initiative_order === currentTurnOrder);
        if (currentParticipantInOriginalOrder && currentParticipantInOriginalOrder.is_active) {
             this.db.prepare(
                `UPDATE encounter_participants SET has_acted = TRUE WHERE id = ?`
            ).run(currentParticipantInOriginalOrder.id);
        }
    }
    
    // Determine the next turn order
    let nextTurnOrder = currentTurnOrder + 1;
    let nextParticipant: EncounterParticipant | undefined = undefined;

    // Loop to find the next *active* participant
    let attempts = 0; // Safety break for infinite loops
    while (attempts < participants.length * 2) { // Allow to loop through participants twice (for round change)
        if (nextTurnOrder > participants.length) { // End of round, start new round
            nextTurnOrder = 1;
            encounter.current_round += 1;
            
            // Reset has_acted for all *active* participants for the new round
            this.db.prepare(
                `UPDATE encounter_participants SET has_acted = FALSE WHERE encounter_id = ? AND is_active = TRUE`
            ).run(encounterId);
            // Re-fetch participants as their has_acted status changed
            participants = this.getEncounterParticipants(encounterId);
        }

        nextParticipant = participants.find(p => p.initiative_order === nextTurnOrder && p.is_active);

        if (nextParticipant) {
            break; // Found next active participant
        }
        
        nextTurnOrder++; // Try next in order
        attempts++;
    }

    if (!nextParticipant) {
      // This could happen if all participants become inactive
      console.log(`No active participant found for next turn in encounter ${encounterId}. Ending encounter.`);
      this.endEncounter(encounterId, 'stalemate'); // Or some other appropriate status
      return null;
    }

    // Initialize turn state and actor actions
    const initialActions = {
      actionAvailable: true,
      bonusActionAvailable: true,
      movementRemaining: 30
    };

    // Update encounter with new turn, round, and proper state management
    this.db.prepare(
        `UPDATE encounters
         SET current_turn = ?, current_round = ?, currentState = ?, currentActorActions = ?
         WHERE id = ?`
    ).run(nextTurnOrder, encounter.current_round, 'TURN_STARTED', JSON.stringify(initialActions), encounterId);
    
    // The nextParticipant object already contains all necessary details from getEncounterParticipants
    return nextParticipant;
  }

  endEncounter(id: number, outcome: string = 'completed') {
    const stmt = this.db.prepare(`
      UPDATE encounters 
      SET status = ?, ended_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(outcome, id);
  }

  applyDamage(targetType: string, targetId: number, damage: number) {
    let stmt;
    
    if (targetType === 'character') {
      stmt = this.db.prepare(`
        UPDATE characters
        SET current_hp = MAX(0, current_hp - ?)
        WHERE id = ?
      `);
      stmt.run(damage, targetId);
      const character = this.getCharacter(targetId) as any;
      if (character && character.current_hp <= 0) {
        // Character is incapacitated, mark as inactive in encounters
        const activeEncounters = this.db.prepare(`
          SELECT encounter_id FROM encounter_participants
          WHERE participant_type = 'character' AND participant_id = ? AND is_active = TRUE
        `).all(targetId) as { encounter_id: number }[];

        for (const enc of activeEncounters) {
          this.db.prepare(`
            UPDATE encounter_participants
            SET is_active = FALSE
            WHERE participant_type = 'character' AND participant_id = ? AND encounter_id = ?
          `).run(targetId, enc.encounter_id);
          this.updateInitiativeOrder(enc.encounter_id); // Recalculate initiative order
        }
      }
      return character;

    } else if (targetType === 'npc') {
      stmt = this.db.prepare(`
        UPDATE npcs
        SET current_hp = MAX(0, current_hp - ?),
            is_alive = CASE WHEN current_hp - ? <= 0 THEN FALSE ELSE TRUE END
        WHERE id = ?
      `);
      stmt.run(damage, damage, targetId);
      
      const npc = this.getNPC(targetId) as any;
      if (npc && !npc.is_alive) {
         // NPC died, mark as inactive in encounters
        const activeEncounters = this.db.prepare(`
          SELECT encounter_id FROM encounter_participants
          WHERE participant_type = 'npc' AND participant_id = ? AND is_active = TRUE
        `).all(targetId) as { encounter_id: number }[];

        for (const enc of activeEncounters) {
          this.db.prepare(`
            UPDATE encounter_participants
            SET is_active = FALSE
            WHERE participant_type = 'npc' AND participant_id = ? AND encounter_id = ?
          `).run(targetId, enc.encounter_id);
          this.updateInitiativeOrder(enc.encounter_id); // Recalculate initiative order
        }
      }
      return npc;
    }
    
    // Should not reach here if targetType is valid
    return null;
  }

  // Quest Operations
  addQuest(data: {
    title: string;
    description: string;
    objectives: Record<string, any>[] | string[]; // Array of objective strings or objects
    rewards: Record<string, any>; // e.g., { gold: 100, experience: 50, items: ["item_id_1"] }
  }) {
    const stmt = this.db.prepare(`
      INSERT INTO quests (title, description, objectives, rewards)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.title,
      data.description,
      JSON.stringify(data.objectives),
      JSON.stringify(data.rewards)
    );
    return this.getQuestById(result.lastInsertRowid as number);
  }

  getQuestById(id: number): Quest | null {
    const stmt = this.db.prepare('SELECT * FROM quests WHERE id = ?');
    const quest = stmt.get(id) as Quest | undefined;
    if (quest) {
      // objectives and rewards are stored as JSON, parse them if needed by caller
      // For now, return as stored. Parsing can be done in handler or by caller.
    }
    return quest || null;
  }

  assignQuestToCharacter(characterId: number, questId: number, status: 'active' | 'completed' | 'failed' = 'active') {
    // Check if character and quest exist
    const character = this.getCharacter(characterId);
    if (!character) throw new Error(`Character with ID ${characterId} not found.`);
    const quest = this.getQuestById(questId);
    if (!quest) throw new Error(`Quest with ID ${questId} not found.`);

    const stmt = this.db.prepare(`
      INSERT INTO character_quests (character_id, quest_id, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(character_id, quest_id) DO UPDATE SET
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
      WHERE character_quests.status != 'completed' AND character_quests.status != 'failed'
            OR excluded.status = 'active' -- Allow re-activating if previously completed/failed for some reason
    `);
    const result = stmt.run(characterId, questId, status);
    if (result.changes > 0) {
        // Need to get the ID of the inserted/updated row.
        // If it was an insert, result.lastInsertRowid works.
        // If it was an update due to conflict, we need to query it.
        const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
        const cq = cqStmt.get(characterId, questId) as { id: number } | undefined;
        return cq ? this.getCharacterQuestById(cq.id) : null;
    }
    // If no changes, it means the quest was already completed/failed and we tried to assign it as active again without override.
    // Or some other edge case. Return existing record.
    const cqStmt = this.db.prepare('SELECT id FROM character_quests WHERE character_id = ? AND quest_id = ?');
    const cq = cqStmt.get(characterId, questId) as { id: number } | undefined;
    return cq ? this.getCharacterQuestById(cq.id) : null;
  }

  getCharacterQuestById(characterQuestId: number): CharacterQuest | null {
    const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.id = ?
    `);
    const cq = stmt.get(characterQuestId) as CharacterQuest | undefined;
    if (cq) {
      // Parse JSON fields
      if (cq.objectives) cq.objectives = JSON.parse(cq.objectives as string);
      if (cq.rewards) cq.rewards = JSON.parse(cq.rewards as string);
      if (cq.progress) cq.progress = JSON.parse(cq.progress as string);
    }
    return cq || null;
  }

  getCharacterActiveQuests(characterId: number): CharacterQuest[] {
    const stmt = this.db.prepare(`
      SELECT cq.*, q.title, q.description, q.objectives, q.rewards
      FROM character_quests cq
      JOIN quests q ON cq.quest_id = q.id
      WHERE cq.character_id = ? AND cq.status = 'active'
      ORDER BY cq.assigned_at DESC
    `);
    const quests = stmt.all(characterId) as CharacterQuest[];
    return quests.map(q => {
      if (q.objectives) q.objectives = JSON.parse(q.objectives as string);
      if (q.rewards) q.rewards = JSON.parse(q.rewards as string);
      if (q.progress) q.progress = JSON.parse(q.progress as string);
      return q;
    });
  }

  updateCharacterQuestStatus(characterQuestId: number, status: 'active' | 'completed' | 'failed', progress?: Record<string, any> | null) {
    const fieldsToUpdate: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [status];

    if (progress !== undefined) {
      fieldsToUpdate.push('progress = ?');
      values.push(progress ? JSON.stringify(progress) : null);
    }
    values.push(characterQuestId);

    const stmt = this.db.prepare(`
      UPDATE character_quests
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = ?
    `);
    const result = stmt.run(...values);
    if (result.changes > 0) {
      return this.getCharacterQuestById(characterQuestId);
    }
    return null; // Or throw error if not found/not updated
  }

  close() {
    this.db.close();
  }
}
````

## File: README.md
````markdown
# 🎯 RPG MCP Servers - Advanced D&D 5e Combat & Game State Management

**The most advanced MCP server suite for AI-powered D&D experiences!** Features 3D spatial combat, ASCII battlefield visualization, and complete character management.

## 🚀 **Latest Major Updates**

### 🗺️ **NEW: ASCII Battlefield Visualization**
```
📍 **BATTLEFIELD MAP** (X→, Y↓):

 0│· · · · · · · · · · · · · · · 
 1│· · · · · · · · · · · · · · · 
 2│· · · · · · · · █ · · · · · · 
 3│· · · · · · · · █ · · · · · · 
 4│· · · · · ≡ ≡ · █ · · · · · · 
 5│· · · · · ≡ L · █ · · · · · · 
 6│· · · K · · · · · · · · · · · 
 7│· · · · · · · · · · · · · · · 
 8│· · · · · · · · · · · · S · · 
 9│· · · · · · · · · · · · · · · 
  └0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 

**LEGEND**: █=wall, ■=pillar, ≡=stairs, Letters=creatures
```

### ⚔️ **NEW: 3D Spatial Combat Engine**
- **Elevation System**: Stairs, pillars, flying creatures
- **Line of Sight**: Ray-casting with cover calculation  
- **Opportunity Attacks**: Movement validation
- **Flanking Detection**: Tactical positioning bonuses
- **Area Effect Targeting**: Spell geometry and targeting

### 🧠 **NEW: Human-Readable Tactical Intelligence**
```
🎯 **Lyra Swiftarrow** is standing on stairs at coordinates (6,5,5).

⚔️ **ENEMIES IN SIGHT**: 
  Kael Ironshield (25ft close) - clear shot, 
  Stone Gargoyle (38ft medium) - clear shot

🏃 **MOVEMENT OPTIONS**: pillar (32ft away), wall (12ft away)
```

### 🔧 **Enhanced Features**
- **Fixed dice notation**: `2d20kh1` (advantage) and `2d20kl1` (disadvantage)
- **Complete turn management**: Actions, bonus actions, movement, reactions
- **Enhanced inventory**: Full item management with equipped status
- **Monster/NPC system**: Template-based creature creation
- **Story & Quest management**: Progress tracking and objectives
- **Bug fixes**: Battlefield initialization now preserves creatures

## 🏗️ **Project Architecture**

- **game-state-server/**: SQLite-based persistent character sheets, inventory, encounters
- **combat-engine-server/**: Advanced 3D spatial combat with D&D 5e mechanics

## 🎮 **Key Features**

### 📊 **Complete Character Management**
- **Character Sheets**: Full D&D 5e stats (STR, DEX, CON, INT, WIS, CHA)
- **Inventory System**: Items, equipment, quantities, equipped status
- **World State**: Location tracking, NPC relationships, environmental data
- **Story Progress**: Chapter/checkpoint tracking with narrative summaries

### ⚔️ **Advanced Combat System**
- **3D Battlefield**: X, Y, Z positioning with terrain features
- **Turn Management**: Initiative order, action economy tracking
- **Spatial Intelligence**: Distance calculation, movement validation
- **Tactical Analysis**: Flanking, cover, height advantage detection
- **Visual Combat Maps**: ASCII battlefield visualization

### 🎲 **D&D 5e Mechanics**
- **Complete Dice System**: All standard dice with advantage/disadvantage
- **Combat Actions**: Attack rolls, damage, saving throws, spell effects
- **Movement Rules**: Speed limits, opportunity attacks, difficult terrain
- **Area Effects**: Spells with proper geometry (spheres, cones, lines)

## 🛠️ **Prerequisites**

**Roo Code Installation Required:**
- Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)
- Or via CLI: `code --install-extension RooVeterinaryInc.roo-cline`
- Configure AI provider (OpenAI, Anthropic, etc.)
- Visit [Roo Code docs](https://docs.roocode.com) for setup details

## 🚀 **Quick Setup**

### 1. **Install & Build Servers**
```bash
# Game State Server
cd game-state-server
npm install && npm run build

# Combat Engine Server  
cd ../combat-engine-server
npm install && npm run build
```

### 2. **Configure Environment** (Optional)
Create `.env` files in each server directory:

**game-state-server/.env:**
```
DATABASE_PATH=./data/my_rpg.db
PORT=3001
```

**combat-engine-server/.env:**
```
PORT=3002
```

### 3. **Start Servers**
```bash
# Terminal 1
cd game-state-server && npm start

# Terminal 2  
cd combat-engine-server && npm start
```

### 4. **Configure Roo Code MCP Settings**

Add to your `mcp_settings.json` (typically at `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`):

```json
{
  "mcpServers": {
    "rpg-game-state": {
      "name": "rpg-game-state-server",
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/game-state-server",
      "enabled": true,
      "alwaysAllow": [
        "create_character", "get_character", "get_character_by_name", "list_characters", "update_character",
        "add_item", "get_inventory", "remove_item", "update_item",
        "save_world_state", "get_world_state", "update_world_state",
        "create_npc", "create_npc_group", "get_npc", "list_npcs", "update_npc", "remove_npc",
        "create_encounter", "add_to_encounter", "get_encounter_state", "get_active_encounter",
        "start_turn", "end_turn", "next_turn", "consume_action", "end_encounter", "apply_damage",
        "save_story_progress", "add_quest", "get_active_quests", "update_quest_state", "assign_quest_to_character"
      ]
    },
    "rpg-combat-engine": {
      "name": "rpg-combat-engine-server", 
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "PATH_TO_YOUR_PROJECT/rpg-mcp-servers/combat-engine-server",
      "enabled": true,
      "alwaysAllow": [
        "roll_dice", "roll_check", "attack_roll", "initiative_roll", "damage_roll", "saving_throw",
        "use_reaction", "use_legendary_action", "trigger_lair_action", "execute_multiattack",
        "initialize_battlefield", "place_creature", "move_creature", "check_line_of_sight",
        "get_area_effect_targets", "get_tactical_summary", "check_flanking", "check_height_advantage",
        "describe_battlefield", "describe_detailed_tactical_situation", "generate_battlefield_map",
        "get_combat_log", "clear_combat_log"
      ]
    }
  }
}
```

**📝 Note**: Replace `PATH_TO_YOUR_PROJECT` with your actual path (e.g., `C:/projects/rpg-mcp-servers`).

## 🎯 **Usage Examples**

### **Create a Character**
```javascript
// Creates a new D&D character with full stats
create_character({
  name: "Lyra Swiftarrow",
  class: "Ranger", 
  stats: { strength: 14, dexterity: 18, constitution: 16, intelligence: 12, wisdom: 15, charisma: 10 }
})
```

### **Setup 3D Combat**
```javascript
// Initialize battlefield with terrain
initialize_battlefield({
  width: 15, height: 12,
  terrain: [
    { type: "wall", position: {x: 8, y: 2, z: 0}, dimensions: {width: 1, height: 4, depth: 5} },
    { type: "stairs", position: {x: 5, y: 4, z: 0}, dimensions: {width: 2, height: 2, depth: 5} }
  ]
})

// Place creatures in 3D space
place_creature({
  creature_id: "ranger_lyra", name: "Lyra Swiftarrow",
  x: 6, y: 5, z: 5, size: "medium", speed: 30, reach: 5
})

// Get tactical situation
describe_detailed_tactical_situation({ creature_id: "ranger_lyra" })
```

### **Generate Visual Map**
```javascript
// Creates ASCII battlefield visualization
generate_battlefield_map()
```

### **Advanced Combat Mechanics**
```javascript
// Roll with advantage
roll_dice({ notation: "2d20kh1+5", reason: "Attack with advantage" })

// Check line of sight with cover
check_line_of_sight({ from_creature: "ranger_lyra", to_creature: "goblin_1" })

// Validate movement with opportunity attacks
move_creature({ creature_id: "fighter_kael", target_x: 10, target_y: 8, speed: 25 })
```

## 🔧 **Advanced Features**

### **🎲 Dice System**
- Standard D&D notation: `1d20+5`, `3d6`, `1d8+3`
- Advantage/Disadvantage: `2d20kh1+5`, `2d20kl1+5`
- Critical hits: Automatic damage doubling
- Custom modifiers: Situational bonuses

### **⚔️ Combat Mechanics**
- **Initiative**: Automatic turn order management
- **Action Economy**: Actions, bonus actions, movement, reactions
- **Opportunity Attacks**: Movement validation and triggering
- **Area Effects**: Spell targeting with geometric calculations
- **Cover & Concealment**: Line of sight with partial cover

### **🗺️ Spatial Intelligence**
- **3D Positioning**: Full X, Y, Z coordinate system
- **Terrain Features**: Walls, pillars, stairs, pits, doors
- **Movement Validation**: Pathfinding with obstacle avoidance
- **Tactical Analysis**: Flanking, height advantage, reach calculations

## 🎮 **Integration with AI Dungeon**

Perfect for integration with the [AI Dungeon Experiment](https://github.com/Mnehmos/AI-Dungeon-Experiment):

1. **Create custom Roo Code modes** for Dungeon Master AI
2. **Leverage MCP tools** for consistent mechanics
3. **Maintain persistent state** across gaming sessions  
4. **Generate tactical descriptions** for AI narrative integration

## 🎯 **What Makes This Special**

- ✅ **Visual Combat Maps**: ASCII battlefield with terrain and creatures
- ✅ **True 3D Combat**: Elevation, flying, multilevel encounters  
- ✅ **Human-Readable**: Tactical descriptions perfect for AI integration
- ✅ **Complete D&D 5e**: Full rules implementation with persistent state
- ✅ **AI-Optimized**: Designed specifically for LLM-powered gameplay
- ✅ **Production Ready**: Robust error handling and state management

## 🚀 **Get Started**

Ready to create the ultimate AI-powered D&D experience? Clone this repository and follow the setup instructions above. Within minutes, you'll have a complete RPG system with visual combat maps and advanced tactical intelligence!

---

**🎲 Happy adventuring with AI-powered D&D!** 🐉
````

## File: game-state-server/src/index.ts
````typescript
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
````
