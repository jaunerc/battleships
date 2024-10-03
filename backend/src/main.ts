import "reflect-metadata";
import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';
import {WebsocketMessage} from "../../messages/WebsocketMessage";
import {container} from "./inversify.config";
import {WebsocketMessageProcessor} from "./websocket/WebsocketMessageProcessor";

const expressWsInstance = expressWs(express());
const app = expressWsInstance.app;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT: number = 3001;

const clients: WebSocket[] = [];

app.get('/api', (_req, res) => {
    res.status(200).json({message: 'Hello from the server!'});
});

// websocket handler with a placeholder
app.ws('/', function (ws, _req) {
    console.log('new connection');
    clients.push(ws)

    ws.on('message', function (msg) {
        const websocketMessage: WebsocketMessage = JSON.parse(msg.toString());
        console.log('msg received of type: ' + websocketMessage.type);
        const websocketMessageProcessor: WebsocketMessageProcessor = container.get('WebsocketMessageProcessor')

        websocketMessageProcessor.processWebsocketMessage(websocketMessage)

    });

    ws.on('close', function (_code, _reason) {
        console.log('connection closed')
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});