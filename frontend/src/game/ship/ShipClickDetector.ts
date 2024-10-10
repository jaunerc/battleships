import {calculateShipFields} from "./ShipFieldsCalculator.ts";
import {FieldPosition, ShipOrientation, ShipType} from "../Game";

export function isShipClicked(
    shipStartField: FieldPosition,
    shipType: ShipType,
    shipOrientation: ShipOrientation,
    clickedField: FieldPosition): boolean {
    return calculateShipFields(shipOrientation, shipType, shipStartField)
        .find(shipField => shipField.x === clickedField.x && shipField.y === clickedField.y) !== undefined
}