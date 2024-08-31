import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';

const expressWsInstance = expressWs(express());
const app = expressWsInstance.app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT: number = 3001;
const gameId: number = 1234;

const clients: WebSocket[] = [];

app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
});

// websocket handler with a placeholder
app.ws('/:id', function(ws, req) {
    console.log('new connection');
    const id: number = Number.parseInt(req.params.id)

    if (id === gameId) {
        clients.push(ws);
    }

    ws.on('message', function(msg) {
        console.log('server msg received: ' + msg + ', with id: ' + id);
        // broadcast the message to all clients on this route
        clients.forEach(client => {
            client.send('broadcast message');
        })
    });

    ws.on('close', function (_code, _reason) {
        console.log('connection closed')
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});