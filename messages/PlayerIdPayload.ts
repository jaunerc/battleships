
export type SeatId = 'first' | 'second'

export interface PlayerIdPayload {
    id: string,
    seatId: SeatId
}