import './style.css'
import "reflect-metadata";
import {container} from "./inversify.config.ts";
import {View} from "./view/View.ts";
import {WebsocketMessage} from "./WebsocketMessage.ts";
import {State} from "./State.ts";

const webSocket: WebSocket = container.get<WebSocket>('Websocket')

const startView = container.get<View>('StartView')
const state = container.get<State>('State')

webSocket.onopen = () => {
    console.log('websocket connected')
    startView.show(document.querySelector<HTMLDivElement>('#app')!)
}

webSocket.onmessage = (message: MessageEvent<string>) => {
    const websocketMessage: WebsocketMessage = JSON.parse(message.data);
    switch (websocketMessage.messageType) {
        case "READY":
            onReadyMessage();
    }
}
function onReadyMessage(): void {
    console.log('username from state: ' + state.username)
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div>
            <p>Battle!</p>
        </div>
    `
}
