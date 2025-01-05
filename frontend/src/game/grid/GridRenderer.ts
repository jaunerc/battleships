import { inject, injectable } from 'inversify'
import type { BoardDimension } from '../Game'
import { Svg } from '@svgdotjs/svg.js'

@injectable()
export class GridRenderer {
    constructor(@inject('BoardDimension') private boardDimension: BoardDimension) {}

    render(svg: Svg): void {
        const numberOfColumns = this.boardDimension.canvasSizeInPixels / this.boardDimension.columnSizeInPixels
        const columnsSize = this.boardDimension.columnSizeInPixels
        for (let row = 0; row < numberOfColumns; row++) {
            for (let col = 0; col < numberOfColumns; col++) {
                svg.rect(columnsSize, columnsSize)
                    .attr({ fill: '#FFF', stroke: '#000', strokeWidth: 1 })
                    .move(col * columnsSize, row * columnsSize)
            }
        }
    }
}
