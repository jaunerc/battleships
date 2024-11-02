import {type BoardDimension, FieldPosition} from "../Game";

export class Shoot {

    constructor(private boardDimension: BoardDimension) {
    }

    draw(context: CanvasRenderingContext2D, fieldPosition: FieldPosition) {
        context.strokeStyle = '#000000'

        const columnSize = this.boardDimension.columnSizeInPixels;
        context.beginPath()
        context.moveTo(fieldPosition.x * columnSize, fieldPosition.y * columnSize)
        context.lineTo((fieldPosition.x + 1) * columnSize, (fieldPosition.y + 1) * columnSize)
        context.moveTo((fieldPosition.x + 1) * columnSize, fieldPosition.y * columnSize)
        context.lineTo(fieldPosition.x * columnSize, (fieldPosition.y + 1) * columnSize)
        context.stroke()
    }
}
