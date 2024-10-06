import {inject, injectable} from "inversify";
import {WebsocketPayloadProcessor} from "../WebsocketPayloadProcessor";
import {GameState} from "../../Backend";
import {SendUsernamePayload} from "../../../../messages/SendUsernamePayload";

@injectable()
export class UsernamePayloadProcessor implements WebsocketPayloadProcessor {

    gameState: GameState

    constructor(@inject('GameState') gameState: GameState) {
        this.gameState = gameState
    }

    process(payload: string): void {
        const sendUsernamePayload: SendUsernamePayload = JSON.parse(payload)
        this.gameState.players?.push({name: sendUsernamePayload.name, id: 'asdf'});
    }
}