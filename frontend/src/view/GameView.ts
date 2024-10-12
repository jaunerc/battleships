import {inject, injectable} from "inversify";
import type {State} from "../State.ts";
import {View} from "./View.ts";
import {MyFleetCanvas} from "../game/canvas/MyFleetCanvas.ts";
import {container} from "../inversify.config.ts";

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

        const myFleetHtmlCanvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#my-fleet-canvas')!
        const myFleetCanvas: MyFleetCanvas = container.get<MyFleetCanvas>('MyFleetCanvas')
        myFleetCanvas.init(myFleetHtmlCanvas, this.state.fleet!)
        myFleetCanvas.draw()

        console.log(this.state)
    }
}