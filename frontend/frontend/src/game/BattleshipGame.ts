import type {BoardDimension, FieldPosition} from "./Game";
import {Ship} from "./Ship.ts";
import type {Grid} from "./Grid.ts";
import {convertToFieldPosition} from "./MousePositionConverter.ts";
import type {ShipFactory} from "./ShipFactory.ts";
import {inject, injectable} from "inversify";

@injectable()
export class BattleshipGame {

    board: BoardDimension
    context?: CanvasRenderingContext2D
    shipFactory: ShipFactory
    grid: Grid
    ships: Ship[] = []

    mouseDragStart?: FieldPosition
    mouseDragging: boolean = false
    clickedShip?: Ship

    constructor(
        @inject('BoardDimension') board: BoardDimension,
        @inject('ShipFactory') shipFactory: ShipFactory,
        @inject('Grid') grid: Grid) {
        this.board = board
        this.shipFactory = shipFactory
        this.grid = grid
    }

    init(canvas: HTMLCanvasElement): void {
        this.context = canvas.getContext('2d')!
        canvas.addEventListener('mousedown', this.onMouseDown)
        canvas.addEventListener('mousemove', this.onMouseMove)
        canvas.addEventListener('mouseup', this.onMouseUp)

        this.ships = this.shipFactory.buildFleet()
    }

    draw(): void {
        if (this.context === undefined) {
            throw 'The drawing context cannot be undefined.'
        }
        this.clearCanvas()
        this.grid.draw(this.context)
        this.ships.forEach(ship => ship.draw(this.context!))
    }

    private clearCanvas(): void {
        this.context?.clearRect(0, 0, this.board.canvasSizeInPixels, this.board.canvasSizeInPixels)
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