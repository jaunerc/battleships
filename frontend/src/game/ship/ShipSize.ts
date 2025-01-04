import { ShipType } from '../Game'
import { valueIfPresentOrError } from '../../TypeUtils.ts'

export const ShipSize: Record<ShipType, number> = {
    Battleship: 4,
    Carrier: 3,
    Cruiser: 2,
    Submarine: 1,
}

export function getShipTypeByLength(shipLength: number): ShipType {
    const entry = Object.entries(ShipSize).find(([, size]) => size === shipLength)
    return valueIfPresentOrError(entry)[0] as ShipType
}
