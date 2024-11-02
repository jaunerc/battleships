import {Ship} from "../ship/Ship.ts";
import {inject, injectable} from "inversify";
import type {BoardDimension} from "../Game";
import {Grid} from "../grid/Grid.ts";
import {FireLogEntry} from "../../../../messages/GameUpdatePayload.ts";
import {Shoot} from "../shoot/Shoot.ts";

@injectable()
export class MyFleetCanvas {
    context?: CanvasRenderingContext2D
    ships: Ship[] = []
    fireLogEntries: FireLogEntry[] = []

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
        const shoot: Shoot = new Shoot(this.board)
        this.fireLogEntries.forEach(fireLogEntry => shoot.draw(this.context!, fireLogEntry.coordinates))
    }

    update(fireLogEntries: FireLogEntry[]) {
        this.fireLogEntries = fireLogEntries
    }

    private clearCanvas(): void {
        this.context?.clearRect(0, 0, this.board.canvasSizeInPixels, this.board.canvasSizeInPixels)
    }
}