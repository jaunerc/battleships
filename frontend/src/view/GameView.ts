import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {View} from "./View.ts";

@injectable()
export class GameView implements View {

    constructor(
        @inject('State') private state: State
    ) {}

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <p>Game View</p>
            </div>
        `
        console.log(this.state.fleet)
    }
}