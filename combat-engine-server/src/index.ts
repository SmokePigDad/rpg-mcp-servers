// File: combat-engine-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Utility: single block response
function makeTextContent(text: string): { type: 'text'; text: string } {
    return { type: 'text', text };
}

// --- oWoD Pool Roller (core for most tools) ---
function rollWodPool(pool_size: number, difficulty: number, has_specialty: boolean, wound_penalty: number = 0, force_result?: string) {
    if (pool_size < 0) throw new Error("Pool size must be a non-negative integer.");
    const final_pool_size = Math.max(0, pool_size - wound_penalty);
    // Forced results for testing
    if (force_result) {
        switch (force_result) {
            case 'botch': return { successes: 0, rolls: [1, 1], isBotch: true, isSpectacular: false, resultText: "BOTCH! Catastrophic failure (forced for testing)." };
            case 'failure': return { successes: 0, rolls: [3, 4], isBotch: false, isSpectacular: false, resultText: "Failure – no successes (forced for testing)." };
            case 'success': {
                const forcedRolls = [10, 8];
                let forcedSuccesses = 0;
                for (const r of forcedRolls) { if (r >= difficulty) forcedSuccesses += (r === 10 && has_specialty) ? 2 : 1; }
                return { successes: forcedSuccesses, rolls: forcedRolls, isBotch: false, isSpectacular: false, resultText: `Successes: ${forcedSuccesses} (forced for testing${has_specialty ? ', specialty applied to 10s' : ''})` };
            }
            case 'specialty_test': {
                const specialtyRolls = [10, 10, 6];
                let specialtySuccesses = 0;
                for (const r of specialtyRolls) { if (r >= difficulty) specialtySuccesses += (r === 10 && has_specialty) ? 2 : 1; }
                return { successes: specialtySuccesses, rolls: specialtyRolls, isBotch: false, isSpectacular: false, resultText: `Successes: ${specialtySuccesses} (specialty test)` };
            }
        }
    }
    if (final_pool_size < 1) {
        const roll = Math.floor(Math.random() * 10) + 1;
        if (roll === 1) return { successes: 0, rolls: [1], isBotch: true, isSpectacular: false, resultText: "BOTCH! Catastrophic failure." };
        if (roll === 10) return { successes: 1, rolls: [10], isBotch: false, isSpectacular: false, resultText: "Successes: 1" };
        return { successes: 0, rolls: [roll], isBotch: false, isSpectacular: false, resultText: "Failure – no successes." };
    }
    if (difficulty < 2 || difficulty > 10) throw new Error("Difficulty must be between 2 and 10");
    const rolls = Array.from({ length: final_pool_size }, () => Math.floor(Math.random() * 10) + 1);
    let successes = 0, botches = 0;
    for (const r of rolls) {
        if (r >= difficulty) successes += (r === 10 && has_specialty) ? 2 : 1;
        else if (r === 1) botches += 1;
    }
    const isBotch = (successes === 0 && botches > 0);
    const totalSuccesses = successes - botches;
    const finalSuccesses = isBotch ? 0 : Math.max(0, totalSuccesses);
    const isSpectacular = !isBotch && finalSuccesses >= 5;
    let resultText = '';
    if (isBotch) resultText = `BOTCH! Catastrophic failure (${botches}x 1's rolled).`;
    else if (finalSuccesses === 0) resultText = "Failure – no successes.";
    else { resultText = `Successes: ${finalSuccesses}`; if (isSpectacular) resultText += " (Spectacular Success!)"; }
    return { successes: finalSuccesses, rolls, isBotch, isSpectacular, resultText };
}

// --- Tool Definitions (from TOOLS.md) ---
const toolDefinitions = [
    {
        name: 'roll_wod_pool',
        description: 'Roll an oWoD dice pool. For pool_size 0, performs a chance die roll.',
        inputSchema: {
            type: 'object',
            properties: {
                pool_size: { type: 'integer', minimum: 0, description: 'Number of dice to roll.' },
                difficulty: { type: 'integer', minimum: 2, maximum: 10, description: 'Target number for success.' },
                has_specialty: { type: 'boolean', default: false, description: 'Specialty: 10s count as 2 successes.' },
                wound_penalty: { type: 'integer', minimum: 0, default: 0, description: 'Penalty to pool (subtracted before roll).' },
                force_result: { type: 'string', enum: ['botch', 'failure', 'success', 'specialty_test'], description: 'Force a roll result (testing).' }
            },
            required: ['pool_size']
        }
    },
    {
        name: 'roll_contested_action',
        description: 'Resolve a contested action roll (attacker vs defender).',
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
        description: 'Roll to soak incoming damage.',
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
        description: 'Roll a damage pool to determine damage dealt.',
        inputSchema: {
            type: 'object',
            properties: {
                pool_size: { type: 'integer' },
                damage_type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'], default: 'lethal' }
            },
            required: ['pool_size']
        }
    },
    {
        name: "set_initiative",
        description: 'Set initiative order for a scene (stateless stub for demo).',
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
        description: 'Get current initiative order for a scene (stateless stub for demo).',
        inputSchema: {
            type: 'object',
            properties: { scene_id: { type: 'string' } },
            required: ['scene_id']
        }
    },
    {
        name: 'advance_turn',
        description: 'Advance the turn in a scene (stateless stub for demo).',
        inputSchema: {
            type: 'object',
            properties: { scene_id: { type: 'string' } },
            required: ['scene_id']
        }
    },
    {
        name: 'get_current_turn',
        description: 'Get current turn for a scene (stateless stub for demo).',
        inputSchema: {
            type: 'object',
            properties: { scene_id: { type: 'string' } },
            required: ['scene_id']
        }
    },
    {
        name: 'roll_social_combat',
        description: 'Roll a contested social action (attacker vs target) for social combat.',
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
    },
    {
        name: "roll_virtue_check",
        description: "Roll a virtue check (Vampire: Conscience etc).",
        inputSchema: {
            type: "object",
            properties: {
                character_id: { type: "integer" },
                virtue_name: { type: "string" },
                difficulty: { type: "integer" }
            },
            required: ["character_id", "virtue_name", "difficulty"]
        }
    },
    {
        name: "change_form",
        description: "Werewolf: Change form (returns modifiers, no DB change).",
        inputSchema: {
            type: "object",
            properties: {
                character_id: { type: "integer" },
                target_form: { type: "string", enum: ["Homid", "Glabro", "Crinos", "Hispo", "Lupus"] }
            },
            required: ["character_id", "target_form"]
        }
    },
    {
        name: "spend_rage_for_extra_actions",
        description: "Werewolf: Spend Rage for extra actions (returns narrative only).",
        inputSchema: {
            type: "object",
            properties: {
                character_id: { type: "integer" },
                actions_to_gain: { type: "integer" }
            },
            required: ["character_id", "actions_to_gain"]
        }
    },
    {
        name: "roll_magick_effect",
        description: "Mage: Roll magick effect (Arete roll etc).",
        inputSchema: {
            type: "object",
            properties: {
                character_id: { type: "integer" },
                spheres: { type: "array", items: { type: "string" } },
                arete_roll_pool: { type: "integer" },
                difficulty: { type: "integer" },
                is_coincidental: { type: "boolean" },
                force_result: { type: "string", enum: ["botch", "failure", "success", "specialty_test"] }
            },
            required: ["character_id", "spheres", "arete_roll_pool", "difficulty", "is_coincidental"]
        }
    },
    {
        name: "invoke_cantrip",
        description: "Changeling: Roll Cantrip (Art+Realm, diff, optional force_result).",
        inputSchema: {
            type: "object",
            properties: {
                character_id: { type: "integer" },
                art_pool: { type: "integer" },
                realm_pool: { type: "integer" },
                difficulty: { type: "integer" },
                force_result: { type: "string", enum: ["botch", "failure", "success", "specialty_test"] }
            },
            required: ["character_id", "art_pool", "realm_pool", "difficulty"]
        }
    }
];

const server = new Server(
    { name: 'rpg-combat-engine-server', version: '3.0.0' },
    { capabilities: { tools: Object.fromEntries(toolDefinitions.map(t => [t.name, t])) } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'roll_wod_pool': {
                const { pool_size, difficulty = 6, has_specialty = false, wound_penalty = 0, force_result } = args;
                if (typeof pool_size !== "number" || pool_size < 0) return { content: [makeTextContent("Error: 'pool_size' must be a non-negative integer.")], isError: true };
                if (pool_size > 0 && (typeof difficulty !== "number" || difficulty < 2 || difficulty > 10)) return { content: [makeTextContent("Error: 'difficulty' must be an integer between 2 and 10.")], isError: true };
                const result = rollWodPool(pool_size, difficulty, !!has_specialty, wound_penalty, force_result);
                let output = `🎲 oWoD Dice Pool Roll\nBase Pool: ${pool_size}`;
                if (wound_penalty && wound_penalty > 0) output += `, Wound Penalty: -${wound_penalty}\nFinal Pool: ${Math.max(0, pool_size - wound_penalty)}`;
                output += `\nDifficulty: ${difficulty}, Specialty: ${has_specialty ? '✅' : 'No'}`;
                output += `\nRolled: [${result.rolls.join(', ')}]`;
                output += `\n➡ Result: ${result.resultText}`;
                return { content: [makeTextContent(output)] };
            }
            case 'roll_contested_action': {
                const { attacker_pool, attacker_difficulty, attacker_specialty = false, defender_pool, defender_difficulty, defender_specialty = false } = args;
                if ([attacker_pool, defender_pool].some(x => typeof x !== 'number' || x < 0)) return { content: [makeTextContent("Error: All pools must be non-negative integers.")], isError: true };
                if ([attacker_difficulty, defender_difficulty].some(x => typeof x !== 'number' || x < 2 || x > 10)) return { content: [makeTextContent("Error: All difficulties must be in the range 2–10.")], isError: true };
                const atk = rollWodPool(attacker_pool, attacker_difficulty, attacker_specialty);
                const def = rollWodPool(defender_pool, defender_difficulty, defender_specialty);
                const net = atk.successes - def.successes;
                let resultLine = `🎯 CONTESTED ACTION\nAttacker: Pool ${attacker_pool} vs Diff ${attacker_difficulty} → Rolls: [${atk.rolls.join(', ')}] (${atk.successes} successes)\nDefender: Pool ${defender_pool} vs Diff ${defender_difficulty} → Rolls: [${def.rolls.join(', ')}] (${def.successes} successes)\n\nResult: `;
                if (atk.isBotch) resultLine += "Attacker BOTCHES!";
                else if (def.isBotch) resultLine += "Defender BOTCHES! Attacker wins.";
                else if (net > 0) resultLine += `Attacker nets +${net} successes.`;
                else resultLine += "Defender wins or ties.";
                return { content: [makeTextContent(resultLine)] };
            }
            case 'roll_soak': {
                const { soak_pool, damage_type, has_fortitude = false } = args;
                if (typeof soak_pool !== "number" || soak_pool < 0) return { content: [makeTextContent("Error: 'soak_pool' must be a non-negative integer.")], isError: true };
                if (!["bashing", "lethal", "aggravated"].includes(damage_type)) return { content: [makeTextContent("Error: 'damage_type' must be one of: bashing, lethal, aggravated.")], isError: true };
                // Soak rolls: Fortitude allows soaking lethal/aggravated
                const soakDifficulty = 6;
                let canSoak = (damage_type === "bashing" || has_fortitude);
                if (damage_type === "aggravated" && !has_fortitude) canSoak = false;
                if (!canSoak) return { content: [makeTextContent("❌ Cannot soak this damage type without Fortitude.")], isError: true };
                const result = rollWodPool(soak_pool, soakDifficulty, false);
                let out = `🛡 Soak Roll [${damage_type}]: Pool ${soak_pool} vs Diff 6 → Rolls: [${result.rolls.join(', ')}]\nResult: ${result.successes} damage mitigated.`;
                if (result.isBotch) out += "\nBOTCH! You actually take an extra level of damage.";
                return { content: [makeTextContent(out)] };
            }
            case 'roll_damage_pool': {
                const { pool_size, damage_type = "lethal" } = args;
                if (typeof pool_size !== "number" || pool_size < 0) return { content: [makeTextContent("Error: 'pool_size' must be a non-negative integer.")], isError: true };
                if (!["bashing", "lethal", "aggravated"].includes(damage_type)) return { content: [makeTextContent("Error: 'damage_type' must be one of: bashing, lethal, aggravated.")], isError: true };
                const roll = rollWodPool(pool_size, 6, false);  // Damage always at diff 6 (core rule)
                let narrative = `💥 Damage Roll: Pool ${pool_size} [${damage_type}] vs Diff 6 → Rolls: [${roll.rolls.join(', ')}]\nResult: ${roll.successes} levels.`;
                if (roll.isBotch) narrative += "\nBOTCH! Mishap occurs – no damage inflicted.";
                return { content: [makeTextContent(narrative)] };
            }
            case 'set_initiative':
            case 'get_initiative_order':
            case 'advance_turn':
            case 'get_current_turn': {
                const note = `🕑 Initiative/Turn: This is a stateless engine. Update and get initiative/turn data from the persistent state server ("rpg-game-state").`;
                return { content: [makeTextContent(note)] };
            }
            case 'roll_social_combat': {
                const { attacker_name, attacker_pool, target_name, target_pool, attack_type } = args;
                if (typeof attacker_pool !== 'number' || typeof target_pool !== 'number') return { content: [makeTextContent("Error: Both pools must be numbers.")], isError: true };
                if (!['intimidation', 'persuasion', 'seduction', 'subterfuge'].includes(attack_type)) return { content: [makeTextContent("Error: 'attack_type' must be valid.")], isError: true };
                const atk = rollWodPool(attacker_pool, 6, false);
                const def = rollWodPool(target_pool, 6, false);
                let result = `🗣 Social Combat: ${attacker_name} attacks (${attack_type}) vs ${target_name}\nAttacker: [${atk.rolls.join(', ')}] (${atk.successes})\nTarget: [${def.rolls.join(', ')}] (${def.successes})\n`;
                if (atk.isBotch) result += "Attacker BOTCHES!";
                else if (def.isBotch) result += "Target BOTCHES! Attacker dominates.";
                else if (atk.successes > def.successes) result += `${attacker_name} dominates by ${atk.successes - def.successes} successes.`;
                else result += `${target_name} resists or prevails.`;
                return { content: [makeTextContent(result)] };
            }
            case 'roll_virtue_check': {
                const { virtue_name, difficulty } = args;
                const allowed = ["Conscience", "Self-Control", "Courage", "Conviction", "Instinct"];
                if (typeof virtue_name !== "string" || !allowed.includes(virtue_name)) return { content: [makeTextContent(`Error: 'virtue_name' must be one of: ${allowed.join(", ")}`)], isError: true };
                if (typeof difficulty !== 'number' || difficulty < 2 || difficulty > 10) return { content: [makeTextContent("Error: 'difficulty' must be an integer between 2 and 10.")], isError: true };
                const pool_size = 3; // Sheet load required—stubbed.
                const result = rollWodPool(pool_size, difficulty, false);
                return { content: [makeTextContent(`🎭 Virtue Check (${virtue_name}) → Rolls: [${result.rolls.join(', ')}], ${result.successes} successes. ${result.resultText}`)] };
            }
            case 'change_form': {
                const { target_form } = args;
                const allowedForms = ["Homid", "Glabro", "Crinos", "Hispo", "Lupus"];
                if (!allowedForms.includes(target_form)) return { content: [makeTextContent(`Error: 'target_form' must be one of: ${allowedForms.join(", ")}`)], isError: true };
                const mods: Record<string, any> = {
                    Homid: { str: 0, dex: 0, sta: 0, app: 0 },
                    Glabro: { str: 2, dex: 0, sta: 2, app: -1 },
                    Crinos: { str: 4, dex: 1, sta: 3, app: -3 },
                    Hispo: { str: 3, dex: 2, sta: 2, app: -3 },
                    Lupus: { str: 1, dex: 2, sta: 1, app: -2 }
                };
                return { content: [makeTextContent(`🐺 Change form: ${target_form}, modifiers: ${JSON.stringify(mods[target_form])}`)] };
            }
            case 'spend_rage_for_extra_actions': {
                const { actions_to_gain } = args;
                if (typeof actions_to_gain !== 'number' || !Number.isInteger(actions_to_gain) || actions_to_gain < 1 || actions_to_gain > 5) return { content: [makeTextContent("Error: 'actions_to_gain' must be an integer between 1 and 5.")], isError: true };
                return { content: [makeTextContent(`🔥 ${actions_to_gain} extra action(s) by spending Rage (caller must spend resource via game-state).`)] };
            }
            case 'roll_magick_effect': {
                const { arete_roll_pool, difficulty, is_coincidental, force_result } = args;
                if (typeof arete_roll_pool !== "number" || arete_roll_pool < 0) return { content: [makeTextContent("Error: 'arete_roll_pool' must be a non-negative integer.")], isError: true };
                if (typeof difficulty !== "number" || difficulty < 2 || difficulty > 10) return { content: [makeTextContent("Error: 'difficulty' must be an integer between 2 and 10.")], isError: true };
                const result = rollWodPool(arete_roll_pool, difficulty, false, 0, force_result);
                let paradox_gain = (!is_coincidental) ? Math.max(1, 5 - result.successes) : 0;
                if (!is_coincidental && result.isBotch) paradox_gain += 3;
                let narrative = `✨ Magick Effect: Rolled [${result.rolls.join(', ')}], ${result.successes} successes. Paradox gain: ${paradox_gain}. ${result.isBotch ? "BOTCH! Paradox backlash strikes!" : ""}`;
                return { content: [makeTextContent(narrative)] };
            }
            case 'invoke_cantrip': {
                const { art_pool, realm_pool, difficulty, force_result } = args;
                if ([art_pool, realm_pool, difficulty].some(v => typeof v !== "number" || v < 0)) return { content: [makeTextContent("Error: All pools and difficulty must be non-negative integers.")], isError: true };
                const total = art_pool + realm_pool;
                const result = rollWodPool(total, difficulty, false, 0, force_result);
                return { content: [makeTextContent(`🧚 Cantrip: Art ${art_pool} + Realm ${realm_pool} vs Diff ${difficulty} → [${result.rolls.join(', ')}] (${result.successes} successes). ${result.resultText}`)] };
            }
            default:
                return { content: [makeTextContent(`Error: Unknown tool '${name}'.`)], isError: true };
        }
    } catch (error: any) {
        return { content: [makeTextContent(`Error in '${name}': ${error.message}`)], isError: true };
    }
});

server.connect(new StdioServerTransport());
console.error('✅ oWoD Combat Engine Server v3.0.0 running on stdio');
