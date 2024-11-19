import 'reflect-metadata'; // this import is necessary so that inversify is working with tests

import {WebsocketMessageProcessor} from "../../src/websocket/WebsocketMessageProcessor";
import {UsernamePayloadProcessor} from "../../src/websocket/processor/UsernamePayloadProcessor";
import {PlayerJoiningPayloadProcessor} from "../../src/websocket/processor/PlayerJoiningPayloadProcessor";
import {PlayerReadyPayloadProcessor} from "../../src/websocket/processor/PlayerReadyPayloadProcessor";
import {FleetPayloadProcessor} from "../../src/websocket/processor/FleetPayloadProcessor";
import {ShootPayloadProcessor} from "../../src/websocket/processor/ShootPayloadProcessor";

describe('WebsocketMessageProcessor', () => {
    let sendUsernamePayloadProcessorMock: UsernamePayloadProcessor
    let playerJoiningPayloadProcessorMock: PlayerJoiningPayloadProcessor
    let websocketMessageProcessor: WebsocketMessageProcessor
    let playerReadyPayloadProcessMock: PlayerReadyPayloadProcessor
    let fleetPayloadProcessorMock: FleetPayloadProcessor
    let shootPayloadProcessorMock: ShootPayloadProcessor

    beforeEach(() => {
        sendUsernamePayloadProcessorMock = getPayloadProcessorMock()()
        playerJoiningPayloadProcessorMock = getPayloadProcessorMock()()
        playerReadyPayloadProcessMock = getPayloadProcessorMock()()
        fleetPayloadProcessorMock = getPayloadProcessorMock()()
        shootPayloadProcessorMock = getPayloadProcessorMock()()
        websocketMessageProcessor = new WebsocketMessageProcessor(
            sendUsernamePayloadProcessorMock,
            playerJoiningPayloadProcessorMock,
            fleetPayloadProcessorMock,
            playerReadyPayloadProcessMock,
            shootPayloadProcessorMock)
    })

    describe('processWebsocketMessage', () => {

        it('should throw an error if the payload is undefined.', () => {
            expect(() => websocketMessageProcessor.processWebsocketMessage({ type: 'USERNAME', payload: undefined }))
                .toThrow()
        })

        it('should call the right payload processor for a message of type USERNAME.', () => {
            websocketMessageProcessor.processWebsocketMessage({ type: 'USERNAME', payload: '{"a":"a"}' })
            expect(sendUsernamePayloadProcessorMock.process).toHaveBeenCalled()
        })

        it('should call the right payload processor for a message of type PLAYER_JOINING.', () => {
            websocketMessageProcessor.processWebsocketMessage({ type: 'PLAYER_JOINING', payload: '{"a":"a"}' }, jest.fn().mockReturnValue({})())
            expect(playerJoiningPayloadProcessorMock.process).toHaveBeenCalled()
        })

        it('should call the right payload processor for a message of type FLEET.', () => {
            websocketMessageProcessor.processWebsocketMessage({ type: 'FLEET', payload: '{"a":"a"}' }, jest.fn().mockReturnValue({})())
            expect(fleetPayloadProcessorMock.process).toHaveBeenCalled()
        })

        it('should call the right payload processor for a message of type PLAYER_READY.', () => {
            websocketMessageProcessor.processWebsocketMessage({ type: 'PLAYER_READY', payload: '{"a":"a"}' })
            expect(playerReadyPayloadProcessMock.process).toHaveBeenCalled()
        })
    })
})

function getPayloadProcessorMock() {
    return jest.fn().mockReturnValue({
        process: jest.fn(),
        gameState: ''
    });
}
