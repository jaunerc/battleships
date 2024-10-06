import 'reflect-metadata'; // this import is necessary so that inversify is working with tests
import {SendUsernamePayloadProcessor} from "../../src/websocket/SendUsernamePayloadProcessor";
import {WebsocketMessageProcessor} from "../../src/websocket/WebsocketMessageProcessor";

describe('WebsocketMessageProcessor', () => {
    describe('processWebsocketMessage', () => {
        const sendUsernameMessagePayloadProcessorMock: SendUsernamePayloadProcessor = mockSendUsernameMessagePayloadProcess()
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

function mockSendUsernameMessagePayloadProcess(): SendUsernamePayloadProcessor {
    return jest.fn().mockReturnValue({
        process: jest.fn(),
        gameState: ''
    })()
}
