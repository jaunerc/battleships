import {View} from "./View.ts";
import {WebsocketMessage} from "../WebsocketMessage.ts";
import {inject, injectable} from "inversify";
import type {State} from "../State.ts";

@injectable()
export class UsernameView implements View {

    websocket: WebSocket
    state: State

    constructor(
        @inject('State') state: State,
        @inject('Websocket') websocket: WebSocket) {
        this.websocket = websocket
        this.state = state
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
            this.sendUsername(username)
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