import { G } from '@svgdotjs/svg.js'
import { BoardDimension } from '../GameTypes.ts'
import { injectable } from 'inversify'
import { FieldPosition, FireLogEntry } from '../../../../shared/Shared.ts'

@injectable()
export class ShootRenderer {
    createShootElement(svgShootGroup: G,
        board: BoardDimension,
        fireLogEntries: FireLogEntry[]): void {
        svgShootGroup.clear()
        fireLogEntries.forEach((fireLogEntry) => {
            if (fireLogEntry.result === 'hit') {
                this.renderCross(svgShootGroup, fireLogEntry.coordinates, board)
            } else {
                this.renderCircle(svgShootGroup, fireLogEntry.coordinates, board)
            }
        })
    }

    private renderCross(group: G,
        fieldPosition: FieldPosition,
        board: BoardDimension): void {
        group.line(fieldPosition.x * board.columnSizeInPixels,
            fieldPosition.y * board.columnSizeInPixels,
            (fieldPosition.x + 1) * board.columnSizeInPixels,
            (fieldPosition.y + 1) * board.columnSizeInPixels)
            .stroke({ width: 1, color: '#E63946' })

        group.line(fieldPosition.x * board.columnSizeInPixels,
            (fieldPosition.y + 1) * board.columnSizeInPixels,
            (fieldPosition.x + 1) * board.columnSizeInPixels,
            fieldPosition.y * board.columnSizeInPixels)
            .stroke({ width: 1, color: '#E63946' })
    }

    private renderCircle(group: G,
        fieldPosition: FieldPosition,
        board: BoardDimension): void {
        const halfColumnSize: number = board.columnSizeInPixels / 2
        group.circle(halfColumnSize / 2)
            .move(fieldPosition.x * board.columnSizeInPixels + halfColumnSize * 0.75,
                fieldPosition.y * board.columnSizeInPixels + halfColumnSize * 0.75)
            .fill('#457B9D')
    }
}
