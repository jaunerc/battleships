import {inject, injectable} from "inversify";
import WebSocket from "ws";
import {UsernamePayloadProcessor} from "./processor/UsernamePayloadProcessor";
import {PlayerJoiningPayloadProcessor} from "./processor/PlayerJoiningPayloadProcessor";
import {WebsocketMessage} from "../../../messages/WebsocketMessage";
import {FleetPayloadProcessor} from "./processor/FleetPayloadProcessor";
import {PlayerReadyPayloadProcessor} from "./processor/PlayerReadyPayloadProcessor";
import {valueIfPresentOrError} from "../TypeUtils";

@injectable()
export class WebsocketMessageProcessor {

    constructor(@inject('UsernamePayloadProcessor') private sendUsernameMessagePayloadProcessor: UsernamePayloadProcessor,
                @inject('PlayerJoiningPayloadProcessor') private playerJoiningPayloadProcessor: PlayerJoiningPayloadProcessor,
                @inject('FleetPayloadProcessor') private fleetPayloadProcessor: FleetPayloadProcessor,
                @inject('PlayerReadyPayloadProcessor') private playerReadyPayloadProcessor: PlayerReadyPayloadProcessor
    ) {}

    processWebsocketMessage(websocketMessage: WebsocketMessage, clientWs?: WebSocket): void {
        switch (websocketMessage.type) {
            case 'PLAYER_JOINING':
                this.playerJoiningPayloadProcessor.process('', valueIfPresentOrError(clientWs))
                break
            case 'USERNAME':
                this.sendUsernameMessagePayloadProcessor.process(valueIfPresentOrError(websocketMessage.payload))
                break
            case 'FLEET':
                if (websocketMessage.payload === undefined) {
                    throw 'The payload cannot be undefined'
                }
                this.fleetPayloadProcessor.process(valueIfPresentOrError(websocketMessage.payload))
                break
            case "PLAYER_READY":
                if (websocketMessage.payload === undefined) {
                    throw 'The payload cannot be undefined'
                }
                this.playerReadyPayloadProcessor.process(valueIfPresentOrError(websocketMessage.payload))
        }
    }
}
