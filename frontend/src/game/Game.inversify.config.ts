import {ContainerModule, interfaces} from "inversify";
import {BoardDimension} from "./Game";
import {Grid} from "./Grid.ts";
import {ShipFactory} from "./ShipFactory.ts";
import {BattleshipGame} from "./BattleshipGame.ts";

const gameContainer = new ContainerModule(
    (bind: interfaces.Bind,) => {
        bind<BoardDimension>('BoardDimension').toConstantValue({
            canvasSizeInPixels: 400,
            columnSizeInPixels: 40,
            shipFillStyle: '#FF964B80',
            shipStrokeStyle: '#AC2F0D'})
        bind<Grid>('Grid').to(Grid)
        bind<ShipFactory>('ShipFactory').to(ShipFactory)
        bind<BattleshipGame>('BattleshipGame').to(BattleshipGame)
    }
)

export { gameContainer }