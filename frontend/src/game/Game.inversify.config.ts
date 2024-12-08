import { ContainerModule, interfaces } from 'inversify'
import { BoardDimension } from './Game'
import { PlaceShipsCanvas } from './canvas/PlaceShipsCanvas.ts'
import { ShipFactory } from './ship/ShipFactory.ts'
import { Grid } from './grid/Grid.ts'
import { MyFleetCanvas } from './canvas/MyFleetCanvas.ts'
import { OpponentFleetCanvas } from './canvas/OpponentFleetCanvas.ts'

const gameContainer = new ContainerModule(
    (bind: interfaces.Bind) => {
        bind<BoardDimension>('BoardDimension').toConstantValue({
            canvasSizeInPixels: 400,
            columnSizeInPixels: 40,
            shipFillStyle: '#FF964B80',
            shipStrokeStyle: '#AC2F0D' })
        bind<Grid>('Grid').to(Grid)
        bind<ShipFactory>('ShipFactory').to(ShipFactory)
        bind<PlaceShipsCanvas>('PlaceShipsCanvas').to(PlaceShipsCanvas)
        bind<MyFleetCanvas>('MyFleetCanvas').to(MyFleetCanvas)
        bind<OpponentFleetCanvas>('OpponentFleetCanvas').to(OpponentFleetCanvas)
    },
)

export { gameContainer }
