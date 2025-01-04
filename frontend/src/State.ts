import { injectable } from 'inversify'
import { FireLogEntry } from '../../messages/GameUpdatePayload.ts'
import { FieldPosition } from './game/Game'

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

export type SeatId = 'first' | 'second'

@injectable()
export class StateImpl implements State {

}
