import 'reflect-metadata';
import {GameState} from "../../../src/Backend";
import {WebsocketMessageSender} from "../../../src/websocket/WebsocketMessageSender";
import {PlayerReadyPayloadProcessor} from "../../../src/websocket/processor/PlayerReadyPayloadProcessor";
import {PlayerReadyPayload} from "../../../../messages/PlayerReadyPayload";

describe('PlayerReadyPayloadProcessor', () => {
    describe('process', () => {
        it('should save the ready state for the given player in the game state.', () => {
            const gameState: GameState = {
                players: [
                    { id: 'a', readyToStartGame: false },
                    { id: 'b', readyToStartGame: false }
                ]
            }
            const websocketMessageSenderMock: WebsocketMessageSender = mockWebsocketMessageSender()
            const processor: PlayerReadyPayloadProcessor = new PlayerReadyPayloadProcessor(gameState, websocketMessageSenderMock)
            const payload: PlayerReadyPayload = { playerId: 'b' }

            processor.process(JSON.stringify(payload), jest.fn().mockReturnValue({})())

            expect(gameState.players[0].readyToStartGame).toBe(false)
            expect(gameState.players[1].readyToStartGame).toBe(true)
            expect(websocketMessageSenderMock.sendTo).toHaveBeenCalledTimes(0)
        })
    })
})

function mockWebsocketMessageSender(): WebsocketMessageSender {
    return jest.fn().mockReturnValue({
        sendTo: jest.fn()
    })()
}
