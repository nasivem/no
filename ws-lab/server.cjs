const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<!DOCTYPE html>
<html>
<head>
  <title>🐶 Doge RCE Lab</title>
  <style>body{font-family:monospace;background:#000;color:lime;padding:20px;}#output{height:400px;overflow:auto;background:#111;padding:10px;border:1px solid #444;}input{width:70%;padding:10px;}button{padding:10px 20px;background:red;color:white;border:none;cursor:pointer;}</style>
</head>
<body>
  <h1>🐶 Doge RCE Lab :1337</h1>
  <div id="status">🔌 Connecting...</div>
  <div id="output">Waiting...</div>
  <input id="code" placeholder="console.log('wow')" value="console.log('🐶 Doge RCE LIVE!')">
  <button onclick="run()">🚀 EXECUTE</button>
  <button onclick="clearOutput()">🧹 Clear</button>

  <script>
    const ws = new WebSocket('ws://' + location.host + '/rce');
    const statusEl = document.getElementById('status');
    const outputEl = document.getElementById('output');

    ws.onopen = () => {
      statusEl.innerHTML = '🔥 <span style="color:lime">LIVE</span>';
      ws.send('console.log("🐕 Welcome to Doge RCE Lab! Much execute, very wow!")');
    };

    ws.onmessage = (e) => {
      outputEl.innerHTML += '<div>' + e.data + '</div>';
      outputEl.scrollTop = outputEl.scrollHeight;
    };

    function run() {
      const code = document.getElementById('code').value;
      ws.send(code);
      document.getElementById('code').value = '';
    }

    function clearOutput() {
      document.getElementById('output').innerHTML = '';
    }

    document.getElementById('code').addEventListener('keypress', e => {
      if (e.key === 'Enter') run();
    });
  </script>
</body>
</html>`);
});

const wss = new WebSocket.Server({
  noServer: true,
  path: '/rce'
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    console.log('🐶 Doge connected!');

    // SIMPLIFIED EXECUTION - Direct eval
    ws.on('message', (message) => {
      const code = message.toString();
      
      try {
        // Capture console output
        let output = '';
        const originalLog = console.log;
        console.log = (...args) => {
          output += args.map(a => String(a)).join(' ') + '\n';
        };

        // Execute the code
        const result = eval(code);
        
        // Restore console
        console.log = originalLog;
        
        // Send result
        if (output) {
          ws.send(output.trim());
        } else if (result !== undefined) {
          ws.send(String(result));
        } else {
          ws.send('✅ Code executed successfully!');
        }
        
      } catch (error) {
        // Restore console on error
        console.log = originalLog;
        ws.send('❌ Error: ' + error.message);
      }
    });

    // Welcome
    ws.send('🐕 Doge RCE Lab ready! Try: console.log("wow")');
  });
});

server.listen(1337, '0.0.0.0', () => {
  console.log('🐶 Doge RCE Lab LIVE on :1337');
});
