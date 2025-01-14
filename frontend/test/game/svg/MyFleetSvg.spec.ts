import { describe, it, expect, vi } from 'vitest'
import { Svg, G } from '@svgdotjs/svg.js'
import { FireLogEntry } from '../../../../messages/GameUpdatePayload'
import { BoardDimension, FieldPosition } from '../../../src/game/Game'
import { GridRenderer } from '../../../src/game/grid/GridRenderer'
import { ShootRenderer } from '../../../src/game/shoot/ShootRenderer'
import { MyFleetSvg } from '../../../src/game/svg/MyFleetSvg'

vi.mock('@svgdotjs/svg.js', () => ({
    G: class {
        group = vi.fn().mockReturnThis()
        rect = vi.fn().mockReturnThis()
        move = vi.fn().mockReturnThis()
        fill = vi.fn().mockReturnThis()
    },
    Svg: class {
        group = vi.fn(() => new G())
    },
}))

describe('MyFleetSvg', () => {
    const board: BoardDimension = { columnSizeInPixels: 50, canvasSizeInPixels: 0, shipStrokeStyle: '', shipFillStyle: '' }
    const mockGridRenderer = {
        render: vi.fn(),
    } as unknown as GridRenderer
    const mockShootRenderer = {
        createShootElement: vi.fn(),
    } as unknown as ShootRenderer
    const mockSvg = new Svg()

    it('should initialize with the correct SVG and fleet', () => {
        const myFleet = new MyFleetSvg(board, mockGridRenderer, mockShootRenderer)
        const fleet: FieldPosition[][] = [
            [{ x: 0, y: 0 }, { x: 0, y: 1 }],
            [{ x: 2, y: 2 }],
        ]

        myFleet.init(mockSvg, fleet)

        expect(myFleet.svg).toBe(mockSvg)
        expect(myFleet.ships.length).toBe(2)
        expect(mockGridRenderer.render).toHaveBeenCalledWith(mockSvg)
    })

    it('should update fire log entries and render shoots', () => {
        const myFleet = new MyFleetSvg(board, mockGridRenderer, mockShootRenderer)
        const fireLogEntries: FireLogEntry[] = [
            { coordinates: { x: 0, y: 0 }, result: 'hit' },
            { coordinates: { x: 1, y: 1 }, result: 'missed' },
        ]

        myFleet.init(mockSvg, [])
        myFleet.update(fireLogEntries)

        expect(myFleet.fireLogEntries).toEqual(fireLogEntries)
        expect(mockShootRenderer.createShootElement).toHaveBeenCalledWith(
            myFleet.svgShootGroup,
            board,
            fireLogEntries.map(entry => entry.coordinates),
        )
    })

    it('should correctly create a ship from field positions', () => {
        const myFleet = new MyFleetSvg(board, mockGridRenderer, mockShootRenderer)
        const fieldPositions: FieldPosition[] = [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
        ]

        const ship = myFleet['createShipFromFieldPositions'](fieldPositions) // Access private method indirectly

        expect(ship.startField).toEqual(fieldPositions[0])
        expect(ship.shipType).toBe('Carrier')
    })
})
