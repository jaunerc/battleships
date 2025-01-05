import { Ship } from '../ship/Ship.ts'
import { inject, injectable } from 'inversify'
import type { BoardDimension, FieldPosition } from '../Game'
import { FireLogEntry } from '../../../../messages/GameUpdatePayload.ts'
import { G, Svg } from '@svgdotjs/svg.js'
import { GridRenderer } from '../grid/GridRenderer.ts'
import { ShootRenderer } from '../shoot/ShootRenderer.ts'
import { getShipTypeByLength } from '../ship/ShipSize.ts'

@injectable()
export class MyFleetSvg {
    context?: CanvasRenderingContext2D
    svg?: Svg
    svgShootGroup?: G
    ships: Ship[] = []
    fireLogEntries: FireLogEntry[] = []

    constructor(
        @inject('BoardDimension') private board: BoardDimension,
        @inject('GridRenderer') private gridRenderer: GridRenderer,
        @inject('ShootRenderer') private shootRenderer: ShootRenderer,
    ) {}

    init(svg: Svg, fleet: FieldPosition[][]): void {
        this.svg = svg
        this.ships = fleet.map(fieldPositions => this.createShipFromFieldPositions(fieldPositions))
        this.gridRenderer.render(this.svg)

        this.ships.forEach(ship => ship.createSvgElement(this.svg!))
        this.svgShootGroup = svg.group()
    }

    private createShipFromFieldPositions(fieldPositions: FieldPosition[]): Ship {
        if (fieldPositions.length === 1) {
            return new Ship(this.board, fieldPositions[0], getShipTypeByLength(1), 'Vertical')
        }
        const startField: FieldPosition = fieldPositions[0]
        const lastField: FieldPosition = fieldPositions[fieldPositions.length - 1]

        if (startField.x === lastField.x) {
            return new Ship(this.board, startField, getShipTypeByLength(fieldPositions.length), 'Vertical')
        }
        return new Ship(this.board, startField, getShipTypeByLength(fieldPositions.length), 'Horizontal')
    }

    update(fireLogEntries: FireLogEntry[]) {
        this.fireLogEntries = fireLogEntries
        this.shootRenderer.createShootElement(this.svgShootGroup!, this.board,
            this.fireLogEntries.map(fireLogEntry => fireLogEntry.coordinates))
    }
}
