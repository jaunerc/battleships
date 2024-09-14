
export interface Board {
    canvasSizeInPixels: number
    columnSizeInPixels: number
    shipStrokeStyle: string
    shipFillStyle: string
}

export interface Ship {
    move: (nextStartField: FieldPosition) => void
    draw: (context: CanvasRenderingContext2D) => void
    rotate: (context: CanvasRenderingContext2D) => void
}

export interface FieldPosition {
    x: number
    y: number
}

export type ShipOrientation = 'Horizontal' | 'Vertical'

export type ShipType = 'Carrier' | 'Battleship' | 'Cruiser' | 'Submarine' | 'Destroyer'
