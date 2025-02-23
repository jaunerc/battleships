import { injectable } from 'inversify'
import { FieldPosition, FireLogEntry, SeatId } from '../../shared/Shared.ts'

export interface State {
    playerId?: string
    seatId?: SeatId
    username?: string
    fleet?: FieldPosition[][]
    fireLogs?: FireLogs
}

export interface FireLogs {
    myFireLog: FireLogEntry[]
    opponentFireLog: FireLogEntry[]
}

@injectable()
export class StateImpl implements State {

}
