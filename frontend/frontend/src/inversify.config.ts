import {Container} from "inversify";
import {State, StateImpl} from "./State.ts";
import {View} from "./view/View.ts";
import {UsernameView} from "./view/UsernameView.ts";
import {StartView} from "./view/StartView.ts";
import {PlaceShipsView} from "./view/PlaceShipsView.ts";

const container = new Container()
container.bind<State>('State').toConstantValue(new StateImpl())
container.bind<WebSocket>('Websocket').toConstantValue(new WebSocket('ws://localhost:3001'))

container.bind<View>('StartView').to(StartView)
container.bind<View>('UsernameView').to(UsernameView)
container.bind<View>('PlaceShipsView').to(PlaceShipsView)

export { container }