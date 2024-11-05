import 'reflect-metadata';
import {FleetPayloadProcessor} from "../../../src/websocket/processor/FleetPayloadProcessor";
import {GameState} from "../../../src/Backend";
import {FleetPayload} from "../../../../messages/FleetPayload";
import {WebsocketMessageSender} from "../../../src/websocket/WebsocketMessageSender";

describe('FleetPayloadProcessor', () => {
    let gameState: GameState;
    let processor: FleetPayloadProcessor;

    beforeEach(() => {
        gameState = {
            players: [{ id: 'player1', fleet: [], readyToStartGame: false, fireLog: [], websocket: jest.fn().mockReturnValue({})() }],
            currentPlayerSeatId: 'first'
        };
        processor = new FleetPayloadProcessor(gameState, mockWebsocketMessageSender());
    });

    describe('process', () => {
        it('should set the fleet for the player if the distance between the ships is sufficient.', () => {
            const payload: FleetPayload = {
                playerId: 'player1',
                fleet: [
                    [{ x: 0, y: 0 }],
                    [{ x: 2, y: 2 }]
                ]
            };

            processor.process(JSON.stringify(payload), jest.fn().mockReturnValue({})());

            expect(gameState.players[0].fleet).toEqual(payload.fleet);
        });

        it('should throw an error if the player ID does not exist.', () => {
            const invalidPayload: FleetPayload = {
                playerId: 'unknown_player',
                fleet: [
                    [{ x: 0, y: 0 }],
                    [{ x: 2, y: 2 }]
                ]
            };

            expect(() => processor.process(JSON.stringify(invalidPayload), jest.fn().mockReturnValue({})())).toThrow();
        });

        it('should prevent fleet assignment if ships overlap.', () => {
            const overlappingPayload: FleetPayload = {
                playerId: 'player1',
                fleet: [
                    [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                    [{ x: 0, y: 1 }, { x: 0, y: 2 }]
                ]
            };

            // Spy on the validateNoOverlappingShips method
            const validateSpy = jest.spyOn(processor as any, 'validateNoOverlappingShips');

            processor.process(JSON.stringify(overlappingPayload), jest.fn().mockReturnValue({})());

            expect(validateSpy).toHaveReturnedWith('overlapping_ships');
            expect(gameState.players[0].fleet).toEqual([]); // fleet should not be assigned due to overlap
        });
    });
});

function mockWebsocketMessageSender(): WebsocketMessageSender {
    return jest.fn().mockReturnValue({
        sendTo: jest.fn()
    })()
}
