import WebSocket from 'ws'
import { FieldPosition, SeatId, ShootResult } from '../../shared/Shared'

export interface FireLogEntry {
    coordinates: FieldPosition
    result: ShootResult
}

export interface Player {
    id: string
    readyToStartGame: boolean
    websocket: WebSocket
    seatId?: SeatId
    name?: string
    fleet?: FieldPosition[][]
    fireLog: FireLogEntry[]
}

export interface GameState {
    players: Player[]
    currentPlayerSeatId: SeatId
    winnerPlayerSeatId?: SeatId
}
