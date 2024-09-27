import {FieldPosition, ShipOrientation, ShipType} from "./Game";
import {ShipSize} from "./ShipSize.ts";

export function isShipClicked(
    shipStartField: FieldPosition,
    shipType: ShipType,
    shipOrientation: ShipOrientation,
    clickedField: FieldPosition): boolean {
    if (clickedField.x === shipStartField.x && clickedField.y === shipStartField.y) {
        return true
    }
    return calculateShipFields(shipOrientation, shipType, shipStartField)
        .find(shipField => shipField.x === clickedField.x && shipField.y === clickedField.y) !== undefined
}

function calculateShipFields(shipOrientation: ShipOrientation, shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    switch (shipOrientation) {
        case 'Horizontal':
            return calculateHorizontalShipFields(shipType, startField)
        case 'Vertical':
            return calculateVerticalShipFields(shipType, startField)
    }
}

function calculateHorizontalShipFields(shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    const fields: FieldPosition[] = []
    for (let i = 1; i < ShipSize[shipType]; i++) {
        fields.push({ x: startField.x + i, y: startField.y})
    }
    return fields
}

function calculateVerticalShipFields(shipType: ShipType, startField: FieldPosition): FieldPosition[] {
    const fields: FieldPosition[] = []
    for (let i = 1; i < ShipSize[shipType]; i++) {
        fields.push({ x: startField.x, y: startField.y + i})
    }
    return fields
}