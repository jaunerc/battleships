
export interface ShipFieldCoordinate {
    x: number
    y: number
}

export interface Player {
    id: string
    readyToStartGame: boolean
    seatId?: SeatId
    name?: string
    fleet?: ShipFieldCoordinate[][]
}

export interface GameState {
    players: Player[]
}

export type SeatId = 'first' | 'second'
