import {injectable} from "inversify";

export interface State {
    username?: string;
}

@injectable()
export class StateImpl implements State {

}