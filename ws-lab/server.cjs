const WebSocket = require('ws');
const { VM } = require('vm2');
const http = require('http');
const https = require('https');

// DuckDuckGo search function
function searchDuckDuckGo(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Create HTTP server first
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/rce' || req.url === '/rce/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐕 Doge WebSocket RCE Lab</title>
    <style>
        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .container {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
        }

        h1 {
            color: #ff6b6b;
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.2em;
        }

        .code-input {
            width: 100%;
            min-height: 150px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            padding: 15px;
            border: 3px solid #4ecdc4;
            border-radius: 10px;
            margin-bottom: 20px;
            resize: vertical;
        }

        .buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        button {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        button:active {
            transform: translateY(0);
        }

        #execute {
            background: linear-gradient(45deg, #4ecdc4, #45b7d1);
        }

        #clear {
            background: linear-gradient(45deg, #ff6b6b, #ff8e53);
        }

        .output {
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            border-radius: 10px;
            padding: 15px;
            min-height: 200px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            white-space: pre-wrap;
            overflow-y: auto;
            max-height: 400px;
        }

        .status {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            border-radius: 10px;
            font-weight: bold;
        }

        .status.connected {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .status.disconnected {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .examples {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
        }

        .examples h3 {
            color: #45b7d1;
            margin-top: 0;
        }

        .example-code {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin: 5px 0;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            border: 1px solid #dee2e6;
        }

        .example-code:hover {
            background: #e9ecef;
        }

        .doge-meme {
            text-align: center;
            font-size: 2em;
            margin: 20px 0;
        }

        .search-section {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .search-section h3 {
            color: #45b7d1;
            margin-top: 0;
            text-align: center;
        }

        .search-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .search-input {
            flex: 1;
            padding: 12px;
            border: 3px solid #45b7d1;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
        }

        .search-input:focus {
            border-color: #4ecdc4;
            box-shadow: 0 0 10px rgba(78, 205, 196, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐕 Doge WebSocket RCE Lab</h1>
        <div class="subtitle">Much Code. Very Execute. Wow! 🐶</div>
        <div class="doge-meme">such code, very execute, wow!</div>

        <div id="status" class="status disconnected">🔌 Connecting to RCE Lab...</div>

            <div class="search-section">
                <h3>🔍 DuckDuckGo Search</h3>
                <div class="search-controls">
                    <input type="text" id="search-query" class="search-input" placeholder="Search DuckDuckGo...">
                    <button id="search-btn">🔍 Search</button>
                </div>
            </div>

            <div class="buttons">
                <button id="execute">🚀 Execute Code</button>
                <button id="clear">🧹 Clear Output</button>
            </div>

            <textarea id="code" class="code-input" placeholder="Enter your JavaScript code here...
Example: console.log('Hello, Doge!');
2 + 2
process.version
search('JavaScript tutorials')"></textarea>

            <div id="output" class="output">🐕 Welcome to the Doge RCE Lab!\nMuch secure. Very sandbox. Wow.\n\nReady to execute code or search... 🐶</div>

            <div class="examples">
                <h3>🐶 Example Code Snippets</h3>
                <div class="example-code" onclick="loadExample('console.log(\\'Hello from Doge RCE Lab!\\');')">console.log('Hello from Doge RCE Lab!');</div>
                <div class="example-code" onclick="loadExample('2 + 2')">2 + 2</div>
                <div class="example-code" onclick="loadExample('process.version')">process.version</div>
                <div class="example-code" onclick="loadExample('setTimeout(() => console.log(\\'Delayed message!\\'), 1000);')">setTimeout(() => console.log('Delayed message!'), 1000);</div>
                <div class="example-code" onclick="loadExample('Buffer.from(\\'doge\\').toString(\\'hex\\')')">Buffer.from('doge').toString('hex')</div>
                <div class="example-code" onclick="loadExample('search(\\'JavaScript tutorials\\')')">search('JavaScript tutorials')</div>
                <div class="example-code" onclick="loadExample('search(\\'what is Node.js\\')')">search('what is Node.js')</div>
            </div>

    <script>
        let ws;
        const status = document.getElementById('status');
        const output = document.getElementById('output');
        const code = document.getElementById('code');

        function connect() {
            ws = new WebSocket('ws://' + window.location.host + '/rce');

            ws.onopen = function() {
                status.textContent = '🟢 Connected to RCE Lab!';
                status.className = 'status connected';
                appendOutput('🐕 Connected! Ready to execute code.');
            };

            ws.onmessage = function(event) {
                appendOutput(event.data);
            };

            ws.onclose = function() {
                status.textContent = '🔴 Disconnected from RCE Lab';
                status.className = 'status disconnected';
                appendOutput('❌ Connection lost. Refresh to reconnect.');
            };

            ws.onerror = function(error) {
                status.textContent = '❌ Connection Error';
                status.className = 'status disconnected';
                appendOutput('❌ WebSocket error: ' + error);
            };
        }

        function appendOutput(text) {
            output.textContent += '\\n' + text;
            output.scrollTop = output.scrollHeight;
        }

        function loadExample(example) {
            code.value = example;
        }

        document.getElementById('execute').addEventListener('click', function() {
            if (ws && ws.readyState === WebSocket.OPEN) {
                const codeToExecute = code.value.trim();
                if (codeToExecute) {
                    ws.send(codeToExecute);
                    appendOutput('\\n🚀 Executing: ' + codeToExecute);
                } else {
                    appendOutput('\\n⚠️ Please enter some code to execute!');
                }
            } else {
                appendOutput('\\n❌ Not connected to RCE Lab. Please refresh the page.');
            }
        });

        document.getElementById('clear').addEventListener('click', function() {
            output.textContent = '🐕 Output cleared!\\n';
        });

        // Handle Enter key in textarea
        code.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                document.getElementById('execute').click();
            }
        });

        document.getElementById('search-btn').addEventListener('click', function() {
            const query = document.getElementById('search-query').value.trim();
            if (query && ws && ws.readyState === WebSocket.OPEN) {
                ws.send('SEARCH:' + query);
                appendOutput('\\n🔍 Searching DuckDuckGo for: ' + query);
            } else if (!query) {
                appendOutput('\\n⚠️ Please enter a search query!');
            } else {
                appendOutput('\\n❌ Not connected to RCE Lab. Please refresh the page.');
            }
        });

        // Handle Enter key in search input
        document.getElementById('search-query').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('search-btn').click();
            }
        });
    </script>
</body>
</html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('🐕 Not found. Much confuse. Wow.');
  }
});

// WebSocket server attached to HTTP server
const wss = new WebSocket.Server({ server });

console.log('🐕 Doge WebSocket RCE Lab running on port 1337');
console.log('Much secure. Very sandbox. Wow.');

wss.on('connection', (ws) => {
  console.log('New connection: such code, very execute');

  ws.on('message', async (message) => {
    try {
      const data = message.toString();
      console.log('Received data:', data);

      // Handle search commands
      if (data.startsWith('SEARCH:')) {
        const query = data.substring(7).trim();
        try {
          const results = await searchDuckDuckGo(query);
          ws.send('🔍 Search Results for: ' + query);
          if (results.AbstractText) {
            ws.send('📄 Abstract: ' + results.AbstractText);
          }
          if (results.Answer) {
            ws.send('💡 Answer: ' + results.Answer);
          }
          if (results.RelatedTopics && results.RelatedTopics.length > 0) {
            ws.send('🔗 Related Topics:');
            results.RelatedTopics.slice(0, 3).forEach((topic, index) => {
              if (topic.Text) {
                ws.send(`${index + 1}. ${topic.Text}`);
              }
            });
          }
          if (results.Definition) {
            ws.send('📚 Definition: ' + results.Definition);
          }
        } catch (error) {
          ws.send('❌ Search Error: ' + error.message);
        }
        return;
      }

      // Handle code execution
      const code = data;
      console.log('Executing code:', code);

      // VM2 sandbox for safe execution
      const vm = new VM({
        timeout: 5000,
        sandbox: {
          console: {
            log: (...args) => {
              ws.send('🐕 Console: ' + args.join(' '));
            },
            error: (...args) => {
              ws.send('❌ Error: ' + args.join(' '));
            }
          },
          setTimeout: setTimeout,
          setInterval: setInterval,
          clearTimeout: clearTimeout,
          clearInterval: clearInterval,
          Buffer: Buffer,
          process: {
            env: {},
            version: process.version,
            platform: process.platform
          },
          // Add search function to sandbox
          search: async (query) => {
            try {
              const results = await searchDuckDuckGo(query);
              return results;
            } catch (error) {
              throw new Error('Search failed: ' + error.message);
            }
          }
        }
      });

      const result = vm.run(code);
      ws.send('✅ Result: ' + result);
    } catch (error) {
      ws.send('❌ Error: ' + error.message);
    }
  });

  ws.on('close', () => {
    console.log('Connection closed: sad doge');
  });
});

server.listen(1337, () => {
  console.log('🐕 Doge RCE Lab server listening on port 1337');
});