import {ShipDrawer} from "./ShipDrawer.ts";
import {BoardDimension, FieldPosition, ShipOrientation, ShipType} from "./Game";
import {ShipSize} from "./ShipSize.ts";

export class Ship {
    
    board: BoardDimension
    startField: FieldPosition
    shipOrientation: ShipOrientation = 'Vertical'
    shipDrawer: ShipDrawer
    shipType: ShipType
    
    constructor(board: BoardDimension, startField: FieldPosition, shipType: ShipType, shipDrawer: ShipDrawer = new ShipDrawer()) {
        this.board = board
        this.startField = startField
        this.shipType = shipType
        this.shipDrawer = shipDrawer
    }

    move(nextStartField: FieldPosition): void {
        this.startField = nextStartField
    }
    
    draw(context: CanvasRenderingContext2D): void {
        switch (this.shipOrientation) {
            case 'Horizontal':
                this.shipDrawer.drawShipHorizontal(
                    context,
                    this.board,
                    this.startField,
                    ShipSize[this.shipType]
                )
                break
            case 'Vertical':
                this.shipDrawer.drawShipVertical(
                    context,
                    this.board,
                    this.startField,
                    ShipSize[this.shipType]
                )
        }
    }
    
    rotate(context: CanvasRenderingContext2D): void {
        switch (this.shipOrientation) {
            case 'Horizontal':
                this.shipOrientation = 'Vertical'
                break
            case 'Vertical':
                this.shipOrientation = 'Horizontal'
        }
        this.draw(context)
    }
    
}