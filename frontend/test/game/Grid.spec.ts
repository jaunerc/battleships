import 'reflect-metadata'; // this import is necessary so that inversify is working with tests
import {describe, expect, it} from "vitest";
import {BoardDimension} from "../../src/game/Game";
import {Grid} from "../../src/game/Grid";
import {mockedCanvasContext} from "../CanvasMock";

describe('Grid', () => {
    it('should draw a vertical / horizontal line for each column plus one more for the right border', () => {
        const boardDimension: BoardDimension = {
            canvasSizeInPixels: 100,
            columnSizeInPixels: 10,
            shipFillStyle: '',
            shipStrokeStyle: ''
        }
        const grid: Grid = new Grid(boardDimension)

        const mockedContext = mockedCanvasContext()
        grid.draw(mockedContext)

        expect(mockedContext.beginPath).toHaveBeenCalledTimes(11)
    })
})