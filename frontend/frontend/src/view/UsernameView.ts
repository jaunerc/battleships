import {View} from "./View.ts";
import {WebsocketMessage} from "../WebsocketMessage.ts";
import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {PlaceShipsView} from "./PlaceShipsView.ts";

@injectable()
export class UsernameView implements View {

    websocket: WebSocket
    state: State
    placeShipsView: PlaceShipsView

    constructor(
        @inject('State') state: State,
        @inject('Websocket') websocket: WebSocket,
        @inject('PlaceShipsView') placeShipsView: PlaceShipsView) {
        this.websocket = websocket
        this.state = state
        this.placeShipsView = placeShipsView
    }

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
          <div>
            <label for="username">Please type your username</label>
            <input id="username"/>
            <button id="submit">Submit</button>
          </div>
        `
        const submitButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#submit')!
        submitButton.addEventListener('click', () => {
            const username: string = this.readUsernameFromDom()
            this.state.username = username
            this.sendUsername(username)

            this.placeShipsView.show(appDiv)
        })
    }

    readUsernameFromDom(): string {
        return document.querySelector<HTMLInputElement>('#username')!.value
    }

    sendUsername(username: string): void {
        const websocketMessage: WebsocketMessage = { messageType: 'SEND_USERNAME', username: username}
        this.websocket.send(JSON.stringify(websocketMessage))
    }
}