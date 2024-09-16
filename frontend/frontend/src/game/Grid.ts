import {BoardDimension} from "./Game";

export class Grid {
    
    boardDimension: BoardDimension
    
    constructor(boardDimension: BoardDimension) {
        this.boardDimension = boardDimension
    }
    
    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = '#000000'
        const numberOfColumns: number = 10
        for (let i = 0; i <= numberOfColumns; i++) {
            // draw vertical grid lines
            context.beginPath()
            context.moveTo(i * this.boardDimension.columnSizeInPixels, 0)
            context.lineTo(i * this.boardDimension.columnSizeInPixels, this.boardDimension.canvasSizeInPixels)
            context.stroke()

            // draw horizontal grid lines
            context.moveTo(0, i * this.boardDimension.columnSizeInPixels)
            context.lineTo(this.boardDimension.canvasSizeInPixels, i * this.boardDimension.columnSizeInPixels)
            context.stroke()
        }
    }
}