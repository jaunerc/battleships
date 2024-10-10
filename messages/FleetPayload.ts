export interface ShipFieldCoordinate {
    x: number
    y: number
}

export interface FleetPayload {
    playerId: string
    fleet: ShipFieldCoordinate[][]
}
