import 'reflect-metadata'
import { GameState } from '../../../src/Backend'
import { WebsocketMessageSender } from '../../../src/websocket/WebsocketMessageSender'
import { PlayerReadyPayloadProcessor } from '../../../src/websocket/processor/PlayerReadyPayloadProcessor'
import { PlayerReadyPayload } from '../../../../messages/PlayerReadyPayload'

describe('PlayerReadyPayloadProcessor', () => {
    let websocketMessageSenderMock: WebsocketMessageSender

    beforeEach(() => {
        websocketMessageSenderMock = mockWebsocketMessageSender()
    })

    describe('process', () => {
        it('should save the ready state for the given player in the game state.', () => {
            const gameState: GameState = {
                players: [
                    { id: 'a', readyToStartGame: false, fireLog: [], websocket: jest.fn().mockReturnValue({})() },
                    { id: 'b', readyToStartGame: false, fireLog: [], websocket: jest.fn().mockReturnValue({})() },
                ],
                currentPlayerSeatId: 'first',
            }
            const processor: PlayerReadyPayloadProcessor = new PlayerReadyPayloadProcessor(gameState, websocketMessageSenderMock)
            const payload: PlayerReadyPayload = { playerId: 'b' }

            processor.process(JSON.stringify(payload))

            expect(gameState.players[0].readyToStartGame).toBe(false)
            expect(gameState.players[1].readyToStartGame).toBe(true)
            expect(websocketMessageSenderMock.broadcast).toHaveBeenCalledTimes(0)
        })

        it('should not send a GAME_UPDATE message when only one player has joined.', () => {
            const gameState: GameState = {
                players: [
                    { id: 'a', readyToStartGame: false, fireLog: [], websocket: jest.fn().mockReturnValue({})() },
                ],
                currentPlayerSeatId: 'first',
            }
            const processor: PlayerReadyPayloadProcessor = new PlayerReadyPayloadProcessor(gameState, websocketMessageSenderMock)
            const payload: PlayerReadyPayload = { playerId: 'a' }

            processor.process(JSON.stringify(payload))

            expect(gameState.players[0].readyToStartGame).toBe(true)
            expect(websocketMessageSenderMock.broadcast).toHaveBeenCalledTimes(0)
        })

        it('should send a GAME_UPDATE message when both players are ready.', () => {
            const gameState: GameState = {
                players: [
                    { id: 'a', readyToStartGame: true, fireLog: [], websocket: jest.fn().mockReturnValue({})() },
                    { id: 'b', readyToStartGame: false, fireLog: [], websocket: jest.fn().mockReturnValue({})() },
                ],
                currentPlayerSeatId: 'first',
            }
            const processor: PlayerReadyPayloadProcessor = new PlayerReadyPayloadProcessor(gameState, websocketMessageSenderMock)
            const payload: PlayerReadyPayload = { playerId: 'b' }

            processor.process(JSON.stringify(payload))

            expect(gameState.players[0].readyToStartGame).toBe(true)
            expect(gameState.players[1].readyToStartGame).toBe(true)
            expect(websocketMessageSenderMock.broadcast).toHaveBeenCalled()
        })
    })
})

function mockWebsocketMessageSender(): WebsocketMessageSender {
    return jest.fn().mockReturnValue({
        sendTo: jest.fn(),
        broadcast: jest.fn(),
    })()
}
