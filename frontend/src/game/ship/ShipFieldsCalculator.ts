import {ShipSize} from "./ShipSize.ts";
import {FieldPosition, ShipOrientation, ShipType} from "../Game";

export function calculateShipFields(shipOrientation: ShipOrientation, shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    switch (shipOrientation) {
        case 'Horizontal':
            return calculateHorizontalShipFields(shipType, startField)
        case 'Vertical':
            return calculateVerticalShipFields(shipType, startField)
    }
}

function calculateHorizontalShipFields(shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    const fields: FieldPosition[] = []
    for (let i = 0; i < ShipSize[shipType]; i++) {
        fields.push({ x: startField.x + i, y: startField.y})
    }
    return fields
}

function calculateVerticalShipFields(shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    const fields: FieldPosition[] = []
    for (let i = 0; i < ShipSize[shipType]; i++) {
        fields.push({ x: startField.x, y: startField.y + i})
    }
    return fields
}