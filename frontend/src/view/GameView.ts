import { inject, injectable } from 'inversify'
import type { State } from '../State.ts'
import { View } from './View.ts'
import { MyFleetSvg } from '../game/svg/MyFleetSvg.ts'
import { container } from '../inversify.config.ts'
import { OpponentFleetSvg } from '../game/svg/OpponentFleetSvg.ts'
import { PlayerReadyPayload } from '../../../messages/PlayerReadyPayload.ts'
import { WebsocketMessage } from '../../../messages/WebsocketMessage.ts'
import { GameUpdatePayload, PlayerSeatId } from '../../../messages/GameUpdatePayload.ts'
import { SVG, Svg } from '@svgdotjs/svg.js'

@injectable()
export class GameView implements View {
    infoTextParagraph?: HTMLParagraphElement
    opponentFleetSvg?: OpponentFleetSvg
    myFleetSvg?: MyFleetSvg

    constructor(
        @inject('State') private state: State,
        @inject('Websocket') private websocket: WebSocket,
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div class="view-content">
                <h1>Battle!</h1>
                <p id="info-text">Waiting for the other player...</p>
                <div class="battleground">
                    <div>
                        <svg id="opponents-fleet-svg"></svg>
                        <p>Opponents fleet</p>
                    </div>
                    <div>
                        <svg id="my-fleet-svg"></svg>
                        <p>My fleet</p>
                    </div>
                </div>
            </div>
        `

        const myFleetSvg: Svg = SVG('#my-fleet-svg')
            .size('100%', '100%')
            .root()
        const opponentsFleetSvg: Svg = SVG('#opponents-fleet-svg')
            .size('100%', '100%')
            .root()

        myFleetSvg.viewbox(-1, -1, 102, 102)
        opponentsFleetSvg.viewbox(-1, -1, 102, 102)

        this.myFleetSvg = container.get<MyFleetSvg>('MyFleetSvg')
        this.opponentFleetSvg = container.get<OpponentFleetSvg>('OpponentFleetSvg')

        this.infoTextParagraph = document.querySelector<HTMLParagraphElement>('#info-text')!

        this.myFleetSvg.init(myFleetSvg, this.state.fleet!)
        this.opponentFleetSvg.init(opponentsFleetSvg)

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
                opponentFireLog: gameUpdatePayload.fireLogs.find(fireLog => fireLog.playerSeatId !== this.state.seatId)!.entries,
            }
            this.myFleetSvg?.update(this.state.fireLogs?.opponentFireLog)
            this.opponentFleetSvg?.update(this.state.fireLogs?.myFireLog)
        }

        this.setCurrentPlayerInfo(gameUpdatePayload)

        this.opponentFleetSvg?.setLockForUserInput(this.isOpponentSeat(gameUpdatePayload.currentPlayerSeatId))

        if (gameUpdatePayload.winnerSeatId !== undefined) {
            const wonTheBattle: boolean = !this.isOpponentSeat(gameUpdatePayload.winnerSeatId)
            this.opponentFleetSvg?.setLockForUserInput(true)

            if (wonTheBattle) {
                this.infoTextParagraph!.innerText = 'Congrats. You won!'
            } else {
                this.infoTextParagraph!.innerText = 'You lost...'
            }
        }
    }

    private isOpponentSeat(seatId: PlayerSeatId): boolean {
        return this.state.seatId !== seatId
    }

    private setCurrentPlayerInfo(gameUpdatePayload: GameUpdatePayload): void {
        const showOpponentInfo: boolean = this.isOpponentSeat(gameUpdatePayload.currentPlayerSeatId)
        this.infoTextParagraph!.innerText = `Current Player: ${showOpponentInfo ? 'Opponent' : 'You'}`
    }
}
