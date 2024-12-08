import WebSocket from 'ws'

export interface WebsocketPayloadProcessor {
    process: (payload: string, clientWs: WebSocket) => void
}
