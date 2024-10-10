import {inject, injectable} from "inversify";
import type {BoardDimension} from "../Game";

@injectable()
export class Grid {

    constructor(@inject('BoardDimension') private boardDimension: BoardDimension) {}
    
    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = '#000000'
        const numberOfColumns: number = this.boardDimension.canvasSizeInPixels / this.boardDimension.columnSizeInPixels
        for (let i = 0; i <= numberOfColumns; i++) {
            // draw vertical grid lines
            context.beginPath()
            context.moveTo(i * this.boardDimension.columnSizeInPixels, 0)
            context.lineTo(i * this.boardDimension.columnSizeInPixels, this.boardDimension.canvasSizeInPixels)

            // draw horizontal grid lines
            context.moveTo(0, i * this.boardDimension.columnSizeInPixels)
            context.lineTo(this.boardDimension.canvasSizeInPixels, i * this.boardDimension.columnSizeInPixels)
            context.stroke()
        }
    }
}