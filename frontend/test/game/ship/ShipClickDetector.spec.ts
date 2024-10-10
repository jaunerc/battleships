import {describe, expect, it, test} from "vitest";
import {FieldPosition, ShipOrientation, ShipType} from "../../../src/game/Game";
import {isShipClicked} from "../../../src/game/ship/ShipClickDetector";

describe('ShipClickDetector', () => {
    describe.each([
        { ship: 'Battleship' as ShipType, clickedField: { x: 6, y: 3 } },
        { ship: 'Carrier' as ShipType, clickedField: { x: 5, y: 3 } },
        { ship: 'Cruiser' as ShipType, clickedField: { x: 4, y: 3 } },
        { ship: 'Submarine' as ShipType, clickedField: { x: 3, y: 3 } }
    ])('should return true when the ship in horizontal position is clicked', ({ship, clickedField}) => {
            test(`ShipType ${ship}`, () => {
                const shipStartField: FieldPosition = { x: 3, y: 3 }
                const shipOrientation: ShipOrientation = 'Horizontal'

                const result = isShipClicked(shipStartField, ship, shipOrientation, clickedField)
                expect(result).toBe(true)
            })
        }
    )

    describe.each([
        { ship: 'Battleship' as ShipType, clickedField: { x: 3, y: 6 } },
        { ship: 'Carrier' as ShipType, clickedField: { x: 3, y: 5 } },
        { ship: 'Cruiser' as ShipType, clickedField: { x: 3, y: 4 } },
        { ship: 'Submarine' as ShipType, clickedField: { x: 3, y: 3 } }
    ])('should return true when the ship in vertical position is clicked', ({ship, clickedField}) => {
            test(`ShipType ${ship}`, () => {
                const shipStartField: FieldPosition = { x: 3, y: 3 }
                const shipOrientation: ShipOrientation = 'Vertical'

                const result = isShipClicked(shipStartField, ship, shipOrientation, clickedField)
                expect(result).toBe(true)
            })
        }
    )

    it('should return false when the click is on a non-ship field', () => {
        const shipStartField: FieldPosition = { x: 0, y: 0 }
        const shipType: ShipType = 'Submarine'
        const shipOrientation: ShipOrientation = 'Horizontal'

        const clickedField: FieldPosition = { x: 1, y: 7 }
        const result = isShipClicked(shipStartField, shipType, shipOrientation, clickedField)

        expect(result).toBe(false)
    })
})
