import {inject, injectable} from "inversify";
import {GameState} from "../../Backend";
import {WebsocketMessageSender} from "../WebsocketMessageSender";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";
import WebSocket from "ws";
import {PlayerReadyPayload} from "../../../../messages/PlayerReadyPayload";
import {WebsocketMessage} from "../../../../messages/WebsocketMessage";
import {GameUpdatePayload} from "../../../../messages/GameUpdatePayload";

@injectable()
export class PlayerReadyPayloadProcessor implements WebsocketPayloadProcessor {

    constructor(@inject('GameState') private gameState: GameState,
                @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender
    ) {}

    process(payload: string, clientWs: WebSocket) {
        const playerReadyPayload: PlayerReadyPayload = JSON.parse(payload)
        const player = this.gameState.players?.find(player => player.id === playerReadyPayload.playerId)
        if (player === undefined) {
            throw 'User does not exists with the id=' + playerReadyPayload.playerId
        }

        player.readyToStartGame = true

        const numNotReadyPlayers = this.gameState.players
            .filter(player => !player.readyToStartGame)
            .length;

        if (numNotReadyPlayers === 0) {
            const gameUpdatePayload: GameUpdatePayload = { currentPlayerSeatId: 'first' }
            const websocketMessage: WebsocketMessage = { type: 'GAME_UPDATE', payload: JSON.stringify(gameUpdatePayload) }
            // this must be changed to a broadcast
            this.websocketMessageSender.sendTo(clientWs, websocketMessage)
        }
    }
}