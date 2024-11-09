import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {View} from "./View.ts";
import {MyFleetCanvas} from "../game/canvas/MyFleetCanvas.ts";
import {container} from "../inversify.config.ts";
import {OpponentFleetCanvas} from "../game/canvas/OpponentFleetCanvas.ts";
import {PlayerReadyPayload} from "../../../messages/PlayerReadyPayload.ts";
import {WebsocketMessage} from "../../../messages/WebsocketMessage.ts";
import {GameUpdatePayload} from "../../../messages/GameUpdatePayload.ts";

@injectable()
export class GameView implements View {

    currentPlayerParagraph?: HTMLParagraphElement
    opponentFleetCanvas?: OpponentFleetCanvas
    myFleetCanvas?: MyFleetCanvas
    winnerPlayerParagraph?: HTMLParagraphElement;

    constructor(
        @inject('State') private state: State,
        @inject('Websocket') private websocket: WebSocket,
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <p>Current Player:</p>
                <p id="current-player"></p>
                <p>Winner:</p>
                <p id="winner"></p>
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
        this.myFleetCanvas = container.get<MyFleetCanvas>('MyFleetCanvas')
        this.opponentFleetCanvas = container.get<OpponentFleetCanvas>('OpponentFleetCanvas')

        this.currentPlayerParagraph = document.querySelector<HTMLParagraphElement>('#current-player')!
        this.winnerPlayerParagraph = document.querySelector<HTMLParagraphElement>('#winner')!

        this.myFleetCanvas.init(myFleetHtmlCanvas, this.state.fleet!)
        this.opponentFleetCanvas.init(opponentFleetHtmlCanvas)
        this.myFleetCanvas.draw()
        this.opponentFleetCanvas.draw()

        const playerReadyPayload: PlayerReadyPayload = { playerId: this.state.playerId! }
        const readyMessage: WebsocketMessage = { type: 'PLAYER_READY', payload: JSON.stringify(playerReadyPayload) }
        this.websocket.send(JSON.stringify(readyMessage))

        this.websocket.onmessage = this.onWebsocketMessage
    }

    private onWebsocketMessage = (message: MessageEvent<string>) => {
        const websocketMessage: WebsocketMessage = JSON.parse(message.data)
        const gameUpdatePayload: GameUpdatePayload = JSON.parse(websocketMessage.payload!)

        if (gameUpdatePayload.fireLogs.length > 0) {
            this.state.fireLogs = {
                myFireLog: gameUpdatePayload.fireLogs.find(fireLog => fireLog.playerSeatId === this.state.seatId)!.entries,
                opponentFireLog: gameUpdatePayload.fireLogs.find(fireLog => fireLog.playerSeatId !== this.state.seatId)!.entries
            }
            this.myFleetCanvas?.update(this.state.fireLogs?.opponentFireLog!)
            this.opponentFleetCanvas?.update(this.state.fireLogs?.myFireLog!)
        }


        this.currentPlayerParagraph!.innerText = gameUpdatePayload.currentPlayerSeatId

        this.myFleetCanvas?.draw()
        this.opponentFleetCanvas?.draw()
        this.opponentFleetCanvas?.setLockForUserInput(this.currentPlayerIsOpponent(gameUpdatePayload))

        if (gameUpdatePayload.winnerSeatId !== undefined) {
            this.winnerPlayerParagraph!.innerText = gameUpdatePayload.winnerSeatId
            this.opponentFleetCanvas?.setLockForUserInput(true)
            this.currentPlayerParagraph!.innerText = ''
        }
    }

    private currentPlayerIsOpponent(gameUpdatePayload: GameUpdatePayload): boolean {
        return this.state.seatId !== gameUpdatePayload.currentPlayerSeatId;
    }
}