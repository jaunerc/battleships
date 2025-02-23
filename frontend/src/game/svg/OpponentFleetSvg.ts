import { inject, injectable } from 'inversify'
import type { BoardDimension } from '../Game'
import { convertToFieldPosition, convertToSvgCoordinates } from './SvgCoordinateConverter.ts'
import { ShootPayload } from '../../../../messages/ShootPayload.ts'
import { WebsocketMessage } from '../../../../messages/WebsocketMessage.ts'
import type { State } from '../../State.ts'
import { FireLogEntry } from '../../../../messages/GameUpdatePayload.ts'
import { G, Svg } from '@svgdotjs/svg.js'
import { GridRenderer } from '../grid/GridRenderer.ts'
import { ShootRenderer } from '../shoot/ShootRenderer.ts'

@injectable()
export class OpponentFleetSvg {
    context?: CanvasRenderingContext2D
    svg?: Svg
    svgShootGroup?: G
    lockForUserInput: boolean = true
    fireLogEntries: FireLogEntry[] = []

    constructor(
        @inject('BoardDimension') private board: BoardDimension,
        @inject('GridRenderer') private gridRenderer: GridRenderer,
        @inject('ShootRenderer') private shootRenderer: ShootRenderer,
        @inject('Websocket') private websocket: WebSocket,
        @inject('State') private state: State,
    ) {}

    init(svg: Svg): void {
        this.svg = svg
        this.gridRenderer.render(this.svg!)
        this.svgShootGroup = svg.group()
        svg.mousedown(this.onMouseDown)
    }

    update(fireLogEntries: FireLogEntry[]) {
        this.fireLogEntries = fireLogEntries
        this.shootRenderer.createShootElement(this.svgShootGroup!, this.board,
            fireLogEntries.map(fireLogEntry => fireLogEntry.coordinates))
    }

    setLockForUserInput(lockForUserInput: boolean): void {
        this.lockForUserInput = lockForUserInput
    }

    private onMouseDown = (event: MouseEvent): void => {
        if (this.lockForUserInput) {
            return
        }
        const p = convertToSvgCoordinates(this.svg!, event.clientX, event.clientY)
        const mousePosition = convertToFieldPosition(p, this.board.columnSizeInPixels)

        const shootPayload: ShootPayload = { playerSeatId: this.state.seatId!, shoot: mousePosition }
        const websocketMessage: WebsocketMessage = { type: 'SHOOT', payload: JSON.stringify(shootPayload) }
        this.websocket.send(JSON.stringify(websocketMessage))
    }
}
