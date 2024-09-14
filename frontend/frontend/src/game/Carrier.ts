import {ShipDrawer} from "./ShipDrawer.ts";
import {Board, FieldPosition, Ship, ShipOrientation} from "./Game";

const SIZE: number = 5

export class Carrier implements Ship {
    
    board: Board
    startField: FieldPosition
    shipOrientation: ShipOrientation = 'Vertical'
    shipDrawer: ShipDrawer
    
    constructor(board: Board, startField: FieldPosition, shipDrawer: ShipDrawer = new ShipDrawer()) {
        this.board = board
        this.startField = startField
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
                    SIZE
                )
                break
            case 'Vertical':
                this.shipDrawer.drawShipVertical(
                    context,
                    this.board,
                    this.startField,
                    SIZE
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