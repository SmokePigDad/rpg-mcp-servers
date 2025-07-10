// oWoD antagonist templates for Storyteller System NPC creation

export interface AntagonistSheet {
  name: string;
  game_line: string;
  type: string; // 'enemy', 'ally', 'neutral'
  /** A brief archetypal summary, e.g. "Ruthless footsoldier," "Master manipulator" */
  concept: string;
  attributes: {
    strength: number;
    dexterity: number;
    stamina: number;
    charisma: number;
    manipulation: number;
    appearance: number;
    perception: number;
    intelligence: number;
    wits: number;
  };
  abilities: Partial<{
    talents: Record<string, number>;
    skills: Record<string, number>;
    knowledges: Record<string, number>;
  }>;
  willpower: number;
  health_levels: Record<string, number>;
  supernatural?: Record<string, any>;
  description?: string;
}

type AntagonistTemplates = Record<string, AntagonistSheet>;

/**
 * oWoD antagonist archetypes
 */
export const ANTAGONIST_TEMPLATES: AntagonistTemplates = {
  // VAMPIRE
  'First-Gen Vampire': {
    name: 'First-Gen Vampire',
    concept: 'Founder of a vampiric lineage—absolute apex predator.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 10, dexterity: 7, stamina: 10,
      charisma: 8, manipulation: 8, appearance: 7,
      perception: 9, intelligence: 10, wits: 9,
    },
    abilities: {
      talents: { Brawl: 5, Alertness: 5, Intimidation: 5, Subterfuge: 5 },
      skills: { Melee: 5, Stealth: 5, Firearms: 4 },
      knowledges: { Occult: 5, Medicine: 4, Investigation: 5, Law: 5 },
    },
    willpower: 10,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 10, Dominate: 9, Fortitude: 10 } },
    description: 'An impossibly ancient Kindred; a god among vampires.',
  },
  'Sabbat Shovelhead': {
    name: 'Sabbat Shovelhead',
    concept: 'Expendable vampire soldier—fodder for the Sword of Caine.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 2,
      charisma: 2, manipulation: 1, appearance: 1,
      perception: 2, intelligence: 1, wits: 2,
    },
    abilities: {
      talents: { Brawl: 3, Intimidation: 2 },
      skills: { Melee: 2, Drive: 1 },
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 2, Celerity: 1 } },
    description: 'A freshly Embraced recruit thrown into battle by the Sabbat.',
  },
  'Anarch Bruiser': {
    name: 'Anarch Bruiser',
    concept: 'Anarch gang muscle; discontented Kindred brawler.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 2, stamina: 3,
      charisma: 2, manipulation: 2, appearance: 2,
      perception: 2, intelligence: 2, wits: 2,
    },
    abilities: {
      talents: { Brawl: 4, Alertness: 2 },
      skills: { Melee: 2, Firearms: 1 },
      knowledges: {},
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 2, Fortitude: 1 } },
    description: 'A tough unlife enforcer for the Anarch Movement.',
  },
  'Camarilla Sheriff': {
    name: 'Camarilla Sheriff',
    concept: 'Enforcer of Kindred law—pragmatic, ruthless, loyal.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 3, stamina: 4,
      charisma: 3, manipulation: 3, appearance: 2,
      perception: 3, intelligence: 3, wits: 4,
    },
    abilities: {
      talents: { Brawl: 4, Alertness: 4, Intimidation: 3 },
      skills: { Melee: 3, Firearms: 3, Stealth: 2 },
      knowledges: { Investigation: 3 },
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Celerity: 2, Potence: 3, Fortitude: 2 } },
    description: 'An elite law enforcer of the Camarilla, skilled in Kindred justice.',
  },

  // WEREWOLF
  'Bane Spirit': {
    name: 'Bane Spirit',
    concept: 'Malevolent Umbra spirit—corruptor and tormentor.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 4, stamina: 3,
      charisma: 1, manipulation: 4, appearance: 0,
      perception: 5, intelligence: 4, wits: 3,
    },
    abilities: {
      talents: { Alertness: 4 },
      skills: {},
      knowledges: { Occult: 4 },
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: ['Obfuscate', 'Bane Touch'] },
    description: 'A malicious spiritual entity, twisted in the Umbra.',
  },
  'Black Spiral Dancer': {
    name: 'Black Spiral Dancer',
    concept: 'Wyrm-corrupted Garou—chaotic, insane, predatory.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 3, stamina: 3,
      charisma: 2, manipulation: 2, appearance: 1,
      perception: 3, intelligence: 2, wits: 3,
    },
    abilities: {
      talents: { Brawl: 4, Intimidation: 4 },
      skills: { Stealth: 3, Survival: 3 },
      knowledges: { Occult: 3 },
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: { 'Balefire': 2 } },
    description: 'A corrupted Garou, malicious and insane.',
  },
  'Pentex First-Team': {
    name: 'Pentex First-Team',
    concept: 'Corporate paramilitary anti-werewolf commando.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 4, stamina: 4,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 3, intelligence: 3, wits: 3,
    },
    abilities: {
      talents: { Brawl: 4, Alertness: 3 },
      skills: { Firearms: 5, Drive: 3, Melee: 3 },
      knowledges: { Science: 2, Investigation: 2 },
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: "Pentex's elite paramilitary anti-Garou squad.",
  },
  'Fomori': {
    name: 'Fomori',
    concept: 'Possessed mutant—human vessel for a Bane.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 3,
      charisma: 1, manipulation: 1, appearance: 0,
      perception: 2, intelligence: 1, wits: 2,
    },
    abilities: {
      talents: { Brawl: 2 },
      skills: { Melee: 2 },
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A human possessed and mutated by Banes.',
  },

  // MAGE
  'Technocracy Agent': {
    name: 'Technocracy Agent',
    concept: 'Fanatical enforcer of Consensus reality.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 3, stamina: 3,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 4, intelligence: 4, wits: 4,
    },
    abilities: {
      talents: { Alertness: 3, Subterfuge: 4, Intimidation: 2 },
      skills: { Firearms: 4, Melee: 2, Stealth: 3, Drive: 3 },
      knowledges: { Science: 4, Technology: 5, Investigation: 3 },
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A field operative of the Technocratic Union, trained in advanced weaponry and counter-magic.',
  },
  'Technocracy Hit Squad': {
    name: 'Technocracy Hit Squad',
    concept: 'Team of paramilitary Convention operatives.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 4, stamina: 3,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 4, intelligence: 3, wits: 4,
    },
    abilities: {
      talents: { Alertness: 4, Subterfuge: 3 },
      skills: { Firearms: 5, Drive: 2, Melee: 2 },
      knowledges: { Technology: 4, Science: 4 },
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Forces: 3, Correspondence: 2 } },
    description: 'A team of trained Operatives with access to Technomantic devices.',
  },
  'Marauder': {
    name: 'Marauder',
    concept: 'Reality-warping chaos mage—embracing madness.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 3, stamina: 4,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 2, intelligence: 4, wits: 3,
    },
    abilities: {
      talents: { Subterfuge: 3, Intimidation: 2 },
      skills: { Firearms: 2 },
      knowledges: { Occult: 3 },
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Entropy: 3, Mind: 3 } },
    description: 'A reality-warping, Madness-tainted mage.',
  },
  'Nephandus': {
    name: 'Nephandus',
    concept: 'Sorcerer corrupted by dark cosmic powers.',
    game_line: 'mage',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 2, stamina: 2,
      charisma: 2, manipulation: 3, appearance: 1,
      perception: 4, intelligence: 4, wits: 3,
    },
    abilities: {
      talents: { Subterfuge: 3, Intimidation: 2 },
      skills: { Melee: 2, Occult: 4 },
      knowledges: {},
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Forces: 2, Prime: 3 } },
    description: 'A diabolist practicing the arts of destruction and corruption.',
  },

  // CHANGELING
  'Autumn Person': {
    name: 'Autumn Person',
    concept: 'Mundane human with extreme Banality; fae danger.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 2, stamina: 2,
      charisma: 1, manipulation: 2, appearance: 1,
      perception: 3, intelligence: 3, wits: 2,
    },
    abilities: {
      talents: { Alertness: 2 },
      skills: {},
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A mundane human, steeped in Banality and a danger to fae.',
  },
  'Dauntain': {
    name: 'Dauntain',
    concept: 'Banality-corrupted changeling—enemy of the Dreaming.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 2,
      charisma: 2, manipulation: 2, appearance: 1,
      perception: 3, intelligence: 2, wits: 3,
    },
    abilities: {
      talents: { Subterfuge: 2 },
      skills: { Survival: 2 },
      knowledges: {},
    },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { arts: { Unleashing: 2 } },
    description: 'A fae who has turned against Dreaming, corrupted by Banality.',
  },
  'Hostile Chimera': {
    name: 'Hostile Chimera',
    concept: 'Aggressive dream-construct—manifested nightmare.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: {
      strength: 4, dexterity: 4, stamina: 2,
      charisma: 1, manipulation: 1, appearance: 0,
      perception: 3, intelligence: 2, wits: 3,
    },
    abilities: {
      talents: { Alertness: 3, Brawl: 3 },
      skills: { Stealth: 2 },
      knowledges: {},
    },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'An aggressive dream-being or nightmare given form.',
  },

  // Mortal (generic, not game-line, but still a usable template)
  'Street Thug': {
    name: 'Street Thug',
    concept: 'Violent, street-level criminal opportunist.',
    game_line: 'mortal',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 3,
      charisma: 2, manipulation: 1, appearance: 1,
      perception: 2, intelligence: 2, wits: 2,
    },
    abilities: {
      talents: { Brawl: 3, Alertness: 2, Intimidation: 2 },
      skills: { Melee: 1, Stealth: 1 },
      knowledges: {},
    },
    willpower: 3,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A typical street-level tough engaged in criminal activity.',
  }
};
