import {inject, injectable} from "inversify";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";
import {FieldCoordinate, GameState} from "../../Backend";
import {FleetPayload} from "../../../../messages/FleetPayload";
import {WebsocketMessageSender} from "../WebsocketMessageSender";
import WebSocket from "ws";
import {WebsocketMessage} from "../../../../messages/WebsocketMessage";
import {FleetValidationPayload} from "../../../../messages/FleetValidationPayload";
import logger from "../../Logger";

type ValidationResult = 'passed' | 'overlapping_ships' | 'no_distance_between_ships'

@injectable()
export class FleetPayloadProcessor implements WebsocketPayloadProcessor {

    constructor(@inject('GameState') private gameState: GameState,
                @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender) {
    }

    process(payload: string, clientWs: WebSocket): void {
        const fleetPayload: FleetPayload = JSON.parse(payload)
        const player = this.gameState.players?.find(player => player.id === fleetPayload.playerId)
        if (player === undefined) {
            throw 'User does not exists with the id=' + fleetPayload.playerId
        }

        const result: ValidationResult = this.validateFleet(fleetPayload.fleet)

        const fleetValidationPayload: FleetValidationPayload = {validationResult: result}
        const websocketMessage: WebsocketMessage = {
            type: 'FLEET_VALIDATION',
            payload: JSON.stringify(fleetValidationPayload)
        }
        this.websocketMessageSender.sendTo(clientWs, websocketMessage)

        if (result === 'passed') {
            player.fleet = fleetPayload.fleet
        }
    }

    private validateFleet(fleet: FieldCoordinate[][]): ValidationResult {
        const noOverlappingShipsResult: ValidationResult = this.validateNoOverlappingShips(fleet)
        if (noOverlappingShipsResult !== 'passed') {
            logger.warn('Fleet validation unsuccessfully - there are overlapping ships.')
            return noOverlappingShipsResult
        }
        const distanceBetweenShipsResult: ValidationResult = this.validateDistanceBetweenShips(fleet)
        if (distanceBetweenShipsResult !== 'passed') {
            logger.warn('Fleet validation unsuccessfully - the distance between the ships is too small.')
            return distanceBetweenShipsResult
        }
        return 'passed'
    }

    private validateNoOverlappingShips(fleet: FieldCoordinate[][]): ValidationResult {
        const occupiedFields: FieldCoordinate[] = []

        for (const shipField of fleet.flat()) {
            if (occupiedFields.some(neighbourField => neighbourField.x === shipField.x && neighbourField.y === shipField.y)) {
                return 'overlapping_ships'
            }
            occupiedFields.push(shipField)
        }
        return 'passed'
    }

    private validateDistanceBetweenShips(fleet: FieldCoordinate[][]): ValidationResult {
        const occupiedFields: FieldCoordinate[] = []

        // create an array with all neighbour fields
        for (const ship of fleet) {
            // add all neighbour fields
            for (const shipField of ship) {
                const neighbourFields: FieldCoordinate[] = [
                    // left fields
                    {x: shipField.x - 1, y: shipField.y - 1},
                    {x: shipField.x - 1, y: shipField.y},
                    {x: shipField.x - 1, y: shipField.y + 1},
                    // top field
                    {x: shipField.x, y: shipField.y - 1},
                    // bottom field
                    {x: shipField.x, y: shipField.y + 1},
                    // right fields
                    {x: shipField.x + 1, y: shipField.y - 1},
                    {x: shipField.x + 1, y: shipField.y},
                    {x: shipField.x + 1, y: shipField.y + 1},
                ]

                for (const neighbour of neighbourFields) {
                    // avoid adding the same field multiple times
                    // avoid adding ship fields
                    if (!occupiedFields.some(occupiedField => occupiedField.x === neighbour.x && occupiedField.y === neighbour.y)
                        && !ship.some(shipField => shipField.x === neighbour.x && shipField.y === neighbour.y)) {
                        occupiedFields.push(neighbour)
                    }
                }
            }
        }

        for (const shipField of fleet.flat()) {
            if (occupiedFields.some(neighbourField => neighbourField.x === shipField.x && neighbourField.y === shipField.y)) {
                return 'no_distance_between_ships'
            }
        }

        return 'passed'
    }
}