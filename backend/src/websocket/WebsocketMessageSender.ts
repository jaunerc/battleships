import WebSocket from 'ws';
import {WebsocketMessage} from "../../../messages/WebsocketMessage";
import {injectable} from "inversify";

@injectable()
export class WebsocketMessageSender {

    sendTo(ws: WebSocket, message: WebsocketMessage) {
        ws.send(JSON.stringify(message))
    }
}