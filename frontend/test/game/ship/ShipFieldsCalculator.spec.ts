import { describe, expect, test } from 'vitest'
import { ShipSize } from '../../../src/game/ship/ShipSize'
import { calculateShipFields } from '../../../src/game/ship/ShipFieldsCalculator'
import { Box } from '@svgdotjs/svg.js'
import { ShipType } from '../../../../shared/Shared'

describe('ShipFieldsCalculator', () => {
    describe.each([
        { ship: 'Battleship' as ShipType },
        { ship: 'Carrier' as ShipType },
        { ship: 'Cruiser' as ShipType },
        { ship: 'Submarine' as ShipType },
    ])('should calculate the correct number of fields', ({ ship }) => {
        test(`ShipType ${ship}`, () => {
            const shipSize = ShipSize[ship]
            const shipBox: Box = new Box('')

            const fields = calculateShipFields(shipBox, ship, { x: 0, y: 0 })

            expect(fields.length).toBe(shipSize)
        })
    },
    )
})
