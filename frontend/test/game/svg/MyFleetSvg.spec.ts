import { describe, it, expect, vi } from 'vitest'
import { Svg, G } from '@svgdotjs/svg.js'
import { GridRenderer } from '../../../src/game/grid/GridRenderer'
import { ShootRenderer } from '../../../src/game/shoot/ShootRenderer'
import { MyFleetSvg } from '../../../src/game/svg/MyFleetSvg'
import { FieldPosition, FireLogEntry } from '../../../../shared/Shared'
import { BoardDimension } from '../../../src/game/GameTypes'

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
        // given
        const myFleet = new MyFleetSvg(board, mockGridRenderer, mockShootRenderer)
        const fleet: FieldPosition[][] = [
            [{ x: 0, y: 0 }, { x: 0, y: 1 }],
            [{ x: 2, y: 2 }],
        ]

        // when
        myFleet.init(mockSvg, fleet)

        // then
        expect(myFleet.svg).toBe(mockSvg)
        expect(myFleet.ships.length).toBe(2)
        expect(mockGridRenderer.render).toHaveBeenCalledWith(mockSvg)
    })

    it('should update fire log entries and render shoots', () => {
        // given
        const myFleet = new MyFleetSvg(board, mockGridRenderer, mockShootRenderer)
        const fireLogEntries: FireLogEntry[] = [
            { coordinates: { x: 0, y: 0 }, result: 'hit' },
            { coordinates: { x: 1, y: 1 }, result: 'missed' },
        ]

        // when
        myFleet.init(mockSvg, [])
        myFleet.update(fireLogEntries)

        // then
        expect(myFleet.fireLogEntries).toEqual(fireLogEntries)
        expect(mockShootRenderer.createShootElement).toHaveBeenCalledWith(
            myFleet.svgShootGroup,
            board,
            fireLogEntries,
        )
    })
})
