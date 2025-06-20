import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DiceEngine } from './dice.js';
import { GameDatabase } from '../../game-state-server/src/db.js';

// Create the server instance
const server = new Server({
    name: 'rpg-combat-engine-server',
    version: '2.1.0-wod', // Version updated to reflect new tools
}, {
    capabilities: {
        tools: {},
    },
});

// Instantiate the DiceEngine
const diceEngine = new DiceEngine();

// Define the World of Darkness toolset
const toolDefinitions = [
    {
        name: 'perform_roll',
        description: 'Performs a standard World of Darkness dice roll (d10 pool vs. difficulty). This is the core mechanic for all non-combat actions.',
        inputSchema: {
            type: 'object',
            properties: {
                pool_size: { type: 'number', description: 'The number of d10s to roll (e.g., Attribute + Ability).' },
                difficulty: { type: 'number', description: 'The target number for a success (usually 6, 7, or 8).' },
                reason: { type: 'string', description: 'What the roll is for (e.g., "Dexterity + Stealth to hide").' },
                has_specialty: { type: 'boolean', default: false, description: 'Set to true if a specialty applies (10s count as 2 successes).' }
            },
            required: ['pool_size', 'difficulty', 'reason']
        }
    },
    {
        name: 'resolve_attack',
        description: 'Resolves a complete WoD combat sequence automatically by fetching stats for both attacker and defender.',
        inputSchema: {
            type: 'object',
            properties: {
                attacker_id: { type: 'number', description: "The database ID of the attacker." },
                defender_id: { type: 'number', description: "The database ID of the defender." },
                attack_type: { type: 'string', enum: ['brawl_punch', 'melee_knife', 'firearms_pistol'], description: "The type of attack being made." },
                difficulty_modifier: { type: 'number', default: 0, description: "Modifier to the standard difficulty of 6 (e.g., +1 for a hard shot)." },
                has_specialty: { type: 'boolean', default: false }
            },
            required: ['attacker_id', 'defender_id', 'attack_type']
        }
    }
];

// Register the tool definitions with the server
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions
}));

// Handle tool calls from the AI
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'perform_roll': {
                const { pool_size, difficulty, reason, has_specialty } = args as any;
                const result = diceEngine.roll(pool_size, difficulty, has_specialty);

                const outcome = result.isBotch ? "💥 BOTCH!"
                              : result.successes === 0 ? "❌ Failure"
                              : result.successes === 1 ? "✅ Success (Marginal)"
                              : result.successes < 3 ? "✅ Success (Standard)"
                              : "🌟 Success (Impressive!)";
                
                let output = `🎲 ROLL: ${reason}\n\n`;
                output += `Pool: ${pool_size > 0 ? pool_size : '1 (Chance Die)'}d10 vs. Difficulty ${difficulty}\n`;
                output += `Rolls: [${result.rolls.join(', ')}]\n`;
                output += `Result: ${result.successes} Successes\n`;
                output += `Outcome: ${outcome}\n`;

                if (result.isBotch) {
                    output += `\nA catastrophic failure occurs! The Storyteller will describe the consequences.`;
                }
                if (result.specialtySuccesses > 0) {
                    output += `\n(Includes ${result.specialtySuccesses} extra success(es) from a specialty.)`;
                }
                if (result.cancellations > 0) {
                    output += `\n(${result.cancellations} success(es) were cancelled by 1s.)`;
                }

                return { content: [{ type: 'text', text: output }] };
            }

            case 'resolve_attack': {
                const {
                    attacker_id, defender_id, attack_type,
                    difficulty_modifier = 0, has_specialty = false
                } = args as any;

                const db = new GameDatabase();
                let output = '';
                try {
                    const attackerStats = db.getCombatStats(attacker_id, attack_type);
                    // For defender, attack_type doesn't matter for soak, so a default is fine.
                    const defenderStats = db.getCombatStats(defender_id, 'brawl_punch');

                    output = `⚔️ COMBAT: ${attackerStats.name} vs. ${defenderStats.name}\n\n`;

                    // 1. Attack Roll
                    output += `[1] Attack Roll (${attack_type}):\n`;
                    const attack_difficulty = 6 + difficulty_modifier;
                    const attackResult = diceEngine.roll(attackerStats.attack_pool, attack_difficulty, has_specialty);
                    output += `  - Pool: ${attackerStats.attack_pool}d10 vs. Diff ${attack_difficulty}\n`;
                    output += `  - Rolls: [${attackResult.rolls.join(', ')}]\n`;
                    output += `  - Result: ${attackResult.successes} Successes\n`;

                    if (attackResult.isBotch) {
                        output += `\n💥 BOTCH! The attack fails disastrously.`;
                        db.close();
                        return { content: [{ type: 'text', text: output }] };
                    }
                    if (attackResult.successes === 0) {
                        output += `\n❌ MISS! The attack fails to connect.`;
                        db.close();
                        return { content: [{ type: 'text', text: output }] };
                    }

                    const damage_type = attack_type.includes('firearms') || attack_type.includes('melee') ? 'lethal' : 'bashing';

                    // 2. Damage Roll
                    output += `\n[2] Damage Roll:\n`;
                    const totalDamagePool = attackerStats.damage_pool + attackResult.successes;
                    const damageResult = diceEngine.roll(totalDamagePool, 6);
                    output += `  - Pool: ${totalDamagePool}d10 (Base ${attackerStats.damage_pool} + ${attackResult.successes} net successes)\n`;
                    output += `  - Potential Damage: ${damageResult.successes} levels of ${damage_type}\n`;

                    if (damageResult.successes === 0) {
                        output += `\n🛡️ GLANCING BLOW! The attack hits but fails to cause any significant harm.`;
                        db.close();
                        return { content: [{ type: 'text', text: output }] };
                    }

                    // 3. Soak Roll
                    const canSoakLethal = (defenderStats.character_type === 'Werewolf');
                    const canSoak = damage_type === 'bashing' || (damage_type === 'lethal' && canSoakLethal);
                    let soak_pool = defenderStats.soak_pool;

                    output += `\n[3] Soak Roll:\n`;
                    if (canSoak) {
                        const soakResult = diceEngine.roll(soak_pool, 6);
                        const damageSoaked = soakResult.successes;
                        const finalDamage = Math.max(0, damageResult.successes - damageSoaked);

                        output += `  - ${defenderStats.name} attempts to soak with a pool of ${soak_pool}d10.\n`;
                        output += `  - Damage Soaked: ${damageSoaked} levels\n`;
                        output += `\n[4] Final Outcome:\n`;
                        if (finalDamage > 0) {
                            output += `  - 🩸 ${defenderStats.name} suffers ${finalDamage} level(s) of ${damage_type} damage.\n`;
                            output += `  - (Storyteller must now call 'inflict_damage' on game-state server).`;
                        } else {
                            output += `  - ✅ ${defenderStats.name} successfully soaks all damage!`;
                        }
                    } else {
                        output += `  - ${defenderStats.name} cannot soak ${damage_type} damage!\n`;
                        output += `\n[4] Final Outcome:\n`;
                        output += `  - 🩸 ${defenderStats.name} suffers the full ${damageResult.successes} level(s) of ${damage_type} damage.\n`;
                        output += `  - (Storyteller must now call 'inflict_damage' on game-state server).`;
                    }
                } finally {
                    db.close();
                }
                
                return { content: [{ type: 'text', text: output }] };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: any) {
        return {
            content: [{ type: 'text', text: `❌ COMBAT ENGINE ERROR: ${error.message}` }],
            isError: true
        };
    }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);
console.error('World of Darkness Combat Engine MCP Server running on stdio');