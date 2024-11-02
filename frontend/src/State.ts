import {injectable} from "inversify";
import {Ship} from "./game/ship/Ship.ts";
import {FireLogEntry} from "../../messages/GameUpdatePayload.ts";

export interface State {
    playerId?: string
    seatId?: SeatId
    username?: string
    fleet?: Ship[]
    fireLogs?: FireLogs
}

export interface FireLogs {
    myFireLog: FireLogEntry[]
    opponentFireLog: FireLogEntry[]
}

export type SeatId = 'first' | 'second'

@injectable()
export class StateImpl implements State {

}