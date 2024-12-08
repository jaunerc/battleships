import { inject, injectable } from 'inversify'
import { v4 } from 'uuid'
import WebSocket from 'ws'
import { GameState, Player, SeatId } from '../../Backend'
import { WebsocketMessageSender } from '../WebsocketMessageSender'
import { PlayerIdPayload } from '../../../../messages/PlayerIdPayload'
import { WebsocketMessage } from '../../../../messages/WebsocketMessage'
import { WebsocketPayloadProcessor } from './WebsocketPayloadProcessor'
import logger from '../../Logger'

@injectable()
export class PlayerJoiningPayloadProcessor implements WebsocketPayloadProcessor {
    constructor(@inject('GameState') private gameState: GameState,
        @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender,
    ) {}

    process(_payload: string, clientWs: WebSocket): void {
        const player: Player = { id: v4(), readyToStartGame: false, websocket: clientWs, seatId: this.getNextSeatId(), fireLog: [] }
        this.gameState.players.push(player)
        logger.info(`Player joined on the ${player.seatId} seat id.`)

        const playerIdPayload: PlayerIdPayload = { id: player.id, seatId: player.seatId! }
        const websocketMessage: WebsocketMessage = { type: 'PLAYER_ID', payload: JSON.stringify(playerIdPayload) }
        this.websocketMessageSender.sendTo(clientWs, websocketMessage)
    }

    private getNextSeatId(): SeatId {
        if (this.gameState.players.length === 0) {
            return 'first'
        }
        return 'second'
    }
}
