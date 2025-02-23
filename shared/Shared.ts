export type ShootResult = 'hit' | 'missed'

export type ValidationResult = 'passed' | 'overlapping_ships' | 'no_distance_between_ships'

export type SeatId = 'first' | 'second'

export type ShipType = 'Carrier' | 'Battleship' | 'Cruiser' | 'Submarine'

export type WebsocketMessageType = 'PLAYER_JOINING' | 'USERNAME' | 'PLAYER_ID' | 'FLEET' | 'FLEET_VALIDATION' | 'PLAYER_READY' | 'GAME_UPDATE' | 'SHOOT'

export interface FieldPosition {
    x: number
    y: number
}

export interface FireLogEntry {
    coordinates: FieldPosition
    result: ShootResult
}

export interface PlayerFireLog {
    playerSeatId: SeatId
    entries: FireLogEntry[]
}

/*
 * Websocket messages
 */
export interface WebsocketMessage {
    type: WebsocketMessageType
    payload?: string
}

export interface FleetPayload {
    playerId: string
    fleet: FieldPosition[][]
}

export interface FleetValidationPayload {
    validationResult: ValidationResult
}

export interface GameUpdatePayload {
    currentPlayerSeatId: SeatId
    winnerSeatId?: SeatId
    fireLogs: PlayerFireLog[]
}

export interface PlayerIdPayload {
    id: string,
    seatId: SeatId
}

export interface PlayerReadyPayload {
    playerId: string
}

export interface ShootPayload {
    playerSeatId: SeatId
    shoot: FieldPosition
}

export interface UsernamePayload {
    playerId: string
    name: string
}
