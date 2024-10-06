import "reflect-metadata";
import express from 'express';
import expressWs from 'express-ws';
import {WebsocketMessage} from "../../messages/WebsocketMessage";
import {container} from "./inversify.config";
import {WebsocketMessageProcessor} from "./websocket/processor/WebsocketMessageProcessor";

const expressWsInstance = expressWs(express());
const app = expressWsInstance.app;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT: number = 3001;

app.get('/api', (_req, res) => {
    res.status(200).json({message: 'Hello from the server!'});
});

// websocket handler with a placeholder
app.ws('/', function (ws, _req) {
    const websocketMessageProcessor: WebsocketMessageProcessor = container.get('WebsocketMessageProcessor')
    console.log('new connection');

    const playerJoiningMessage: WebsocketMessage = { type: 'PLAYER_JOINING' }
    websocketMessageProcessor.processWebsocketMessage(playerJoiningMessage, ws)

    ws.on('message', function (msg) {
        const websocketMessage: WebsocketMessage = JSON.parse(msg.toString());
        console.log('msg received of type: ' + websocketMessage.type);

        websocketMessageProcessor.processWebsocketMessage(websocketMessage)

    });

    ws.on('close', function (_code, _reason) {
        console.log('connection closed')
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});