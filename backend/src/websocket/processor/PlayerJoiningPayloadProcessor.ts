import { inject, injectable } from 'inversify'
import { v4 } from 'uuid'
import WebSocket from 'ws'
import { GameState, Player } from '../../Backend'
import { WebsocketMessageSender } from '../WebsocketMessageSender'
import { WebsocketPayloadProcessor } from './WebsocketPayloadProcessor'
import logger from '../../Logger'
import { PlayerIdPayload, SeatId, WebsocketMessage } from '../../../../shared/Shared'

@injectable()
export class PlayerJoiningPayloadProcessor implements WebsocketPayloadProcessor {
    constructor(@inject('GameState') private gameState: GameState,
        @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender,
    ) {}

    process(_payload: string, clientWs: WebSocket): void {
        let playerJoiningPayload: PlayerIdPayload

        if (this.isJoiningNotPossible()) {
            logger.warn('A player try to join the game but it is not possible because there are already two players connected.')
            playerJoiningPayload = { joiningSuccessful: false }
            this.sendWebsocketMessage(clientWs, playerJoiningPayload)
            return
        }

        const player: Player = { id: v4(), readyToStartGame: false, websocket: clientWs, seatId: this.getNextSeatId(), fireLog: [] }
        this.gameState.players.push(player)
        logger.info(`Player joined on the ${player.seatId} seat id.`)

        playerJoiningPayload = { id: player.id, seatId: player.seatId!, joiningSuccessful: true }
        this.sendWebsocketMessage(clientWs, playerJoiningPayload)
    }

    private getNextSeatId(): SeatId {
        if (this.gameState.players.length === 0) {
            return 'first'
        }
        return 'second'
    }

    private isJoiningNotPossible(): boolean {
        return this.gameState.players.length >= 2
    }

    private sendWebsocketMessage(clientWs: WebSocket, playerJoiningPayload: PlayerIdPayload): void {
        const websocketMessage: WebsocketMessage = { type: 'PLAYER_ID', payload: JSON.stringify(playerJoiningPayload) }
        this.websocketMessageSender.sendTo(clientWs, websocketMessage)
    }
}
