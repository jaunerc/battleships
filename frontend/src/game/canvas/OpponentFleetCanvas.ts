import {inject, injectable} from "inversify";
import type {BoardDimension} from "../Game";
import {Grid} from "../grid/Grid.ts";
import {convertToFieldPosition} from "../MousePositionConverter.ts";

@injectable()
export class OpponentFleetCanvas {
    context?: CanvasRenderingContext2D
    lockForUserInput: boolean = true

    constructor(
        @inject('BoardDimension') private board: BoardDimension,
        @inject('Grid') private grid: Grid
    ) {}

    init(canvas: HTMLCanvasElement): void {
        this.context = canvas.getContext('2d')!
        canvas.addEventListener('mousedown', this.onMouseDown)
    }

    draw(): void {
        if (this.context === undefined) {
            throw 'The drawing context cannot be undefined.'
        }
        this.clearCanvas()
        this.grid.draw(this.context)
    }

    setLockForUserInput(lockForUserInput: boolean): void {
        this.lockForUserInput = lockForUserInput
    }

    private clearCanvas(): void {
        this.context?.clearRect(0, 0, this.board.canvasSizeInPixels, this.board.canvasSizeInPixels)
    }

    private onMouseDown = (event: MouseEvent): void => {
        if (this.lockForUserInput) {
            return
        }
        const mousePosition = convertToFieldPosition(event.offsetX, event.offsetY, this.board.columnSizeInPixels)
        console.log('Clicked on the field to shoot: {x:' + mousePosition.x + ',y:' + mousePosition.y + '}')
    }
}