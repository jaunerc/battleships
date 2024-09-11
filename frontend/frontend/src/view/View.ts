export interface View {
    websocket: WebSocket
    show: (appDiv: HTMLDivElement) => void
}