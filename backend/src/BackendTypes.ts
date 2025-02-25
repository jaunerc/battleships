import WebSocket from 'ws'
import { FieldPosition, FireLogEntry, SeatId } from '../../shared/Shared'

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
