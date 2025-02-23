import { describe, it, expect, vi, beforeEach } from 'vitest'
import { G, Svg } from '@svgdotjs/svg.js'
import { ShipRenderer } from '../../../src/game/ship/ShipRenderer'
import { BoardDimension } from '../../../src/game/GameTypes'

// mock the required functions for this test from svg.js
vi.mock('@svgdotjs/svg.js', () => ({
    G: class {
        rect = vi.fn().mockReturnThis()
        move = vi.fn().mockReturnThis()
        fill = vi.fn().mockReturnThis()
    },
    Svg: class {
        group = vi.fn(() => new G())
    },
}))

describe('ShipRenderer', () => {
    const board: BoardDimension = {
        columnSizeInPixels: 20,
        shipFillStyle: '#FF0000',
        canvasSizeInPixels: 0,
        shipStrokeStyle: '',
    }

    const startField = {
        x: 2,
        y: 3,
    }

    const shipSize = 4
    let svg: Svg
    let shipRenderer: ShipRenderer

    beforeEach(() => {
        svg = new Svg()
        shipRenderer = new ShipRenderer()
    })

    it('should create a horizontal ship.', () => {
        const shipGroup = shipRenderer.createHorizontalShip(svg, board, startField, shipSize)

        expect(svg.group).toHaveBeenCalledTimes(1)
        expect(shipGroup.rect).toHaveBeenCalledWith(shipSize * board.columnSizeInPixels, board.columnSizeInPixels)
        expect(shipGroup.move).toHaveBeenCalledWith(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
        expect(shipGroup.fill).toHaveBeenCalledWith(board.shipFillStyle)
    })

    it('should create a vertical ship.', () => {
        const shipGroup = shipRenderer.createVerticalShip(svg, board, startField, shipSize)

        expect(svg.group).toHaveBeenCalledTimes(1)
        expect(shipGroup.rect).toHaveBeenCalledWith(board.columnSizeInPixels, shipSize * board.columnSizeInPixels)
        expect(shipGroup.move).toHaveBeenCalledWith(startField.x * board.columnSizeInPixels, startField.y * board.columnSizeInPixels)
        expect(shipGroup.fill).toHaveBeenCalledWith(board.shipFillStyle)
    })
})
