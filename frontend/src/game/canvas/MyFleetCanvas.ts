import {Ship} from "../ship/Ship.ts";
import {inject, injectable} from "inversify";
import type {BoardDimension} from "../Game";
import {Grid} from "../grid/Grid.ts";

@injectable()
export class MyFleetCanvas {
    context?: CanvasRenderingContext2D
    ships: Ship[] = []

    constructor(
        @inject('BoardDimension') private board: BoardDimension,
        @inject('Grid') private grid: Grid
    ) {}

    init(canvas: HTMLCanvasElement, ships: Ship[]): void {
        this.context = canvas.getContext('2d')!
        this.ships = ships
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
}