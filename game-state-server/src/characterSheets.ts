/**
 * Modular Character Sheet Formatters
 * -----------------------------------
 * Provides template-driven, game-line-specific character sheet output, supporting
 * Vampire, Werewolf, Mage, Changeling, and a generic fallback. Formatting is
 * functionally and thematically correct for each game. Cleanly integrates
 * conditions/status, derangements, and XP reporting.
 *
 * To add a new game line: Add a function here with the signature below and update
 * the formatSheetByGameLine selector below.
 *
 * API: Each formatter receives a CharacterSheetOptions object and returns
 *      { type: 'text', text: string }
 */
import { HealthTracker } from './health-tracker.js';
export type CharacterSheetOptions = {
  character: any,                   // Core character object (db shape)
  extra?: Record<string, any>,      // Game-line-specific joined data (e.g., disciplines)
  derangements?: any[],             // Array of derangement objects
  conditions?: any[],               // Array of active conditions
  xpHistory?: any[]                 // Array of XP change records (optional; fallback if empty)
};

/**
 * Utility to format derangements/status/XP blocks for all sheets.
 */
function formatStatusBlocks({
  derangements = [],
  conditions = [],
  xpHistory = []
}: Partial<CharacterSheetOptions>): string {
  let blocks = '';
  // Mental State / Derangements
  if (derangements.length) {
    blocks += `🧠 Mental State / Derangements:\n`;
    derangements.forEach(d => {
      blocks += `  - ${d.derangement}${d.description ? `: ${d.description}` : ''}\n`;
    });
  }
  // Conditions/Status Effects
  if (conditions.length) {
    blocks += `🦠 Conditions / Status Effects:\n`;
    conditions.forEach(c => {
      blocks += `  - ${c.condition_name}`;
      if (c.duration !== null && c.duration !== undefined) blocks += ` [${c.duration} rounds left]`;
      if (c.effect_json) blocks += `: ${typeof c.effect_json === 'object' ? JSON.stringify(c.effect_json) : c.effect_json}`;
      blocks += `\n`;
    });
  }
  // XP History (if any)
  if (xpHistory.length) {
    blocks += `📈 XP History (last ${xpHistory.length}):\n`;
    xpHistory.forEach(xp => {
      blocks += `  - ${xp.amount > 0 ? '+' : ''}${xp.amount} XP: ${xp.reason || ''} (${xp.timestamp ? new Date(xp.timestamp).toLocaleDateString() : ''})\n`;
    });
  }
  return blocks;
}
/** Fallback: All WoD lines share these core blocks */
function formatCoreBlocks(character: any): string {
  // Helper: lookup ability rating by case-insensitive name
  function getAbilityRating(abilities: any[], name: string): number {
    if (!Array.isArray(abilities)) return 0;
    const found = abilities.find(
      ab => typeof ab.ability_name === "string" && ab.ability_name.toLowerCase() === name.toLowerCase()
    );
    return found ? Number(found.rating) || 0 : 0;
  }
  // COMMON DICE POOLS for Vampire
  function formatCommonDicePools(character: any): string {
    const abilities = character.abilities || [];
    // For Vampire/oWoD, most frequent pools:
    const pools = [
      {
        label: "Perception + Alertness",
        total:
          Number(character.perception || 0) +
          getAbilityRating(abilities, "Alertness"),
      },
      {
        label: "Dexterity + Brawl",
        total:
          Number(character.dexterity || 0) +
          getAbilityRating(abilities, "Brawl"),
      },
      {
        label: "Manipulation + Subterfuge",
        total:
          Number(character.manipulation || 0) +
          getAbilityRating(abilities, "Subterfuge"),
      },
      // Add more as needed (optional):
      {
        label: "Wits + Intimidation",
        total:
          Number(character.wits || 0) +
          getAbilityRating(abilities, "Intimidation"),
      },
      {
        label: "Dexterity + Firearms",
        total:
          Number(character.dexterity || 0) +
          getAbilityRating(abilities, "Firearms"),
      },
    ];
    // Only show pools where at least one component is nonzero or ability is present
    const filtered = pools.filter(
      p => p.total > 0
    );
    if (filtered.length === 0) return "";
    let block = "🎲 Most-Used Dice Pools:\n";
    block += filtered
      .map((p) => `  - ${p.label}: ${p.total}`)
      .join("\n");
    return block + "\n─────────────────────────────────────────────\n";
  }

  // HEALTH using HealthTracker for graphic block
  let healthBlock = '';
  try {
    const tracker = HealthTracker.from(character.health_levels);
    const healthBoxes = tracker.getBoxArray(); // Array of "", "/", "X", "*", or custom symbols per wound
    const woundPenalty = tracker.getWoundPenalty();
    healthBlock = '❤️ Health Levels:\n';
    healthBlock += `  [${healthBoxes.map((b: string) => b ? b : ' ').join('][')}] (Penalty: ${woundPenalty})\n`;
  } catch (e) {
    // fallback (should never trigger)
    healthBlock = '';
  }

  return [
    `👤 Name: ${character.name}`,
    character.concept ? `🧠 Concept: ${character.concept}` : '',
    character.title ? `👑 Title: ${character.title}` : '',
    (() => {
      let splatInfo = '';
      switch ((character.game_line || '').toLowerCase()) {
        case 'vampire':
          splatInfo = `${character.clan || 'Unknown Clan'}, Gen: ${character.generation || '?'}`;
          break;
        case 'werewolf':
          splatInfo = `${character.tribe || 'Unknown Tribe'}, ${character.auspice || 'Unknown Auspice'}`;
          break;
        case 'mage':
          splatInfo = `${character.tradition_convention || 'Unknown Tradition'}`;
          break;
        case 'changeling':
          splatInfo = `${character.kith || 'Unknown Kith'}, ${character.seeming || 'Unknown Seeming'}`;
          break;
      }
      const gameLine = character.game_line?.[0]?.toUpperCase() + character.game_line?.slice(1);
      return `🗂️  Game Line: ${gameLine}${splatInfo ? ` (${splatInfo})` : ''}`;
    })(),
    '',
    `💪 Strength: ${character.strength}\n🏃 Dexterity: ${character.dexterity}\n❤️ Stamina: ${character.stamina}`,
    `🎭 Charisma: ${character.charisma}\n🗣️ Manipulation: ${character.manipulation}\n🌟 Appearance: ${character.appearance}`,
    `👁️ Perception: ${character.perception}\n🧠 Intelligence: ${character.intelligence}\n⚡ Wits: ${character.wits}`,
    '',
    '────────────── ABILITIES ──────────────',
    character.abilities?.length
      ? character.abilities.map(
          // FIX: Use the correct property names ('name' and 'type') from the repository's aliased query result.
          (ab: any) => `  - ${ab.name} (${ab.type}): ${ab.rating}${ab.specialty ? `, Specialty: ${ab.specialty}` : ''}`
        ).join('\n')
      : '  (none recorded)',
    '',
    formatCommonDicePools(character),
    healthBlock,
    '────────────── CORE TRAITS ──────────────',
    `🔵 Willpower: ${character.willpower_current}/${character.willpower_permanent}`,
    `⭐ Experience: ${character.experience || 0}`,
    character.power_stat_name && character.power_stat_rating !== undefined
      ? `🪄 ${character.power_stat_name}: ${character.power_stat_rating}` : ''
  ].filter(Boolean).join('\n');
}
/**
 * Vampire: Adds Disciplines, Blood Pool, Humanity
 */
export function formatVampireSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: VAMPIRE Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.coterie_name) out += `Coterie: ${character.coterie_name}\n`;
  if (character.sect_status) out += `Sect Status: ${character.sect_status}\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.coterie_name) out += `Coterie: ${character.coterie_name}\n`;
  if (character.sect_status) out += `Sect Status: ${character.sect_status}\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Disciplines, Blood Pool, Humanity
  if (extra.disciplines?.length) {
    out += "\n🩸 Disciplines:\n";
    extra.disciplines.forEach((d: any) => {
      out += `  - ${d.discipline_name}: ${d.rating}\n`;
    });
  }
  out += `Blood Pool: ${character.blood_pool_current || 0}/${character.blood_pool_max || 0}, Humanity: ${character.humanity ?? ''}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Werewolf: Adds Gifts, Rage, Gnosis, Renown
 */
export function formatWerewolfSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: WEREWOLF Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.pack_name) out += `Pack: ${character.pack_name}`;
  if (character.pack_totem) out += ` (Totem: ${character.pack_totem})`;
  if (character.pack_name || character.pack_totem) out += `\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Gifts, Rage, Gnosis, Renown
  if (extra.gifts?.length) {
    out += "\n🐺 Gifts:\n";
    extra.gifts.forEach((g: any) => {
      out += `  - ${g.gift_name} (Rank ${g.rank})\n`;
    });
  }
  out += `Rage: ${character.rage_current || 0}, Gnosis: ${character.gnosis_current || 0}, Renown: Glory ${character.renown_glory || 0}, Honor ${character.renown_honor || 0}, Wisdom ${character.renown_wisdom || 0}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Mage: Adds Spheres, Arete, Quintessence, Paradox
 */
export function formatMageSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: MAGE Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.cabal_name) out += `Cabal: ${character.cabal_name}\n`;
  if (character.paradigm_notes) out += `Paradigm Notes: ${character.paradigm_notes}\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Spheres, Arete, Quintessence, Paradox
  if (extra.spheres?.length) {
    out += "\n🕯️ Spheres:\n";
    extra.spheres.forEach((s: any) => {
      out += `  - ${s.sphere_name}: ${s.rating}\n`;
    });
  }
  out += `Arete: ${character.arete || 0}, Quintessence: ${character.quintessence || 0}, Paradox: ${character.paradox || 0}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Changeling: Adds Arts, Realms, Glamour, Banality
 */
export function formatChangelingSheet(opts: CharacterSheetOptions) {
  const { character, extra = {} } = opts;
  let out = `🎲 World of Darkness: CHANGELING Sheet\n\n`;
  if (character.title) out += `👑 Title: ${character.title}\n`;
  if (character.court) out += `Court: ${character.court}\n`;
  if (character.house) out += `House: ${character.house}\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  if (extra.arts?.length) {
    out += "\n✨ Arts:\n";
    extra.arts.forEach((a: any) => {
      out += `  - ${a.art_name}: ${a.rating}\n`;
    });
  }
  if (extra.realms?.length) {
    out += "🌐 Realms:\n";
    extra.realms.forEach((r: any) => {
      out += `  - ${r.realm_name}: ${r.rating}\n`;
    });
  }
  out += `Glamour: ${character.glamour_current || 0}/${character.glamour_permanent || 0}, Banality: ${character.banality_permanent || 0}\n`;
  if (character.notes) out += `\n📝 Notes:\n${character.notes}\n`;
  return { type: 'text', text: out };
}
/**
 * Fallback: Core WoD sheet structure
 */
export function formatGenericWoDSheet(opts: CharacterSheetOptions) {
  const { character } = opts;
  let out = `🎲 World of Darkness Character Sheet (Generic)\n\n`;
  out += formatCoreBlocks(character) + '\n';
  out += formatStatusBlocks(opts);

  // Health
  // (health block now included in formatCoreBlocks)

  // Power stat if present
  if (character.power_stat_name && character.power_stat_rating !== undefined) {
    out += `${character.power_stat_name}: ${character.power_stat_rating}\n`;
  }
  return { type: 'text', text: out };
}
/**
 * Selector for formatter function (UI/readability extensibility point)
 */
export function formatSheetByGameLine(opts: CharacterSheetOptions) {
  switch ((opts.character.game_line || '').toLowerCase()) {
    case 'vampire':    return formatVampireSheet(opts);
    case 'werewolf':   return formatWerewolfSheet(opts);
    case 'mage':       return formatMageSheet(opts);
    case 'changeling': return formatChangelingSheet(opts);
    default:           return formatGenericWoDSheet(opts);
  }
}
/**
 * To extend for a new game line:
 * 1. Write `function formatHunterSheet(opts: CharacterSheetOptions) {...}`
 * 2. Add `case 'hunter': return formatHunterSheet(opts);` to formatSheetByGameLine
 * 3. (Optionally) update docs/UI layer
 */