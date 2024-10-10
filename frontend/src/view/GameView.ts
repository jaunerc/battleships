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
                <div>
                    <p>Opponents fleet</p>
                    <canvas id="opponent-canvas" width="400px" height="400px"></canvas>
                </div>
                <div>
                    <p>My fleet</p>
                    <canvas id="my-fleet-canvas" width="400px" height="400px"></canvas>
                </div>
            </div>
        `
        //const myFleetCanvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#my-fleet-canvas')!
        console.log(this.state)
    }
}