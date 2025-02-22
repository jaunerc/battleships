import { describe, expect, it } from 'vitest'
import { convertToFieldPosition } from '../../src/game/svg/SvgCoordinateConverter'
import { Point } from '@svgdotjs/svg.js'

describe('SvgCoordinateConverter', () => {
    it('should convert the given mouse position to a field position', () => {
        const columnSize = 10
        const x = 59
        const y = 5
        const point = new Point(x, y)

        const fieldPosition = convertToFieldPosition(point, columnSize)

        expect(fieldPosition).toStrictEqual({ x: 5, y: 0 })
    })
})
