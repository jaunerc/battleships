import {injectable} from "inversify";
import {Ship} from "./game/ship/Ship.ts";

export interface State {
    playerId?: string
    username?: string
    fleet?: Ship[]
}

@injectable()
export class StateImpl implements State {

}