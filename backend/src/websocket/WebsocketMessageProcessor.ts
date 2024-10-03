import {WebsocketMessage} from "../../../messages/WebsocketMessage";
import {SendUsernameMessagePayloadProcessor} from "./SendUsernameMessagePayloadProcessor";
import {inject, injectable} from "inversify";

@injectable()
export class WebsocketMessageProcessor {

    sendUsernameMessagePayloadProcessor: SendUsernameMessagePayloadProcessor

    constructor(@inject('SendUsernameMessagePayloadProcessor') sendUsernameMessagePayloadProcessor: SendUsernameMessagePayloadProcessor) {
        this.sendUsernameMessagePayloadProcessor = sendUsernameMessagePayloadProcessor
    }

    processWebsocketMessage(websocketMessage: WebsocketMessage): void {
        switch (websocketMessage.type) {
            case "SEND_USERNAME":
                if (websocketMessage.payload === undefined) {
                    throw 'The payload cannot be undefined'
                }
                this.sendUsernameMessagePayloadProcessor.process(websocketMessage.payload)
        }
    }
}
