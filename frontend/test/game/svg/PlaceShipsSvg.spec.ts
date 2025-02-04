import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PlaceShipsSvg } from '../../../src/game/svg/PlaceShipsSvg'
import { ShipFactory } from '../../../src/game/ship/ShipFactory'
import { GridRenderer } from '../../../src/game/grid/GridRenderer'
import { Svg } from '@svgdotjs/svg.js'
import { Ship } from '../../../src/game/ship/Ship'

describe('PlaceShipsSvg', () => {
    let placeShipsSvg: PlaceShipsSvg
    let mockShipFactory: ShipFactory
    let mockGridRenderer: GridRenderer
    let mockSvg: Svg
    let mockShips: Array<Ship>

    beforeEach(() => {
        mockShipFactory = { buildFleet: vi.fn(() => mockShips) } as unknown as ShipFactory
        mockGridRenderer = { render: vi.fn() } as unknown as GridRenderer
        mockSvg = {
            mousemove: vi.fn(),
            mouseup: vi.fn(),
            mouseleave: vi.fn(),
        } as unknown as Svg

        mockShips = [
            { createSvgElement: vi.fn(), shipSvg: { mousedown: vi.fn() }, move: vi.fn(), rotate: vi.fn() } as unknown as Ship,
            { createSvgElement: vi.fn(), shipSvg: { mousedown: vi.fn() }, move: vi.fn(), rotate: vi.fn() } as unknown as Ship,
        ]

        placeShipsSvg = new PlaceShipsSvg({ columnSizeInPixels: 50, canvasSizeInPixels: 0, shipStrokeStyle: '', shipFillStyle: '' }, mockShipFactory, mockGridRenderer)
    })

    it('should initialize with the SVG and build the fleet.', () => {
        // when
        placeShipsSvg.init(mockSvg)

        // then
        expect(placeShipsSvg.svg).toBe(mockSvg)
        expect(placeShipsSvg.ships).toBe(mockShips)
        expect(mockShipFactory.buildFleet).toHaveBeenCalled()
        expect(mockGridRenderer.render).toHaveBeenCalledWith(mockSvg)

        placeShipsSvg.ships.forEach((ship) => {
            expect(ship.createSvgElement).toHaveBeenCalledWith(mockSvg)
        })
    })
})
