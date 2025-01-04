import { G } from '@svgdotjs/svg.js'
import { BoardDimension, FieldPosition } from '../Game'
import { injectable } from 'inversify'

@injectable()
export class ShootRenderer {
    createShootElement(svgShootGroup: G,
        board: BoardDimension,
        shootPositions: FieldPosition[]): void {
        svgShootGroup.clear()
        shootPositions.forEach(shootPosition => this.renderCross(svgShootGroup, shootPosition, board))
    }

    private renderCross(group: G,
        fieldPosition: FieldPosition,
        board: BoardDimension): void {
        group.line(fieldPosition.x * board.columnSizeInPixels,
            fieldPosition.y * board.columnSizeInPixels,
            (fieldPosition.x + 1) * board.columnSizeInPixels,
            (fieldPosition.y + 1) * board.columnSizeInPixels)
            .stroke({ width: 1, color: 'red' })

        group.line(fieldPosition.x * board.columnSizeInPixels,
            (fieldPosition.y + 1) * board.columnSizeInPixels,
            (fieldPosition.x + 1) * board.columnSizeInPixels,
            fieldPosition.y * board.columnSizeInPixels)
            .stroke({ width: 1, color: 'red' })
    }
}
