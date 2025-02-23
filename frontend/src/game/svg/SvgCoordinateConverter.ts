import { Point, Svg } from '@svgdotjs/svg.js'
import { FieldPosition } from '../../../../shared/Shared.ts'

export function convertToFieldPosition(svgPoint: Point, columnSizeInPixels: number): FieldPosition {
    return {
        x: Math.floor(svgPoint.x / columnSizeInPixels),
        y: Math.floor(svgPoint.y / columnSizeInPixels),
    }
}

export function convertToSvgCoordinates(svg: Svg, clientX: number, clientY: number): Point {
    return svg.point(clientX, clientY)
}
