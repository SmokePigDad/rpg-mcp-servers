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