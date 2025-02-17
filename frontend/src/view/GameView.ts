import { inject, injectable } from 'inversify'
import type { State } from '../State.ts'
import { View } from './View.ts'
import { MyFleetSvg } from '../game/svg/MyFleetSvg.ts'
import { container } from '../inversify.config.ts'
import { OpponentFleetSvg } from '../game/svg/OpponentFleetSvg.ts'
import { PlayerReadyPayload } from '../../../messages/PlayerReadyPayload.ts'
import { WebsocketMessage } from '../../../messages/WebsocketMessage.ts'
import { GameUpdatePayload } from '../../../messages/GameUpdatePayload.ts'
import { SVG, Svg } from '@svgdotjs/svg.js'
import { BoardDimension } from '../game/Game'

@injectable()
export class GameView implements View {
    currentPlayerParagraph?: HTMLParagraphElement
    opponentFleetSvg?: OpponentFleetSvg
    myFleetSvg?: MyFleetSvg
    winnerPlayerParagraph?: HTMLParagraphElement

    constructor(
        @inject('State') private state: State,
        @inject('Websocket') private websocket: WebSocket,
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div class="view-content">
                <p>Current Player:</p>
                <p id="current-player"></p>
                <p>Winner:</p>
                <p id="winner"></p>
                <div class="battleground">
                    <div>
                        <p>Opponents fleet</p>
                        <svg id="opponents-fleet-svg"></svg>
                    </div>
                    <div>
                        <p>My fleet</p>
                        <svg id="my-fleet-svg"></svg>
                    </div>
                </div>
            </div>
        `

        window.addEventListener('resize', this.onResize)

        const myFleetSvg: Svg = SVG('#my-fleet-svg')
            .size('100%', '100%')
            .root()
        const opponentsFleetSvg: Svg = SVG('#opponents-fleet-svg')
            .size('100%', '100%')
            .root()

        myFleetSvg.viewbox(0, 0, 400, 400)
        opponentsFleetSvg.viewbox(0, 0, 400, 400)

        this.myFleetSvg = container.get<MyFleetSvg>('MyFleetSvg')
        this.opponentFleetSvg = container.get<OpponentFleetSvg>('OpponentFleetSvg')

        this.currentPlayerParagraph = document.querySelector<HTMLParagraphElement>('#current-player')!
        this.winnerPlayerParagraph = document.querySelector<HTMLParagraphElement>('#winner')!

        this.myFleetSvg.init(myFleetSvg, this.state.fleet!)
        this.opponentFleetSvg.init(opponentsFleetSvg)

        const playerReadyPayload: PlayerReadyPayload = { playerId: this.state.playerId! }
        const readyMessage: WebsocketMessage = { type: 'PLAYER_READY', payload: JSON.stringify(playerReadyPayload) }
        this.websocket.send(JSON.stringify(readyMessage))

        this.websocket.onmessage = this.onWebsocketMessage
    }

    private onResize = () => {
        const boardDimension: BoardDimension = container.get<BoardDimension>('BoardDimension')
        const svgSize: number = document.querySelector<SVGElement>('#my-fleet-svg')!.clientWidth
        console.log('svgSize: ' + svgSize)

        boardDimension.canvasSizeInPixels = 400
        boardDimension.columnSizeInPixels = boardDimension.canvasSizeInPixels / 10
        SVG('#my-fleet-svg')
            .size('100%', '100%')
            .root()
        this.myFleetSvg?.resize(this.state.fleet!)
    }

    private onWebsocketMessage = (message: MessageEvent<string>) => {
        const websocketMessage: WebsocketMessage = JSON.parse(message.data)
        const gameUpdatePayload: GameUpdatePayload = JSON.parse(websocketMessage.payload!)

        if (gameUpdatePayload.fireLogs.length > 0) {
            this.state.fireLogs = {
                myFireLog: gameUpdatePayload.fireLogs.find(fireLog => fireLog.playerSeatId === this.state.seatId)!.entries,
                opponentFireLog: gameUpdatePayload.fireLogs.find(fireLog => fireLog.playerSeatId !== this.state.seatId)!.entries,
            }
            this.myFleetSvg?.update(this.state.fireLogs?.opponentFireLog)
            this.opponentFleetSvg?.update(this.state.fireLogs?.myFireLog)
        }

        this.currentPlayerParagraph!.innerText = gameUpdatePayload.currentPlayerSeatId

        this.opponentFleetSvg?.setLockForUserInput(this.currentPlayerIsOpponent(gameUpdatePayload))

        if (gameUpdatePayload.winnerSeatId !== undefined) {
            this.winnerPlayerParagraph!.innerText = gameUpdatePayload.winnerSeatId
            this.opponentFleetSvg?.setLockForUserInput(true)
            this.currentPlayerParagraph!.innerText = ''
        }
    }

    private currentPlayerIsOpponent(gameUpdatePayload: GameUpdatePayload): boolean {
        return this.state.seatId !== gameUpdatePayload.currentPlayerSeatId
    }
}
