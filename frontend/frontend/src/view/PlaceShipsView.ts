import {View} from "./View.ts";
import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {BoardDimension} from "../game/Game";
import {BattleshipGame} from "../game/BattleshipGame.ts";

@injectable()
export class PlaceShipsView implements View {

    websocket: WebSocket
    state: State
    context?: CanvasRenderingContext2D
    board?: BoardDimension

    constructor(
        @inject('State') state: State,
        @inject('Websocket') websocket: WebSocket
    ) {
        this.state = state
        this.websocket = websocket
    }

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <h1>Place your ships</h1>
                <canvas id="battleship-canvas" width="400px" height="400px"></canvas>
            </div>
        `

        const battleShipCanvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#battleship-canvas')!
        this.context = battleShipCanvas.getContext('2d')!

        this.board = {
            canvasSizeInPixels: 400,
            columnSizeInPixels: 400 / 10,
            shipStrokeStyle: '#AC2F0D',
            shipFillStyle: '#FF964B80'
        }

        const battleShipGame: BattleshipGame = new BattleshipGame(this.board, battleShipCanvas)
        battleShipGame.draw()
    }
}