import {describe, expect, test} from "vitest";
import {ShipSize} from "../../src/game/ShipSize";
import {calculateShipFields} from "../../src/game/ShipFieldsCalculator";
import {ShipType} from "../../src/game/Game";

describe('ShipFieldsCalculator', () => {

    describe.each([
        { ship: 'Battleship' as ShipType },
        { ship: 'Carrier' as ShipType },
        { ship: 'Cruiser' as ShipType },
        { ship: 'Submarine' as ShipType }
    ])('should calculate the correct number of fields', ({ship}) => {
            test(`ShipType ${ship}`, () => {
                const shipSize = ShipSize[ship]

                const fields = calculateShipFields('Vertical', ship, { x: 0, y: 0 })

                expect(fields.length).toBe(shipSize)
            })
        }
    )
})