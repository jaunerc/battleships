import {WebsocketMessageType} from "./WebsocketMessageType";

export interface WebsocketMessage {
    type: WebsocketMessageType
    payload?: string
}