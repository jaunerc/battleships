import { G, Svg } from '@svgdotjs/svg.js'
import { BoardDimension } from '../GameTypes.ts'
import { FieldPosition } from '../../../../shared/Shared.ts'

export class ShipRenderer {
    createHorizontalShip(svg: Svg,
        board: BoardDimension,
        startField: FieldPosition,
        shipSize: number): G {
        const shipGroup: G = svg.group()
        shipGroup
            .rect(shipSize * board.columnSizeInPixels, board.columnSizeInPixels)
            .move(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
            .fill(board.shipFillStyle)
        return shipGroup
    }

    createVerticalShip(svg: Svg,
        board: BoardDimension,
        startField: FieldPosition,
        shipSize: number): G {
        const shipGroup: G = svg.group()
        shipGroup
            .rect(board.columnSizeInPixels, shipSize * board.columnSizeInPixels)
            .move(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
            .fill(board.shipFillStyle)
        return shipGroup
    }
}
