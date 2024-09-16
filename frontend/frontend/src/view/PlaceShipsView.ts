import {View} from "./View.ts";
import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {Ship} from "../game/Ship.ts";
import {BoardDimension} from "../game/Game";

interface MouseDragPosition {
    x: number
    y: number
}

@injectable()
export class PlaceShipsView implements View {

    websocket: WebSocket
    state: State

    mouseDragStart: MouseDragPosition = {x: 0, y: 0}
    mouseDragging: boolean = false
    context?: CanvasRenderingContext2D

    board?: BoardDimension
    carrier?: Ship

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

        this.carrier = new Ship(this.board, { x: 2, y: 2}, 'Carrier')

        this.drawGrid()
        this.carrier.draw(this.context)

        battleShipCanvas.addEventListener('mousedown', this.onMouseDown)
        battleShipCanvas.addEventListener('mousemove', this.onMouseMove)
        battleShipCanvas.addEventListener('mouseup', this.onMouseUp)
    }

    private clearCanvas() {
        const canvasSizeInPixels: number = 400
        this.context!.clearRect(0, 0, canvasSizeInPixels, canvasSizeInPixels)
        this.drawGrid()
    }

    private drawGrid() {
        const canvasSizeInPixels: number = 400
        const numberOfColumns: number = 10
        const columnSize: number = canvasSizeInPixels / numberOfColumns

        this.context!.strokeStyle = 'black'
        for (let i = 0; i <= numberOfColumns; i++) {
            this.context!.beginPath()
            this.context!.moveTo(i * columnSize, 0)
            this.context!.lineTo(i * columnSize, canvasSizeInPixels)
            this.context!.stroke()

            this.context!.moveTo(0, i * columnSize)
            this.context!.lineTo(canvasSizeInPixels, i * columnSize)
            this.context!.stroke()
        }
    }
    private onMouseDown = (event: MouseEvent): void => {
        this.mouseDragStart = { x: event.offsetX, y: event.offsetY }
        this.mouseDragging = true
    }

    private onMouseMove = (event: MouseEvent): void => {
        if (!this.mouseDragging) {
            return
        }

        const canvasSizeInPixels: number = 400
        const numberOfColumns: number = 10
        const columnSize: number = canvasSizeInPixels / numberOfColumns

        // convert mouse position to field index
        const fieldIndexX: number = Math.floor(event.offsetX / columnSize)
        const fieldIndexY: number = Math.floor(event.offsetY / columnSize)

        this.clearCanvas()
        this.carrier?.move({ x: fieldIndexX, y: fieldIndexY})
        this.carrier?.draw(this.context!)
    }

    private onMouseUp = (event: MouseEvent): void => {
        this.mouseDragging = false

        if (this.mouseDragStart.x === event.offsetX && this.mouseDragStart.y === event.offsetY) {
            this.clearCanvas()
            this.carrier?.rotate(this.context!)
        }
    }

}