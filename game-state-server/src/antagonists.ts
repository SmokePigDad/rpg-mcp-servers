// oWoD antagonist templates for Storyteller System NPC creation

export interface AntagonistSheet {
  name: string;
  type: string; // 'enemy', 'ally', 'neutral'
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
    knowledge: Record<string, number>;
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
  'First-Gen Vampire': {
    name: 'First-Gen Vampire',
    type: 'enemy',
    attributes: {
      strength: 10, dexterity: 7, stamina: 10,
      charisma: 8, manipulation: 8, appearance: 7,
      perception: 9, intelligence: 10, wits: 9
    },
    abilities: {
      talents: { Brawl: 5, Alertness: 5, Intimidation: 5, Subterfuge: 5 },
      skills: { Melee: 5, Stealth: 5, Firearms: 4 },
      knowledge: { Occult: 5, Medicine: 4, Investigation: 5, Law: 5 }
    },
    willpower: 10,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 10, Dominate: 9, Fortitude: 10 } },
    description: 'An impossibly ancient Kindred; a god among vampires.'
  },
  'Street Thug': {
    name: 'Street Thug',
    type: 'enemy',
    attributes: {
      strength: 3, dexterity: 2, stamina: 3,
      charisma: 2, manipulation: 1, appearance: 1,
      perception: 2, intelligence: 2, wits: 2
    },
    abilities: {
      talents: { Brawl: 3, Alertness: 2, Intimidation: 2 },
      skills: { Melee: 1, Stealth: 1 },
      knowledge: {}
    },
    willpower: 3,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A typical street-level tough engaged in criminal activity.'
  },
  'Bane Spirit': {
    name: 'Bane Spirit',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 4, stamina: 3,
      charisma: 1, manipulation: 4, appearance: 0,
      perception: 5, intelligence: 4, wits: 3
    },
    abilities: {
      talents: { Alertness: 4 },
      skills: {},
      knowledge: { Occult: 4 }
    },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: ['Obfuscate', 'Bane Touch'] },
    description: 'A malicious spiritual entity, twisted in the Umbra.'
  },
  'Technocracy Agent': {
    name: 'Technocracy Agent',
    type: 'enemy',
    attributes: {
      strength: 2, dexterity: 3, stamina: 3,
      charisma: 2, manipulation: 3, appearance: 2,
      perception: 4, intelligence: 4, wits: 4
    },
    abilities: {
      talents: { Alertness: 3, Subterfuge: 4, Intimidation: 2 },
      skills: { Firearms: 4, Melee: 2, Stealth: 3, Drive: 3 },
      knowledge: { Science: 4, Technology: 5, Investigation: 3 }
    },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A field operative of the Technocratic Union, trained in advanced weaponry and counter-magic.'
  }
};
