import WebSocket from 'ws'
import { inject, injectable } from 'inversify'
import { GameState } from '../Backend'
import logger from '../Logger'
import { WebsocketMessage } from '../../../shared/Shared'

@injectable()
export class WebsocketMessageSender {
    constructor(@inject('GameState') private gameState: GameState) {
    }

    sendTo(ws: WebSocket, message: WebsocketMessage): void {
        logger.info(`Send message with type ${message.type} to the client.`)
        ws.send(JSON.stringify(message))
    }

    broadcast(message: WebsocketMessage): void {
        this.gameState.players.forEach((player) => {
            this.sendTo(player.websocket, message)
        })
    }
}
