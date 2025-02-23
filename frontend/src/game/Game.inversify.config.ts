import { ContainerModule, interfaces } from 'inversify'
import { BoardDimension } from './GameTypes.ts'
import { PlaceShipsSvg } from './svg/PlaceShipsSvg.ts'
import { ShipFactory } from './ship/ShipFactory.ts'
import { MyFleetSvg } from './svg/MyFleetSvg.ts'
import { OpponentFleetSvg } from './svg/OpponentFleetSvg.ts'
import { GridRenderer } from './grid/GridRenderer.ts'
import { ShootRenderer } from './shoot/ShootRenderer.ts'

const gameContainer = new ContainerModule(
    (bind: interfaces.Bind) => {
        bind<BoardDimension>('BoardDimension').toConstantValue({
            canvasSizeInPixels: 100,
            columnSizeInPixels: 10,
            shipFillStyle: '#FF964B80',
            shipStrokeStyle: '#AC2F0D' })
        bind<GridRenderer>('GridRenderer').to(GridRenderer)
        bind<ShootRenderer>('ShootRenderer').to(ShootRenderer)
        bind<ShipFactory>('ShipFactory').to(ShipFactory)
        bind<PlaceShipsSvg>('PlaceShipsSvg').to(PlaceShipsSvg)
        bind<MyFleetSvg>('MyFleetSvg').to(MyFleetSvg)
        bind<OpponentFleetSvg>('OpponentFleetSvg').to(OpponentFleetSvg)
    },
)

export { gameContainer }
