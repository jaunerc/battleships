import { inject, injectable } from 'inversify'
import { GameState } from '../../BackendTypes'
import { WebsocketPayloadProcessor } from './WebsocketPayloadProcessor'
import { UsernamePayload } from '../../../../shared/Shared'

@injectable()
export class UsernamePayloadProcessor implements WebsocketPayloadProcessor {
    constructor(@inject('GameState') private gameState: GameState) {}

    process(payload: string): void {
        const usernamePayload: UsernamePayload = JSON.parse(payload)
        const player = this.gameState.players?.find(player => player.id === usernamePayload.playerId)
        if (player === undefined) {
            throw 'User does not exists with the id=' + usernamePayload.playerId
        }
        player.name = usernamePayload.name
    }
}
