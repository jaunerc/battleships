import { Container } from 'inversify'
import { GameState } from './BackendTypes'
import { WebsocketMessageSender } from './websocket/WebsocketMessageSender'
import { UsernamePayloadProcessor } from './websocket/processor/UsernamePayloadProcessor'
import { PlayerJoiningPayloadProcessor } from './websocket/processor/PlayerJoiningPayloadProcessor'
import { WebsocketPayloadProcessor } from './websocket/processor/WebsocketPayloadProcessor'
import { WebsocketMessageProcessor } from './websocket/WebsocketMessageProcessor'
import { FleetPayloadProcessor } from './websocket/processor/FleetPayloadProcessor'
import { PlayerReadyPayloadProcessor } from './websocket/processor/PlayerReadyPayloadProcessor'
import { ShootPayloadProcessor } from './websocket/processor/ShootPayloadProcessor'

const container = new Container()
container.bind<GameState>('GameState').toConstantValue({ players: [], currentPlayerSeatId: 'first' })

container.bind<WebsocketMessageSender>('WebsocketMessageSender').to(WebsocketMessageSender)
container.bind<WebsocketPayloadProcessor>('UsernamePayloadProcessor').to(UsernamePayloadProcessor)
container.bind<WebsocketPayloadProcessor>('PlayerJoiningPayloadProcessor').to(PlayerJoiningPayloadProcessor)
container.bind<WebsocketPayloadProcessor>('FleetPayloadProcessor').to(FleetPayloadProcessor)
container.bind<WebsocketPayloadProcessor>('PlayerReadyPayloadProcessor').to(PlayerReadyPayloadProcessor)
container.bind<WebsocketPayloadProcessor>('ShootPayloadProcessor').to(ShootPayloadProcessor)
container.bind<WebsocketMessageProcessor>('WebsocketMessageProcessor').to(WebsocketMessageProcessor)

export { container }
