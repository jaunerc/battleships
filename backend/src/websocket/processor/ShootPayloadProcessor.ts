import {inject, injectable} from "inversify";
import {FireLogEntry, GameState, Player} from "../../Backend";
import {WebsocketMessageSender} from "../WebsocketMessageSender";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";
import {ShootPayload} from "../../../../messages/ShootPayload";
import {GameUpdatePayload, PlayerFireLog, PlayerSeatId} from "../../../../messages/GameUpdatePayload";
import {WebsocketMessage} from "../../../../messages/WebsocketMessage";
import {valueIfPresentOrError} from "../../TypeUtils";
import logger from "../../Logger";

@injectable()
export class ShootPayloadProcessor implements WebsocketPayloadProcessor {

    constructor(@inject('GameState') private gameState: GameState,
                @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender) {}

    process(payload: string) {
        const shootPayload: ShootPayload = JSON.parse(payload)
        logger.info(`The ${shootPayload.playerSeatId} player shoot at the position (x: ${shootPayload.shoot.x}, y: ${shootPayload.shoot.y}).`)

        const player: Player = valueIfPresentOrError(this.gameState.players
            .find(player => player.seatId === shootPayload.playerSeatId))

        const fireLogEntry: FireLogEntry = this.createFireLogEntry(shootPayload)
        player.fireLog?.push(fireLogEntry)

        let gameUpdatePayload: GameUpdatePayload
        if (fireLogEntry.result === 'missed') {
            logger.info(`The shoot (x: ${shootPayload.shoot.x}, y: ${shootPayload.shoot.y}) missed all ships.`)
            this.switchCurrentPlayer()
            gameUpdatePayload = { currentPlayerSeatId: this.gameState.currentPlayerSeatId, fireLogs: this.createFireLogsForAllPlayers() }
        } else {
            logger.info(`The shoot (x: ${shootPayload.shoot.x}, y: ${shootPayload.shoot.y}) hit a ship.`)
            const allShipsOfOpponentDestroyed: boolean = this.ifAllShipsDestroyed()

            if (allShipsOfOpponentDestroyed) {
                logger.info(`All ships of the opponent destroyed. The ${player.seatId} wins the game.`)
                this.gameState.winnerPlayerSeatId = this.gameState.currentPlayerSeatId
                gameUpdatePayload = { currentPlayerSeatId: this.gameState.currentPlayerSeatId, winnerSeatId: this.gameState.winnerPlayerSeatId, fireLogs: this.createFireLogsForAllPlayers() }
            } else {
                gameUpdatePayload = { currentPlayerSeatId: this.gameState.currentPlayerSeatId, fireLogs: this.createFireLogsForAllPlayers() }
            }
        }
        this.sendGameUpdateMessage(gameUpdatePayload)
    }

    private createFireLogEntry(shootPayload: ShootPayload): FireLogEntry {
        const opponent: Player = this.findOpponent(shootPayload.playerSeatId)

        return { coordinates: shootPayload.shoot, result: this.missingShot(opponent, shootPayload) ? 'missed' : 'hit' }
    }

    private missingShot(opponent: Player, shootPayload: ShootPayload) {
        return opponent.fleet?.flat()
            .filter(shipCoordinate => shipCoordinate.x === shootPayload.shoot.x && shipCoordinate.y === shootPayload.shoot.y)
            .length === 0;
    }

    private findOpponent(shooterPlayerSeatId: PlayerSeatId) {
        return valueIfPresentOrError(this.gameState.players.find(player => player.seatId !== shooterPlayerSeatId));
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

    private ifAllShipsDestroyed(): boolean {
        const opponent: Player = this.findOpponent(this.gameState.currentPlayerSeatId)
        const currentPlayer: Player = this.gameState.players.find(player => player.seatId === this.gameState.currentPlayerSeatId)!

        return opponent.fleet?.flat()
            .filter(shipField => currentPlayer.fireLog.some(firedField => firedField.coordinates.x === shipField.x && firedField.coordinates.y === shipField.y))
            .length === opponent.fleet?.flat().length
    }

    private sendGameUpdateMessage(payload: GameUpdatePayload): void {
        const websocketMessage: WebsocketMessage = { type: 'GAME_UPDATE', payload: JSON.stringify(payload) }
        this.websocketMessageSender.broadcast(websocketMessage)
    }
}