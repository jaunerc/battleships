import {UsernamePayloadProcessor} from "./UsernamePayloadProcessor";
import {inject, injectable} from "inversify";
import WebSocket from "ws";
import {PlayerJoiningPayloadProcessor} from "./PlayerJoiningPayloadProcessor";
import {WebsocketMessage} from "../../../../messages/WebsocketMessage";

@injectable()
export class WebsocketMessageProcessor {

    sendUsernameMessagePayloadProcessor: UsernamePayloadProcessor
    playerJoiningPayloadProcessor: PlayerJoiningPayloadProcessor

    constructor(@inject('UsernamePayloadProcessor') sendUsernameMessagePayloadProcessor: UsernamePayloadProcessor,
                @inject('PlayerJoiningPayloadProcessor') playerJoiningPayloadProcessor: PlayerJoiningPayloadProcessor) {
        this.sendUsernameMessagePayloadProcessor = sendUsernameMessagePayloadProcessor
        this.playerJoiningPayloadProcessor = playerJoiningPayloadProcessor
    }

    processWebsocketMessage(websocketMessage: WebsocketMessage, clientWs?: WebSocket): void {
        switch (websocketMessage.type) {
            case 'PLAYER_JOINING':
                if (clientWs === undefined) {
                    throw 'the client websocket cannot be undefined'
                }
                this.playerJoiningPayloadProcessor.process('', clientWs)
                break
            case 'USERNAME':
                if (websocketMessage.payload === undefined) {
                    throw 'The payload cannot be undefined'
                }
                this.sendUsernameMessagePayloadProcessor.process(websocketMessage.payload)
        }
    }
}
