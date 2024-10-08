import {inject, injectable} from "inversify";
import {GameState} from "../../Backend";
import {UsernamePayload} from "../../../../messages/UsernamePayload";
import {WebsocketPayloadProcessor} from "./WebsocketPayloadProcessor";

@injectable()
export class UsernamePayloadProcessor implements WebsocketPayloadProcessor {

    constructor(@inject('GameState') private gameState: GameState) {}

    process(payload: string): void {
        const sendUsernamePayload: UsernamePayload = JSON.parse(payload)
        this.gameState.players?.push({name: sendUsernamePayload.name, id: 'asdf'});
    }
}