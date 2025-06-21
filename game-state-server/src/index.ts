import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GameDatabase } from './db.js';

// Initialize the World of Darkness database
const db = new GameDatabase();

// Create the server instance
const server = new Server({
    name: 'rpg-game-state-server',
    version: '2.4.0-wod', // Version updated for MCP compliance
}, {
    capabilities: {
        tools: {},
    },
});

// Define the World of Darkness toolset
const toolDefinitions = [
    // Character Management
    {
        name: 'create_character',
        description: 'Create a new World of Darkness character (Vampire, Werewolf, Mage, etc.)',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                character_type: { type: 'string', enum: ['Vampire', 'Werewolf', 'Mage', 'Changeling', 'Wraith', 'Mummy', 'Mortal'] },
                splat1: { type: 'string', description: "Primary descriptor: Clan, Tribe, Tradition, etc." },
                attributes: { type: 'object', description: 'JSON object for Physical, Social, Mental attributes' },
                abilities: { type: 'object', description: 'JSON object for Talents, Skills, Knowledges' },
                willpower_permanent: { type: 'number' },
                splat2: { type: 'string', description: "Secondary descriptor: Auspice, Seeming, etc." },
                concept: { type: 'string' },
                nature: { type: 'string' },
                demeanor: { type: 'string' },
                resources: { type: 'object' },
                powers: { type: 'object' },
                backgrounds: { type: 'object' },
                virtues_or_traits: { type: 'object' }
            },
            required: ['name', 'character_type', 'attributes', 'abilities', 'willpower_permanent']
        }
    },
    {
        name: 'get_character',
        description: 'Get a full character sheet for a WoD character by ID. Returns a JSON string.',
        inputSchema: { type: 'object', properties: { character_id: { type: 'number' } }, required: ['character_id'] }
    },
    {
        name: 'update_character',
        description: 'Update any value on a character sheet using dot notation for nested JSON. E.g., `{"resources.blood_pool": 9}`.',
        inputSchema: {
            type: 'object',
            properties: {
                character_id: { type: 'number' },
                updates: { type: 'object' }
            },
            required: ['character_id', 'updates']
        }
    },
    // Health & Resource Management
    {
        name: 'inflict_damage',
        description: 'Apply Bashing, Lethal, or Aggravated damage to a character. This updates their health levels.',
        inputSchema: {
            type: 'object',
            properties: {
                target_id: { type: 'number' },
                amount: { type: 'number' },
                type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'] }
            },
            required: ['target_id', 'amount', 'type']
        }
    },
    {
        name: 'spend_willpower',
        description: 'Spend one point of temporary Willpower for a character.',
        inputSchema: { type: 'object', properties: { character_id: { type: 'number' } }, required: ['character_id'] }
    },
    {
        name: 'spend_resource',
        description: 'Spend a specified amount of a game-specific resource (e.g., blood_pool, rage, gnosis, glamour).',
        inputSchema: {
            type: 'object',
            properties: {
                character_id: { type: 'number' },
                resource_name: { type: 'string', description: "e.g., 'blood_pool', 'rage', 'gnosis', 'glamour', 'quintessence', 'pathos', 'sekhem'" },
                amount: { type: 'number' }
            },
            required: ['character_id', 'resource_name', 'amount']
        }
    },
    // UX and Progression Tools
    {
        name: 'display_health',
        description: "Generates a visual string representing a character's current health levels, damage, and wound penalties.",
        inputSchema: {
            type: 'object',
            properties: {
                character_id: { type: 'number' }
            },
            required: ['character_id']
        }
    },
    {
        name: 'spend_experience',
        description: 'Spend experience points to improve a character trait. The server calculates the cost automatically.',
        inputSchema: {
            type: 'object',
            properties: {
                character_id: { type: 'number' },
                trait_to_improve: { type: 'string', description: 'The dot-notation path to the trait, e.g., "attributes.physical.strength" or "powers.disciplines.Auspex".' }
            },
            required: ['character_id', 'trait_to_improve']
        }
    },
    {
        name: 'generate_character_sheet_html',
        description: 'Generates the data needed for a stylized HTML character sheet. Returns a JSON string with the HTML content and a suggested filename.',
        inputSchema: {
            type: 'object',
            properties: {
                character_id: { type: 'number' }
            },
            required: ['character_id']
        }
    },
    {
        name: 'generate_powers_summary',
        description: "A request for the AI to generate a markdown document explaining what a character's supernatural powers do.",
        inputSchema: {
            type: 'object',
            properties: {
                character_id: { type: 'number' },
                character_name: { type: 'string' },
                powers_data: { type: 'object', description: "The 'powers' JSON object from the character sheet." }
            },
            required: ['character_id', 'character_name', 'powers_data']
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
            case 'create_character': {
                const character = db.createCharacter(args as any) as any;
                const output = `🌙 NEW CHARACTER AWAKENED IN THE WORLD OF DARKNESS

👤 Name: ${character.name}
🩸 Type: ${character.character_type} (${character.splat1 || 'N/A'})
🆔 ID: ${character.id}

"Welcome to the night. Your story begins now."

(Use 'get_character' with ID ${character.id} for a full sheet.)`;
                return { content: [{ type: 'text', text: output }] };
            }

            case 'get_character': {
                const character = db.getCharacter((args as any).character_id);
                if (!character) {
                    return { content: [{ type: 'text', text: `👻 ERROR: Character with ID ${(args as any).character_id} not found.` }] };
                }
                const characterJsonString = JSON.stringify(character, null, 2);
                return { content: [{ type: 'text', text: characterJsonString }] };
            }

            case 'update_character': {
                const character = db.updateCharacter((args as any).character_id, (args as any).updates);
                const output = `✒️ Record updated for ${character.name} (ID: ${character.id}).`;
                return { content: [{ type: 'text', text: output }] };
            }

            case 'inflict_damage': {
                const character = db.inflictDamage(
                    (args as any).target_id,
                    (args as any).amount,
                    (args as any).type
                );
                const damage = character.damage_taken;
                const output = `💥 ${character.name} takes ${(args as any).amount} level(s) of ${(args as any).type} damage!
Current Damage State: ${damage.bashing} Bashing, ${damage.lethal} Lethal, ${damage.aggravated} Aggravated.`;
                return { content: [{ type: 'text', text: output }] };
            }

            case 'spend_willpower': {
                const character = db.spendWillpower((args as any).character_id);
                const output = `⚡ ${character.name} focuses their will, spending a point of Willpower!
Remaining: ${character.willpower_current}/${character.willpower_permanent}`;
                return { content: [{ type: 'text', text: output }] };
            }

            case 'spend_resource': {
                const { character_id, resource_name, amount } = args as any;
                const character = db.spendResource(character_id, resource_name, amount);
                const newAmount = character.resources[resource_name];
                const output = `🩸 ${character.name} spends ${amount} ${resource_name}.
Remaining: ${newAmount}.`;
                return { content: [{ type: 'text', text: output }] };
            }

            case 'display_health': {
                const healthInfo = db.display_health((args as any).character_id);
                return { content: [{ type: 'text', text: healthInfo.visual }] };
            }

            case 'spend_experience': {
                const result = db.spend_experience((args as any).character_id, (args as any).trait_to_improve);
                const output = `✅ ${result.message}\nRemaining XP: ${result.remainingXp}`;
                return { content: [{ type: 'text', text: output }] };
            }
            
            case 'generate_character_sheet_html': {
                const character = db.getCharacter((args as any).character_id);
                if (!character) {
                    throw new Error(`Character with ID ${(args as any).character_id} not found.`);
                }
                const htmlContent = db.generate_character_sheet_html((args as any).character_id);
                const filename = `${character.name.replace(/\s+/g, '_')}_${character.id}.html`;

                const responseObject = {
                    html_content: htmlContent,
                    suggested_filename: filename,
                    character_name: character.name
                };
                const responseJsonString = JSON.stringify(responseObject);

                return {
                    content: [{
                        type: 'text',
                        text: responseJsonString
                    }]
                };
            }

            case 'generate_powers_summary': {
                const { character_name, powers_data } = args as any;
                const powerTypes = Object.keys(powers_data).join(', ');
                const output = `✅ Acknowledged. Generating powers summary for ${character_name} covering: ${powerTypes}. The AI will now create the markdown document.`;
                
                return {
                    content: [{
                        type: 'text',
                        text: output
                    }]
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: any) {
        return {
            content: [{ type: 'text', text: `❌ GAME STATE ERROR: ${error.message}` }],
            isError: true
        };
    }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);
console.error('World of Darkness Game State MCP Server running on stdio');