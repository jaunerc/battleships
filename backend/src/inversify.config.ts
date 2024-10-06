import {Container} from "inversify";
import {WebsocketPayloadProcessor} from "./websocket/WebsocketPayloadProcessor";
import {UsernamePayloadProcessor} from "./websocket/UsernamePayloadProcessor";
import {WebsocketMessageProcessor} from "./websocket/WebsocketMessageProcessor";
import {GameState} from "./Backend";
import {WebsocketMessageSender} from "./websocket/WebsocketMessageSender";
import {PlayerJoiningPayloadProcessor} from "./websocket/PlayerJoiningPayloadProcessor";

const container = new Container()
container.bind<GameState>('GameState').toConstantValue({ players: [] })

container.bind<WebsocketMessageSender>('WebsocketMessageSender').to(WebsocketMessageSender)
container.bind<WebsocketPayloadProcessor>('UsernamePayloadProcessor').to(UsernamePayloadProcessor)
container.bind<WebsocketPayloadProcessor>('PlayerJoiningPayloadProcessor').to(PlayerJoiningPayloadProcessor)
container.bind<WebsocketMessageProcessor>('WebsocketMessageProcessor').to(WebsocketMessageProcessor)

export { container }
