import { describe, it, expect, vi, beforeEach } from 'vitest'
import { G } from '@svgdotjs/svg.js'
import { ShootRenderer } from '../../../src/game/shoot/ShootRenderer'
import { BoardDimension } from '../../../src/game/GameTypes'
import { FieldPosition, FireLogEntry } from '../../../../shared/Shared'

vi.mock('@svgdotjs/svg.js', () => ({
    G: class {
        clear = vi.fn()
        line = vi.fn(() => ({
            stroke: vi.fn().mockReturnThis(),
        }))

        circle = vi.fn(() => ({
            move: vi.fn().mockReturnThis(),
            fill: vi.fn().mockReturnThis(),
        }))
    },
}))

describe('ShootRenderer', () => {
    const board: BoardDimension = {
        columnSizeInPixels: 20,
        canvasSizeInPixels: 0,
        shipStrokeStyle: '',
        shipFillStyle: '',
    }

    const shootPositions: FireLogEntry[] = [
        { coordinates: { x: 1, y: 2 }, result: 'hit' },
        { coordinates: { x: 3, y: 4 }, result: 'hit' },
        { coordinates: { x: 3, y: 5 }, result: 'missed' },
    ]

    let svgShootGroup: G
    let shootRenderer: ShootRenderer

    beforeEach(() => {
        svgShootGroup = new G()
        shootRenderer = new ShootRenderer()
    })

    it('should clear the group and render correct symbols for each shoot position.', () => {
        shootRenderer.createShootElement(svgShootGroup, board, shootPositions)

        expect(svgShootGroup.clear).toHaveBeenCalledTimes(1)

        shootPositions.filter(fireLogEntry => fireLogEntry.result === 'hit')
            .forEach((fireLogEntry, index) => {
                const position: FieldPosition = fireLogEntry.coordinates
                const startX1 = position.x * board.columnSizeInPixels
                const startY1 = position.y * board.columnSizeInPixels
                const endX1 = (position.x + 1) * board.columnSizeInPixels
                const endY1 = (position.y + 1) * board.columnSizeInPixels

                const startX2 = position.x * board.columnSizeInPixels
                const startY2 = (position.y + 1) * board.columnSizeInPixels
                const endX2 = (position.x + 1) * board.columnSizeInPixels
                const endY2 = position.y * board.columnSizeInPixels

                expect(svgShootGroup.line).toHaveBeenNthCalledWith(
                    index * 2 + 1,
                    startX1,
                    startY1,
                    endX1,
                    endY1,
                )
                expect(svgShootGroup.line).toHaveBeenNthCalledWith(
                    index * 2 + 2,
                    startX2,
                    startY2,
                    endX2,
                    endY2,
                )
            })

        shootPositions.filter(fireLogEntry => fireLogEntry.result === 'missed')
            .forEach(() =>
                expect(svgShootGroup.circle).toHaveBeenCalled())
    })
})
