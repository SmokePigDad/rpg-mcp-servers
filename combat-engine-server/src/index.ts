import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DiceEngine } from './dice.js'; // FIX: Import the new DiceEngine

// Create the server instance
const server = new Server({
    name: 'rpg-combat-engine-server',
    version: '2.0.0-wod',
}, {
    capabilities: {
        tools: {},
    },
});

// FIX: Instantiate the DiceEngine at the top level
const diceEngine = new DiceEngine();

// Define the World of Darkness tools
const toolDefinitions = [
    {
        name: 'perform_roll',
        description: 'Performs a standard World of Darkness dice roll (d10 pool vs. difficulty). This is the core mechanic for all actions.',
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
        name: 'perform_combat_roll',
        description: 'Performs a full combat sequence: attack roll, damage roll, and soak roll, returning a summary.',
        inputSchema: {
            type: 'object',
            properties: {
                attacker_name: { type: 'string' },
                defender_name: { type: 'string' },
                attack_pool: { type: 'number', description: "Attacker's dice pool for the attack." },
                attack_difficulty: { type: 'number', description: "Difficulty of the attack." },
                damage_pool: { type: 'number', description: "Attacker's base damage pool (e.g., Strength + weapon modifier)." },
                soak_pool: { type: 'number', description: "Defender's soak dice pool (e.g., Stamina)." },
                damage_type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'], description: "The type of damage being dealt." },
                attack_has_specialty: { type: 'boolean', default: false }
            },
            required: ['attacker_name', 'defender_name', 'attack_pool', 'attack_difficulty', 'damage_pool', 'soak_pool', 'damage_type']
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

            case 'perform_combat_roll': {
                const {
                    attacker_name, defender_name, attack_pool, attack_difficulty,
                    damage_pool, soak_pool, damage_type, attack_has_specialty
                } = args as any;

                let output = `⚔️ COMBAT: ${attacker_name} vs. ${defender_name}\n\n`;

                // 1. Attack Roll
                output += `[1] Attack Roll:\n`;
                const attackResult = diceEngine.roll(attack_pool, attack_difficulty, attack_has_specialty);
                output += `  - Pool: ${attack_pool}d10 vs. Diff ${attack_difficulty}\n`;
                output += `  - Rolls: [${attackResult.rolls.join(', ')}]\n`;
                output += `  - Result: ${attackResult.successes} Successes\n`;

                if (attackResult.isBotch) {
                    output += `\n💥 BOTCH! The attack fails disastrously.`;
                    return { content: [{ type: 'text', text: output }] };
                }
                if (attackResult.successes === 0) {
                    output += `\n❌ MISS! The attack fails to connect.`;
                    return { content: [{ type: 'text', text: output }] };
                }

                // 2. Damage Roll
                output += `\n[2] Damage Roll:\n`;
                const totalDamagePool = damage_pool + attackResult.successes;
                const damageResult = diceEngine.roll(totalDamagePool, 6); // Damage is always vs. difficulty 6
                output += `  - Pool: ${totalDamagePool}d10 (Base ${damage_pool} + ${attackResult.successes} net successes)\n`;
                output += `  - Rolls: [${damageResult.rolls.join(', ')}]\n`;
                output += `  - Potential Damage: ${damageResult.successes} levels of ${damage_type}\n`;

                if (damageResult.successes === 0) {
                    output += `\n🛡️ GLANCING BLOW! The attack hits but fails to cause any significant harm.`;
                    return { content: [{ type: 'text', text: output }] };
                }

                // 3. Soak Roll
                output += `\n[3] Soak Roll:\n`;
                const soakResult = diceEngine.roll(soak_pool, 6); // Soak is always vs. difficulty 6
                output += `  - Pool: ${soak_pool}d10\n`;
                output += `  - Rolls: [${soakResult.rolls.join(', ')}]\n`;
                output += `  - Damage Soaked: ${soakResult.successes} levels\n`;

                // 4. Final Result
                const finalDamage = Math.max(0, damageResult.successes - soakResult.successes);
                output += `\n[4] Final Outcome:\n`;
                if (finalDamage > 0) {
                    output += `  - 🩸 ${defender_name} suffers ${finalDamage} level(s) of ${damage_type} damage.\n`;
                    output += `  - (The game-state server must now be called with \`inflict_damage\` to apply this result.)`;
                } else {
                    output += `  - ✅ ${defender_name} successfully soaks all damage!`;
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
}); // FIX: Ensure all brackets and braces are correctly closed

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);
console.error('World of Darkness Combat Engine MCP Server running on stdio');