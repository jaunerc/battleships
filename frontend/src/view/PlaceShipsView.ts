import { View } from './View.ts'
import { inject, injectable } from 'inversify'
import type { State } from '../State.ts'
import { FieldPosition } from '../game/Game'
import { PlaceShipsSvg } from '../game/svg/PlaceShipsSvg.ts'
import { container } from '../inversify.config.ts'
import { gameContainer } from '../game/Game.inversify.config.ts'
import { GameView } from './GameView.ts'
import { FleetPayload } from '../../../messages/FleetPayload.ts'
import { WebsocketMessage } from '../../../messages/WebsocketMessage.ts'
import { FleetValidationPayload } from '../../../messages/FleetValidationPayload.ts'
import { SVG, Svg } from '@svgdotjs/svg.js'

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
            <div>
                <h1>Place your ships</h1>
                <svg id="place-ships-svg"></svg>
                <button id="save-fleet">Save Fleet</button>
            </div>
        `
        this.appDiv = appDiv
        const svg: Svg = SVG('#place-ships-svg')
            .size(400, 400)
            .root()
        const saveFleetButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#save-fleet')!

        saveFleetButton.addEventListener('click', () => {
            if (this.placeShipsSvg === undefined) {
                throw 'The game state must be defined.'
            }
            const fleet: FieldPosition[][] = this.placeShipsSvg?.ships.map(ship => ship.getFieldPositions(svg))
            this.state.fleet = fleet

            const fleetPayload: FleetPayload = { playerId: this.state.playerId!, fleet }
            const websocketMessage: WebsocketMessage = { type: 'FLEET', payload: JSON.stringify(fleetPayload) }
            this.websocket.send(JSON.stringify(websocketMessage))
        })

        container.load(gameContainer)
        this.placeShipsSvg = container.get<PlaceShipsSvg>('PlaceShipsSvg')
        this.placeShipsSvg.init(svg)
        this.placeShipsSvg.draw()

        this.websocket.onmessage = this.onWebsocketMessage
    }

    private onWebsocketMessage = (message: MessageEvent<string>) => {
        const websocketMessage: WebsocketMessage = JSON.parse(message.data)
        const fleetValidationPayload: FleetValidationPayload = JSON.parse(websocketMessage.payload!)

        if (fleetValidationPayload.validationResult === 'passed') {
            this.gameView.show(this.appDiv!)
        }
    }
}
