import {inject, injectable} from "inversify";
import {v4} from "uuid";
import WebSocket from "ws";
import {GameState, Player} from "../../Backend";
import {WebsocketMessageSender} from "../WebsocketMessageSender";
import {PlayerIdPayload} from "../../../../messages/PlayerIdPayload";
import {WebsocketMessage} from "../../../../messages/WebsocketMessage";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";

@injectable()
export class PlayerJoiningPayloadProcessor implements WebsocketPayloadProcessor {

    constructor(@inject('GameState') private gameState: GameState,
                @inject('WebsocketMessageSender') private websocketMessageSender: WebsocketMessageSender
    ) {}

    process(_payload: string, clientWs: WebSocket): void {
        const player: Player = { id: v4() }
        this.gameState.players.push(player)
        const playerIdPayload: PlayerIdPayload = { id: player.id }
        const websocketMessage: WebsocketMessage = { type: "PLAYER_ID", payload: JSON.stringify(playerIdPayload)}
        this.websocketMessageSender.sendTo(clientWs, websocketMessage)
    }
}
