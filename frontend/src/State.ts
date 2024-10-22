import {injectable} from "inversify";
import {Ship} from "./game/ship/Ship.ts";

export interface State {
    playerId?: string
    seatId?: SeatId
    username?: string
    fleet?: Ship[]
}

export type SeatId = 'first' | 'second'

@injectable()
export class StateImpl implements State {

}