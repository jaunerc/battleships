import {State} from "./State.ts";

export class StateHandler {
    state: State

    constructor(state: State) {
        this.state = state
    }

    getState(): State {
        return this.state
    }

    setUsername(username: string) {
        this.state = {...this.state, username: username}
    }
}