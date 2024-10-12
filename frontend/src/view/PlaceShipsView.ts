import {View} from "./View.ts";
import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {FieldPosition} from "../game/Game";
import {PlaceShipsCanvas} from "../game/canvas/PlaceShipsCanvas.ts";
import {container} from "../inversify.config.ts";
import {gameContainer} from "../game/Game.inversify.config.ts";
import {GameView} from "./GameView.ts";
import {FleetPayload} from "../../../messages/FleetPayload.ts";
import {WebsocketMessage} from "../../../messages/WebsocketMessage.ts";
import {Ship} from "../game/ship/Ship.ts";
import {calculateShipFields} from "../game/ship/ShipFieldsCalculator.ts";

@injectable()
export class PlaceShipsView implements View {

    context?: CanvasRenderingContext2D
    placeShipsCanvas?: PlaceShipsCanvas

    constructor(
        @inject('State') private state: State,
        @inject('Websocket') private websocket: WebSocket,
        @inject('GameView') private gameView: GameView
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <h1>Place your ships</h1>
                <canvas id="battleship-canvas" width="400px" height="400px"></canvas>
                <button id="save-fleet">Save Fleet</button>
            </div>
        `

        const battleShipCanvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#battleship-canvas')!
        const saveFleetButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#save-fleet')!

        saveFleetButton.addEventListener('click', () => {
            if (this.placeShipsCanvas === undefined) {
                throw 'The game state must be defined.'
            }
            const fleet: FieldPosition[][] = this.placeShipsCanvas?.ships.map(ship => this.calculateShipFields(ship))
            this.state.fleet = this.placeShipsCanvas?.ships

            const fleetPayload: FleetPayload = { playerId: this.state.playerId!, fleet }
            const websocketMessage: WebsocketMessage = { type: 'FLEET', payload: JSON.stringify(fleetPayload) }
            this.websocket.send(JSON.stringify(websocketMessage))

            this.gameView.show(appDiv)
        })

        this.context = battleShipCanvas.getContext('2d')!

        container.load(gameContainer)
        this.placeShipsCanvas = container.get<PlaceShipsCanvas>('PlaceShipsCanvas')
        this.placeShipsCanvas.init(battleShipCanvas)
        this.placeShipsCanvas.draw()
    }

    private calculateShipFields(ship: Ship): FieldPosition[] {
        return calculateShipFields(ship.shipOrientation, ship.shipType, ship.startField)
    }
}