// File: combat-engine-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { handleGetTacticalAdvantage } from './narrative-engine.js';

interface CombatState {
  log: string[];
}

let combatState: CombatState = {
  log: []
};

// Utility: Serialize any array of strings/objects as { type: 'text', text: string }[] for MCP compliance
function makeTextContentArray(contentArr: any[]): { type: 'text', text: string }[] {
  return contentArr.map(entry => {
    if (typeof entry === "string") {
      return { type: 'text', text: entry };
    }
    if (entry && typeof entry === "object" && entry.type === "text" && typeof entry.text === "string") {
      // Already compliant
      return entry;
    }
    // For any other objects/values, serialize as prettified JSON
    return { type: 'text', text: JSON.stringify(entry, null, 2) };
  });
}

function rollWodPool(pool_size: number, difficulty: number, has_specialty: boolean, force_result?: string): {
  successes: number,
  rolls: number[],
  isBotch: boolean,
  isSpectacular: boolean,
  resultText: string
} {
    if (pool_size < 0) {
      throw new Error("Pool size must be a non-negative integer.");
    }

    // Handle forced results for testing
    if (force_result) {
      switch (force_result) {
        case 'botch':
          return {
            successes: 0,
            rolls: [1, 1],
            isBotch: true,
            isSpectacular: false,
            resultText: "BOTCH! Catastrophic failure (forced for testing)."
          };
        case 'failure':
          return {
            successes: 0,
            rolls: [3, 4],
            isBotch: false,
            isSpectacular: false,
            resultText: "Failure – no successes (forced for testing)."
          };
        case 'success':
          // Force a 10 to test specialty rules
          const forcedRolls = [10, 8];
          let forcedSuccesses = 0;
          for (const r of forcedRolls) {
            if (r >= difficulty) {
              forcedSuccesses += (r === 10 && has_specialty) ? 2 : 1;
            }
          }
          return {
            successes: forcedSuccesses,
            rolls: forcedRolls,
            isBotch: false,
            isSpectacular: false,
            resultText: `Successes: ${forcedSuccesses} (forced for testing${has_specialty ? ', specialty applied to 10s' : ''})`
          };
        case 'specialty_test':
          // Specifically test specialty rules with multiple 10s
          const specialtyRolls = [10, 10, 6];
          let specialtySuccesses = 0;
          for (const r of specialtyRolls) {
            if (r >= difficulty) {
              specialtySuccesses += (r === 10 && has_specialty) ? 2 : 1;
            }
          }
          return {
            successes: specialtySuccesses,
            rolls: specialtyRolls,
            isBotch: false,
            isSpectacular: false,
            resultText: `Successes: ${specialtySuccesses} (specialty test: ${has_specialty ? '2 tens = 4 successes + 1 regular = 5 total' : '2 tens = 2 successes + 1 regular = 3 total'})`
          };
      }
    }

    if (pool_size < 1) { // Handle 0-dice "chance die" rolls
        const roll = Math.floor(Math.random() * 10) + 1;
        if (roll === 1) return { successes: 0, rolls: [1], isBotch: true, isSpectacular: false, resultText: "BOTCH! Catastrophic failure." };
        if (roll === 10) return { successes: 1, rolls: [10], isBotch: false, isSpectacular: false, resultText: "Successes: 1" };
        return { successes: 0, rolls: [roll], isBotch: false, isSpectacular: false, resultText: "Failure – no successes." };
    }
    if (difficulty < 2 || difficulty > 10) throw new Error("Difficulty must be between 2 and 10");

    const rolls = Array.from({ length: pool_size }, () => Math.floor(Math.random() * 10) + 1);

    let successes = 0;
    let botches = 0;
    for (const r of rolls) {
        if (r >= difficulty) {
            successes += (r === 10 && has_specialty) ? 2 : 1;
        } else if (r === 1) {
            botches += 1;
        }
    }

    // Revised V20/VTM Botch logic: botch only if *no* successes AND at least one '1'
    const isBotch = (successes === 0 && botches > 0);
    const totalSuccesses = successes - botches;
    const finalSuccesses = isBotch ? 0 : totalSuccesses;
    const isSpectacular = !isBotch && finalSuccesses >= 5;

    let resultText = '';
    if (isBotch) {
        resultText = `BOTCH! Catastrophic failure (${botches}x 1's rolled).`;
    } else if (finalSuccesses === 0) {
        resultText = "Failure – no successes.";
    } else {
        resultText = `Successes: ${finalSuccesses}`;
        if (isSpectacular) resultText += " (Spectacular Success!)";
    }

    return { successes: finalSuccesses, rolls, isBotch, isSpectacular, resultText };
}

const toolDefinitions = [
    {
        name: 'roll_wod_pool',
        description: 'Roll an oWoD dice pool. For pool_size 0, performs a chance die roll.',
        inputSchema: {
            type: 'object',
            properties: {
                pool_size: { type: 'integer', minimum: 0, description: 'Number of dice to roll. 0 = chance die.' },
                difficulty: { type: 'integer', minimum: 2, maximum: 10, description: 'Target number for success. Not used for chance die (pool_size 0).' },
                has_specialty: { type: 'boolean', default: false, description: 'Whether the character has a specialty (10s count as 2 successes).' },
                character_id: { type: 'integer', description: 'Character ID for context (optional).' },
                actor_context: { type: 'object', description: 'Actor context for narrative modifiers (optional).' },
                force_result: { type: 'string', enum: ['botch', 'failure', 'success', 'specialty_test'], description: 'For testing: force a specific result type', nullable: true }
            },
            required: ['pool_size']
        }
    },
    {
        name: 'roll_contested_action',
        description: 'Resolve a contested action.',
        inputSchema: {
            type: 'object',
            properties: {
                attacker_pool: { type: 'integer' },
                attacker_difficulty: { type: 'integer' },
                attacker_specialty: { type: 'boolean' },
                defender_pool: { type: 'integer' },
                defender_difficulty: { type: 'integer' },
                defender_specialty: { type: 'boolean' }
            },
            required: ['attacker_pool', 'attacker_difficulty', 'defender_pool', 'defender_difficulty']
        }
    },
    {
        name: 'roll_soak',
        description: 'Roll for soaking damage in oWoD. Args: soak_pool (dice count), damage_type ("bashing","lethal","aggravated"), has_fortitude (bool, default false). Returns narrative result and soak count.',
        inputSchema: {
            type: 'object',
            properties: {
                soak_pool: { type: 'integer' },
                damage_type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'] },
                has_fortitude: { type: 'boolean' }
            },
            required: ['soak_pool', 'damage_type']
        }
    },
    {
        name: 'roll_damage_pool',
        description: 'Rolls a damage pool (e.g., Strength + Weapon Damage) to determine how many levels of damage are dealt after a successful attack.',
        inputSchema: {
            type: 'object',
            properties: {
                pool_size: { type: 'integer' },
                damage_type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'], default: 'lethal' }
            },
            required: ['pool_size'],
        }
    },
    // Initiative & Turn Management (moved from game-state, orchestrator/bridge style):
      {
        name: "set_initiative",
        description: 'Set the initiative order for a scene. Central combat tool—calls game-state for persistence.',
        inputSchema: {
          type: 'object',
          properties: {
            scene_id: { type: 'string' },
            entries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  character_id: { type: ["number", "null"] },
                  npc_id: { type: ["number", "null"] },
                  actor_name: { type: "string" },
                  initiative_score: { type: "number" },
                  turn_order: { type: "number" }
                },
                required: ["actor_name", "initiative_score", "turn_order"]
              }
            }
          },
          required: ['scene_id', 'entries']
        }
      },
      {
        name: 'get_initiative_order',
    description: 'Get the current initiative order for a scene.',
    inputSchema: {
      type: 'object',
      properties: { scene_id: { type: 'string' } },
      required: ['scene_id']
    }
  },
  {
    name: 'advance_turn',
    description: 'Advance the turn order in the current scene.',
    inputSchema: {
      type: 'object',
      properties: { scene_id: { type: 'string' } },
      required: ['scene_id']
    }
  },
  {
    name: 'get_current_turn',
    description: 'Get the actor and round for the current turn in a scene.',
    inputSchema: {
      type: 'object',
      properties: { scene_id: { type: 'string' } },
      required: ['scene_id']
    }
  },
  // --- Social Combat Tool ---
  {
    name: 'roll_social_combat',
    description: 'Perform a contested social action (e.g., Intimidation vs. Willpower). Resolves, provides narrative, and recommends status effect/Willpower impact.',
    inputSchema: {
      type: 'object',
      properties: {
        attacker_name: { type: 'string' },
        attacker_pool: { type: 'number' },
        target_name: { type: 'string' },
        target_pool: { type: 'number' },
        attack_type: { type: 'string', enum: ['intimidation', 'persuasion', 'seduction', 'subterfuge'] }
      },
      required: ['attacker_name', 'attacker_pool', 'target_name', 'target_pool', 'attack_type']
    }
  }
  // ---------- PHASE 2: GAME-LINE SPECIFIC TOOL SCHEMA DEFINITIONS ----------
  ,
  // Vampire: Virtue/Frenzy/Humanity Check
  {
    name: "roll_virtue_check",
    description: "Roll a Virtue check in the Vampire line (e.g., Humanity, Frenzy, Rötschreck). Used for Conscience/Conviction, Self-Control/Instinct, Courage, etc.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "Character to roll for" },
        virtue_name: { type: "string", description: "The virtue being rolled, e.g., 'conscience', 'self-control', 'courage'" },
        difficulty: { type: "integer", description: "Standard difficulty, e.g. 6, 8" }
      },
      required: ["character_id", "virtue_name", "difficulty"]
    }
  },
  // Werewolf: Change Form
  {
    name: "change_form",
    description: "Change forms (Homid, Glabro, Crinos, Hispo, Lupus) for a Werewolf. Returns new attribute modifiers.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "The Garou" },
        target_form: { type: "string", enum: ["Homid", "Glabro", "Crinos", "Hispo", "Lupus"], description: "Form to assume" }
      },
      required: ["character_id", "target_form"]
    }
  },
  // Werewolf: Spend Rage for Extra Actions
  {
    name: "spend_rage_for_extra_actions",
    description: "Spend Werewolf Rage for extra actions in a turn.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "The Garou" },
        actions_to_gain: { type: "integer", description: "Number of additional actions to activate" }
      },
      required: ["character_id", "actions_to_gain"]
    }
  },
  // Mage: Magick Effect Roll
  {
    name: "roll_magick_effect",
    description: "Mage Arete roll for magick effect casting. Returns magick successes and potential Paradox gain.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer", description: "Mage preset" },
        spheres: { type: "array", items: { type: "string" }, description: "Spheres being used (e.g., ['Forces', 'Entropy'])" },
        arete_roll_pool: { type: "integer", description: "Dice pool (usually Arete)" },
        difficulty: { type: "integer", description: "Difficulty (6 coincidental/7+ vulgar)" },
        is_coincidental: { type: "boolean", description: "True for coincidental, False for vulgar" },
        force_result: { type: "string", enum: ["botch", "failure", "success", "specialty_test"], description: "For testing: force a specific result type", nullable: true }
      },
      required: ["character_id", "spheres", "arete_roll_pool", "difficulty", "is_coincidental"]
    }
  },
  // Changeling: Cantrip
  {
    name: "invoke_cantrip",
    description: "Changeling cantrip roll. Rolls Art + Realm pool against difficulty.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "integer" },
        art_pool: { type: "integer", description: "Art dots" },
        realm_pool: { type: "integer", description: "Realm dots" },
        difficulty: { type: "integer" },
        force_result: { type: "string", enum: ["botch", "failure", "success", "specialty_test"], description: "For testing: force a specific result type", nullable: true }
      },
      required: ["character_id", "art_pool", "realm_pool", "difficulty"]
    }
  }
];

const server = new Server({
name: 'rpg-combat-engine-server',
version: '2.0.0',
}, {
capabilities: {
  tools: Object.fromEntries(
    toolDefinitions.map(tool => [tool.name, tool])
  )
},
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Stateless tool: Delegates to rpg-game-state for all persistent initiative operations—
      // DOES NOT read or mutate world/scene/character state here. This handler returns only
      // instructions for the caller to invoke the proper stateful mechanism on rpg-game-state.
      case "roll_initiative_for_scene": {
        const { scene_id, actors } = args;
        return {
          content: makeTextContentArray([
            {
              description:
                "Delegating to rpg-game-state. Please call roll_initiative_for_scene there.",
              next_tool_call: {
                server: "rpg-game-state",
                tool_name: "roll_initiative_for_scene",
                arguments: { scene_id, actors },
              },
            },
          ]),
        };
      }
      // === PHASE 2 NEW TOOLS ===

      // Stateless tool: Computes Virtue check results but DOES NOT read or write character/game/world state.
      // Only returns rolls and check summary. The caller must apply any effects/XP/state change externally.
      case 'roll_virtue_check': {
        const { character_id, virtue_name, difficulty } = args;
        const allowedVirtues = ["Conscience", "Self-Control", "Courage", "Conviction", "Instinct"]; // tune as appropriate
        if (typeof virtue_name !== "string" || !allowedVirtues.includes(virtue_name)) {
          return {
            content: makeTextContentArray([{ type: 'text', text: `Error: 'virtue_name' must be one of: ${allowedVirtues.join(", ")}` }]),
            isError: true
          };
        }
        if (typeof difficulty !== "number" || !Number.isInteger(difficulty) || difficulty < 2 || difficulty > 10) {
          return {
            content: makeTextContentArray([{ type: 'text', text: `Error: 'difficulty' must be an integer between 2 and 10.` }]),
            isError: true
          };
        }
        // The pool_size should eventually be loaded from DB, but is now a placeholder.
        const pool_size = 3;
        const result = rollWodPool(pool_size, difficulty, false);
        return {
          content: makeTextContentArray([
            `🎭 Virtue Check (${virtue_name})\nRolled: [${result.rolls.join(', ')}]\nResult: ${result.successes} successes\n${result.resultText}`,
            JSON.stringify({
              virtue: virtue_name,
              successes: result.successes,
              rolls: result.rolls,
              isBotch: result.isBotch
            })
          ])
        };
      }
      // Stateless tool: Only computes attribute modifiers for physical form change.
      // Does NOT mutate or depend on character state—caller must use the returned modifiers/instructions
      // to update persistent character data with the appropriate stateful tool on the game-state server.
      case 'change_form': {
        const { character_id, target_form } = args;
        const allowedForms = ["Homid", "Glabro", "Crinos", "Hispo", "Lupus"];
        if (typeof target_form !== "string" || !allowedForms.includes(target_form)) {
          return {
            content: makeTextContentArray([
              { type: "text", text: `Error: 'target_form' must be one of: ${allowedForms.join(", ")}` }
            ]),
            isError: true
          };
        }
        const form_mods: Record<string, any> = {
          Homid:   { str: 0, dex: 0, sta: 0, app: 0 },
          Glabro:  { str: +2, dex: 0, sta: +2, app: -1 },
          Crinos:  { str: +4, dex: +1, sta: +3, app: -3 },
          Hispo:   { str: +3, dex: +2, sta: +2, app: -3 },
          Lupus:   { str: +1, dex: +2, sta: +1, app: -2 }
        };
        const mods = form_mods[target_form];
        return {
          content: makeTextContentArray([
            `🐺 Change form: ${target_form}\nAttribute modifiers: ${JSON.stringify(mods)}`,
            { character_id, target_form, modifiers: mods }
          ])
        };
      }

      // Stateless tool: Calculates extra actions requested. DOES NOT spend Rage or mutate initiative state.
      // The client/caller MUST invoke a stateful spend_resource and update_initiative tool elsewhere to commit.
      case 'spend_rage_for_extra_actions': {
        const { character_id, actions_to_gain } = args;
        if (typeof actions_to_gain !== "number" || !Number.isInteger(actions_to_gain) || actions_to_gain < 1 || actions_to_gain > 5) {
          return {
            content: makeTextContentArray([{ type: 'text', text: "Error: 'actions_to_gain' must be an integer between 1 and 5." }]),
            isError: true
          };
        }
        return {
          content: makeTextContentArray([
            `🔥 ${actions_to_gain} action(s) activated by spending Rage for character #${character_id}.`,
            { character_id, actions_gained: actions_to_gain, note: "Caller must actually spend Rage and update initiative elsewhere." }
          ])
        };
      }
      // Stateless tool: Mage magick effect roll.
      // Only computes and outputs result (successes, paradox, botch info).
      // Caller is responsible for invoking *any* stateful resource/Paradox update tool.
      case 'roll_magick_effect': {
        const { character_id, spheres, arete_roll_pool, difficulty, is_coincidental, force_result } = args;
        if (typeof arete_roll_pool !== "number" || !Number.isInteger(arete_roll_pool) || arete_roll_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'arete_roll_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        if (typeof difficulty !== "number" || !Number.isInteger(difficulty) || difficulty < 2 || difficulty > 10) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'difficulty' must be an integer between 2 and 10." }]),
            isError: true
          };
        }
        // Simple oWoD Arete roll; if vulgar & fails, paradox accrues
        const result = rollWodPool(arete_roll_pool, difficulty, false, force_result);
        let paradox_gain = 0;
        let backlash_narrative = "";

        if (!is_coincidental) {
          paradox_gain = Math.max(1, 5 - result.successes);
        }

        // Handle Paradox backlash on botch for vulgar magick
        if (result.isBotch && !is_coincidental) {
          paradox_gain += 3; // Additional paradox for botched vulgar magick
          backlash_narrative = "\n🌪️ PARADOX BACKLASH! The vulgar magick botch tears at reality itself. The mage suffers immediate consequences as the universe strikes back against their hubris.";
        }

        let output = `✨ Mage Magick Roll\nRolled: [${result.rolls.join(', ')}]\nSuccesses: ${result.successes}\nParadox Gained: ${paradox_gain}`;
        if (backlash_narrative) {
          output += backlash_narrative;
        }

        return {
          content: makeTextContentArray([
            output,
            JSON.stringify({
              character_id,
              spheres,
              successes: result.successes,
              paradox_gain,
              isBotch: result.isBotch,
              backlash: result.isBotch && !is_coincidental
            })
          ])
        };
      }
      // Stateless tool: Changeling Cantrip roll.
      // Computes result (success, botch, banality). Does NOT mutate glamour, banality, or character state.
      // Caller must use results to update state via other tools.
      case 'invoke_cantrip': {
        const { character_id, art_pool, realm_pool, difficulty, force_result } = args;
        if (typeof art_pool !== "number" || !Number.isInteger(art_pool) || art_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'art_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        if (typeof realm_pool !== "number" || !Number.isInteger(realm_pool) || realm_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'realm_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        if (typeof difficulty !== "number" || !Number.isInteger(difficulty) || difficulty < 2 || difficulty > 10) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'difficulty' must be an integer between 2 and 10." }]),
            isError: true
          };
        }
        const total_pool = (art_pool || 0) + (realm_pool || 0);
        const result = rollWodPool(total_pool, difficulty, false, force_result);

        let banality_narrative = "";
        let banality_gain = 0;

        // Handle Banality trigger on botch
        if (result.isBotch) {
          banality_gain = 1; // Changeling gains 1 point of Banality
          banality_narrative = "\n💀 BANALITY SURGE! The botched cantrip backfires, and the cold touch of mundane reality seeps into the changeling's soul. The magic fails catastrophically, leaving them more disconnected from their fae nature.";
        }

        let output = `🎠 Cantrip: Art + Realm (${art_pool}+${realm_pool}) -> Rolled: [${result.rolls.join(', ')}], Successes: ${result.successes}`;
        if (banality_narrative) {
          output += banality_narrative;
        }

        return {
          content: makeTextContentArray([
            output,
            JSON.stringify({
              character_id,
              successes: result.successes,
              rolls: result.rolls,
              isBotch: result.isBotch,
              banality_gain,
              banality_triggered: result.isBotch
            })
          ])
        };
      }
      // Stateless tool: Generic WoD dice pool. Computes only; NO character/resource/world state mutation.
      // Any spending of Willpower, resource, or logging must be invoked externally by the consumer.
      case 'roll_wod_pool': {
        const { pool_size, difficulty, has_specialty = false, character_id, actor_context, force_result, ...rest } = args;
      
        // --- Input Validation ---
        if (typeof pool_size !== "number" || pool_size < 0 || !Number.isFinite(pool_size) || !Number.isInteger(pool_size)) {
          return { content: makeTextContentArray(
            ["Error: 'pool_size' must be a non-negative integer."]), isError: true };
        }
      
        // For chance die rolls (pool_size = 0), difficulty is not used, so we can be more lenient
        let validatedDifficulty = difficulty;
        if (pool_size > 0) {
          if (typeof difficulty !== "number" || !Number.isFinite(difficulty) || difficulty < 2 || difficulty > 10 || !Number.isInteger(difficulty)) {
            return { content: makeTextContentArray(
              ["Error: 'difficulty' must be an integer between 2 and 10."]), isError: true };
          }
        } else {
          // For chance die, set a default difficulty (won't be used anyway)
          if (typeof difficulty !== "number" || !Number.isFinite(difficulty)) {
            validatedDifficulty = 6; // Default, but won't affect chance die logic
          }
        }
      
        let willpowerWarning = "";
        let narrativeApplied = false;
        let narrativeDetail: string[] = [];
        let narrativePool = pool_size;
        let narrativeDiff = validatedDifficulty;
      
        // Check for legacy or invalid willpower param
        if ('spend_willpower_for_success' in rest) {
          willpowerWarning = "⚠️ CRITICAL WARNING: 'spend_willpower_for_success' is not supported in this tool. Always call 'spend_resource' to spend Willpower BEFORE rolling. No Willpower bonus will be applied!";
        }
      
        if (actor_context) {
          try {
            const result = handleGetTacticalAdvantage({ actor: actor_context });
            if (result && typeof result.modifiers === "number") {
              narrativeDiff = Math.max(2, narrativeDiff + result.modifiers);
              narrativeApplied = result.modifiers !== 0;
              if (result.reasons?.length) narrativeDetail = result.reasons;
            }
          } catch (e) {
            console.error("Narrative engine error:", e);
          }
        }
      
        const result = rollWodPool(narrativePool, narrativeDiff, has_specialty, force_result);
        let successes = result.successes;
      
        let output = `🎲 oWoD Dice Pool Roll\n\n`;
        output += `Pool Size: ${narrativePool}`;
        if (narrativePool > 0) output += `, Difficulty: ${narrativeDiff}`;
        output += `, Specialty: ${has_specialty ? '✅' : 'No'}\n`;
        if (narrativeApplied && narrativeDetail.length > 0) {
          output += `Narrative Modifiers Applied: ${narrativeDetail.join(" | ")}\n`;
        }
        if (willpowerWarning) {
          output += willpowerWarning + "\n";
        }
        output += `Rolled: [${result.rolls.join(', ')}]\n`;
        output += `➡  Result: ${successes} success${successes !== 1 ? 'es' : ''}\n`;
      
        // Quality Feedback
        let feedback = "";
        if (result.isBotch) {
          feedback = "Critical Botch! Catastrophic failure.";
        } else if (successes === 0) {
          feedback = "Failure – No successes.";
        } else if (successes === 1) {
          feedback = "Marginal Success. You barely manage it.";
        } else if (successes === 2) {
          feedback = "Moderate Success.";
        } else if (successes === 3) {
          feedback = "Strong Success!";
        } else if (successes === 4) {
          feedback = "Excellent Success!";
        } else if (successes >= 5) {
          feedback = "Spectacular Success!";
        }
        // Outcome label
        let outcomeLabel = result.isBotch ? "[BOTCH]" : (successes > 0 ? "[SUCCESS]" : "[FAILURE]");
        output += `${outcomeLabel} ${feedback}\n`;
        // Basic result
        output += `${result.resultText}\n`;
      
        // Removed combatState.log (no persistent or global state should be mutated in stateless tools)
        // combatState.log.push(`Roll: [${result.rolls.join(', ')}] vs diff ${narrativeDiff} -> ${successes} successes.`);
      
        return { content: makeTextContentArray([output, JSON.stringify({})]) };
      }
      
      // Stateless tool: Computes both halves of a contested action, does not mutate attacker/defender
      // records or write world state. Consumer must apply outcome elsewhere.
      case 'roll_contested_action': {
        const { attacker_pool, attacker_difficulty, attacker_specialty, defender_pool, defender_difficulty, defender_specialty } = args;
      
        // --- Input Validation ---
        if (
          typeof attacker_pool !== "number" || attacker_pool < 0 || !Number.isFinite(attacker_pool) ||
          typeof attacker_difficulty !== "number" || !Number.isFinite(attacker_difficulty) || attacker_difficulty < 2 || attacker_difficulty > 10 ||
          typeof defender_pool !== "number" || defender_pool < 0 || !Number.isFinite(defender_pool) ||
          typeof defender_difficulty !== "number" || !Number.isFinite(defender_difficulty) || defender_difficulty < 2 || defender_difficulty > 10
        ) {
          return { content: makeTextContentArray(
            ["Error: All pools must be non-negative integers and all difficulties must be 2–10."]), isError: true };
        }
      
        const atk = rollWodPool(attacker_pool, attacker_difficulty, !!attacker_specialty);
        const def = rollWodPool(defender_pool, defender_difficulty, !!defender_specialty);
        const net = atk.successes - def.successes;
        
        let logtxt = `🎯 CONTESTED/RESISTED ACTION\n\n`;
        logtxt += `Attacker: Pool ${attacker_pool} vs Diff ${attacker_difficulty} → Rolls: [${atk.rolls.join(', ')}] (${atk.successes} successes)${atk.isBotch ? ' [BOTCH]' : ''}\n`;
        logtxt += `Defender: Pool ${defender_pool} vs Diff ${defender_difficulty} → Rolls: [${def.rolls.join(', ')}] (${def.successes} successes)${def.isBotch ? ' [BOTCH]' : ''}\n\n`;
        
        logtxt += `RESULT: `;
        if (atk.isBotch) {
          logtxt += `Attacker BOTCHES—automatic failure.`;
        } else if (def.isBotch) {
          logtxt += `Defender BOTCHES! Attacker wins automatically.`;
        } else if (net > 0) {
          logtxt += `Attacker wins by ${net} net success${net > 1 ? 'es' : ''}.`;
        } else {
          logtxt += `STANDOFF—tie or defender wins.`;
        }
      
        combatState.log.push(`Contested roll: Atk [${atk.successes}] vs Def [${def.successes}]`);
        return { content: makeTextContentArray([logtxt]) };
      }

      // 1. roll_soak
      // Stateless tool: Computes result of soak roll. Never mutates health, damage, or character state.
      // All state adjustment (damage reduction) must be handled by stateful logic in game-state-server.
      case 'roll_soak': {
        const { soak_pool, damage_type, has_fortitude = false } = args;
        const allowedTypes = ['bashing', 'lethal', 'aggravated'];
        if (typeof damage_type !== "string" || !allowedTypes.includes(damage_type)) {
          return {
            content: makeTextContentArray([{ type: "text", text: `Error: 'damage_type' must be one of: ${allowedTypes.join(", ")}` }]),
            isError: true
          };
        }
        if (typeof soak_pool !== "number" || !Number.isInteger(soak_pool) || soak_pool < 0) {
          return {
            content: makeTextContentArray([{ type: "text", text: "Error: 'soak_pool' must be a non-negative integer." }]),
            isError: true
          };
        }
        // aggravated with no fortitude: cannot soak
        if (damage_type === 'aggravated' && !has_fortitude) {
          return {
            content: makeTextContentArray([
              `💥 Aggravated damage is normally unsoakable by mortals and most supernaturals! Only beings with Fortitude may roll soak aggravated damage (difficulty 8).\n\n0 soaks.`
            ])
          };
        }
        // Roll soak dice
        let diff = 6;
        if (damage_type === 'aggravated') diff = 8;
        const rolls = soak_pool > 0 ? Array.from({ length: soak_pool }, () => Math.floor(Math.random() * 10) + 1) : [];
        const soaks = rolls.filter(r => r >= diff).length;
        let narration = ``;
        if (rolls.length === 0) {
          narration = `No soak dice rolled; 0 soaks.`;
        } else {
          narration += `Soak Dice: [${rolls.join(', ')}] vs diff ${diff}\n`;
          narration += `➡  Soaked ${soaks} ${soaks === 1 ? 'point' : 'points'} of damage.\n`;
          if (soaks === 0) narration += `You fail to soak any damage!`;
          else if (soaks < soak_pool / 2) narration += `Marginal soak – you reduce some, but not all, of the blow.`;
          else if (soaks < soak_pool) narration += `Solid soak effort.`;
          else narration += `Perfect soak! You shrug it off entirely.`;
        }
        return {
          content: makeTextContentArray([narration])
        };
      }

      // --- Initiative & Turn Management Orchestration ---
      // Stateless tool: Delegates initiative persistence to rpg-game-state; never mutates scene/initiative here.
      // All changes must be committed by explicitly calling the tool in rpg-game-state.
      case 'set_initiative': {
        const { scene_id, entries } = args;
        return {
          content: makeTextContentArray([
            `🗂 Set initiative for Scene ${scene_id}.`,
            {
              description: "This API call delegates initiative persistence to rpg-game-state. Please call set_initiative there.",
              next_tool_call: {
                server: 'rpg-game-state',
                tool_name: 'set_initiative',
                arguments: { scene_id, entries }
              }
            }
          ])
        };
      }

      // Stateless tool: Delegates to rpg-game-state for authoritative initiative order.
      // Reads no state; returns next_tool_call contract for orchestration.
      case 'get_initiative_order': {
        const { scene_id } = args;
        return {
          content: makeTextContentArray([
            {
              description: "Delegating to rpg-game-state. Please call get_initiative_order there.",
              next_tool_call: {
                server: 'rpg-game-state',
                tool_name: 'get_initiative_order',
                arguments: { scene_id }
              }
            }
          ])
        };
      }

      // Stateless tool: Advance turn orchestration. No state change; returns instructions for rpg-game-state.
      case 'advance_turn': {
        const { scene_id } = args;
        return {
          content: makeTextContentArray([
            {
              description: "Delegating to rpg-game-state. Please call advance_turn there.",
              next_tool_call: {
                server: 'rpg-game-state',
                tool_name: 'advance_turn',
                arguments: { scene_id }
              }
            }
          ])
        };
      }

      // Stateless tool: Orchestrates current turn lookups by deferring to rpg-game-state.
      // Does not inspect or mutate turn/scene state itself.
      case 'get_current_turn': {
        const { scene_id } = args;
        return {
          content: makeTextContentArray([
            {
              description: "Delegating to rpg-game-state. Please call get_current_turn there.",
              next_tool_call: {
                server: 'rpg-game-state',
                tool_name: 'get_current_turn',
                arguments: { scene_id }
              }
            }
          ])
        };
      }

      // --- Social Combat System ---
      // Stateless tool: Social Combat. Rolls both sides; returns outcome plus a recommendation instruction.
      // Never applies, mutates, or records effects—caller must dispatch all stateful changes using result.
      case 'roll_social_combat': {
        const { attacker_name, attacker_pool, target_name, target_pool, attack_type } = args;
        const allowedAttackTypes = ["intimidation", "persuasion", "deception", "seduction"];
        let errMsgs: string[] = [];
        if (typeof attacker_pool !== "number" || !Number.isInteger(attacker_pool) || attacker_pool < 0) {
          errMsgs.push("Error: 'attacker_pool' must be a non-negative integer.");
        }
        if (typeof target_pool !== "number" || !Number.isInteger(target_pool) || target_pool < 0) {
          errMsgs.push("Error: 'target_pool' must be a non-negative integer.");
        }
        if (typeof attack_type !== "string" || !allowedAttackTypes.includes(attack_type)) {
          errMsgs.push(`Error: 'attack_type' must be one of: ${allowedAttackTypes.join(", ")}`);
        }
        if (errMsgs.length > 0) {
          return {
            content: makeTextContentArray(errMsgs.map(msg => ({ type: "text", text: msg }))),
            isError: true
          };
        }
        const attackRoll = rollWodPool(attacker_pool, 6, false);
        const defendRoll = rollWodPool(target_pool, 6, false);
        const net = attackRoll.successes - defendRoll.successes;
        let recommendation = null;
        let outcome = "";
    
        if (attackRoll.isBotch) {
          outcome = `❌ ${attacker_name} botches their social gambit—this spectacular failure may have lasting consequences.`;
        } else if (defendRoll.isBotch) {
          outcome = `💥 ${target_name} botches their defense—severe embarrassment or compliance follows!`;
        } else if (net > 0) {
          outcome = `🗣️ ${attacker_name} wins the social exchange by ${net} net success${net > 1 ? "es" : ""}.`;
          if (net >= 3) {
            recommendation = {
              action: "apply_status_effect",
              target: target_name,
              effect_name: (attack_type === "intimidation" ? "Intimidated" : attack_type === "persuasion" ? "Convinced" : attack_type.charAt(0).toUpperCase() + attack_type.slice(1)),
              duration_type: net >= 5 ? "scene" : "rounds",
              duration_value: net >= 5 ? null : net
            };
          } else {
            recommendation = {
              action: "apply_status_effect",
              target: target_name,
              effect_name: "Shaken",
              duration_type: "rounds",
              duration_value: net
            };
          }
        } else if (net < 0) {
          outcome = `🛡️ ${target_name} successfully resists the social gambit by ${-net} net success${net < -1 ? "es" : ""}.`;
          recommendation = null;
        } else {
          outcome = "Draw—both sides hold their ground. No effect.";
          recommendation = null;
        }
        const outputText = `🎭 Social Combat (${attack_type}):\n` +
          `${attacker_name} rolls [${attackRoll.rolls.join(', ')}] (${attackRoll.successes} successes)\n` +
          `${target_name} rolls [${defendRoll.rolls.join(', ')}] (${defendRoll.successes} successes)\n\n` +
          outcome;
    
        const resultObject: any = { net_successes: net, outcome };
        if (recommendation) resultObject.recommendation = recommendation;
    
        return {
          content: makeTextContentArray([
            outputText,
            JSON.stringify(resultObject)
          ])
        };
      }
      default:
        // Stateless tool: Damage pool roll; returns only the rolled damage. Applies no harm or wound to any entity.
        // The caller is responsible for applying result to persistent world/character via stateful tool.
        case 'roll_damage_pool': {
          const { pool_size, damage_type = 'lethal' } = args;
          const allowedTypes = ['bashing', 'lethal', 'aggravated'];
          if (typeof damage_type !== "string" || !allowedTypes.includes(damage_type)) {
            return {
              content: makeTextContentArray([{ type: "text", text: `Error: 'damage_type' must be one of: ${allowedTypes.join(", ")}` }]),
              isError: true
            };
          }
          if (typeof pool_size !== "number" || !Number.isInteger(pool_size) || pool_size < 0) {
            return {
              content: makeTextContentArray([{ type: "text", text: "'pool_size' must be a non-negative integer." }]),
              isError: true
            };
          }
          // Roll pool_size d10s at difficulty 6
          const rolls = pool_size > 0 ? Array.from({ length: pool_size }, () => Math.floor(Math.random() * 10) + 1) : [];
          const successes = rolls.filter((r) => r >= 6).length;
          let desc = `💥 Damage Pool Roll`;
          desc += `\n\nPool Size: ${pool_size}, Difficulty: 6\n`;
          desc += `Damage Type: ${damage_type.charAt(0).toUpperCase() + damage_type.slice(1)}\n`;
          desc += `Rolled: [${rolls.join(', ')}]\n➡  Result: ${successes} ${successes === 1 ? 'level' : 'levels'} of ${damage_type} damage.\n`;
          if (pool_size === 0) {
            desc += "No dice rolled; result is 0 levels of damage.\n";
          } else if (successes === 0) {
            desc += "No damage inflicted!";
          } else if (successes >= 5) {
            desc += "Devastating blow!";
          } else if (successes >= 3) {
            desc += "Solid hit.";
          } else if (successes === 1) {
            desc += "Glancing blow.";
          }
      
          // Return both text broadcast and machine-usable structure
          return {
            content: makeTextContentArray([
              desc,
              JSON.stringify({ successes, damage_type })
            ])
          };
        }

        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: makeTextContentArray([`Error: ${error.message}`]),
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error('oWoD RPG Combat Engine MCP Server v2.0 running on stdio');

