import {FieldCoordinate} from "./FieldCoordinate";

export interface FleetPayload {
    playerId: string
    fleet: FieldCoordinate[][]
}
