import 'reflect-metadata'; // this import is necessary so that inversify is working with tests
import {GameState} from "../../../src/Backend";
import {UsernamePayloadProcessor} from "../../../src/websocket/processor/UsernamePayloadProcessor";
import {UsernamePayload} from "../../../../messages/UsernamePayload";

describe('UsernamePayloadProcessor', () => {
    describe('process', () => {
        it('should add a the given player name to the game state', () => {
            const gameState: GameState = { players: [] }
            const processor: UsernamePayloadProcessor = new UsernamePayloadProcessor(gameState)

            const payload: UsernamePayload = { name: 'Han Solo' }
            processor.process(JSON.stringify(payload))

            expect(gameState.players.length).toBe(1)
            expect(gameState.players[0].name).toBe('Han Solo')
        })
    })
})