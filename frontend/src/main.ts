import './style.css'
import "reflect-metadata";
import {container} from "./inversify.config.ts";
import {View} from "./view/View.ts";

const webSocket: WebSocket = container.get<WebSocket>('Websocket')

const startView = container.get<View>('StartView')

webSocket.onopen = () => {
    console.log('websocket connected')
    startView.show(document.querySelector<HTMLDivElement>('#app')!)
}
