import 'reflect-metadata'
import { GameState } from '../../../src/Backend'
import { WebsocketMessageSender } from '../../../src/websocket/WebsocketMessageSender'
import { ShootPayloadProcessor } from '../../../src/websocket/processor/ShootPayloadProcessor'
import {ShootPayload} from "../../../../shared/Shared";

describe('ShootPayloadProcessor', () => {
    let gameState: GameState
    let websocketMessageSender: WebsocketMessageSender
    let processor: ShootPayloadProcessor

    beforeEach(() => {
        gameState = {
            currentPlayerSeatId: 'first',
            players: [
                {
                    seatId: 'first', fireLog: [], fleet: [[{ x: 1, y: 1 }]],
                    id: '',
                    readyToStartGame: false,
                    websocket: jest.fn().mockReturnValue({})(),
                },
                {
                    seatId: 'second', fireLog: [], fleet: [[{ x: 2, y: 2 }]],
                    id: '',
                    readyToStartGame: false,
                    websocket: jest.fn().mockReturnValue({})(),
                },
            ],
        }
        websocketMessageSender = mockWebsocketMessageSender()
        processor = new ShootPayloadProcessor(gameState, websocketMessageSender)
    })

    describe('process', () => {
        it('should process a hit shot correctly.', () => {
            const payload: ShootPayload = {
                playerSeatId: 'first',
                shoot: { x: 2, y: 2 },
            }

            processor.process(JSON.stringify(payload))

            const player = gameState.players[0]
            expect(player.fireLog?.length).toBe(1)
            expect(player.fireLog![0]).toEqual({ coordinates: payload.shoot, result: 'hit' })
            expect(gameState.currentPlayerSeatId).toBe('first')
            expect(websocketMessageSender.broadcast).toHaveBeenCalled()
        })

        it('should process a missed shot and switch the current player.', () => {
            const payload: ShootPayload = {
                playerSeatId: 'first',
                shoot: { x: 3, y: 3 }, // coordinates that miss
            }

            processor.process(JSON.stringify(payload))

            const player = gameState.players[0]
            expect(player.fireLog?.length).toBe(1)
            expect(player.fireLog![0]).toEqual({ coordinates: payload.shoot, result: 'missed' })
            expect(gameState.currentPlayerSeatId).toBe('second')
            expect(websocketMessageSender.broadcast).toHaveBeenCalled()
        })

        it ('should set the winner when all ships of the opponent have been destroyed.', () => {
            const payload: ShootPayload = {
                playerSeatId: 'first',
                shoot: { x: 2, y: 2 },
            }

            processor.process(JSON.stringify(payload))

            expect(gameState.winnerPlayerSeatId).toBe('first')
            expect(websocketMessageSender.broadcast).toHaveBeenCalled()
        })
    })
})

function mockWebsocketMessageSender(): WebsocketMessageSender {
    return jest.fn().mockReturnValue({
        sendTo: jest.fn(),
        broadcast: jest.fn(),
    })()
}
