import 'reflect-metadata'; // this import is necessary so that inversify is working with tests

import {WebsocketMessageProcessor} from "../../src/websocket/WebsocketMessageProcessor";
import {UsernamePayloadProcessor} from "../../src/websocket/processor/UsernamePayloadProcessor";
import {PlayerJoiningPayloadProcessor} from "../../src/websocket/processor/PlayerJoiningPayloadProcessor";

describe('WebsocketMessageProcessor', () => {
    describe('processWebsocketMessage', () => {
        const sendUsernamePayloadProcessorMock: UsernamePayloadProcessor = mockSendUsernamePayloadProcess()
        const playerJoiningPayloadProcessorMock: PlayerJoiningPayloadProcessor = mockPlayerJoiningPayloadProcess()
        const websocketMessageProcess: WebsocketMessageProcessor = new WebsocketMessageProcessor(sendUsernamePayloadProcessorMock, playerJoiningPayloadProcessorMock)

        it('should throw an error if the payload is undefined.', () => {
            expect(() => websocketMessageProcess.processWebsocketMessage({ type: 'USERNAME', payload: undefined }))
                .toThrow()
        })

        it('should call the right payload processor for a message of type SEND_USERNAME.', () => {
            websocketMessageProcess.processWebsocketMessage({ type: 'USERNAME', payload: '{"a":"a"}' })
            expect(sendUsernamePayloadProcessorMock.process).toHaveBeenCalled()
        })
    })
})

function mockSendUsernamePayloadProcess(): UsernamePayloadProcessor {
    return jest.fn().mockReturnValue({
        process: jest.fn(),
        gameState: ''
    })()
}

function mockPlayerJoiningPayloadProcess(): PlayerJoiningPayloadProcessor {
    return jest.fn().mockReturnValue({
        process: jest.fn(),
        gameState: ''
    })()
}