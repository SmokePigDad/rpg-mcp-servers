// File: game-state-server/src/simple_index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

console.log("Initializing simple game state server...");

const toolDefinitions = {
  hello_world: {
    name: 'hello_world',
    description: 'A simple hello world tool.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
};

const transport = new StdioServerTransport();
const server = new Server({ name: 'simple-game-state-server', version: '1.0.0' }, { capabilities: { tools: toolDefinitions } });

server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log("ListToolsRequestSchema handler called!");
  return { tools: Object.values(toolDefinitions) };
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name } = request.params;
  if (name === 'hello_world') {
    return { content: [{ type: 'text', text: 'Hello, world!' }] };
  }
  return { content: [{ type: 'text', text: 'Unknown tool' }], isError: true };
});

server.connect(transport);

console.error('Simple game state server running on stdio');