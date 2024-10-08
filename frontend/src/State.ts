import {injectable} from "inversify";

export interface ShipFieldCoordinate {
    x: number
    y: number
}

export interface ShipCoordinates {
    coordinates: ShipFieldCoordinate[]
}

export interface State {
    playerId?: string
    username?: string
    fleet?: ShipFieldCoordinate[][]
}

@injectable()
export class StateImpl implements State {

}