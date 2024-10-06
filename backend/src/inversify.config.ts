import {Container} from "inversify";
import {WebsocketMessagePayloadProcessor} from "./websocket/WebsocketMessagePayloadProcessor";
import {SendUsernameMessagePayloadProcessor} from "./websocket/SendUsernameMessagePayloadProcessor";
import {WebsocketMessageProcessor} from "./websocket/WebsocketMessageProcessor";
import {GameState} from "./Backend";
import {WebsocketMessageSender} from "./websocket/WebsocketMessageSender";
import {PlayerJoiningPayloadProcessor} from "./websocket/PlayerJoiningPayloadProcessor";

const container = new Container()
container.bind<GameState>('GameState').toConstantValue({ players: [] })

container.bind<WebsocketMessageSender>('WebsocketMessageSender').to(WebsocketMessageSender)
container.bind<WebsocketMessagePayloadProcessor>('SendUsernameMessagePayloadProcessor').to(SendUsernameMessagePayloadProcessor)
container.bind<WebsocketMessagePayloadProcessor>('PlayerJoiningPayloadProcessor').to(PlayerJoiningPayloadProcessor)
container.bind<WebsocketMessageProcessor>('WebsocketMessageProcessor').to(WebsocketMessageProcessor)

export { container }
