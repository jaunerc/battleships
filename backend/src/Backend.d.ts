import WebSocket from "ws";

export interface FieldCoordinate {
    x: number
    y: number
}

export type ShootResult = 'hit' | 'missed'

export interface FireLogEntry {
    coordinates: FieldCoordinate
    result: ShootResult
}

export interface Player {
    id: string
    readyToStartGame: boolean
    websocket: WebSocket
    seatId?: SeatId
    name?: string
    fleet?: FieldCoordinate[][]
    fireLog: FireLogEntry[]
}

export interface GameState {
    players: Player[]
    currentPlayerSeatId: SeatId
    winnerPlayerSeatId?: SeatId
}

export type SeatId = 'first' | 'second'
