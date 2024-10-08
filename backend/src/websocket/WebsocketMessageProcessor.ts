import {inject, injectable} from "inversify";
import WebSocket from "ws";
import {UsernamePayloadProcessor} from "./processor/UsernamePayloadProcessor";
import {PlayerJoiningPayloadProcessor} from "./processor/PlayerJoiningPayloadProcessor";
import {WebsocketMessage} from "../../../messages/WebsocketMessage";

@injectable()
export class WebsocketMessageProcessor {

    constructor(@inject('UsernamePayloadProcessor') private sendUsernameMessagePayloadProcessor: UsernamePayloadProcessor,
                @inject('PlayerJoiningPayloadProcessor') private playerJoiningPayloadProcessor: PlayerJoiningPayloadProcessor
    ) {}

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
