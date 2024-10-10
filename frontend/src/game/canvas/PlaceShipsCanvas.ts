import type {BoardDimension, FieldPosition} from "../Game";
import {convertToFieldPosition} from "../MousePositionConverter.ts";
import {inject, injectable} from "inversify";
import {Ship} from "../ship/Ship.ts";
import {ShipFactory} from "../ship/ShipFactory.ts";
import {Grid} from "../grid/Grid.ts";

@injectable()
export class PlaceShipsCanvas {
    context?: CanvasRenderingContext2D
    ships: Ship[] = []

    mouseDragStart?: FieldPosition
    mouseDragging: boolean = false
    clickedShip?: Ship

    constructor(
        @inject('BoardDimension') private board: BoardDimension,
        @inject('ShipFactory') private shipFactory: ShipFactory,
        @inject('Grid') private grid: Grid
    ) {}

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