
export interface ShipFieldCoordinate {
    x: number
    y: number
}

export interface Player {
    id: string
    name?: string;
    fleet?: ShipFieldCoordinate[][]
}

export interface GameState {
    players: Player[]
}