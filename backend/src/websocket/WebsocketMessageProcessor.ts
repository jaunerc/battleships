import {WebsocketMessage} from "../../../messages/WebsocketMessage";
import {SendUsernameMessagePayloadProcessor} from "./SendUsernameMessagePayloadProcessor";
import {inject, injectable} from "inversify";
import WebSocket from "ws";
import {PlayerJoiningPayloadProcessor} from "./PlayerJoiningPayloadProcessor";

@injectable()
export class WebsocketMessageProcessor {

    sendUsernameMessagePayloadProcessor: SendUsernameMessagePayloadProcessor
    playerJoiningPayloadProcessor: PlayerJoiningPayloadProcessor

    constructor(@inject('SendUsernameMessagePayloadProcessor') sendUsernameMessagePayloadProcessor: SendUsernameMessagePayloadProcessor,
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
            case 'SEND_USERNAME':
                if (websocketMessage.payload === undefined) {
                    throw 'The payload cannot be undefined'
                }
                this.sendUsernameMessagePayloadProcessor.process(websocketMessage.payload)
        }
    }
}
