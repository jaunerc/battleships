import WebSocket from 'ws';
import {WebsocketMessage} from "../../../messages/WebsocketMessage";
import {inject, injectable} from "inversify";
import {GameState} from "../Backend";

@injectable()
export class WebsocketMessageSender {

    constructor(@inject('GameState') private gameState: GameState) {
    }

    sendTo(ws: WebSocket, message: WebsocketMessage): void {
        ws.send(JSON.stringify(message))
    }

    broadcast(message: WebsocketMessage): void {
        this.gameState.players.forEach(player => {
            this.sendTo(player.websocket, message)
        })
    }
}