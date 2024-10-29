import {PlayerSeatId} from "./GameUpdatePayload";
import {FieldCoordinate} from "./FieldCoordinate";

export interface ShootPayload {
    playerSeatId: PlayerSeatId
    shoot: FieldCoordinate
}
