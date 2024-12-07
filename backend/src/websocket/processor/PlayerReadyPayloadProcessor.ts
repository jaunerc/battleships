import {inject, injectable} from "inversify";
import {GameState} from "../../Backend";
import {WebsocketMessageSender} from "../WebsocketMessageSender";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";
import {PlayerReadyPayload} from "../../../../messages/PlayerReadyPayload";
import {WebsocketMessage} from "../../../../messages/WebsocketMessage";
import {GameUpdatePayload} from "../../../../messages/GameUpdatePayload";
import logger from "../../Logger";

@injectable()
export class PlayerReadyPayloadProcessor implements WebsocketPayloadProcessor {

    constructor(@inject('GameState') private gameState: GameState,
                @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender
    ) {}

    process(payload: string) {
        const playerReadyPayload: PlayerReadyPayload = JSON.parse(payload)
        const player = this.gameState.players?.find(player => player.id === playerReadyPayload.playerId)
        if (player === undefined) {
            throw 'User does not exists with the id=' + playerReadyPayload.playerId
        }

        logger.info(`The ${player.seatId} player is ready to start the game.`)
        player.readyToStartGame = true

        const numNotReadyPlayers = this.gameState.players
            .filter(player => !player.readyToStartGame)
            .length;

        if (this.gameState.players.length === 2 && numNotReadyPlayers === 0) {
            const gameUpdatePayload: GameUpdatePayload = { currentPlayerSeatId: 'first', fireLogs: [] }
            const websocketMessage: WebsocketMessage = { type: 'GAME_UPDATE', payload: JSON.stringify(gameUpdatePayload) }
            this.websocketMessageSender.broadcast(websocketMessage)
        }
    }
}