/**
 * Centralized tool definitions for every MCP tool supported by the game-state server.
 * Exports ONLY a plain object, with tool name as key and tool data as value.
 */
export const toolDefinitions = {
  create_character: {
    name: "create_character",
    description: "Create a new character in the game state.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Character name" },
        game_line: { type: "string", description: "Game line (e.g., Vampire, Werewolf, Mage, etc.)" },
        player: { type: "string", description: "Player name (optional)" }
      },
      required: ["name", "game_line"]
    },
    result: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        character_id: { type: "number" }
      }
    }
  },
  get_character: {
    name: "get_character",
    description: "Retrieve a character and their full data by character ID.",
    parameters: {
      type: "object",
      properties: {
        character_id: { type: "number", description: "ID of the character" }
      },
      required: ["character_id"]
    },
    result: {
      type: "object",
      properties: {
        found: { type: "boolean" },
        character: { type: "object" }
      }
    }
  },
  get_character_by_name: {
    name: "get_character_by_name",
    description: "Retrieve a character and their full data by character name.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Character name" }
      },
      required: ["name"]
    },
    result: {
      type: "object",
      properties: {
        found: { type: "boolean" },
        character: { type: "object" }
      }
    }
  },
  proxy_tool: {
    name: "proxy_tool",
    description: "Proxy tool to call tools on other MCP servers.",
    parameters: {
      type: "object",
      properties: {
        server_address: { type: "string", description: "Address of the target MCP server" },
        tool_name: { type: "string", description: "Name of the tool to call on the target server" },
        arguments: { type: "object", description: "Arguments to pass to the tool" }
      },
      required: ["server_address", "tool_name", "arguments"]
    },
    result: {
      type: "object",
      properties: {
        content: { type: "array", items: { type: "object" } },
        isError: { type: "boolean" }
      }
    }
  }
};