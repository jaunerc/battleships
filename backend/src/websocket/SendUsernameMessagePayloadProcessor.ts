import {inject, injectable} from "inversify";
import {SendUsernamePayload} from "../../../messages/SendUsernamePayload";
import {WebsocketMessagePayloadProcessor} from "./WebsocketMessagePayloadProcessor";
import {GameState} from "../Backend";

@injectable()
export class SendUsernameMessagePayloadProcessor implements WebsocketMessagePayloadProcessor {

    gameState: GameState

    constructor(@inject('GameState') gameState: GameState) {
        this.gameState = gameState
    }

    process(payload: string): void {
        const sendUsernamePayload: SendUsernamePayload = JSON.parse(payload)
        this.gameState.players?.push({name: sendUsernamePayload.name, id: 'asdf'});
    }
}