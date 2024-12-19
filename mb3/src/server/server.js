const express = require('express');
const path = require('path');
const routes = require('./routes');
const { setupWSConnection } = require('y-websocket/bin/utils');
const Y = require('yjs');

const app = express();
const port = 3000;

app.use(express.json());

// Serve a modified version of the web client
app.use(express.static(path.join(__dirname, '../dist')));

// Use the routes defined in routes.js
app.use('/', routes);

const ydoc = new Y.Doc();

const websocketProvider = new WebsocketProvider(
    'ws://localhost:3000', // WebSocket server URL
    'my-document', // Room name (can be dynamic based on your needs)
    ydoc
);

// Set up WebSocket connection
setupWSConnection(app, '/websocket', {
    gc: true, // Enable garbage collection (optional)
});

const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Handle WebSocket connections separately
server.on('upgrade', (request, socket, head) => {
    if (request.url === '/websocket') {
        setupWSConnection(
            {
                request,
                socket,
                head,
            },
            {
                gc: true,
            }
        );
    } else {
        socket.destroy();
    }
});
