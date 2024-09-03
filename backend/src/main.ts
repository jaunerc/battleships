import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';

const expressWsInstance = expressWs(express());
const app = expressWsInstance.app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT: number = 3001;

const clients: WebSocket[] = [];

interface Player {
    name: string;
}
const players: Player[] = [];

app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
});

interface WebsocketMessage {
    messageType: 'READY' | 'SEND_USERNAME';
    username?: string;
}

// websocket handler with a placeholder
app.ws('/', function(ws, _req) {
    console.log('new connection');
    clients.push(ws)

    ws.on('message', function(msg) {
        const websocketMessage: WebsocketMessage = JSON.parse(msg.toString());
        console.log('msg received of type: ' + websocketMessage.messageType);

        switch (websocketMessage.messageType) {
            case "SEND_USERNAME":
                players.push({ name: websocketMessage.username!});
                if (players.length === 2) {
                    clients.forEach(client => {
                        const broadcastMessage: WebsocketMessage = { messageType: "READY"};
                        client.send(JSON.stringify(broadcastMessage));
                    })
                }
        }
    });

    ws.on('close', function (_code, _reason) {
        console.log('connection closed')
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});