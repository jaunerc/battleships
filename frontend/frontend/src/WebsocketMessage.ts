export interface WebsocketMessage {
    messageType: 'READY' | 'SEND_USERNAME';
    username?: string;
}