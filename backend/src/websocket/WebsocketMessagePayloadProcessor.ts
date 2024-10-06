import WebSocket from "ws";

export interface WebsocketMessagePayloadProcessor {
    process: (payload: string, clientWs: WebSocket) => void
}
