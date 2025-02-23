import { ShipSize } from './ShipSize.ts'
import { ShipRenderer } from './ShipRenderer.ts'
import { Box, G, Svg } from '@svgdotjs/svg.js'
import { valueIfPresentOrError } from '../../TypeUtils.ts'
import { calculateShipFields } from './ShipFieldsCalculator.ts'
import { FieldPosition, ShipType } from '../../../../shared/Shared.ts'
import { BoardDimension, ShipOrientation } from '../GameTypes.ts'

export class Ship {
    shipType: ShipType
    shipOrientation: ShipOrientation
    startField: FieldPosition
    shipSvg?: G
    rotated: boolean = false

    private readonly ROTATION_ANGLE_DEGREES: number = 90

    constructor(private boardDimension: BoardDimension,
        startField: FieldPosition,
        shipType: ShipType, shipOrientation: ShipOrientation = 'Vertical',
        private shipRenderer: ShipRenderer = new ShipRenderer()) {
        this.shipType = shipType
        this.shipOrientation = shipOrientation
        this.startField = startField
    }

    move(targetField: FieldPosition): void {
        this.startField = targetField
        const nextShipCenterPosition: FieldPosition = this.calculateNextShipCenterPosition(targetField)
        const ship: G = valueIfPresentOrError(this.shipSvg)
        if (this.rotated) {
            // If the ship is rotated the ship has to be rotated back first before moving.
            ship.rotate(-this.ROTATION_ANGLE_DEGREES)
                .center(nextShipCenterPosition.x, nextShipCenterPosition.y)
                .rotate(this.ROTATION_ANGLE_DEGREES)
        } else {
            ship.center(nextShipCenterPosition.x, nextShipCenterPosition.y)
        }
    }

    private calculateNextShipCenterPosition(targetField: FieldPosition): FieldPosition {
        const columnSize: number = this.boardDimension.columnSizeInPixels
        const halfColumnSize: number = columnSize / 2
        if (this.evenShipSize()) {
            return { x: targetField.x + halfColumnSize, y: targetField.y + columnSize }
        }
        return { x: targetField.x + halfColumnSize, y: targetField.y + halfColumnSize }
    }

    createSvgElement(svg: Svg): void {
        switch (this.shipOrientation) {
            case 'Horizontal':
                this.shipSvg = this.shipRenderer.createHorizontalShip(
                    svg,
                    this.boardDimension,
                    this.startField,
                    ShipSize[this.shipType],
                )
                break
            case 'Vertical':
                this.shipSvg = this.shipRenderer.createVerticalShip(
                    svg,
                    this.boardDimension,
                    this.startField,
                    ShipSize[this.shipType],
                )
        }
    }

    rotate(): void {
        if (ShipSize[this.shipType] === 1) {
            // The one-field size ships cannot be rotated
            return
        }
        this.rotateSvg(valueIfPresentOrError(this.shipSvg), this.boardDimension.columnSizeInPixels)
        this.rotated = !this.rotated
    }

    getFieldPositions(parent: Svg): FieldPosition[] {
        const ship: G = valueIfPresentOrError(this.shipSvg)
        const boundingBox: Box = ship.rbox(parent)
        const startField: FieldPosition = {
            x: Math.round(boundingBox.x) / this.boardDimension.columnSizeInPixels,
            y: Math.round(boundingBox.y) / this.boardDimension.columnSizeInPixels,
        }
        return calculateShipFields(boundingBox, this.shipType, startField)
    }

    private rotateSvg(ship: G, columnSize: number): void {
        const rotationDirection: number = this.rotated ? -1 : 1
        ship.rotate(rotationDirection * this.ROTATION_ANGLE_DEGREES)
        if (this.evenShipSize()) {
            // The position of an even ship needs to be corrected after rotation.
            // Otherwise, the ship would lie between the rows.
            ship.translate(rotationDirection * columnSize / 2, rotationDirection * -columnSize / 2)
        }
    }

    private evenShipSize(): boolean {
        return ShipSize[this.shipType] % 2 === 0
    }
}
