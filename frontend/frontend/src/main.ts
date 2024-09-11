import './style.css'
import "reflect-metadata";
import {container} from "./inversify.config.ts";
import {View} from "./view/View.ts";

const webSocket: WebSocket = container.get<WebSocket>('Websocket')

const usernameView = container.get<View>('UsernameView')

webSocket.onopen = () => {
    console.log('websocket connected')
    usernameView.show(document.querySelector<HTMLDivElement>('#app')!)
}

interface WebsocketMessage {
    messageType: 'READY' | 'SEND_USERNAME';
    username?: string;
}

webSocket.onmessage = (message: MessageEvent<string>) => {
    const websocketMessage: WebsocketMessage = JSON.parse(message.data);
    switch (websocketMessage.messageType) {
        case "READY":
            onReadyMessage();
    }
}
function onReadyMessage(): void {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div>
            <p>Battle!</p>
        </div>
    `
}
