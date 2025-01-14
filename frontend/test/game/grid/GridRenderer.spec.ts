import { describe, it, vi, expect } from 'vitest'
import { Svg } from '@svgdotjs/svg.js'
import { GridRenderer } from '../../../src/game/grid/GridRenderer'
import { BoardDimension } from '../../../src/game/Game'

describe('GridRenderer', () => {
    it('should render a grid with the correct number of cells.', () => {
        // given
        const mockSvg = {
            rect: vi.fn().mockReturnThis(),
            attr: vi.fn().mockReturnThis(),
            move: vi.fn().mockReturnThis(),
        } as unknown as Svg

        const boardDimension: BoardDimension = {
            canvasSizeInPixels: 100,
            columnSizeInPixels: 10,
            shipStrokeStyle: '',
            shipFillStyle: '',
        }

        // when
        const gridRenderer = new GridRenderer(boardDimension)
        gridRenderer.render(mockSvg)

        // then
        const numberOfColumns = boardDimension.canvasSizeInPixels / boardDimension.columnSizeInPixels
        const totalCells = numberOfColumns * numberOfColumns

        expect(mockSvg.rect).toHaveBeenCalledTimes(totalCells)
        expect(mockSvg.attr).toHaveBeenCalledTimes(totalCells)
        expect(mockSvg.move).toHaveBeenCalledTimes(totalCells)

        // Verify that each rect has the correct attributes
        const columnsSize = boardDimension.columnSizeInPixels
        for (let row = 0; row < numberOfColumns; row++) {
            for (let col = 0; col < numberOfColumns; col++) {
                const callIndex = row * numberOfColumns + col
                expect(mockSvg.move).toHaveBeenNthCalledWith(callIndex + 1, col * columnsSize, row * columnsSize)
            }
        }
    })
})
