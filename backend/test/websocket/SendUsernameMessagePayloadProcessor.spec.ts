import 'reflect-metadata'; // this import is necessary so that inversify is working with tests
import {SendUsernameMessagePayloadProcessor} from "../../src/websocket/SendUsernameMessagePayloadProcessor";
import {GameState} from "../../src/GameState";
import {SendUsernamePayload} from "../../../messages/SendUsernamePayload";

describe('SendUsernameMessagePayloadProcessor', () => {
    describe('process', () => {
        it('should add a the given player name to the game state', () => {
            const gameState: GameState = { players: [] }
            const processor: SendUsernameMessagePayloadProcessor = new SendUsernameMessagePayloadProcessor(gameState)

            const payload: SendUsernamePayload = { name: 'Han Solo' }
            processor.process(JSON.stringify(payload))

            expect(gameState.players.length).toBe(1)
            expect(gameState.players[0].name).toBe('Han Solo')
        })
    })
})