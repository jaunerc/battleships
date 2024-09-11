import {Container} from "inversify";
import {State, StateImpl} from "./State.ts";
import {View} from "./view/View.ts";
import {UsernameView} from "./view/UsernameView.ts";

const container = new Container()
container.bind<State>('State').to(StateImpl)
container.bind<View>('UsernameView').to(UsernameView)

container.bind<WebSocket>('Websocket').toConstantValue(new WebSocket('ws://localhost:3001'))

export { container }