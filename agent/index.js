'use strict'

const debug = require('debug')('academy:agent')
const mqtt = require('mqtt')
const defaults = require('defaults')
const EventEmitter = require('events')
const uuid = require('uuid')
const { parsePayload } = require('./utils')

const defaultOptions = {
    name: 'untitled',
    username: 'academy',
    interval: 5000,
    mqtt: {
        host: 'mqtt://localhost'
    }
}
class AcademyAgent extends EventEmitter {

    constructor (options) {
        super ()

        this._options = defaults(options, defaultOptions)
        this._started = false
        this._timer = null
        this._client = null
        this._agentId = null
    }

    connect () {
        if (!this._started) {

            this._client = mqtt.connect(this._options.mqtt.host)
            this._started = true

            this._client.subscribe('agent/connected')
            this._client.subscribe('agent/message')
            this._client.subscribe('agent/disconnected')

            this._client.on('connect', () => {                
                this._agentId = uuid.v4()
                this.emit('agent/connected', this._agentId)
                this._timer = setInterval(() => {
                    this.emit('agent/message', 'this is a message')
                }, this._options.interval)
            })

            this._client.on('message', (topic, payload) => {
                payload = parsePayload(payload)
                console.log(`topic ${topic}`)

                let broadcast = false
                switch (topic) {
                    case 'agent/connected':
                    case 'agent/disconnected':
                    case 'agent/message':
                        broadcast = payload && payload.agent && payload.agent.uuid !== this._agentId
                        break
                }

                if (broadcast) {
                    this.emit(topic, payload)
                }

            })

            this._client.on('error', this.disconnect())
        }
    }

    disconnect () {
        if (this._started) {
            clearInterval(this._timer)
            this._started = false
            this.emit('agent/disconnected')
        }
    }
}

module.exports = AcademyAgent
