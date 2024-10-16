import WebSocket from "ws";

export interface ShipFieldCoordinate {
    x: number
    y: number
}

export interface Player {
    id: string
    readyToStartGame: boolean
    websocket: WebSocket
    seatId?: SeatId
    name?: string
    fleet?: ShipFieldCoordinate[][]
}

export interface GameState {
    players: Player[]
}

export type SeatId = 'first' | 'second'
