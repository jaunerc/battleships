
import {Board, FieldPosition} from "./Game";

export class ShipDrawer {
    drawShipHorizontal(context: CanvasRenderingContext2D,
                          board: Board,
                          startField: FieldPosition,
                          shipSize: number): void {
        context.strokeStyle = board.shipStrokeStyle
        context.fillStyle = board.shipFillStyle

        // fill
        context.beginPath()
        context.fillRect(startField.x*board.columnSizeInPixels, startField.y*board.columnSizeInPixels, shipSize*board.columnSizeInPixels, board.columnSizeInPixels)

        // draw horizontal lines
        context.moveTo(startField.x*board.columnSizeInPixels, startField.y*board.columnSizeInPixels)
        context.lineTo((startField.x+shipSize)*board.columnSizeInPixels, startField.y*board.columnSizeInPixels)
        context.stroke()

        context.moveTo(startField.x*board.columnSizeInPixels, (startField.y + 1)*board.columnSizeInPixels)
        context.lineTo((startField.x+shipSize)*board.columnSizeInPixels, (startField.y + 1)*board.columnSizeInPixels)
        context.stroke()

        // draw vertical lines
        context.moveTo(startField.x*board.columnSizeInPixels, startField.y*board.columnSizeInPixels)
        context.lineTo(startField.x*board.columnSizeInPixels, (startField.y + 1)*board.columnSizeInPixels)
        context.stroke()


        context.moveTo((startField.x+shipSize)*board.columnSizeInPixels, startField.y*board.columnSizeInPixels)
        context.lineTo((startField.x+shipSize)*board.columnSizeInPixels, (startField.y + 1)*board.columnSizeInPixels)
        context.stroke()
    }

    drawShipVertical(context: CanvasRenderingContext2D,
                       board: Board,
                       startField: FieldPosition,
                       shipSize: number): void {
        context.strokeStyle = board.shipStrokeStyle
        context.fillStyle = board.shipFillStyle

        // fill
        context.beginPath()
        context.fillRect(startField.x*board.columnSizeInPixels, startField.y*board.columnSizeInPixels, board.columnSizeInPixels, shipSize*board.columnSizeInPixels)

        // draw horizontal lines
        context.moveTo(startField.x*board.columnSizeInPixels, startField.y*board.columnSizeInPixels)
        context.lineTo(startField.x*board.columnSizeInPixels, (startField.y+shipSize)*board.columnSizeInPixels)
        context.stroke()

        context.moveTo((startField.x + 1)*board.columnSizeInPixels, board.columnSizeInPixels)
        context.lineTo((startField.x + 1)*board.columnSizeInPixels, (startField.y + shipSize)*board.columnSizeInPixels)
        context.stroke()

        // draw vertical lines
        context.moveTo(startField.x*board.columnSizeInPixels, startField.y*board.columnSizeInPixels)
        context.lineTo((startField.x + 1)*board.columnSizeInPixels, startField.y*board.columnSizeInPixels)
        context.stroke()


        context.moveTo(startField.x*board.columnSizeInPixels, (startField.y+shipSize)*board.columnSizeInPixels)
        context.lineTo((startField.x + 1)*board.columnSizeInPixels, (startField.y + shipSize)*board.columnSizeInPixels)
        context.stroke()
    }
}
