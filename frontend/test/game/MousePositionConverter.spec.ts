import { describe, expect, it } from 'vitest'
import { convertToFieldPosition } from '../../src/game/MousePositionConverter'

describe('MousePositionConverter', () => {
    it('should convert the given mouse position to a field position', () => {
        const columnSize = 10
        const mouseX = 59
        const mouseY = 5

        const fieldPosition = convertToFieldPosition(mouseX, mouseY, columnSize)

        expect(fieldPosition).toStrictEqual({ x: 5, y: 0 })
    })
})
