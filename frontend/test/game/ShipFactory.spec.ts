import 'reflect-metadata'; // this import is necessary so that inversify is working with tests
import {describe, expect, it} from "vitest";
import {BoardDimension} from "../../src/game/Game";
import {ShipFactory} from "../../src/game/ShipFactory";

describe('ShipFactory', () => {
    describe('should build a fleet of ships', () => {
        const boardDimensions: BoardDimension = { canvasSizeInPixels: 100, columnSizeInPixels: 10, shipStrokeStyle: '', shipFillStyle: ''}
        const shipFactory = new ShipFactory(boardDimensions)

        const fleet = shipFactory.buildFleet()

        it('should contain 10 ships', () => {
            expect(fleet.length).toBe(10)
        })

        it('should contain 1 Battleship', () => {
            expect(fleet.filter(ship => ship.shipType === 'Battleship').length).toBe(1)
        })

        it('should contain 2 Carriers', () => {
            expect(fleet.filter(ship => ship.shipType === 'Carrier').length).toBe(2)
        })

        it('should contain 3 Cruisers', () => {
            expect(fleet.filter(ship => ship.shipType === 'Cruiser').length).toBe(3)
        })

        it('should contain 4 Submarines', () => {
            expect(fleet.filter(ship => ship.shipType === 'Submarine').length).toBe(4)
        })
    })
})