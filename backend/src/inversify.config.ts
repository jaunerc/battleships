import {Container} from "inversify";
import {GameState} from "./GameState";
import {WebsocketMessagePayloadProcessor} from "./websocket/WebsocketMessagePayloadProcessor";
import {SendUsernameMessagePayloadProcessor} from "./websocket/SendUsernameMessagePayloadProcessor";
import {WebsocketMessageProcessor} from "./websocket/WebsocketMessageProcessor";

const container = new Container()
container.bind<GameState>('GameState').toConstantValue({ players: [] })

container.bind<WebsocketMessagePayloadProcessor>('SendUsernameMessagePayloadProcessor').to(SendUsernameMessagePayloadProcessor)
container.bind<WebsocketMessageProcessor>('WebsocketMessageProcessor').to(WebsocketMessageProcessor)

export { container }
