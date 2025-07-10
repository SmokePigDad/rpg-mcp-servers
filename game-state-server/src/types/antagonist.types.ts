export interface AntagonistRow {
  id: number;
  name: string;
  template: string;
  concept: string;
  game_line: string;
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  blood_pool_current: number;
  notes: string;
}

export interface NpcRow {
  id: number;
  name: string;
  template: string;
  concept: string;
  game_line: string;
  strength: number;
  dexterity: number;
  stamina: number;
  charisma: number;
  manipulation: number;
  appearance: number;
  perception: number;
  intelligence: number;
  wits: number;
  willpower_current: number;
  willpower_permanent: number;
  health_levels: string;
  blood_pool_current: number;
  notes: string;
}

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

export type AntagonistTemplates = Record<string, AntagonistSheet>;