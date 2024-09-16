
export interface BoardDimension {
    canvasSizeInPixels: number
    columnSizeInPixels: number
    shipStrokeStyle: string
    shipFillStyle: string
}

export interface FieldPosition {
    x: number
    y: number
}

export type ShipOrientation = 'Horizontal' | 'Vertical'

export type ShipType = 'Carrier' | 'Battleship' | 'Cruiser' | 'Submarine' | 'Destroyer'
