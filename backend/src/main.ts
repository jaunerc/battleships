import 'reflect-metadata'
import express from 'express'
import expressWs from 'express-ws'
import { container } from './inversify.config'
import { WebsocketMessageProcessor } from './websocket/WebsocketMessageProcessor'
import WebSocket from 'ws'
import logger from './Logger'
import { WebsocketMessage } from '../../shared/Shared'
import { GameState } from './BackendTypes'

const expressWsInstance = expressWs(express())
const app = expressWsInstance.app

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT: number = 3001

app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'Hello from the server!' })
})

app.ws('/', function (ws) {
    // log any error message that is occurred in this websocket handler
    ws.on('error', function (err) {
        logger.error(`An error is occurred: ${err}.`)
    })

    logger.info('New websocket connection.')

    const websocketMessageProcessor: WebsocketMessageProcessor = container.get('WebsocketMessageProcessor')
    process(websocketMessageProcessor, { type: 'PLAYER_JOINING' }, ws)

    ws.on('message', function (msg) {
        const websocketMessage: WebsocketMessage = JSON.parse(msg.toString())
        logger.info(`Message received of type: ${websocketMessage.type}.`)

        process(websocketMessageProcessor, websocketMessage, ws)

        const state: GameState = container.get('GameState')
        if (state.winnerPlayerSeatId !== undefined) {
            // reset the game state for the next game
            state.players = []
            state.winnerPlayerSeatId = undefined
            state.currentPlayerSeatId = 'first'
        }
    })

    ws.on('close', function () {
        logger.info('Connection closed.')
    })
})

function process(websocketMessageProcessor: WebsocketMessageProcessor, playerJoiningMessage: WebsocketMessage, ws: WebSocket) {
    try {
        websocketMessageProcessor.processWebsocketMessage(playerJoiningMessage, ws)
    } catch (error) {
        ws.emit('error', error)
    }
}

app.listen(PORT, () => {
    logger.info(`The server is running on port ${PORT}.`)
})
