import {BoardDimension, FieldPosition} from "./Game";

export class ShipDrawer {
    drawShipHorizontal(context: CanvasRenderingContext2D,
                       board: BoardDimension,
                       startField: FieldPosition,
                       shipSize: number): void {
        context.strokeStyle = board.shipStrokeStyle
        context.fillStyle = board.shipFillStyle

        // fill
        context.beginPath()
        context.fillRect(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels, shipSize * board.columnSizeInPixels, board.columnSizeInPixels)

        // draw lines
        context.moveTo(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
        // top
        context.lineTo((startField.x + shipSize) * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
        // right
        context.lineTo((startField.x + shipSize) * board.columnSizeInPixels, (startField.y + 1) * board.columnSizeInPixels)
        // bottom
        context.lineTo(startField.x * board.columnSizeInPixels, (startField.y + 1) * board.columnSizeInPixels)
        // left
        context.lineTo(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)

        context.stroke()
    }

    drawShipVertical(context: CanvasRenderingContext2D,
                     board: BoardDimension,
                     startField: FieldPosition,
                     shipSize: number): void {
        context.strokeStyle = board.shipStrokeStyle
        context.fillStyle = board.shipFillStyle

        // fill
        context.beginPath()
        context.fillRect(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels, board.columnSizeInPixels, shipSize * board.columnSizeInPixels)

        // draw lines
        context.moveTo(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
        // left
        context.lineTo(startField.x * board.columnSizeInPixels, (startField.y + shipSize) * board.columnSizeInPixels)
        // bottom
        context.lineTo((startField.x + 1) * board.columnSizeInPixels, (startField.y + shipSize) * board.columnSizeInPixels)
        // right
        context.lineTo((startField.x + 1) * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
        // top
        context.lineTo(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)

        context.stroke()
    }
}
