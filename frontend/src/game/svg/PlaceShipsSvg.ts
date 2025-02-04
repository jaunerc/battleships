import type { BoardDimension, FieldPosition } from '../Game'
import { convertToFieldPosition } from '../MousePositionConverter.ts'
import { inject, injectable } from 'inversify'
import { Ship } from '../ship/Ship.ts'
import { ShipFactory } from '../ship/ShipFactory.ts'
import { GridRenderer } from '../grid/GridRenderer.ts'
import { Svg } from '@svgdotjs/svg.js'

@injectable()
export class PlaceShipsSvg {
    svg?: Svg
    ships: Ship[] = []

    mouseDragStart?: FieldPosition
    mouseDragging: boolean = false
    clickedShip?: Ship

    constructor(
        @inject('BoardDimension') private board: BoardDimension,
        @inject('ShipFactory') private shipFactory: ShipFactory,
        @inject('GridRenderer') private gridRenderer: GridRenderer,
    ) {}

    init(svg: Svg): void {
        this.svg = svg
        this.ships = this.shipFactory.buildFleet()

        this.gridRenderer.render(svg)
        this.ships.forEach(ship => ship.createSvgElement(svg))

        this.ships.forEach((ship) => {
            ship.shipSvg?.mousedown((event: MouseEvent) => {
                this.mouseDragStart = { x: event.offsetX, y: event.offsetY }
                this.mouseDragging = true
                this.clickedShip = ship
            })
        })

        svg.mousemove((event: MouseEvent) => {
            if (!this.mouseDragging) {
                return
            }
            const mousePosition = convertToFieldPosition(event.offsetX, event.offsetY, this.board.columnSizeInPixels)
            this.clickedShip?.move({ x: mousePosition.x * this.board.columnSizeInPixels, y: mousePosition.y * this.board.columnSizeInPixels })
        })

        svg.mouseup((event: MouseEvent) => {
            this.mouseDragging = false
            if (this.mouseDragStart?.x === event.offsetX && this.mouseDragStart.y === event.offsetY) {
                this.clickedShip?.rotate()
            }
            this.clickedShip = undefined
        })

        svg.mouseleave(() => {
            this.mouseDragging = false
            this.clickedShip = undefined
        })
    }
}
