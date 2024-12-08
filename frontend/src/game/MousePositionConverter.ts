import { FieldPosition } from './Game'

export function convertToFieldPosition(mouseX: number, mouseY: number, columnSizeInPixels: number): FieldPosition {
    return {
        x: Math.floor(mouseX / columnSizeInPixels),
        y: Math.floor(mouseY / columnSizeInPixels),
    }
}
