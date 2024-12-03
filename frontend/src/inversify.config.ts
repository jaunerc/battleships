import {Container} from "inversify";
import {State, StateImpl} from "./State.ts";
import {View} from "./view/View.ts";
import {UsernameView} from "./view/UsernameView.ts";
import {StartView} from "./view/StartView.ts";
import {PlaceShipsView} from "./view/PlaceShipsView.ts";
import {GameView} from "./view/GameView.ts";

const websocketAddress: string = `ws://${window.location.hostname}${import.meta.env.VITE_BACKEND_PATH_SUFFIX}`

const container = new Container()
container.bind<State>('State').toConstantValue(new StateImpl())
container.bind<WebSocket>('Websocket').toConstantValue(new WebSocket(websocketAddress))
console.log(window.location.hostname)
container.bind<View>('StartView').to(StartView)
container.bind<View>('UsernameView').to(UsernameView)
container.bind<View>('PlaceShipsView').to(PlaceShipsView)
container.bind<View>('GameView').to(GameView)

export { container }