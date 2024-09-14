import {ShipType} from "./Game";

export const ShipSize: Record<ShipType, number> = {
    Battleship: 5,
    Carrier: 4,
    Cruiser: 3,
    Destroyer: 2,
    Submarine: 1
}