import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

/** oWoD Combat State object, tracking active phase (declaration/action) for phased combat logic. */
type CombatPhase = "declaration" | "action";

interface CombatState {
  current_phase: CombatPhase;
  log: string[]; // for expansion: combat log history
}

let combatState: CombatState = {
  current_phase: "declaration",
  log: []
};

/**
 * oWoD dice pool roller.
 * @param {number} pool_size Number of d10 dice to roll (integer >0)
 * @param {number} difficulty Target number for success (2..10)
 * @param {boolean} has_specialty Whether 10s count double for successes
 * @returns {{ successes: number, rolls: number[], isBotch: boolean, isSpectacular: boolean, resultText: string }}
 */
function rollWodPool(pool_size: number, difficulty: number, has_specialty: boolean): {
  successes: number,
  rolls: number[],
  isBotch: boolean,
  isSpectacular: boolean,
  resultText: string
} {
  if (pool_size < 1 || !Number.isInteger(pool_size)) throw new Error("Pool size must be an integer > 0");
  if (difficulty < 2 || difficulty > 10) throw new Error("Difficulty must be between 2 and 10");

  // Roll dice
  const rolls = Array.from({ length: pool_size }, () => Math.floor(Math.random() * 10) + 1);

  // Tally: count successes, count 1s as botch
  let successes = 0;
  let botches = 0;
  let countTens = 0;
  for (const r of rolls) {
    if (r >= difficulty && r < 10) {
      successes += 1;
    } else if (r === 10) {
      countTens += 1;
      successes += has_specialty ? 2 : 1;
    } else if (r === 1) {
      botches += 1;
    }
  }
  successes -= botches;

  const isBotch = successes < 0 || (successes === 0 && botches > 0);
  const isSpectacular = !isBotch && successes >= 5;
  let resultText = '';

  if (isBotch) {
    resultText = `BOTCH! Catastrophic failure (${botches}x 1's rolled).`;
  } else if (successes === 0) {
    resultText = "Failure – no successes.";
  } else {
    resultText = `Successes: ${successes}`;
    if (isSpectacular) resultText += " (Spectacular Success!)";
    if (countTens && has_specialty) resultText += ` [${countTens}x 10s (specialty Double Success)]`;
  }

  return {
    successes: Math.max(successes, 0), // Never negative
    rolls,
    isBotch,
    isSpectacular,
    resultText
  };
}

const server = new Server({
  name: 'rpg-combat-engine-server',
  version: '2.0.0',
}, {
  capabilities: { 
    tools: {},
  },
});

const toolDefinitions = [
  {
    name: 'roll_wod_pool',
    description: 'Roll an oWoD (old World of Darkness) dice pool: d10s, count successes, botches, specialties.',
    inputSchema: {
      type: 'object',
      properties: {
        pool_size: {
          type: 'integer',
          description: 'Number of d10s to roll (dice pool, >0)'
        },
        difficulty: {
          type: 'integer',
          description: 'Difficulty threshold (2-10; count rolls ≥ this as successes)'
        },
        has_specialty: {
          type: 'boolean',
          description: 'Do 10s count as double successes?'
        },
        spend_willpower_for_success: {
          type: 'boolean',
          description: 'If true, character spends Willpower for +1 automatic success.'
        },
        character_id: {
          type: 'integer',
          description: 'Character ID to debit Willpower from (optional, but required if spending willpower).'
        },
        actor_context: {
          type: 'object',
          description: 'Narrative context for tactical modifiers (cover, elevation, etc).',
          properties: {
            cover: { type: 'string' },
            isElevated: { type: 'boolean' }
          }
        }
      },
      required: ['pool_size', 'difficulty', 'has_specialty']
    }
  },
  {
    name: 'get_combat_state',
    description: 'Get the current oWoD combat encounter state (current phase, history)',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  // Tier 3: Contested/Resisted Roll
  {
    name: 'roll_contested_action',
    description: 'Resolve a contested action (PvP net successes): attacker and defender both roll pools at specified difficulties; result is attacker.successes - defender.successes',
    inputSchema: {
      type: 'object',
      properties: {
        attacker_pool: { type: 'integer', description: 'Attackers dice pool size' },
        attacker_difficulty: { type: 'integer', description: 'Attackers difficulty' },
        attacker_specialty: { type: 'boolean', description: 'Attackers has specialty (10s count double)' },
        defender_pool: { type: 'integer', description: 'Defenders dice pool size' },
        defender_difficulty: { type: 'integer', description: 'Defenders difficulty' },
        defender_specialty: { type: 'boolean', description: 'Defender has specialty (10s count double)' }
      },
      required: ['attacker_pool', 'attacker_difficulty', 'defender_pool', 'defender_difficulty']
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

// Tool request handler for oWoD dice only
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'roll_wod_pool': {
        // Unpack all args
        const { pool_size, difficulty, has_specialty, spend_willpower_for_success, character_id, actor_context } = args as any;
        let willpowerSpent = false;
        let willpowerError = "";
        let narrativeApplied = false;
        let narrativeDetail: string[] = [];
        let narrativePool = pool_size;
        let narrativeDiff = difficulty;

        // Integrate narrative/tactical modifiers
        if (actor_context) {
          try {
            // Import narrative tool if co-located; can switch to proper MCP tool bridging if split
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { handleGetTacticalAdvantage } = require("./narrative-engine.js");
            const result = handleGetTacticalAdvantage({ actor: actor_context });
            if (result && typeof result.modifiers === "number") {
              // By default, we apply narrative modifiers to difficulty (as cover/lighting usually makes things harder)
              narrativeDiff = Math.max(2, narrativeDiff + result.modifiers);
              narrativeApplied = result.modifiers !== 0;
              if (result.reasons?.length) narrativeDetail = result.reasons;
            }
          } catch {}
        }

        const result = rollWodPool(
          narrativePool,
          narrativeDiff,
          has_specialty
        );

        let successes = result.successes;
        // Handle Willpower: automatic success and MCP cross-call
        if (spend_willpower_for_success) {
          successes += 1;
          willpowerSpent = true;
          if (typeof character_id === "number") {
            try {
              const { execSync } = require("child_process");
              const spendCmd = JSON.stringify({
                method: "callTool",
                params: {
                  name: "spend_willpower",
                  arguments: { character_id, amount: 1 }
                }
              });
              execSync(`echo '${spendCmd}' | node ../game-state-server/src/index.ts`, { stdio: "ignore" });
            } catch (e: any) {
              willpowerError = " (❌ Could not debit Willpower from character sheet)";
            }
          } else {
            willpowerError = " (⚠️ Willpower not debited: no character_id provided)";
          }
        }

        // Compose response with details for LMs and users
        let output = `🎲 oWoD Dice Pool Roll\n\n`;
        output += `Pool Size: ${narrativePool}, Difficulty: ${narrativeDiff}, Specialty: ${has_specialty ? '✅' : 'No'}\n`;
        if (narrativeApplied && narrativeDetail.length > 0)
          output += `Narrative Modifiers Applied: ${narrativeDetail.map(r=>`• ${r}`).join(" | ")}\n`;
        if (willpowerSpent)
          output += `Willpower Spent: ✅ (+1 automatic success)${willpowerError}\n`;
        output += `Rolled: [${result.rolls.join(', ')}]\n`;
        output += `➡  Result: ${successes} success${successes !== 1 ? 'es' : ''}${willpowerSpent ? ' (incl. Willpower Bonus)' : ''}\n`;
        output += `${result.resultText}\n`;
        if (result.isBotch) output += `💥 BOTCH!`;
        if (result.isSpectacular) output += `🌟 Spectacular Success!`;

        combatState.log.push(
          `oWoD roll [${result.rolls.join(', ')}] at ${narrativeDiff} ⇒ ${successes} success${successes !== 1 ? 'es' : ''}${result.isBotch ? ' (BOTCH)' : (result.isSpectacular ? ' (Spectacular)' : '')}${willpowerSpent ? ' [Willpower +1]' : ''}${willpowerError ? ' ' + willpowerError : ''}${narrativeApplied && narrativeDetail.length > 0 ? ' [Narrative: ' + narrativeDetail.join('; ') + ']' : ''}`
        );

        return {
          content: [{ type: 'text', text: output }]
        };
      }
      case 'roll_contested_action': {
        const { attacker_pool, attacker_difficulty, attacker_specialty, defender_pool, defender_difficulty, defender_specialty } = args as any;
        const atk = rollWodPool(attacker_pool, attacker_difficulty, Boolean(attacker_specialty));
        const def = rollWodPool(defender_pool, defender_difficulty, Boolean(defender_specialty));
        const net = atk.successes - def.successes;
        let logtxt = `🎯 CONTESTED/RESISTED ACTION\n\n`;
        logtxt += `Attacker: Pool ${attacker_pool} vs Diff ${attacker_difficulty} → Rolls: [${atk.rolls.join(', ')}] (${atk.successes} successes)${atk.isBotch ? ' [BOTCH]' : ''}\n`;
        logtxt += `Defender: Pool ${defender_pool} vs Diff ${defender_difficulty} → Rolls: [${def.rolls.join(', ')}] (${def.successes} successes)${def.isBotch ? ' [BOTCH]' : ''}\n\n`;

        logtxt += `RESULT: `;
        if (atk.isBotch && def.isBotch) {
          logtxt += `DOUBLE BOTCH! Chaotic failure.`;
        } else if (atk.isBotch) {
          logtxt += `Attacker BOTCHES—automatic failure.`;
        } else if (def.isBotch) {
          logtxt += `Defender BOTCHES! Attacker wins automatically.`;
        } else if (net > 0) {
          logtxt += `Attacker wins by ${net} net success${net > 1 ? 'es' : ''}.`;
        } else if (net < 0) {
          logtxt += `Defender resists by ${-net} net success${net < -1 ? 'es' : ''}.`;
        } else {
          logtxt += `STANDOFF—tie, no clear winner.`;
        }
        combatState.log.push(
          `Contested roll: Atk [${atk.successes}] vs Def [${def.successes}] → Net: ${net} (${atk.isBotch ? 'Attacker BOTCH' : def.isBotch ? 'Def BOTCH' : net === 0 ? 'Tie' : net > 0 ? 'Attacker wins' : 'Defender wins'})`
        );
        return {
          content: [{ type: 'text', text: logtxt }]
        };
      }
      // New (Tier 2): Return or mutate encounter state here in the future as needed

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error('oWoD RPG Combat Engine MCP Server v2.0 running on stdio');

