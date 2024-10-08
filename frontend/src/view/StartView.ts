import type {View} from "./View.ts";
import type {State} from "../State.ts";
import {inject, injectable} from "inversify";
import {WebsocketMessage} from "../../../messages/WebsocketMessage.ts";
import {PlayerIdPayload} from "../../../messages/PlayerIdPayload.ts";

@injectable()
export class StartView implements View {

    state: State
    usernameView: View
    websocket: WebSocket

    constructor(
        @inject('State') state: State,
        @inject('UsernameView') usernameView: View,
        @inject('Websocket') websocket: WebSocket) {
        this.state = state
        this.usernameView = usernameView
        this.websocket = websocket
    }

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <h1>Welcome to Battleships</h1>
                <button id="start">Start the game</button>
            </div>
        `
        const startButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#start')!
        startButton.addEventListener('click', () => {
            this.usernameView.show(appDiv)
        })

        this.websocket.onmessage = this.onWebsocketMessage
    }

    private onWebsocketMessage = (message: MessageEvent<string>) => {
        const websocketMessage: WebsocketMessage = JSON.parse(message.data);
        if (websocketMessage.type === 'PLAYER_ID') {
            if (websocketMessage.payload === undefined) {
                throw 'the player id payload cannot be undefined'
            }
            const playerIdPayload: PlayerIdPayload = JSON.parse(websocketMessage.payload)
            this.state.playerId = playerIdPayload.id
        }
    }
}