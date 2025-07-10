// Debug script to see what the server is actually returning
const { spawn } = require('child_process');

console.log('🔍 Debugging Tools Response...\n');

// Start the game state server
const serverProcess = spawn('node', ['dist/index.js'], {
  cwd: './game-state-server',
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverOutput = '';
let serverError = '';

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.log('📤 Server stdout:', output);
});

serverProcess.stderr.on('data', (data) => {
  const error = data.toString();
  serverError += error;
  console.log('❌ Server stderr:', error);
});

// Wait for server to start, then send requests
setTimeout(() => {
  console.log('📤 Sending list tools request...');
  
  const listToolsRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };
  
  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Wait for response
  setTimeout(() => {
    console.log('\n📊 Final Analysis:');
    console.log('Server output length:', serverOutput.length);
    console.log('Server error length:', serverError.length);
    
    if (serverOutput.includes('tools')) {
      console.log('✅ Response contains "tools"');
    } else {
      console.log('❌ Response does not contain "tools"');
    }
    
    if (serverOutput.includes('create_character')) {
      console.log('✅ Response contains tool names');
    } else {
      console.log('❌ Response does not contain tool names');
    }
    
    serverProcess.kill();
  }, 3000);
}, 1000);
