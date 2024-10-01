import {Container} from "inversify";
import {GameState} from "./GameState";

const container = new Container()
container.bind<GameState>('GameState').toConstantValue({ players: [] })

export { container }
