import {View} from "./View.ts";
import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {BoardDimension, FieldPosition} from "../game/Game";
import {BattleshipGame} from "../game/BattleshipGame.ts";
import {container} from "../inversify.config.ts";
import {gameContainer} from "../game/Game.inversify.config.ts";
import {Ship} from "../game/Ship.ts";
import {calculateShipFields} from "../game/ShipFieldsCalculator.ts";
import {GameView} from "./GameView.ts";
import {FleetPayload} from "../../../messages/FleetPayload.ts";
import {WebsocketMessage} from "../../../messages/WebsocketMessage.ts";

@injectable()
export class PlaceShipsView implements View {

    context?: CanvasRenderingContext2D
    board?: BoardDimension
    battleshipGame?: BattleshipGame

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
            if (this.battleshipGame === undefined) {
                throw 'The game state must be defined.'
            }
            const fleet: FieldPosition[][] = this.battleshipGame?.ships.map(ship => this.calculateShipFields(ship))
            this.state.fleet = fleet

            const fleetPayload: FleetPayload = { playerId: this.state.playerId!, fleet }
            const websocketMessage: WebsocketMessage = { type: 'FLEET', payload: JSON.stringify(fleetPayload) }
            this.websocket.send(JSON.stringify(websocketMessage))

            this.gameView.show(appDiv)
        })

        this.context = battleShipCanvas.getContext('2d')!

        this.board = {
            canvasSizeInPixels: 400,
            columnSizeInPixels: 400 / 10,
            shipStrokeStyle: '#AC2F0D',
            shipFillStyle: '#FF964B80'
        }

        container.load(gameContainer)
        this.battleshipGame = container.get<BattleshipGame>('BattleshipGame')
        this.battleshipGame.init(battleShipCanvas)
        this.battleshipGame.draw()
    }

    private calculateShipFields(ship: Ship): FieldPosition[] {
        return calculateShipFields(ship.shipOrientation, ship.shipType, ship.startField)
    }
}