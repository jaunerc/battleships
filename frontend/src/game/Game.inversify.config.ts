import {ContainerModule, interfaces} from "inversify";
import {BoardDimension} from "./Game";
import {Grid} from "./Grid.ts";
import {BattleshipCanvas} from "./BattleshipCanvas.ts";
import {ShipFactory} from "./ship/ShipFactory.ts";

const gameContainer = new ContainerModule(
    (bind: interfaces.Bind,) => {
        bind<BoardDimension>('BoardDimension').toConstantValue({
            canvasSizeInPixels: 400,
            columnSizeInPixels: 40,
            shipFillStyle: '#FF964B80',
            shipStrokeStyle: '#AC2F0D'})
        bind<Grid>('Grid').to(Grid)
        bind<ShipFactory>('ShipFactory').to(ShipFactory)
        bind<BattleshipCanvas>('BattleshipCanvas').to(BattleshipCanvas)
    }
)

export { gameContainer }