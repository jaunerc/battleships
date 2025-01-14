import { describe, it, expect, vi, beforeEach } from 'vitest'
import { G } from '@svgdotjs/svg.js'
import { ShootRenderer } from '../../../src/game/shoot/ShootRenderer'
import { BoardDimension } from '../../../src/game/Game'

vi.mock('@svgdotjs/svg.js', () => ({
    G: class {
        clear = vi.fn()
        line = vi.fn(() => ({
            stroke: vi.fn().mockReturnThis(),
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

    const shootPositions = [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
    ]

    let svgShootGroup: G
    let shootRenderer: ShootRenderer

    beforeEach(() => {
        svgShootGroup = new G()
        shootRenderer = new ShootRenderer()
    })

    it('should clear the group and render crosses for each shoot position.', () => {
        shootRenderer.createShootElement(svgShootGroup, board, shootPositions)

        expect(svgShootGroup.clear).toHaveBeenCalledTimes(1)
        expect(svgShootGroup.line).toHaveBeenCalledTimes(shootPositions.length * 2)

        shootPositions.forEach((position, index) => {
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
    })
})
