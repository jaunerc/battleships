import { inject, injectable } from 'inversify'
import WebSocket from 'ws'
import { UsernamePayloadProcessor } from './processor/UsernamePayloadProcessor'
import { PlayerJoiningPayloadProcessor } from './processor/PlayerJoiningPayloadProcessor'
import { WebsocketMessage } from '../../../messages/WebsocketMessage'
import { FleetPayloadProcessor } from './processor/FleetPayloadProcessor'
import { PlayerReadyPayloadProcessor } from './processor/PlayerReadyPayloadProcessor'
import { valueIfPresentOrError } from '../TypeUtils'
import { ShootPayloadProcessor } from './processor/ShootPayloadProcessor'

@injectable()
export class WebsocketMessageProcessor {
    constructor(@inject('UsernamePayloadProcessor') private sendUsernameMessagePayloadProcessor: UsernamePayloadProcessor,
        @inject('PlayerJoiningPayloadProcessor') private playerJoiningPayloadProcessor: PlayerJoiningPayloadProcessor,
        @inject('FleetPayloadProcessor') private fleetPayloadProcessor: FleetPayloadProcessor,
        @inject('PlayerReadyPayloadProcessor') private playerReadyPayloadProcessor: PlayerReadyPayloadProcessor,
        @inject('ShootPayloadProcessor') private shootPayloadProcessor: ShootPayloadProcessor,
    ) {}

    processWebsocketMessage(websocketMessage: WebsocketMessage, clientWs?: WebSocket): void {
        switch (websocketMessage.type) {
            case 'PLAYER_JOINING':
                this.playerJoiningPayloadProcessor.process('', valueIfPresentOrError(clientWs))
                break
            case 'USERNAME':
                this.sendUsernameMessagePayloadProcessor.process(valueIfPresentOrError(websocketMessage.payload))
                break
            case 'FLEET':
                this.fleetPayloadProcessor.process(valueIfPresentOrError(websocketMessage.payload), valueIfPresentOrError(clientWs))
                break
            case 'PLAYER_READY':
                this.playerReadyPayloadProcessor.process(valueIfPresentOrError(websocketMessage.payload))
                break
            case 'SHOOT':
                this.shootPayloadProcessor.process(valueIfPresentOrError(websocketMessage.payload))
        }
    }
}
