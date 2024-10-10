import {inject, injectable} from "inversify";
import {Ship} from "./Ship.ts";
import type {BoardDimension} from "../Game";

@injectable()
export class ShipFactory {

    constructor(@inject('BoardDimension') private boardDimension: BoardDimension) {}

    buildFleet(): Ship[] {
        return [
            new Ship(this.boardDimension, {x: 2, y: 2}, 'Battleship'),
            new Ship(this.boardDimension, {x: 6, y: 3}, 'Carrier'),
            new Ship(this.boardDimension, {x: 8, y: 6}, 'Carrier'),
            new Ship(this.boardDimension, {x: 0, y: 2}, 'Cruiser'),
            new Ship(this.boardDimension, {x: 0, y: 6}, 'Cruiser'),
            new Ship(this.boardDimension, {x: 4, y: 2}, 'Cruiser'),
            new Ship(this.boardDimension, {x: 0, y: 0}, 'Submarine', 'Horizontal'),
            new Ship(this.boardDimension, {x: 4, y: 0}, 'Submarine', 'Horizontal'),
            new Ship(this.boardDimension, {x: 8, y: 0}, 'Submarine', 'Horizontal'),
            new Ship(this.boardDimension, {x: 4, y: 8}, 'Submarine', 'Horizontal'),
        ]
    }
}