import 'reflect-metadata'; // this import is necessary so that inversify is working with tests
import {GameState} from "../../../src/Backend";
import {UsernamePayloadProcessor} from "../../../src/websocket/processor/UsernamePayloadProcessor";
import {UsernamePayload} from "../../../../messages/UsernamePayload";

describe('UsernamePayloadProcessor', () => {
    describe('process', () => {
        const gameState: GameState = { players: [ { id: '1234' }] }
        const processor: UsernamePayloadProcessor = new UsernamePayloadProcessor(gameState)

        it('should set the username of the existing player name in the game state.', () => {
            const payload: UsernamePayload = { name: 'Han Solo', playerId: '1234' }
            processor.process(JSON.stringify(payload))

            expect(gameState.players.length).toBe(1)
            expect(gameState.players[0].name).toBe('Han Solo')
            expect(gameState.players[0].id).toBe('1234')
        })

        it('should throw an error if no player with the given id exists.', () => {
            const payload: UsernamePayload = { name: 'Unknown', playerId: 'unknown-id' }

            expect(() =>processor.process(JSON.stringify(payload))).toThrow()
        })
    })
})