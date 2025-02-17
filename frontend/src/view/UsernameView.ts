import { View } from './View.ts'
import { inject, injectable } from 'inversify'
import type { State } from '../State.ts'
import { PlaceShipsView } from './PlaceShipsView.ts'
import { UsernamePayload } from '../../../messages/UsernamePayload.ts'
import { WebsocketMessage } from '../../../messages/WebsocketMessage.ts'

@injectable()
export class UsernameView implements View {
    constructor(
        @inject('State') private state: State,
        @inject('Websocket') private websocket: WebSocket,
        @inject('PlaceShipsView') private placeShipsView: PlaceShipsView,
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
          <div class="view-content">
            <h1>Type your username</h1>
            <div class="gap-between">
                <input id="username" placeholder="The Captain"/>
                <button id="submit">Submit</button>
            </div>
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
        const usernamePayload: UsernamePayload = { name: username, playerId: this.state.playerId! }
        const websocketMessage: WebsocketMessage = { type: 'USERNAME', payload: JSON.stringify(usernamePayload) }
        this.websocket.send(JSON.stringify(websocketMessage))
    }
}
