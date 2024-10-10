import {ContainerModule, interfaces} from "inversify";
import {BoardDimension} from "./Game";
import {PlaceShipsCanvas} from "./canvas/PlaceShipsCanvas.ts";
import {ShipFactory} from "./ship/ShipFactory.ts";
import {Grid} from "./grid/Grid.ts";

const gameContainer = new ContainerModule(
    (bind: interfaces.Bind,) => {
        bind<BoardDimension>('BoardDimension').toConstantValue({
            canvasSizeInPixels: 400,
            columnSizeInPixels: 40,
            shipFillStyle: '#FF964B80',
            shipStrokeStyle: '#AC2F0D'})
        bind<Grid>('Grid').to(Grid)
        bind<ShipFactory>('ShipFactory').to(ShipFactory)
        bind<PlaceShipsCanvas>('PlaceShipsCanvas').to(PlaceShipsCanvas)
    }
)

export { gameContainer }