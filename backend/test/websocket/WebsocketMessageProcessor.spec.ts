import 'reflect-metadata'; // this import is necessary so that inversify is working with tests
import {SendUsernameMessagePayloadProcessor} from "../../src/websocket/SendUsernameMessagePayloadProcessor";
import {WebsocketMessageProcessor} from "../../src/websocket/WebsocketMessageProcessor";

describe('WebsocketMessageProcessor', () => {
    describe('processWebsocketMessage', () => {
        const sendUsernameMessagePayloadProcessorMock: SendUsernameMessagePayloadProcessor = mockSendUsernameMessagePayloadProcess()
        const websocketMessageProcess: WebsocketMessageProcessor = new WebsocketMessageProcessor(sendUsernameMessagePayloadProcessorMock)

        it('should throw an error if the payload is undefined.', () => {
            expect(() => websocketMessageProcess.processWebsocketMessage({ type: 'SEND_USERNAME', payload: undefined }))
                .toThrow()
        })

        it('should call the right payload processor for a message of type SEND_USERNAME.', () => {
            websocketMessageProcess.processWebsocketMessage({ type: 'SEND_USERNAME', payload: '{"a":"a"}' })
            expect(sendUsernameMessagePayloadProcessorMock.process).toHaveBeenCalled()
        })
    })
})

function mockSendUsernameMessagePayloadProcess(): SendUsernameMessagePayloadProcessor {
    return jest.fn().mockReturnValue({
        process: jest.fn(),
        gameState: ''
    })()
}
