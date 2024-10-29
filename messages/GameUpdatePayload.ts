import {FieldCoordinate} from "./FieldCoordinate";

export type PlayerSeatId = 'first' | 'second'

export type ShootResult = 'hit' | 'missed'

export interface Shoot {
    coordinates: FieldCoordinate
    result: ShootResult
}

export interface PlayerFireLog {
    playerSeatId: PlayerSeatId
    shoots: Shoot[]
}

export interface GameUpdatePayload {
    currentPlayerSeatId: PlayerSeatId
    fireLogs: PlayerFireLog[]
}