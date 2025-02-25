import { View } from './View.ts'
import { inject, injectable } from 'inversify'
import type { State } from '../State.ts'
import { PlaceShipsSvg } from '../game/svg/PlaceShipsSvg.ts'
import { container } from '../inversify.config.ts'
import { gameContainer } from '../game/Game.inversify.config.ts'
import { GameView } from './GameView.ts'
import { SVG, Svg } from '@svgdotjs/svg.js'
import { FieldPosition, FleetPayload, FleetValidationPayload, WebsocketMessage } from '../../../shared/Shared.ts'

@injectable()
export class PlaceShipsView implements View {
    context?: CanvasRenderingContext2D
    placeShipsSvg?: PlaceShipsSvg
    appDiv?: HTMLDivElement

    constructor(
        @inject('State') private state: State,
        @inject('Websocket') private websocket: WebSocket,
        @inject('GameView') private gameView: GameView,
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div class="view-content">
                <h1>Place your ships</h1>
                <div class="gap-between">
                    <svg id="place-ships-svg"></svg>
                    <button id="save-fleet">Save Fleet</button>
                </div>
                <p hidden class="error-text">The ship positions are invalid.</p>
            </div>
        `
        this.appDiv = appDiv
        const svg: Svg = SVG('#place-ships-svg')
            .size('100%', '100%')
            .root()
        svg.viewbox(-1, -1, 102, 102)

        const saveFleetButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#save-fleet')!

        saveFleetButton.addEventListener('click', () => {
            if (this.placeShipsSvg === undefined) {
                throw 'The game state must be defined.'
            }
            const errorParagraph: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>('.error-text')!
            errorParagraph.hidden = true

            const fleet: FieldPosition[][] = this.placeShipsSvg?.ships.map(ship => ship.getFieldPositions(svg))
            this.state.fleet = fleet

            const fleetPayload: FleetPayload = { playerId: this.state.playerId!, fleet }
            const websocketMessage: WebsocketMessage = { type: 'FLEET', payload: JSON.stringify(fleetPayload) }
            this.websocket.send(JSON.stringify(websocketMessage))
        })

        container.load(gameContainer)
        this.placeShipsSvg = container.get<PlaceShipsSvg>('PlaceShipsSvg')
        this.placeShipsSvg.init(svg)

        this.websocket.onmessage = this.onWebsocketMessage
    }

    private onWebsocketMessage = (message: MessageEvent<string>) => {
        const websocketMessage: WebsocketMessage = JSON.parse(message.data)
        const fleetValidationPayload: FleetValidationPayload = JSON.parse(websocketMessage.payload!)

        if (fleetValidationPayload.validationResult === 'passed') {
            this.gameView.show(this.appDiv!)
        } else {
            const errorParagraph: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>('.error-text')!
            errorParagraph.hidden = false
        }
    }
}
