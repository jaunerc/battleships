import {FieldCoordinate} from "./FieldCoordinate";

export type PlayerSeatId = 'first' | 'second'

export type ShootResult = 'hit' | 'missed'

export interface FireLogEntry {
    coordinates: FieldCoordinate
    result: ShootResult
}

export interface PlayerFireLog {
    playerSeatId: PlayerSeatId
    entries: FireLogEntry[]
}

export interface GameUpdatePayload {
    currentPlayerSeatId: PlayerSeatId
    winnerSeatId?: PlayerSeatId
    fireLogs: PlayerFireLog[]
}