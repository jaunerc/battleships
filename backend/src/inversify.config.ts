import {Container} from "inversify";
import {GameState} from "./Backend";
import {WebsocketMessageSender} from "./websocket/WebsocketMessageSender";
import {UsernamePayloadProcessor} from "./websocket/processor/UsernamePayloadProcessor";
import {PlayerJoiningPayloadProcessor} from "./websocket/processor/PlayerJoiningPayloadProcessor";
import {WebsocketPayloadProcessor} from "./websocket/processor/WebsocketPayloadProcessor";
import {WebsocketMessageProcessor} from "./websocket/WebsocketMessageProcessor";

const container = new Container()
container.bind<GameState>('GameState').toConstantValue({ players: [] })

container.bind<WebsocketMessageSender>('WebsocketMessageSender').to(WebsocketMessageSender)
container.bind<WebsocketPayloadProcessor>('UsernamePayloadProcessor').to(UsernamePayloadProcessor)
container.bind<WebsocketPayloadProcessor>('PlayerJoiningPayloadProcessor').to(PlayerJoiningPayloadProcessor)
container.bind<WebsocketMessageProcessor>('WebsocketMessageProcessor').to(WebsocketMessageProcessor)

export { container }
