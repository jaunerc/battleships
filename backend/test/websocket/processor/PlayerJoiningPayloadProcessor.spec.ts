import 'reflect-metadata'
import { GameState } from '../../../src/BackendTypes'
import { PlayerJoiningPayloadProcessor } from '../../../src/websocket/processor/PlayerJoiningPayloadProcessor'
import { WebsocketMessageSender } from '../../../src/websocket/WebsocketMessageSender'

describe('PlayerJoiningPayloadProcessor', () => {
    describe('process', () => {
        it('should save the player id to the game state and send a message with the player id.', () => {
            const gameState: GameState = { players: [], currentPlayerSeatId: 'first' }
            const websocketMessageSenderMock: WebsocketMessageSender = mockWebsocketMessageSender()
            const processor: PlayerJoiningPayloadProcessor = new PlayerJoiningPayloadProcessor(gameState, websocketMessageSenderMock)

            processor.process('', jest.fn().mockReturnValue({})())

            expect(gameState.players.length).toBe(1)
            expect(gameState.players[0].id).toBeDefined()
            expect(gameState.players[0].readyToStartGame).toBe(false)
            expect(websocketMessageSenderMock.sendTo).toHaveBeenCalled()
        })
    })
})

function mockWebsocketMessageSender(): WebsocketMessageSender {
    return jest.fn().mockReturnValue({
        sendTo: jest.fn(),
    })()
}
