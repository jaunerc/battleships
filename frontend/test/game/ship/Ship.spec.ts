import { describe, it, expect, vi } from 'vitest'
import { Svg, G, Box } from '@svgdotjs/svg.js'
import { Ship } from '../../../src/game/ship/Ship'
import { ShipSize } from '../../../src/game/ship/ShipSize'
import { BoardDimension } from '../../../src/game/GameTypes'
import { ShipRenderer } from '../../../src/game/ship/ShipRenderer'
import { FieldPosition, ShipType } from '../../../../shared/Shared'

// mock the required functions for this test from svg.js
vi.mock('@svgdotjs/svg.js', () => ({
    G: class {
        center = vi.fn().mockReturnThis()
        move = vi.fn().mockReturnThis()
        rect = vi.fn().mockReturnThis()
        fill = vi.fn().mockReturnThis()
        rotate = vi.fn().mockReturnThis()
        translate = vi.fn().mockReturnThis()
        rbox = vi.fn().mockReturnThis()
    },
    Svg: class {
        group = vi.fn(() => new G())
    },
}))

describe('Ship', () => {
    const boardDimension: BoardDimension = { columnSizeInPixels: 50, canvasSizeInPixels: 0, shipFillStyle: '', shipStrokeStyle: '' }
    const startField: FieldPosition = { x: 0, y: 0 }
    const shipType: ShipType = 'Battleship'
    const shipRenderer = new ShipRenderer()
    const mockSvg = new Svg()

    it('should move the ship to a new field', () => {
        // given
        const ship = new Ship(boardDimension, startField, shipType)
        const mockShipSvg = new G()
        ship.shipSvg = mockShipSvg
        vi.spyOn(mockShipSvg, 'center')

        // when
        const targetField: FieldPosition = { x: 100, y: 100 }
        ship.move(targetField)

        // then
        expect(ship.startField).toEqual(targetField)
        expect(mockShipSvg.center).toHaveBeenCalledWith(125, 150) // Assuming center adjusts properly
    })

    it('should create a vertical SVG element for the ship', () => {
        // given
        const spy = vi.spyOn(shipRenderer, 'createVerticalShip')
        const ship = new Ship(boardDimension, startField, shipType, 'Vertical', shipRenderer)

        // when
        ship.createSvgElement(mockSvg)

        // then
        expect(spy).toHaveBeenCalledWith(mockSvg, boardDimension, startField, ShipSize[shipType])
        expect(ship.shipSvg).toBeDefined()
    })

    it('should rotate the ship', () => {
        // given
        const ship = new Ship(boardDimension, startField, shipType)
        const mockShipSvg = new G()
        ship.shipSvg = mockShipSvg
        vi.spyOn(mockShipSvg, 'rotate')
        vi.spyOn(mockShipSvg, 'translate')

        // when
        ship.rotate()

        // then
        expect(ship.rotated).toBe(true)
        expect(mockShipSvg.rotate).toHaveBeenCalledWith(90)
    })

    it('should return the correct field positions', () => {
        // given
        const ship = new Ship(boardDimension, startField, shipType)
        const mockShipSvg = new G()
        vi.spyOn(mockShipSvg, 'rbox').mockReturnValue({
            x: 0,
            y: 0,
            width: 100,
            height: 50,
        } as unknown as Box)
        ship.shipSvg = mockShipSvg

        // when
        const fields = ship.getFieldPositions(mockSvg)

        // then
        expect(fields).toBeDefined()
        expect(fields.length).toBeGreaterThan(0)
    })

    it('should not rotate one-field size ships', () => {
        // given
        const oneFieldShipType: ShipType = 'Submarine'
        const ship = new Ship(boardDimension, startField, oneFieldShipType)
        const mockShipSvg = new G()
        ship.shipSvg = mockShipSvg
        vi.spyOn(mockShipSvg, 'rotate')

        // when
        ship.rotate()

        // then
        expect(ship.rotated).toBe(false)
        expect(mockShipSvg.rotate).not.toHaveBeenCalled()
    })
})
