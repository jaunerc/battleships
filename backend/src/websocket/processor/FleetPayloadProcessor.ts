import {inject, injectable} from "inversify";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";
import {GameState} from "../../Backend";
import {FleetPayload} from "../../../../messages/FleetPayload";

@injectable()
export class FleetPayloadProcessor implements WebsocketPayloadProcessor{

    constructor(@inject('GameState') private gameState: GameState) {}

    process(payload: string): void {
        const fleetPayload: FleetPayload = JSON.parse(payload)
        const player = this.gameState.players?.find(player => player.id === fleetPayload.playerId)
        if (player === undefined) {
            throw 'User does not exists with the id=' + fleetPayload.playerId
        }
        player.fleet = fleetPayload.fleet
    }
}