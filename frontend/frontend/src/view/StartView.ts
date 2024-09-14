import type {View} from "./View.ts";
import type {State} from "../State.ts";
import {inject, injectable} from "inversify";

@injectable()
export class StartView implements View {

    state: State
    usernameView: View

    constructor(
        @inject('State') state: State,
        @inject('UsernameView') usernameView: View) {
        this.state = state
        this.usernameView = usernameView
    }

    show(appDiv: HTMLDivElement): void {
        appDiv.innerHTML = `
            <div>
                <h1>Welcome to Battleships</h1>
                <button id="start">Start the game</button>
            </div>
        `
        const startButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#start')!
        startButton.addEventListener('click', () => {
            this.usernameView.show(appDiv)
        })
    }
}