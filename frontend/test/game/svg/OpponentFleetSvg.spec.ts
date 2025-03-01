import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Svg } from '@svgdotjs/svg.js'
import { BoardDimension } from '../../../src/game/GameTypes'
import { GridRenderer } from '../../../src/game/grid/GridRenderer'
import { ShootRenderer } from '../../../src/game/shoot/ShootRenderer'
import { State } from '../../../src/State'
import { OpponentFleetSvg } from '../../../src/game/svg/OpponentFleetSvg'
import { FireLogEntry } from '../../../../shared/Shared'

vi.mock('../MousePositionConverter', () => ({
    convertToFieldPosition: vi.fn(() => ({ x: 0, y: 0 })),
}))

describe('OpponentFleetSvg', () => {
    const board: BoardDimension = { columnSizeInPixels: 50, canvasSizeInPixels: 0, shipStrokeStyle: '', shipFillStyle: '' }
    let mockGridRenderer: GridRenderer
    let mockShootRenderer: ShootRenderer
    let mockWebSocket: WebSocket
    let mockState: State
    let mockSvg: Svg

    beforeEach(() => {
        mockGridRenderer = { render: vi.fn() } as unknown as GridRenderer
        mockShootRenderer = { createShootElement: vi.fn() } as unknown as ShootRenderer
        mockWebSocket = { send: vi.fn() } as unknown as WebSocket
        mockState = { seatId: 1 } as unknown as State
        mockSvg = new Svg()
    })

    it('should initialize the SVG and grid.', () => {
        const opponentFleet = new OpponentFleetSvg(board, mockGridRenderer, mockShootRenderer, mockWebSocket, mockState)

        opponentFleet.init(mockSvg)

        expect(opponentFleet.svg).toBe(mockSvg)
        expect(mockGridRenderer.render).toHaveBeenCalledWith(mockSvg)
        expect(opponentFleet.svgShootGroup).toBeDefined()
    })

    it('should update fire log entries and render shoots.', () => {
        const opponentFleet = new OpponentFleetSvg(board, mockGridRenderer, mockShootRenderer, mockWebSocket, mockState)
        const fireLogEntries: FireLogEntry[] = [
            { coordinates: { x: 0, y: 0 }, result: 'hit' },
            { coordinates: { x: 1, y: 1 }, result: 'missed' },
        ]

        opponentFleet.init(mockSvg)
        opponentFleet.update(fireLogEntries)

        expect(opponentFleet.fireLogEntries).toEqual(fireLogEntries)
        expect(mockShootRenderer.createShootElement).toHaveBeenCalledWith(
            opponentFleet.svgShootGroup,
            board,
            fireLogEntries,
        )
    })

    it('should toggle user input lock.', () => {
        const opponentFleet = new OpponentFleetSvg(board, mockGridRenderer, mockShootRenderer, mockWebSocket, mockState)

        opponentFleet.setLockForUserInput(false)
        expect(opponentFleet.lockForUserInput).toBe(false)

        opponentFleet.setLockForUserInput(true)
        expect(opponentFleet.lockForUserInput).toBe(true)
    })

    it('should send a shoot message on mouse down when unlocked.', () => {
        const opponentFleet = new OpponentFleetSvg(board, mockGridRenderer, mockShootRenderer, mockWebSocket, mockState)
        const mockEvent = { offsetX: 25, offsetY: 25 } as unknown as MouseEvent

        opponentFleet.init(mockSvg)
        opponentFleet.setLockForUserInput(false)
        opponentFleet['onMouseDown'](mockEvent) // private function call

        expect(mockWebSocket.send).toHaveBeenCalledWith(
            JSON.stringify({
                type: 'SHOOT',
                payload: JSON.stringify({
                    playerSeatId: mockState.seatId,
                    shoot: { x: 0, y: 0 },
                }),
            }),
        )
    })

    it('should not send a shoot message on mouse down when locked.', () => {
        const opponentFleet = new OpponentFleetSvg(board, mockGridRenderer, mockShootRenderer, mockWebSocket, mockState)
        const mockEvent = { offsetX: 25, offsetY: 25 } as unknown as MouseEvent

        opponentFleet.init(mockSvg)
        opponentFleet.setLockForUserInput(true)
        opponentFleet['onMouseDown'](mockEvent) // private function call

        expect(mockWebSocket.send).not.toHaveBeenCalled()
    })
})
