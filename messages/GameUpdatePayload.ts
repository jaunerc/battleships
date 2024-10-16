export type PlayerSeatId = 'first' | 'second'

export interface GameUpdatePayload {
    currentPlayerSeatId: PlayerSeatId
}