export interface WebsocketMessagePayloadProcessor {
    process: (payload: string) => void
}
