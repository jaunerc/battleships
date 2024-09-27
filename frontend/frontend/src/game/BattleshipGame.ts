import {BoardDimension, FieldPosition} from "./Game";
import {Ship} from "./Ship.ts";
import {Grid} from "./Grid.ts";
import {convertToFieldPosition} from "./MousePositionConverter.ts";

export class BattleshipGame {

    board: BoardDimension
    context: CanvasRenderingContext2D

    ships: Ship[]
    grid: Grid

    mouseDragStart?: FieldPosition
    mouseDragging: boolean = false
    clickedShip?: Ship

    constructor(board: BoardDimension, canvas: HTMLCanvasElement) {
        this.board = board
        this.context = canvas.getContext('2d')!

        this.grid = new Grid(this.board)
        this.ships = [
            new Ship(this.board, {x: 2, y: 2}, 'Carrier'),
            new Ship(this.board, {x: 6, y: 3}, 'Cruiser'),
            new Ship(this.board, {x: 8, y: 6}, 'Cruiser')
        ]

        canvas.addEventListener('mousedown', this.onMouseDown)
        canvas.addEventListener('mousemove', this.onMouseMove)
        canvas.addEventListener('mouseup', this.onMouseUp)
    }

    draw(): void {
        this.clearCanvas()
        this.grid.draw(this.context)
        this.ships.forEach(ship => ship.draw(this.context))
    }

    private clearCanvas(): void {
        this.context.clearRect(0, 0, this.board.canvasSizeInPixels, this.board.canvasSizeInPixels)
    }

    private onMouseDown = (event: MouseEvent): void => {
        this.mouseDragStart = {x: event.offsetX, y: event.offsetY}
        this.mouseDragging = true

        const mousePosition = convertToFieldPosition(event.offsetX, event.offsetY, this.board.columnSizeInPixels)
        this.clickedShip = this.ships.find(ship => ship.isClicked(mousePosition))
    }

    private onMouseMove = (event: MouseEvent): void => {
        if (!this.mouseDragging) {
            return
        }
        const mousePosition = convertToFieldPosition(event.offsetX, event.offsetY, this.board.columnSizeInPixels)

        this.clickedShip?.move({x: mousePosition.x, y: mousePosition.y})
        this.draw()
    }

    private onMouseUp = (event: MouseEvent): void => {
        this.mouseDragging = false
        if (this.mouseDragStart?.x === event.offsetX && this.mouseDragStart.y === event.offsetY) {
            this.clickedShip?.rotate()
            this.draw()
        }
        this.clickedShip = undefined
    }
}