import { ShipSize } from './ShipSize.ts'
import { Box } from '@svgdotjs/svg.js'
import { FieldPosition, ShipType } from '../../../../shared/Shared.ts'

export function calculateShipFields(shipBbox: Box, shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    const horizontalShipDirection: boolean = shipBbox.width > shipBbox.height
    if (horizontalShipDirection) {
        return calculateHorizontalShipFields(shipType, startField)
    }
    return calculateVerticalShipFields(shipType, startField)
}

function calculateHorizontalShipFields(shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    const fields: FieldPosition[] = []
    for (let i = 0; i < ShipSize[shipType]; i++) {
        fields.push({ ...startField, x: startField.x + i })
    }
    return fields
}

function calculateVerticalShipFields(shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    const fields: FieldPosition[] = []
    for (let i = 0; i < ShipSize[shipType]; i++) {
        fields.push({ ...startField, y: startField.y + i })
    }
    return fields
}
