import 'reflect-metadata'
import { ShootPayload } from "../../../../messages/ShootPayload"
import { WebsocketMessage } from "../../../../messages/WebsocketMessage"
import {GameState} from "../../../src/Backend"
import {WebsocketMessageSender} from "../../../src/websocket/WebsocketMessageSender"
import {ShootPayloadProcessor} from "../../../src/websocket/processor/ShootPayloadProcessor"

describe("ShootPayloadProcessor", () => {
    let gameState: GameState
    let websocketMessageSender: WebsocketMessageSender
    let processor: ShootPayloadProcessor

    beforeEach(() => {
        gameState = {
            currentPlayerSeatId: "first",
            players: [
                {
                    seatId: "first", fireLog: [], fleet: [[{x: 1, y: 1}]],
                    id: "",
                    readyToStartGame: false,
                    websocket: jest.fn().mockReturnValue({})()
                },
                {
                    seatId: "second", fireLog: [], fleet: [[{x: 2, y: 2}]],
                    id: "",
                    readyToStartGame: false,
                    websocket: jest.fn().mockReturnValue({})()
                },
            ],
        }
        websocketMessageSender = mockWebsocketMessageSender()
        processor = new ShootPayloadProcessor(gameState, websocketMessageSender)
    })

    describe('process', () => {
        it("should process a hit shot correctly", () => {
            const payload: ShootPayload = {
                playerSeatId: "first",
                shoot: {x: 2, y: 2},
            }

            processor.process(JSON.stringify(payload))

            const player = gameState.players[0]
            expect(player.fireLog?.length).toBe(1)
            expect(player.fireLog![0]).toEqual({coordinates: payload.shoot, result: "hit"})

            // Ensure the current player hasn't changed after a hit
            expect(gameState.currentPlayerSeatId).toBe("first")

            // Ensure a GAME_UPDATE message is sent
            const expectedMessage: WebsocketMessage = {
                type: "GAME_UPDATE",
                payload: JSON.stringify({
                    currentPlayerSeatId: "first",
                    fireLogs: [
                        {playerSeatId: "first", shoots: player.fireLog},
                        {playerSeatId: "second", shoots: []},
                    ],
                }),
            }
            expect(websocketMessageSender.broadcast).toHaveBeenCalledWith(expectedMessage)
        })

        it("should process a missed shot and switch the current player", () => {
            const payload: ShootPayload = {
                playerSeatId: "first",
                shoot: {x: 3, y: 3}, // coordinates that miss
            }

            processor.process(JSON.stringify(payload))

            // Check if the fire log entry for the player includes a missed shot
            const player = gameState.players[0]
            expect(player.fireLog?.length).toBe(1)
            expect(player.fireLog![0]).toEqual({coordinates: payload.shoot, result: "missed"})

            // Ensure the current player has switched after a miss
            expect(gameState.currentPlayerSeatId).toBe("second")

            // Ensure a GAME_UPDATE message is sent
            const expectedMessage: WebsocketMessage = {
                type: "GAME_UPDATE",
                payload: JSON.stringify({
                    currentPlayerSeatId: "second",
                    fireLogs: [
                        {playerSeatId: "first", shoots: player.fireLog},
                        {playerSeatId: "second", shoots: []},
                    ],
                }),
            }
            expect(websocketMessageSender.broadcast).toHaveBeenCalledWith(expectedMessage)
        })
    })
})

function mockWebsocketMessageSender(): WebsocketMessageSender {
    return jest.fn().mockReturnValue({
        sendTo: jest.fn(),
        broadcast: jest.fn()
    })()
}
