import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {View} from "./View.ts";

@injectable()
export class GameView implements View {

    websocket: WebSocket
    state: State

    constructor(
        @inject('State') state: State,
        @inject('Websocket') websocket: WebSocket
    ) {
        this.state = state
        this.websocket = websocket
    }

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <p>Game View</p>
            </div>
        `
        console.log(this.state.fleet)
    }
}