import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {View} from "./View.ts";
import {MyFleetCanvas} from "../game/canvas/MyFleetCanvas.ts";
import {container} from "../inversify.config.ts";
import {OpponentFleetCanvas} from "../game/canvas/OpponentFleetCanvas.ts";
import {PlayerReadyPayload} from "../../../messages/PlayerReadyPayload.ts";
import {WebsocketMessage} from "../../../messages/WebsocketMessage.ts";

@injectable()
export class GameView implements View {

    constructor(
        @inject('State') private state: State,
        @inject('Websocket') private websocket: WebSocket,
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <div>
                    <p>Opponents fleet</p>
                    <canvas id="opponent-canvas" width="400px" height="400px"></canvas>
                </div>
                <div>
                    <p>My fleet</p>
                    <canvas id="my-fleet-canvas" width="400px" height="400px"></canvas>
                </div>
            </div>
        `

        const myFleetHtmlCanvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#my-fleet-canvas')!
        const opponentFleetHtmlCanvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#opponent-canvas')!
        const myFleetCanvas: MyFleetCanvas = container.get<MyFleetCanvas>('MyFleetCanvas')
        const opponentFleetCanvas: OpponentFleetCanvas = container.get<OpponentFleetCanvas>('OpponentFleetCanvas')

        myFleetCanvas.init(myFleetHtmlCanvas, this.state.fleet!)
        opponentFleetCanvas.init(opponentFleetHtmlCanvas)
        myFleetCanvas.draw()
        opponentFleetCanvas.draw()

        const playerReadyPayload: PlayerReadyPayload = { playerId: this.state.playerId! }
        const readyMessage: WebsocketMessage = { type: 'PLAYER_READY', payload: JSON.stringify(playerReadyPayload) }
        this.websocket.send(JSON.stringify(readyMessage))

        this.websocket.onmessage = this.onWebsocketMessage
    }

    private onWebsocketMessage = (message: MessageEvent<string>) => {
        console.log(message)
    }
}