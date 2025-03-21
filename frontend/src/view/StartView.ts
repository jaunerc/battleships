import type { View } from './View.ts'
import type { State } from '../State.ts'
import { inject, injectable } from 'inversify'
import { PlayerIdPayload, WebsocketMessage } from '../../../shared/Shared.ts'

@injectable()
export class StartView implements View {
    constructor(
        @inject('State') private state: State,
        @inject('UsernameView') private usernameView: View,
        @inject('Websocket') private websocket: WebSocket,
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div class="view-content">
                <h1>Welcome to Battleships</h1>
                <button id="start">Start the game</button>
                <p hidden class="error-text">You cannot join. There is already a game running...</p>
            </div>
        `
        const startButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#start')!
        startButton.addEventListener('click', () => {
            this.usernameView.show(appDiv)
        })

        this.websocket.onmessage = this.onWebsocketMessage
    }

    private onWebsocketMessage = (message: MessageEvent<string>) => {
        const websocketMessage: WebsocketMessage = JSON.parse(message.data)
        if (websocketMessage.type === 'PLAYER_ID') {
            if (websocketMessage.payload === undefined) {
                throw 'the player id payload cannot be undefined'
            }

            const playerIdPayload: PlayerIdPayload = JSON.parse(websocketMessage.payload)

            if (playerIdPayload.joiningSuccessful) {
                this.state.playerId = playerIdPayload.id
                this.state.seatId = playerIdPayload.seatId
            } else {
                const errorParagraph: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>('.error-text')!
                const startButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#start')!

                errorParagraph.hidden = false
                startButton.disabled = true
            }
        }
    }
}
