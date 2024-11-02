import {inject, injectable} from "inversify";
import {FireLogEntry, GameState, Player} from "../../Backend";
import {WebsocketMessageSender} from "../WebsocketMessageSender";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";
import {ShootPayload} from "../../../../messages/ShootPayload";
import {GameUpdatePayload, PlayerFireLog} from "../../../../messages/GameUpdatePayload";
import {WebsocketMessage} from "../../../../messages/WebsocketMessage";
import {valueIfPresentOrError} from "../../TypeUtils";

@injectable()
export class ShootPayloadProcessor implements WebsocketPayloadProcessor {

    constructor(@inject('GameState') private gameState: GameState,
                @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender) {}

    process(payload: string) {
        const shootPayload: ShootPayload = JSON.parse(payload)

        const player: Player = valueIfPresentOrError(this.gameState.players
            .find(player => player.seatId === shootPayload.playerSeatId))

        const fireLogEntry: FireLogEntry = this.createFireLogEntry(shootPayload)
        player.fireLog?.push(fireLogEntry)

        if (fireLogEntry.result === 'missed') {
            this.switchCurrentPlayer()
        }

        const gameUpdatePayload: GameUpdatePayload = { currentPlayerSeatId: this.gameState.currentPlayerSeatId, fireLogs: this.createFireLogsForAllPlayers() }
        const websocketMessage: WebsocketMessage = { type: 'GAME_UPDATE', payload: JSON.stringify(gameUpdatePayload) }
        this.websocketMessageSender.broadcast(websocketMessage)
    }

    private createFireLogEntry(shootPayload: ShootPayload): FireLogEntry {
        const opponent: Player = this.findOpponent(shootPayload)

        return { coordinates: shootPayload.shoot, result: this.missingShot(opponent, shootPayload) ? 'missed' : 'hit' }
    }

    private missingShot(opponent: Player, shootPayload: ShootPayload) {
        return opponent.fleet?.flat()
            .filter(shipCoordinate => shipCoordinate.x === shootPayload.shoot.x && shipCoordinate.y === shootPayload.shoot.y)
            .length === 0;
    }

    private findOpponent(shootPayload: ShootPayload) {
        return valueIfPresentOrError(this.gameState.players.find(player => player.seatId !== shootPayload.playerSeatId));
    }

    private switchCurrentPlayer(): void {
        this.gameState.currentPlayerSeatId = this.gameState.currentPlayerSeatId === 'first' ? 'second' : 'first'
    }

    private createFireLogsForAllPlayers(): PlayerFireLog[] {
        return this.gameState.players
            .map(player => this.createFireLogFor(player))
    }

    private createFireLogFor(player: Player): PlayerFireLog {
        return {
            playerSeatId: player.seatId!,
            entries: player.fireLog!
        }
    }
}