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
 * oWoD antagonist archetypes for use with the create_antagonist tool.
 * Each template provides a ready-to-use NPC for the Storyteller.
 */
export const ANTAGONIST_TEMPLATES: AntagonistTemplates = {

  // =================================================================
  // VAMPIRE: THE MASQUERADE
  // =================================================================

  'Sabbat Shovelhead': {
    name: 'Sabbat Shovelhead',
    concept: 'Expendable vampire soldier—fodder for the Sword of Caine.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 2, stamina: 2, charisma: 2, manipulation: 1, appearance: 1, perception: 2, intelligence: 1, wits: 2 },
    abilities: { talents: { Brawl: 3, Intimidation: 2 }, skills: { Melee: 2, Drive: 1 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Potence: 2, Celerity: 1 } },
    description: 'A freshly Embraced neonate, hastily trained and thrown into battle by the Sabbat. Fueled by fanaticism and mob mentality.',
  },
  'Camarilla Sheriff': {
    name: 'Camarilla Sheriff',
    concept: 'Enforcer of Kindred law—pragmatic, ruthless, and loyal to the Prince.',
    game_line: 'vampire',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 3, stamina: 4, charisma: 3, manipulation: 3, appearance: 2, perception: 3, intelligence: 3, wits: 4 },
    abilities: { talents: { Brawl: 4, Alertness: 4, Intimidation: 3 }, skills: { Melee: 3, Firearms: 3, Stealth: 2 }, knowledges: { Investigation: 3, Law: 2 } },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Celerity: 2, Potence: 3, Fortitude: 2 } },
    description: 'An elite law enforcer of the Camarilla, skilled in Kindred justice and utterly dedicated to upholding the Traditions.',
  },
  'Nosferatu Information Broker': {
    name: 'Nosferatu Information Broker',
    concept: 'Sewer-dwelling spymaster who trades in secrets.',
    game_line: 'vampire',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 3, charisma: 1, manipulation: 4, appearance: 0, perception: 4, intelligence: 4, wits: 4 },
    abilities: { talents: { Subterfuge: 4, Alertness: 3 }, skills: { Stealth: 5, Larceny: 3 }, knowledges: { Investigation: 4, CitySecrets: 4, Technology: 2 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Obfuscate: 4, Animalism: 3, Potence: 1 } },
    description: 'A creature of the shadows who knows everything that happens in the city. Their information is reliable, but it always comes at a price.',
  },
  'Toreador Harpy': {
    name: 'Toreador Harpy',
    concept: 'The queen bee of Elysium, whose words can make or break reputations.',
    game_line: 'vampire',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 2, charisma: 4, manipulation: 5, appearance: 4, perception: 3, intelligence: 3, wits: 4 },
    abilities: { talents: { Empathy: 3, Expression: 4, Subterfuge: 4 }, skills: { Etiquette: 5, Performance: 3 }, knowledges: { Politics: 4, KindredLore: 3 } },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { disciplines: { Presence: 4, Auspex: 3, Celerity: 2 } },
    description: 'A master of social combat, this Toreador wields influence and status as deadly weapons. Crossing them is social suicide.',
  },

  // =================================================================
  // WEREWOLF: THE APOCALYPSE
  // =================================================================
  
  'Black Spiral Dancer': {
    name: 'Black Spiral Dancer',
    concept: 'Wyrm-corrupted Garou—chaotic, insane, and predatory.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 3, stamina: 3, charisma: 2, manipulation: 2, appearance: 1, perception: 3, intelligence: 2, wits: 3 },
    abilities: { talents: { Brawl: 4, Intimidation: 4 }, skills: { Stealth: 3, Survival: 3 }, knowledges: { Occult: 3 } },
    willpower: 5,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { gifts: { 'Balefire': 2, 'Sense Wyrm': 1 } },
    description: 'A corrupted Garou who has danced the Black Spiral and now serves the Wyrm. They are malicious, insane, and a twisted mockery of Gaia\'s warriors.',
  },
  'Pentex First-Team': {
    name: 'Pentex First-Team',
    concept: 'Corporate paramilitary anti-werewolf commando.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 4, stamina: 4, charisma: 2, manipulation: 3, appearance: 2, perception: 3, intelligence: 3, wits: 3 },
    abilities: { talents: { Brawl: 4, Alertness: 3 }, skills: { Firearms: 5, Drive: 3, Melee: 3 }, knowledges: { Science: 2, Investigation: 2 } },
    willpower: 7,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { equipment: 'Silver-jacketed rounds, advanced body armor, communication gear.' },
    description: "Pentex's elite paramilitary squad, equipped with the best technology and silver weaponry to hunt and exterminate Garou.",
  },
  'Fomori': {
    name: 'Fomori',
    concept: 'Possessed and mutated human—a walking vessel for a Bane.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 2, stamina: 3, charisma: 1, manipulation: 1, appearance: 0, perception: 2, intelligence: 1, wits: 2 },
    abilities: { talents: { Brawl: 2 }, skills: { Melee: 2 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { powers: { 'Armored Hide': 2, 'Toxic Saliva': 1 } },
    description: 'A human warped by the possession of a Bane spirit, now a monstrous creature with grotesque powers and a burning hatred for all life.',
  },
  'Corrupted Theurge': {
    name: 'Corrupted Theurge',
    concept: 'A werewolf shaman who communes with malevolent spirits.',
    game_line: 'werewolf',
    type: 'enemy',
    attributes: { strength: 2, dexterity: 3, stamina: 2, charisma: 2, manipulation: 4, appearance: 2, perception: 4, intelligence: 4, wits: 4 },
    abilities: { talents: { Alertness: 3 }, skills: { Survival: 2 }, knowledges: { Occult: 5, Enigmas: 4, SpiritLore: 4 } },
    willpower: 8,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { rage: 4, gnosis: 8, gifts: { 'Command Spirit': 3, 'Pulse of the Invisible': 2, 'Spirit Drain': 3 } },
    description: 'A former mystic of the Garou who now binds Banes and other dark spirits to their will, twisting the Umbra to serve the Wyrm.',
  },

  // =================================================================
  // MAGE: THE ASCENSION
  // =================================================================

  'Technocracy Hit Squad': {
    name: 'Technocracy Hit Squad',
    concept: 'Team of paramilitary Convention operatives.',
    game_line: 'mage',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 4, stamina: 3, charisma: 2, manipulation: 3, appearance: 2, perception: 4, intelligence: 3, wits: 4 },
    abilities: { talents: { Alertness: 4, Subterfuge: 3 }, skills: { Firearms: 5, Drive: 2, Melee: 2 }, knowledges: { Technology: 4, Science: 4 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Forces: 3, Correspondence: 2 }, equipment: 'Enhanced weaponry, counter-magick fields.' },
    description: 'A team of trained Technocracy Operatives with access to technomantic devices designed to enforce Consensus and eliminate Reality Deviants.',
  },
  'Nephandus': {
    name: 'Nephandus',
    concept: 'A sorcerer utterly corrupted by dark, cosmic powers.',
    game_line: 'mage',
    type: 'enemy',
    attributes: { strength: 2, dexterity: 2, stamina: 2, charisma: 2, manipulation: 3, appearance: 1, perception: 4, intelligence: 4, wits: 3 },
    abilities: { talents: { Subterfuge: 3, Intimidation: 2 }, skills: { Melee: 2 }, knowledges: { Occult: 4 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Entropy: 3, Spirit: 2, Prime: 3 } },
    description: 'A diabolist who practices the arts of destruction and corruption, seeking to unravel reality itself.',
  },
  'New World Order "Man in Black"': {
    name: 'NWO Man in Black',
    concept: 'An unnervingly bland agent of conformity and control.',
    game_line: 'mage',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 3, charisma: 2, manipulation: 4, appearance: 2, perception: 4, intelligence: 3, wits: 4 },
    abilities: { talents: { Alertness: 3, Subterfuge: 4 }, skills: { Drive: 3, Firearms: 2, Stealth: 3 }, knowledges: { Investigation: 4, Technology: 3, Law: 2 } },
    willpower: 8,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { spheres: { Mind: 3, Correspondence: 2 } },
    description: 'An agent of the New World Order, specialized in psychic infiltration, surveillance, and enforcing the status quo. They are rarely seen, but always watching.',
  },

  // =================================================================
  // CHANGELING: THE DREAMING
  // =================================================================

  'Autumn Person': {
    name: 'Autumn Person',
    concept: 'A mundane human so steeped in Banality they are toxic to the fae.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: { strength: 2, dexterity: 2, stamina: 2, charisma: 1, manipulation: 2, appearance: 1, perception: 3, intelligence: 3, wits: 2 },
    abilities: { talents: { Alertness: 2 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { banality: 8 },
    description: 'A mortal whose disbelief and mundane nature can unravel fae magic and even harm Changelings on contact.',
  },
  'Hostile Chimera': {
    name: 'Hostile Chimera',
    concept: 'An aggressive dream-being or nightmare given form.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: { strength: 4, dexterity: 4, stamina: 2, charisma: 1, manipulation: 1, appearance: 0, perception: 3, intelligence: 2, wits: 3 },
    abilities: { talents: { Alertness: 3, Brawl: 3 }, skills: { Stealth: 2 } },
    willpower: 4,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { chimerical_powers: ['Claws', 'Fear Aura'] },
    description: 'A dangerous creature born from the Dreaming, often manifested from fear or rage. It is only visible to those with fae sight.',
  },
  'Thallain Nightmare': {
    name: 'Thallain Nightmare',
    concept: 'A twisted, corrupted fae embodying a dark concept.',
    game_line: 'changeling',
    type: 'enemy',
    attributes: { strength: 5, dexterity: 3, stamina: 4, charisma: 0, manipulation: 3, appearance: 0, perception: 3, intelligence: 2, wits: 3 },
    abilities: { talents: { Brawl: 4, Intimidation: 5 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    supernatural: { banality: 6, arts: { 'Infliction': 4 } },
    description: 'The dark reflection of a Changeling, a creature of the Shadow Court that embodies despair, pain, or terror. Its touch brings nightmares to life.',
  },

  // =================================================================
  // MORTALS & OTHERS
  // =================================================================

  'Street Thug': {
    name: 'Street Thug',
    concept: 'Violent, street-level criminal opportunist.',
    game_line: 'mortal',
    type: 'enemy',
    attributes: { strength: 3, dexterity: 2, stamina: 3, charisma: 2, manipulation: 1, appearance: 1, perception: 2, intelligence: 2, wits: 2 },
    abilities: { talents: { Brawl: 3, Alertness: 2, Intimidation: 2 }, skills: { Melee: 1, Stealth: 1 } },
    willpower: 3,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A typical street-level tough engaged in criminal activity, likely armed with a knife or a cheap pistol.',
  },
  'Seasoned Police Detective': {
    name: 'Seasoned Police Detective',
    concept: 'A cynical but sharp investigator who has seen too much.',
    game_line: 'mortal',
    type: 'neutral',
    attributes: { strength: 2, dexterity: 3, stamina: 2, charisma: 2, manipulation: 3, appearance: 2, perception: 4, intelligence: 3, wits: 4 },
    abilities: { talents: { Alertness: 3, Intimidation: 2 }, skills: { Drive: 2, Firearms: 3, Melee: 2 }, knowledges: { Investigation: 4, Law: 3, CitySecrets: 2 } },
    willpower: 6,
    health_levels: { bruised: 1, hurt: 1, injured: 1, wounded: 1, mauled: 1, crippled: 1, incapacitated: 1 },
    description: 'A veteran detective who is hard to fool and notices things others miss. A significant obstacle for any supernatural trying to operate covertly.',
  },
  'Poltergeist': {
    name: 'Poltergeist',
    concept: 'A violent, chaotic, and non-corporeal spirit.',
    game_line: 'ghost',
    type: 'enemy',
    attributes: { strength: 0, dexterity: 0, stamina: 0, charisma: 0, manipulation: 0, appearance: 0, perception: 3, intelligence: 1, wits: 2 },
    abilities: {},
    willpower: 7,
    health_levels: {}, // Ghosts often use a different system, like Corpus or Essence, tracked via Willpower or a custom pool.
    supernatural: { powers: { 'Telekinesis': 3, 'Manifest Fear': 2 }, essence_pool: 15 },
    description: 'An angry and tormented spirit that lashes out at the physical world, throwing objects and creating an atmosphere of terror. It cannot be fought with fists.',
  }
};