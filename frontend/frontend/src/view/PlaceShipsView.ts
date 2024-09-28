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

@injectable()
export class PlaceShipsView implements View {

    websocket: WebSocket
    state: State
    gameView: GameView

    context?: CanvasRenderingContext2D
    board?: BoardDimension
    battleshipGame?: BattleshipGame

    constructor(
        @inject('State') state: State,
        @inject('Websocket') websocket: WebSocket,
        @inject('GameView') gameView: GameView
    ) {
        this.state = state
        this.websocket = websocket
        this.gameView = gameView
    }

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
            this.state.fleet = this.battleshipGame?.ships.map(ship => this.calculateShipFields(ship))
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