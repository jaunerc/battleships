import { ShipDrawer } from './ShipDrawer.ts'
import { ShipSize } from './ShipSize.ts'
import { isShipClicked } from './ShipClickDetector.ts'
import { BoardDimension, FieldPosition, ShipOrientation, ShipType } from '../Game'

export class Ship {
    shipType: ShipType
    shipOrientation: ShipOrientation
    startField: FieldPosition

    constructor(private boardDimension: BoardDimension,
        startField: FieldPosition,
        shipType: ShipType,
                shipOrientation: ShipOrientation = 'Vertical',
                private shipDrawer: ShipDrawer = new ShipDrawer()) {
        this.shipType = shipType
        this.shipOrientation = shipOrientation
        this.startField = startField
    }

    move(nextStartField: FieldPosition): void {
        this.startField = nextStartField
    }

    draw(context: CanvasRenderingContext2D): void {
        switch (this.shipOrientation) {
            case 'Horizontal':
                this.shipDrawer.drawShipHorizontal(
                    context,
                    this.boardDimension,
                    this.startField,
                    ShipSize[this.shipType],
                )
                break
            case 'Vertical':
                this.shipDrawer.drawShipVertical(
                    context,
                    this.boardDimension,
                    this.startField,
                    ShipSize[this.shipType],
                )
        }
    }

    rotate(): void {
        switch (this.shipOrientation) {
            case 'Horizontal':
                this.shipOrientation = 'Vertical'
                break
            case 'Vertical':
                this.shipOrientation = 'Horizontal'
        }
    }

    isClicked(clickedField: FieldPosition): boolean {
        return isShipClicked(
            this.startField,
            this.shipType,
            this.shipOrientation,
            clickedField)
    }
}
